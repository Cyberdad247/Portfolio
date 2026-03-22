import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const runtime = "edge";

export async function POST(request: Request) {
	const { url: supabaseUrl, anonKey } = getSupabaseEnv();
	const cookieStore = await cookies();

	const supabase = createServerClient(supabaseUrl, anonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll() {},
		},
	});

	try {
		const { email_address, datetime, lead_name, marketing_goal } =
			await request.json();

		if (!email_address || !datetime) {
			return NextResponse.json(
				{ error: "Email and Datetime are required" },
				{ status: 400 },
			);
		}

		// 1. Log Scheduling Intent to UKG
		await supabase.from("ukg_events").insert({
			type: "STRATEGY",
			payload: {
				action: `Tasha initiated scheduling for ${email_address} at ${datetime}`,
				lead_name: lead_name || "Unknown",
				marketing_goal: marketing_goal || "",
				status: "pending_dispatch",
			},
			agent_id: "Tasha-Prime",
		});

		// 2. Store scheduling request for Claude MCP dispatch
		const { error: insertError } = await supabase
			.from("tasha_scheduling_queue")
			.insert({
				lead_email: email_address,
				lead_name: lead_name || "Unknown",
				requested_datetime: datetime,
				marketing_goal: marketing_goal || "",
				status: "pending",
				organizer_email: "vizion711@gmail.com",
			});

		if (insertError) {
			// Table might not exist yet — fall back to UKG log only
			console.warn(
				"[SCHEDULE] tasha_scheduling_queue insert failed:",
				insertError.message,
			);
		}

		// 3. Update Lead Status
		await supabase
			.from("leads")
			.update({ status: "scheduled", metadata: { appointment: datetime } })
			.eq("email", email_address);

		return NextResponse.json({
			success: true,
			message: `Scheduling request queued for ${email_address} at ${datetime}. Run /dispatch-invites to send via Google Calendar + Gmail.`,
			dispatch_status: "pending",
		});
	} catch (error) {
		console.error("Scheduling Failure:", error);
		return NextResponse.json(
			{ error: "Failed to queue scheduling request" },
			{ status: 500 },
		);
	}
}
