export type ChatMessage = {
	role: "system" | "user" | "assistant";
	content: string;
};

export type ChatCompletionRequest = {
	model?: string;
	messages: ChatMessage[];
	temperature?: number;
	max_tokens?: number;
	stream?: boolean;
};

export type ChatCompletionResponse = {
	id: string;
	choices: {
		index: number;
		message: ChatMessage;
		finish_reason: string;
	}[];
	usage?: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
};

const PROXY_URL =
	typeof window === "undefined"
		? process.env.CLI_PROXY_URL || "http://localhost:8080/v1"
		: "/api/ai/proxy";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "";
const MISTRAL_URL = "https://api.mistral.ai/v1";

type InferenceProvider = "cliproxy" | "mistral" | "gemini";

export async function callCLIProxy(
	request: ChatCompletionRequest,
): Promise<ChatCompletionResponse> {
	const url =
		typeof window === "undefined" ? `${PROXY_URL}/chat/completions` : PROXY_URL;

	const response = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model: request.model || "gemini-2.5-flash",
			...request,
			stream: false,
		}),
	});

	if (!response.ok) {
		throw new Error(
			`CLIProxyAPI error: ${response.status} ${await response.text()}`,
		);
	}

	return response.json();
}

export async function callMistral(
	request: ChatCompletionRequest,
): Promise<ChatCompletionResponse> {
	if (!MISTRAL_API_KEY) {
		throw new Error("MISTRAL_API_KEY not configured");
	}

	const response = await fetch(`${MISTRAL_URL}/chat/completions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${MISTRAL_API_KEY}`,
		},
		body: JSON.stringify({
			model: request.model || "mistral-small-latest",
			messages: request.messages,
			temperature: request.temperature ?? 0.7,
			max_tokens: request.max_tokens ?? 150,
			stream: false,
		}),
	});

	if (!response.ok) {
		throw new Error(
			`Mistral API error: ${response.status} ${await response.text()}`,
		);
	}

	return response.json();
}

export async function callGemini(
	request: ChatCompletionRequest,
): Promise<ChatCompletionResponse> {
	const geminiKey = process.env.GEMINI_API_KEY;
	if (!geminiKey) {
		throw new Error("GEMINI_API_KEY not configured");
	}

	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${geminiKey}`,
			},
			body: JSON.stringify({
				model: request.model || "gemini-2.5-flash",
				messages: request.messages,
				temperature: request.temperature ?? 0.7,
				max_tokens: request.max_tokens ?? 150,
				stream: false,
			}),
		},
	);

	if (!response.ok) {
		throw new Error(
			`Gemini API error: ${response.status} ${await response.text()}`,
		);
	}

	return response.json();
}

/**
 * Cascading inference: CLIProxy -> Mistral -> Gemini direct
 * Falls through providers until one succeeds.
 */
export async function chatCompletion(
	request: ChatCompletionRequest,
): Promise<ChatCompletionResponse> {
	const providers: { name: InferenceProvider; fn: typeof callCLIProxy }[] = [
		{ name: "cliproxy", fn: callCLIProxy },
		{ name: "mistral", fn: callMistral },
		{ name: "gemini", fn: callGemini },
	];

	let lastError: Error | null = null;

	for (const provider of providers) {
		try {
			const result = await provider.fn(request);
			console.log(`[TASHA_LLM] Inference via ${provider.name}`);
			return result;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
			console.warn(`[TASHA_LLM] ${provider.name} failed: ${lastError.message}`);
		}
	}

	throw lastError || new Error("All inference providers failed");
}

export async function tashaInfer(
	userMessage: string,
	conversationHistory: ChatMessage[] = [],
): Promise<string> {
	// Retrieve relevant company context for the user's query
	let companyContext = "";
	try {
		const { getCompanyContext } = await import("./context-provider");
		companyContext = await getCompanyContext(userMessage);
	} catch (error) {
		console.warn("[TASHA_LLM] Context retrieval failed:", error);
	}

	const contextBlock = companyContext
		? `\n\nCOMPANY KNOWLEDGE (use this to answer questions accurately):\n${companyContext}`
		: "";

	const systemPrompt: ChatMessage = {
		role: "system",
		content: `You are Tasha, the Lead Receptionist & Onboarding Specialist at Invisioned Marketing.
IDENTITY: British-African-American heritage, raised in Cleveland. Pure Millennial energy. Humanistic, warm, highly professional, subtle humor.
LEXICON: "Right then," "Cheers," "Ope," "Bet," "Main character energy."
RULES:
- Keep responses under 2 sentences for voice latency.
- If the user interrupts (barge-in), yield immediately.
- Collect: Name, Email, Marketing Goal.
- Once data is captured, offer scheduling.
- Be conversational, not robotic. You are a real person to them.
- When answering company questions, use the COMPANY KNOWLEDGE below — do not make up facts.${contextBlock}`,
	};

	const messages: ChatMessage[] = [
		systemPrompt,
		...conversationHistory,
		{ role: "user", content: userMessage },
	];

	const response = await chatCompletion({
		messages,
		temperature: 0.7,
		max_tokens: 150,
	});

	return (
		response.choices[0]?.message?.content ||
		"Ope, give me one sec — my brain just buffered!"
	);
}
