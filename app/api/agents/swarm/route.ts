// app/api/agents/swarm/route.ts
// API endpoint to trigger the post-call agent swarm

import { NextResponse } from "next/server";
import { runPostCallSwarm } from "@/lib/agents/swarm-coordinator";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { session_id, lead_data } = body;

		if (!session_id) {
			return NextResponse.json(
				{ error: "session_id is required" },
				{ status: 400 },
			);
		}

		if (
			!lead_data?.full_name ||
			!lead_data?.email ||
			!lead_data?.marketing_goal
		) {
			return NextResponse.json(
				{
					error: "lead_data must include full_name, email, and marketing_goal",
				},
				{ status: 400 },
			);
		}

		const result = await runPostCallSwarm(session_id, {
			full_name: lead_data.full_name,
			email: lead_data.email,
			marketing_goal: lead_data.marketing_goal,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("[SWARM_API] Error:", error);
		return NextResponse.json(
			{
				error: "Swarm execution failed",
				detail: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		const supabase = createServiceClient();

		// Fetch recent swarm-related UKG events
		const { data: events, error } = await supabase
			.from("ukg_events")
			.select("*")
			.eq("type", "KINETIC_STRIKE")
			.like("agent_id", "swarm:%")
			.order("created_at", { ascending: false })
			.limit(50);

		if (error) {
			throw new Error(error.message);
		}

		// Group events by session
		const sessions = new Map<string, Record<string, unknown>[]>();
		for (const event of events || []) {
			const sessionId = (event.payload as Record<string, unknown>)
				?.session_id as string | undefined;
			if (sessionId) {
				if (!sessions.has(sessionId)) {
					sessions.set(sessionId, []);
				}
				sessions.get(sessionId)?.push(event);
			}
		}

		return NextResponse.json({
			recent_swarm_runs: Object.fromEntries(sessions),
			total_events: events?.length ?? 0,
		});
	} catch (error) {
		console.error("[SWARM_API] GET Error:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch swarm status",
				detail: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
