// lib/mastra/tasha-workflow.ts

import { tashaInfer } from "@/lib/ai/cli-proxy";

// --- Types ---
export type TashaPhase = "greeting" | "data_capture" | "scheduling" | "wrap_up";

export type LeadData = {
	full_name: string;
	email: string;
	marketing_goal: string;
};

export type SchedulingData = {
	requested_datetime: string;
	invite_sent: boolean;
};

export type TashaSessionState = {
	session_id: string;
	phase: TashaPhase;
	lead: Partial<LeadData>;
	scheduling: Partial<SchedulingData>;
	conversation_history: { role: "user" | "assistant"; content: string }[];
	barge_in_detected: boolean;
	error_log: string[];
};

// --- Phase Transition Logic ---
function determineNextPhase(state: TashaSessionState): TashaPhase {
	const { lead, scheduling, phase } = state;

	if (phase === "greeting") {
		return "data_capture";
	}

	if (phase === "data_capture") {
		if (lead.full_name && lead.email && lead.marketing_goal) {
			return "scheduling";
		}
		return "data_capture";
	}

	if (phase === "scheduling") {
		if (scheduling.requested_datetime) {
			return "wrap_up";
		}
		return "scheduling";
	}

	return "wrap_up";
}

// --- Data Extraction from Transcript ---
function extractLeadData(
	transcript: string,
	current: Partial<LeadData>,
): Partial<LeadData> {
	const updates: Partial<LeadData> = { ...current };

	if (!current.full_name) {
		const nameMatch = transcript.match(
			/(?:my name is|i'm|i am|this is|call me)\s+([a-z ,.'-]+)/i,
		);
		if (nameMatch?.[1]) {
			updates.full_name = nameMatch[1]
				.replace(/\bfrom\b.*/, "")
				.trim()
				.split(" ")
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
				.join(" ");
		}
	}

	if (!current.email) {
		const emailMatch = transcript.match(
			/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
		);
		if (emailMatch) {
			updates.email = emailMatch[0].toLowerCase();
		}
	}

	if (!current.marketing_goal) {
		const goalMatch = transcript.match(
			/(?:looking for|need help with|want to|goal is|interested in)\s+([^.!?]+)/i,
		);
		if (goalMatch?.[1]) {
			updates.marketing_goal = goalMatch[1].trim();
		}
	}

	return updates;
}

function extractSchedulingData(
	transcript: string,
	current: Partial<SchedulingData>,
): Partial<SchedulingData> {
	const updates: Partial<SchedulingData> = { ...current };

	if (!current.requested_datetime) {
		const datePatterns = [
			/(?:on|this|next)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
			/(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i,
			/(\d{4}-\d{2}-\d{2})/,
		];

		for (const pattern of datePatterns) {
			const match = transcript.match(pattern);
			if (match?.[1]) {
				updates.requested_datetime = match[1].trim();
				break;
			}
		}
	}

	return updates;
}

// --- Phase Prompt Builders ---
function buildPhaseContext(state: TashaSessionState): string {
	switch (state.phase) {
		case "greeting":
			return "You are greeting a new caller. Introduce yourself warmly and ask what brings them in today.";

		case "data_capture": {
			const missing: string[] = [];
			if (!state.lead.full_name) missing.push("their name");
			if (!state.lead.email) missing.push("their email address");
			if (!state.lead.marketing_goal) missing.push("their marketing goal");
			return missing.length > 0
				? `You still need to collect: ${missing.join(", ")}. Ask naturally, one at a time.`
				: "You have all the lead info. Transition to scheduling.";
		}

		case "scheduling":
			return state.scheduling.requested_datetime
				? "The client has given a preferred time. Confirm and wrap up."
				: "Ask the client what day and time works best for a strategy call this week.";

		case "wrap_up":
			return `Confirm the details: Name: ${state.lead.full_name}, Email: ${state.lead.email}, Goal: ${state.lead.marketing_goal}, Meeting: ${state.scheduling.requested_datetime}. Thank them warmly and close.`;
	}
}

// --- Main Orchestrator ---
export function createTashaSession(session_id: string): TashaSessionState {
	return {
		session_id,
		phase: "greeting",
		lead: {},
		scheduling: {},
		conversation_history: [],
		barge_in_detected: false,
		error_log: [],
	};
}

export async function processTashaUtterance(
	state: TashaSessionState,
	userUtterance: string,
): Promise<{
	response: string;
	newState: TashaSessionState;
	tools_triggered: string[];
}> {
	const tools_triggered: string[] = [];
	const newState = { ...state, barge_in_detected: false };

	// Extract data based on current phase
	if (newState.phase === "data_capture" || newState.phase === "greeting") {
		const prevLead = { ...newState.lead };
		newState.lead = extractLeadData(userUtterance, newState.lead);

		if (
			newState.lead.full_name &&
			newState.lead.email &&
			newState.lead.marketing_goal &&
			!(prevLead.full_name && prevLead.email && prevLead.marketing_goal)
		) {
			tools_triggered.push("insert_spacetimedb_lead");
		}
	}

	if (newState.phase === "scheduling") {
		newState.scheduling = extractSchedulingData(
			userUtterance,
			newState.scheduling,
		);
		if (
			newState.scheduling.requested_datetime &&
			!state.scheduling.requested_datetime
		) {
			tools_triggered.push("schedule_gmail_invite");
		}
	}

	// Determine phase transition
	newState.phase = determineNextPhase(newState);

	// Build context and get LLM response
	const phaseContext = buildPhaseContext(newState);

	const augmentedHistory = [
		...newState.conversation_history,
		{ role: "user" as const, content: userUtterance },
	];

	const systemAugment = `\n[PHASE: ${newState.phase.toUpperCase()}] ${phaseContext}`;

	let response: string;
	try {
		response = await tashaInfer(
			`${systemAugment}\n\nUser said: "${userUtterance}"`,
			augmentedHistory.slice(-6),
		);
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : String(error);
		newState.error_log.push(errMsg);
		response =
			"Ope, my connection hiccupped! Give me just a moment... What were you saying?";
	}

	// Update conversation history
	newState.conversation_history = [
		...augmentedHistory,
		{ role: "assistant" as const, content: response },
	];

	return { response, newState, tools_triggered };
}
