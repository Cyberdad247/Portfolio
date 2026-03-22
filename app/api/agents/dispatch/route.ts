// app/api/agents/dispatch/route.ts
// Cron-compatible endpoint for processing the tasha_scheduling_queue

import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST() {
	try {
		const supabase = createServiceClient();

		// Read all pending items from the scheduling queue
		const { data: pendingItems, error: fetchError } = await supabase
			.from("tasha_scheduling_queue")
			.select("*")
			.eq("status", "pending")
			.order("created_at", { ascending: true });

		if (fetchError) {
			throw new Error(`Queue fetch failed: ${fetchError.message}`);
		}

		if (!pendingItems || pendingItems.length === 0) {
			return NextResponse.json({
				message: "No pending items in queue",
				processed: 0,
			});
		}

		const results: {
			id: string;
			lead_email: string;
			status: "dispatched" | "failed";
			error?: string;
		}[] = [];

		for (const item of pendingItems) {
			try {
				// Update status to dispatched
				const { error: updateError } = await supabase
					.from("tasha_scheduling_queue")
					.update({
						status: "dispatched",
						dispatched_at: new Date().toISOString(),
					})
					.eq("id", item.id);

				if (updateError) {
					throw new Error(updateError.message);
				}

				// Log to UKG
				await supabase.from("ukg_events").insert({
					type: "KINETIC_STRIKE",
					payload: {
						event: "schedule_dispatched",
						queue_item_id: item.id,
						lead_email: item.lead_email,
						lead_name: item.lead_name,
						requested_datetime: item.requested_datetime,
						marketing_goal: item.marketing_goal,
					},
					agent_id: "swarm:ScheduleDispatcher",
				});

				results.push({
					id: item.id,
					lead_email: item.lead_email,
					status: "dispatched",
				});
			} catch (error) {
				const errMsg = error instanceof Error ? error.message : String(error);

				// Mark as failed with error log
				await supabase
					.from("tasha_scheduling_queue")
					.update({
						status: "failed",
						error_log: errMsg,
					})
					.eq("id", item.id);

				results.push({
					id: item.id,
					lead_email: item.lead_email,
					status: "failed",
					error: errMsg,
				});
			}
		}

		const dispatched = results.filter((r) => r.status === "dispatched");
		const failed = results.filter((r) => r.status === "failed");

		console.log(
			`[DISPATCH] Processed ${results.length} items: ${dispatched.length} dispatched, ${failed.length} failed`,
		);

		return NextResponse.json({
			message: `Processed ${results.length} queue items`,
			processed: results.length,
			dispatched: dispatched.length,
			failed: failed.length,
			results,
		});
	} catch (error) {
		console.error("[DISPATCH] Error:", error);
		return NextResponse.json(
			{
				error: "Dispatch processing failed",
				detail: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		const supabase = createServiceClient();

		const { data, error } = await supabase
			.from("tasha_scheduling_queue")
			.select("id, lead_email, lead_name, status, created_at, dispatched_at")
			.order("created_at", { ascending: false })
			.limit(50);

		if (error) {
			throw new Error(error.message);
		}

		const statusCounts = (data || []).reduce(
			(acc: Record<string, number>, item) => {
				const status = item.status as string;
				acc[status] = (acc[status] || 0) + 1;
				return acc;
			},
			{},
		);

		return NextResponse.json({
			queue_items: data,
			status_summary: statusCounts,
			total: data?.length ?? 0,
		});
	} catch (error) {
		console.error("[DISPATCH] GET Error:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch queue status",
				detail: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
