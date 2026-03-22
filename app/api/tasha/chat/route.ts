// app/api/tasha/chat/route.ts

import { NextResponse } from "next/server";
import { runPostCallSwarm } from "@/lib/agents/swarm-coordinator";
import {
	classifyTask,
	getRouterMetrics,
	type TaskType,
} from "@/lib/ai/nanobot-router";
import {
	createTashaSession,
	type LeadData,
	processTashaUtterance,
	type TashaPhase,
	type TashaSessionState,
} from "@/lib/mastra/tasha-workflow";

// In-memory session store (production: use Redis/SpacetimeDB)
const sessions = new Map<string, TashaSessionState>();

/** Map Tasha workflow phases to nanobot task types. */
function phaseToTaskType(phase: TashaPhase): TaskType {
	switch (phase) {
		case "greeting":
			return "greeting";
		case "data_capture":
			return "data_extraction";
		case "scheduling":
			return "scheduling";
		case "wrap_up":
			return "creative";
	}
}

export async function POST(request: Request) {
	try {
		const { session_id, utterance } = await request.json();

		if (!session_id || !utterance) {
			return NextResponse.json(
				{ error: "session_id and utterance are required" },
				{ status: 400 },
			);
		}

		// Get or create session
		let state = sessions.get(session_id);
		if (!state) {
			state = createTashaSession(session_id);
			sessions.set(session_id, state);
		}

		// Classify utterance using the current phase as a strong hint
		const phaseHint = phaseToTaskType(state.phase);
		const taskType = classifyTask(utterance, phaseHint);

		// Process utterance through Mastra workflow (handles data extraction,
		// phase transitions, and conversation history management). The workflow
		// still calls tashaInfer internally which uses the existing cascade.
		const { response, newState, tools_triggered } = await processTashaUtterance(
			state,
			utterance,
		);

		// Update session
		sessions.set(session_id, newState);

		// Fire-and-forget: trigger post-call swarm when wrap_up phase completes
		if (
			newState.phase === "wrap_up" &&
			newState.lead.full_name &&
			newState.lead.email &&
			newState.lead.marketing_goal
		) {
			const leadData: LeadData = {
				full_name: newState.lead.full_name,
				email: newState.lead.email,
				marketing_goal: newState.lead.marketing_goal,
			};
			runPostCallSwarm(session_id, leadData).catch((err) => {
				console.error("[TASHA_CHAT] Post-call swarm failed:", err);
			});
		}

		return NextResponse.json({
			response,
			phase: newState.phase,
			lead: newState.lead,
			scheduling: newState.scheduling,
			tools_triggered,
			routing: {
				taskType,
				phaseHint,
			},
			errors: newState.error_log,
		});
	} catch (error) {
		console.error("[TASHA_CHAT] Error:", error);
		return NextResponse.json(
			{ error: "Tasha encountered an internal error" },
			{ status: 500 },
		);
	}
}

// GET for session state inspection and router metrics
export async function GET(request: Request) {
	const url = new URL(request.url);
	const sessionId = url.searchParams.get("session_id");
	const showMetrics = url.searchParams.get("metrics");

	if (showMetrics === "true") {
		return NextResponse.json({
			router_metrics: getRouterMetrics(),
			active_sessions: sessions.size,
		});
	}

	if (!sessionId) {
		return NextResponse.json({ active_sessions: sessions.size });
	}

	const state = sessions.get(sessionId);
	if (!state) {
		return NextResponse.json({ error: "Session not found" }, { status: 404 });
	}

	return NextResponse.json({
		session_id: state.session_id,
		phase: state.phase,
		lead: state.lead,
		scheduling: state.scheduling,
		conversation_length: state.conversation_history.length,
	});
}
