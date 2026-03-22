// lib/ai/context-provider.ts
// Company context retrieval with NotebookLM MCP fallback

import {
	AGENT_FLEET,
	BUSINESS_HOURS,
	COMPANY_INFO,
	CONSULTATION_TYPES,
	DIFFERENTIATORS,
	FAQ_ENTRIES,
	type KnowledgeEntry,
	PRICING_TIERS,
	SERVICES,
} from "./knowledge-base";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface ContextProvider {
	getContext(query: string): Promise<string>;
}

// ---------------------------------------------------------------------------
// Local Knowledge Base Provider
// ---------------------------------------------------------------------------

function tokenize(text: string): string[] {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9 ]/g, " ")
		.split(/\s+/)
		.filter((w) => w.length > 2);
}

function scoreEntry(query: string, entry: KnowledgeEntry): number {
	const queryTokens = tokenize(query);
	let score = 0;

	for (const token of queryTokens) {
		for (const keyword of entry.keywords) {
			if (keyword.includes(token) || token.includes(keyword)) {
				score += 2;
			}
		}
		if (entry.content.toLowerCase().includes(token)) {
			score += 1;
		}
		if (entry.category.includes(token)) {
			score += 3;
		}
	}

	return score;
}

export class LocalKnowledgeBase implements ContextProvider {
	async getContext(query: string): Promise<string> {
		const snippets: string[] = [];

		// Score FAQ entries and pick top matches
		const scored = FAQ_ENTRIES.map((entry) => ({
			entry,
			score: scoreEntry(query, entry),
		}))
			.filter((s) => s.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, 3);

		for (const { entry } of scored) {
			snippets.push(entry.content);
		}

		// Check services relevance
		const queryLower = query.toLowerCase();
		for (const service of SERVICES) {
			if (service.keywords.some((kw) => queryLower.includes(kw))) {
				snippets.push(`Service — ${service.name}: ${service.description}`);
			}
		}

		// Check differentiator relevance
		for (const diff of DIFFERENTIATORS) {
			if (diff.keywords.some((kw) => queryLower.includes(kw))) {
				snippets.push(`Differentiator — ${diff.name}: ${diff.description}`);
			}
		}

		// If pricing-related, include tier details
		if (/pric|cost|how much|budget|afford|rate|fee|tier/i.test(query)) {
			const tierLines = PRICING_TIERS.map(
				(t) => `• ${t.name} (${t.price}): ${t.description}`,
			).join("\n");
			snippets.push(`Pricing tiers:\n${tierLines}`);
		}

		// If agent-related, include fleet details
		if (/agent|fleet|team|tasha|oracle|forge|sentinel|debug/i.test(query)) {
			const agentLines = AGENT_FLEET.map(
				(a) => `• ${a.name} — ${a.role}: ${a.description}`,
			).join("\n");
			snippets.push(`Agent fleet:\n${agentLines}`);
		}

		// If scheduling-related, include consultation types
		if (/schedul|meeting|call|book|appointment|consult/i.test(query)) {
			const consultLines = CONSULTATION_TYPES.map(
				(c) => `• ${c.name} (${c.duration}): ${c.description}`,
			).join("\n");
			snippets.push(
				`Business hours: ${BUSINESS_HOURS.weekday}\nConsultation types:\n${consultLines}`,
			);
		}

		if (snippets.length === 0) {
			// Fallback: return basic company overview
			return `Company: ${COMPANY_INFO.name} | ${COMPANY_INFO.tagline}\nLocation: ${COMPANY_INFO.location} (${COMPANY_INFO.workModel})\nServices: AI-Powered Marketing Automation, Web Development, Brand Strategy, Agentic Workflow Design.`;
		}

		// Deduplicate
		const unique = [...new Set(snippets)];
		return unique.join("\n\n");
	}
}

// ---------------------------------------------------------------------------
// NotebookLM MCP Provider
// ---------------------------------------------------------------------------

const NOTEBOOKLM_MCP_URL =
	process.env.NOTEBOOKLM_MCP_URL || "http://localhost:5001";

export class NotebookLMProvider implements ContextProvider {
	private fallback: LocalKnowledgeBase;
	private mcpUrl: string;
	private available: boolean | null = null;

	constructor(mcpUrl?: string) {
		this.mcpUrl = mcpUrl || NOTEBOOKLM_MCP_URL;
		this.fallback = new LocalKnowledgeBase();
	}

	private async checkAvailability(): Promise<boolean> {
		if (this.available !== null) return this.available;

		try {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 2000);

			const res = await fetch(`${this.mcpUrl}/health`, {
				method: "GET",
				signal: controller.signal,
			});
			clearTimeout(timeout);

			this.available = res.ok;
		} catch {
			this.available = false;
		}

		if (!this.available) {
			console.log(
				"[CONTEXT] NotebookLM MCP not available, using local knowledge base",
			);
		}

		return this.available;
	}

	async getContext(query: string): Promise<string> {
		const isAvailable = await this.checkAvailability();

		if (!isAvailable) {
			return this.fallback.getContext(query);
		}

		try {
			const res = await fetch(`${this.mcpUrl}/query`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query }),
			});

			if (!res.ok) {
				console.warn(
					`[CONTEXT] NotebookLM MCP query failed (${res.status}), falling back`,
				);
				return this.fallback.getContext(query);
			}

			const data = (await res.json()) as { context?: string };
			return data.context || (await this.fallback.getContext(query));
		} catch (error) {
			console.warn("[CONTEXT] NotebookLM MCP error, falling back:", error);
			this.available = null; // Re-check next time
			return this.fallback.getContext(query);
		}
	}
}

// ---------------------------------------------------------------------------
// Singleton + Convenience Export
// ---------------------------------------------------------------------------

let provider: ContextProvider | null = null;

function getProvider(): ContextProvider {
	if (!provider) {
		// Use NotebookLM if URL is configured, otherwise go straight to local
		if (process.env.NOTEBOOKLM_MCP_URL) {
			provider = new NotebookLMProvider(process.env.NOTEBOOKLM_MCP_URL);
		} else {
			provider = new LocalKnowledgeBase();
		}
	}
	return provider;
}

/**
 * Retrieve company context relevant to the user's query.
 * Auto-selects the best available provider (NotebookLM MCP -> Local KB).
 */
export async function getCompanyContext(query: string): Promise<string> {
	return getProvider().getContext(query);
}
