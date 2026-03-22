// lib/ai/nanobot-router.ts — Nanobot-Custom Intelligent Router for Tasha

import {
	type ChatCompletionRequest,
	type ChatCompletionResponse,
	type ChatMessage,
	callCLIProxy,
	callGemini,
	callMistral,
	chatCompletion,
} from "@/lib/ai/cli-proxy";

// ---------------------------------------------------------------------------
// Task Classification
// ---------------------------------------------------------------------------

export type TaskType =
	| "greeting"
	| "data_extraction"
	| "scheduling"
	| "creative"
	| "fallback";

type ComplexityTier = "simple" | "medium" | "complex";

const TASK_COMPLEXITY: Record<TaskType, ComplexityTier> = {
	greeting: "simple",
	data_extraction: "medium",
	scheduling: "medium",
	creative: "complex",
	fallback: "complex",
};

const GREETING_PATTERNS =
	/^(hi|hello|hey|yo|sup|good\s+(morning|afternoon|evening)|what'?s?\s+up)\b/i;
const SCHEDULING_PATTERNS =
	/\b(schedule|book|calendar|appointment|meeting|avail|slot|time|date|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}\s*(am|pm))\b/i;
const DATA_EXTRACTION_PATTERNS =
	/\b(my\s+(name|email)|@|\.com|\.org|\.net|looking\s+for|need\s+help|goal\s+is|interested\s+in)\b/i;

/**
 * Classify an utterance into a task type using keyword heuristics.
 * An explicit override takes priority.
 */
export function classifyTask(utterance: string, hint?: TaskType): TaskType {
	if (hint) return hint;

	const trimmed = utterance.trim();

	if (GREETING_PATTERNS.test(trimmed) && trimmed.split(/\s+/).length <= 8) {
		return "greeting";
	}
	if (SCHEDULING_PATTERNS.test(trimmed)) {
		return "scheduling";
	}
	if (DATA_EXTRACTION_PATTERNS.test(trimmed)) {
		return "data_extraction";
	}

	// Longer messages are more likely to need a quality model
	if (trimmed.length > 300) {
		return "creative";
	}

	return "fallback";
}

// ---------------------------------------------------------------------------
// Token Budget Estimation
// ---------------------------------------------------------------------------

/** Rough token estimate: ~4 characters per token for English text. */
export function estimateTokens(text: string): number {
	return Math.ceil(text.length / 4);
}

function estimateRequestTokens(messages: ChatMessage[]): number {
	return messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
}

// ---------------------------------------------------------------------------
// Anti-Hallucination Validation
// ---------------------------------------------------------------------------

interface ValidationResult {
	passed: boolean;
	flags: string[];
}

/** Very common fake URL hosts that LLMs hallucinate. */
const SUSPICIOUS_URL_PATTERN =
	/https?:\/\/(?!(?:www\.)?(?:google|facebook|twitter|linkedin|instagram|youtube|github|invisioned)\b)[a-z0-9-]+\.[a-z]{2,}/i;

/** Phone numbers that don't look like real US numbers. */
const SUSPICIOUS_PHONE_PATTERN = /\b(?:555-\d{4}|123-456-7890)\b/;

/** Dates with impossible month/day combos. */
const IMPOSSIBLE_DATE_PATTERN =
	/\b(?:(?:0?2)[/-](3[0-9])|(?:0?[469]|11)[/-](31)|(\d{1,2})[/-](0{1,2}))\b/;

export function validateResponse(text: string): ValidationResult {
	const flags: string[] = [];

	if (SUSPICIOUS_URL_PATTERN.test(text)) {
		flags.push("suspicious_url");
	}
	if (SUSPICIOUS_PHONE_PATTERN.test(text)) {
		flags.push("suspicious_phone");
	}
	if (IMPOSSIBLE_DATE_PATTERN.test(text)) {
		flags.push("impossible_date");
	}

	return { passed: flags.length === 0, flags };
}

// ---------------------------------------------------------------------------
// Metrics Tracking
// ---------------------------------------------------------------------------

interface ModelMetrics {
	calls: number;
	successes: number;
	failures: number;
	totalLatencyMs: number;
	totalPromptTokens: number;
	totalCompletionTokens: number;
}

const metricsStore = new Map<string, ModelMetrics>();

function emptyMetrics(): ModelMetrics {
	return {
		calls: 0,
		successes: 0,
		failures: 0,
		totalLatencyMs: 0,
		totalPromptTokens: 0,
		totalCompletionTokens: 0,
	};
}

function recordSuccess(
	model: string,
	latencyMs: number,
	usage?: { prompt_tokens: number; completion_tokens: number },
): void {
	const m = metricsStore.get(model) ?? emptyMetrics();
	m.calls++;
	m.successes++;
	m.totalLatencyMs += latencyMs;
	if (usage) {
		m.totalPromptTokens += usage.prompt_tokens;
		m.totalCompletionTokens += usage.completion_tokens;
	}
	metricsStore.set(model, m);
}

function recordFailure(model: string, latencyMs: number): void {
	const m = metricsStore.get(model) ?? emptyMetrics();
	m.calls++;
	m.failures++;
	m.totalLatencyMs += latencyMs;
	metricsStore.set(model, m);
}

export interface RouterMetricsSnapshot {
	[model: string]: {
		calls: number;
		successRate: number;
		avgLatencyMs: number;
		totalPromptTokens: number;
		totalCompletionTokens: number;
	};
}

export function getRouterMetrics(): RouterMetricsSnapshot {
	const snapshot: RouterMetricsSnapshot = {};
	for (const [model, m] of metricsStore) {
		snapshot[model] = {
			calls: m.calls,
			successRate: m.calls > 0 ? m.successes / m.calls : 0,
			avgLatencyMs: m.calls > 0 ? Math.round(m.totalLatencyMs / m.calls) : 0,
			totalPromptTokens: m.totalPromptTokens,
			totalCompletionTokens: m.totalCompletionTokens,
		};
	}
	return snapshot;
}

// ---------------------------------------------------------------------------
// Routing Logic
// ---------------------------------------------------------------------------

interface RoutingPlan {
	model: string;
	provider: "cliproxy" | "mistral" | "gemini" | "cascade";
	maxTokens: number;
}

function buildRoutingPlan(
	taskType: TaskType,
	estimatedPromptTokens: number,
): RoutingPlan {
	const complexity = TASK_COMPLEXITY[taskType];

	switch (complexity) {
		case "simple":
			return {
				model: "local-fast",
				provider: "cliproxy",
				maxTokens: Math.min(100, 512 - estimatedPromptTokens),
			};

		case "medium":
			return {
				model: "gemini-2.0-flash",
				provider: "cliproxy",
				maxTokens: Math.min(150, 1024 - estimatedPromptTokens),
			};

		case "complex":
			return {
				model: "mistral-small-latest",
				provider: "mistral",
				maxTokens: Math.min(250, 2048 - estimatedPromptTokens),
			};
	}
}

type ProviderFn = (
	req: ChatCompletionRequest,
) => Promise<ChatCompletionResponse>;

function getProviderFn(provider: RoutingPlan["provider"]): ProviderFn {
	switch (provider) {
		case "cliproxy":
			return callCLIProxy;
		case "mistral":
			return callMistral;
		case "gemini":
			return callGemini;
		case "cascade":
			return chatCompletion;
	}
}

// ---------------------------------------------------------------------------
// Main Router Entry Point
// ---------------------------------------------------------------------------

export interface NanobotRouteResult {
	text: string;
	taskType: TaskType;
	model: string;
	provider: string;
	latencyMs: number;
	validation: ValidationResult;
	tokenEstimate: { prompt: number; completion: number };
}

/**
 * Intelligent model router for Tasha.
 *
 * Classifies the request, picks the optimal model, calls it, validates the
 * response, and records metrics. Falls back through the existing cascade on
 * failure.
 */
export async function nanobotRoute(
	messages: ChatMessage[],
	taskType?: TaskType,
	temperature?: number,
): Promise<NanobotRouteResult> {
	// 1. Classify
	const lastUserMsg =
		[...messages].reverse().find((m) => m.role === "user")?.content ?? "";
	const resolvedTask = classifyTask(lastUserMsg, taskType);

	// 2. Estimate token budget
	const estimatedPrompt = estimateRequestTokens(messages);

	// 3. Build routing plan
	const plan = buildRoutingPlan(resolvedTask, estimatedPrompt);

	const request: ChatCompletionRequest = {
		model: plan.model,
		messages,
		temperature: temperature ?? 0.7,
		max_tokens: Math.max(plan.maxTokens, 50),
		stream: false,
	};

	// 4. Call the routed provider, with cascade fallback
	let response: ChatCompletionResponse;
	let actualModel = plan.model;
	let actualProvider: string = plan.provider;
	const start = Date.now();

	try {
		const providerFn = getProviderFn(plan.provider);
		response = await providerFn(request);
		const latency = Date.now() - start;
		recordSuccess(
			actualModel,
			latency,
			response.usage
				? {
						prompt_tokens: response.usage.prompt_tokens,
						completion_tokens: response.usage.completion_tokens,
					}
				: undefined,
		);
	} catch {
		const failLatency = Date.now() - start;
		recordFailure(actualModel, failLatency);

		console.warn(
			`[NANOBOT] Primary route ${plan.provider}/${plan.model} failed, falling back to cascade`,
		);

		// Fall back to the full cascade
		actualModel = "cascade";
		actualProvider = "cascade";
		const cascadeStart = Date.now();
		try {
			response = await chatCompletion({
				...request,
				model: undefined,
			});
			recordSuccess(
				"cascade",
				Date.now() - cascadeStart,
				response.usage
					? {
							prompt_tokens: response.usage.prompt_tokens,
							completion_tokens: response.usage.completion_tokens,
						}
					: undefined,
			);
		} catch {
			recordFailure("cascade", Date.now() - cascadeStart);
			throw new Error("[NANOBOT] All providers exhausted");
		}
	}

	const totalLatency = Date.now() - start;
	const text =
		response.choices[0]?.message?.content ??
		"Ope, give me one sec — my brain just buffered!";

	// 5. Anti-hallucination validation
	const validation = validateResponse(text);
	if (!validation.passed) {
		console.warn(
			`[NANOBOT] Hallucination flags on response: ${validation.flags.join(", ")}`,
		);
	}

	// 6. Build result
	const completionTokens =
		response.usage?.completion_tokens ?? estimateTokens(text);
	const promptTokens = response.usage?.prompt_tokens ?? estimatedPrompt;

	return {
		text,
		taskType: resolvedTask,
		model: actualModel,
		provider: actualProvider,
		latencyMs: totalLatency,
		validation,
		tokenEstimate: {
			prompt: promptTokens,
			completion: completionTokens,
		},
	};
}
