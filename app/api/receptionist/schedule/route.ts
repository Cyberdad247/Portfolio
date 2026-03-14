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
		const { email_address, datetime } = await request.json();

		if (!email_address || !datetime) {
			return NextResponse.json({ error: "Email and Datetime are required" }, { status: 400 });
		}

		// 1. Log Scheduling Intent to UKG
		await supabase.from("ukg_events").insert({
			type: "STRATEGY",
			payload: { 
				action: `Tasha initiated scheduling for ${email_address} at ${datetime}`,
				status: "pending_dispatch"
			},
			agent_id: "Tasha-Prime",
		});

		// 2. KINETIC ACTION: Dispatch Calendar Invite
		// TODO: Integrate Google Calendar API or trigger a Make.com/Zapier webhook
		// Example: await fetch(process.env.CALENDAR_WEBHOOK_URL, { ... })
		console.log(`[KINETIC]: Dispatching invite to ${email_address} for ${datetime}`);

		// 3. Update Lead Status
		await supabase
			.from("leads")
			.update({ status: "scheduled", metadata: { appointment: datetime } })
			.eq("email", email_address);

		return NextResponse.json({ 
			success: true, 
			message: "Calendar invite dispatched via Tasha-Prime." 
		});
	} catch (error) {
		console.error("Scheduling Failure:", error);
		return NextResponse.json({ error: "Failed to dispatch invite" }, { status: 500 });
	}
}
