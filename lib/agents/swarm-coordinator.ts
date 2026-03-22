// lib/agents/swarm-coordinator.ts
// Post-call agent swarm coordinator for Tasha voice receptionist

import { chatCompletion } from "@/lib/ai/cli-proxy";
import type { LeadData } from "@/lib/mastra/tasha-workflow";
import { createServiceClient } from "@/lib/supabase/service";

// --- Agent Types ---

export type SwarmAgentType =
	| "LeadEnricher"
	| "ScheduleDispatcher"
	| "FollowUpDrafter"
	| "QualityAuditor";

export type AgentResult = {
	agent: SwarmAgentType;
	success: boolean;
	data: Record<string, unknown>;
	error?: string;
	durationMs: number;
};

export type SwarmResult = {
	sessionId: string;
	startedAt: string;
	completedAt: string;
	agents: AgentResult[];
	overallSuccess: boolean;
};

// --- UKG Logging Helper ---

async function logSwarmEvent(
	agent: SwarmAgentType,
	payload: Record<string, unknown>,
) {
	try {
		const supabase = createServiceClient();
		await supabase.from("ukg_events").insert({
			type: "KINETIC_STRIKE",
			payload: {
				swarm_agent: agent,
				...payload,
			},
			agent_id: `swarm:${agent}`,
		});
	} catch (error) {
		console.warn(`[SWARM] UKG log failed for ${agent}:`, error);
	}
}

// --- Agent: LeadEnricher ---

async function leadEnricher(
	sessionId: string,
	lead: LeadData,
): Promise<AgentResult> {
	const start = Date.now();
	try {
		const response = await chatCompletion({
			messages: [
				{
					role: "system",
					content:
						"You are a lead enrichment agent. Given a lead's name, email, and marketing goal, generate a brief company profile and enrichment notes. Return JSON with fields: company_domain, inferred_industry, enrichment_notes, lead_score (1-10).",
				},
				{
					role: "user",
					content: `Lead: ${lead.full_name}, Email: ${lead.email}, Marketing Goal: ${lead.marketing_goal}`,
				},
			],
			temperature: 0.3,
			max_tokens: 300,
		});

		const content = response.choices[0]?.message?.content || "{}";
		let enrichment: Record<string, unknown>;
		try {
			enrichment = JSON.parse(content);
		} catch {
			enrichment = { raw_response: content };
		}

		await logSwarmEvent("LeadEnricher", {
			session_id: sessionId,
			lead_email: lead.email,
			enrichment,
		});

		return {
			agent: "LeadEnricher",
			success: true,
			data: enrichment,
			durationMs: Date.now() - start,
		};
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : String(error);
		await logSwarmEvent("LeadEnricher", {
			session_id: sessionId,
			error: errMsg,
		});
		return {
			agent: "LeadEnricher",
			success: false,
			data: {},
			error: errMsg,
			durationMs: Date.now() - start,
		};
	}
}

// --- Agent: ScheduleDispatcher ---

async function scheduleDispatcher(
	sessionId: string,
	lead: LeadData,
): Promise<AgentResult> {
	const start = Date.now();
	try {
		const supabase = createServiceClient();

		// Read pending items for this lead from the scheduling queue
		const { data: pendingItems, error: fetchError } = await supabase
			.from("tasha_scheduling_queue")
			.select("*")
			.eq("lead_email", lead.email)
			.eq("status", "pending");

		if (fetchError) throw new Error(fetchError.message);

		const dispatched: string[] = [];

		for (const item of pendingItems || []) {
			const { error: updateError } = await supabase
				.from("tasha_scheduling_queue")
				.update({
					status: "dispatched",
					dispatched_at: new Date().toISOString(),
				})
				.eq("id", item.id);

			if (updateError) {
				console.error(
					`[SWARM] Failed to dispatch item ${item.id}:`,
					updateError,
				);
			} else {
				dispatched.push(item.id);
			}
		}

		await logSwarmEvent("ScheduleDispatcher", {
			session_id: sessionId,
			lead_email: lead.email,
			pending_count: pendingItems?.length ?? 0,
			dispatched_ids: dispatched,
		});

		return {
			agent: "ScheduleDispatcher",
			success: true,
			data: {
				pending_found: pendingItems?.length ?? 0,
				dispatched_count: dispatched.length,
				dispatched_ids: dispatched,
			},
			durationMs: Date.now() - start,
		};
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : String(error);
		await logSwarmEvent("ScheduleDispatcher", {
			session_id: sessionId,
			error: errMsg,
		});
		return {
			agent: "ScheduleDispatcher",
			success: false,
			data: {},
			error: errMsg,
			durationMs: Date.now() - start,
		};
	}
}

// --- Agent: FollowUpDrafter ---

async function followUpDrafter(
	sessionId: string,
	lead: LeadData,
): Promise<AgentResult> {
	const start = Date.now();
	try {
		const response = await chatCompletion({
			messages: [
				{
					role: "system",
					content: `You are a follow-up email drafter for Invisioned Marketing. Write a warm, professional follow-up email to a lead after their initial call with Tasha, our receptionist. The email should:
- Reference their marketing goal
- Confirm next steps
- Be concise (under 150 words)
- Sign off as "The Invisioned Marketing Team"
Return ONLY the email body text, no subject line.`,
				},
				{
					role: "user",
					content: `Lead Name: ${lead.full_name}, Email: ${lead.email}, Marketing Goal: ${lead.marketing_goal}`,
				},
			],
			temperature: 0.6,
			max_tokens: 300,
		});

		const draftBody =
			response.choices[0]?.message?.content ||
			"Thank you for reaching out to Invisioned Marketing.";

		await logSwarmEvent("FollowUpDrafter", {
			session_id: sessionId,
			lead_email: lead.email,
			draft_length: draftBody.length,
		});

		return {
			agent: "FollowUpDrafter",
			success: true,
			data: {
				subject: `Great connecting with you, ${lead.full_name}!`,
				body: draftBody,
				to: lead.email,
			},
			durationMs: Date.now() - start,
		};
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : String(error);
		await logSwarmEvent("FollowUpDrafter", {
			session_id: sessionId,
			error: errMsg,
		});
		return {
			agent: "FollowUpDrafter",
			success: false,
			data: {},
			error: errMsg,
			durationMs: Date.now() - start,
		};
	}
}

// --- Agent: QualityAuditor ---

async function qualityAuditor(
	sessionId: string,
	lead: LeadData,
): Promise<AgentResult> {
	const start = Date.now();
	try {
		const missingFields: string[] = [];
		const warnings: string[] = [];

		if (!lead.full_name) missingFields.push("full_name");
		if (!lead.email) missingFields.push("email");
		if (!lead.marketing_goal) missingFields.push("marketing_goal");

		// Validate email format
		if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
			warnings.push("Email format appears invalid");
		}

		// Check name quality
		if (lead.full_name && lead.full_name.split(" ").length < 2) {
			warnings.push("Name may be incomplete (single word)");
		}

		// Check marketing goal quality
		if (lead.marketing_goal && lead.marketing_goal.length < 10) {
			warnings.push("Marketing goal is very brief, may need follow-up");
		}

		const completeness = ((3 - missingFields.length) / 3) * 100;

		const auditResult = {
			completeness_pct: completeness,
			missing_fields: missingFields,
			warnings,
			quality_grade:
				completeness === 100 && warnings.length === 0
					? "A"
					: completeness === 100
						? "B"
						: completeness >= 66
							? "C"
							: "F",
		};

		await logSwarmEvent("QualityAuditor", {
			session_id: sessionId,
			lead_email: lead.email,
			audit: auditResult,
		});

		return {
			agent: "QualityAuditor",
			success: true,
			data: auditResult,
			durationMs: Date.now() - start,
		};
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : String(error);
		await logSwarmEvent("QualityAuditor", {
			session_id: sessionId,
			error: errMsg,
		});
		return {
			agent: "QualityAuditor",
			success: false,
			data: {},
			error: errMsg,
			durationMs: Date.now() - start,
		};
	}
}

// --- Swarm Orchestrator ---

export async function runPostCallSwarm(
	sessionId: string,
	leadData: LeadData,
): Promise<SwarmResult> {
	const startedAt = new Date().toISOString();

	console.log(
		`[SWARM] Starting post-call swarm for session ${sessionId}`,
		leadData,
	);

	await logSwarmEvent("LeadEnricher", {
		session_id: sessionId,
		event: "swarm_started",
		lead_email: leadData.email,
	});

	// Run all agents in parallel
	const agentResults = await Promise.allSettled([
		leadEnricher(sessionId, leadData),
		scheduleDispatcher(sessionId, leadData),
		followUpDrafter(sessionId, leadData),
		qualityAuditor(sessionId, leadData),
	]);

	const agents: AgentResult[] = agentResults.map((result, index) => {
		const agentNames: SwarmAgentType[] = [
			"LeadEnricher",
			"ScheduleDispatcher",
			"FollowUpDrafter",
			"QualityAuditor",
		];
		if (result.status === "fulfilled") {
			return result.value;
		}
		return {
			agent: agentNames[index],
			success: false,
			data: {},
			error:
				result.reason instanceof Error
					? result.reason.message
					: String(result.reason),
			durationMs: 0,
		};
	});

	const completedAt = new Date().toISOString();
	const overallSuccess = agents.every((a) => a.success);

	await logSwarmEvent("QualityAuditor", {
		session_id: sessionId,
		event: "swarm_completed",
		overall_success: overallSuccess,
		agent_count: agents.length,
		succeeded: agents.filter((a) => a.success).length,
		failed: agents.filter((a) => !a.success).length,
	});

	console.log(
		`[SWARM] Completed for session ${sessionId}: ${agents.filter((a) => a.success).length}/${agents.length} agents succeeded`,
	);

	return {
		sessionId,
		startedAt,
		completedAt,
		agents,
		overallSuccess,
	};
}
