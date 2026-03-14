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
		const { name, email, query } = await request.json();

		if (!name || !email) {
			return NextResponse.json({ error: "Name and Email are required" }, { status: 400 });
		}

		// 1. Insert into Leads table
		const { data, error } = await supabase
			.from("leads")
			.insert({
				name,
				email,
				query,
				source: "voice_receptionist_tasha",
			})
			.select()
			.single();

		if (error) throw error;

		// 2. Log to UKG (L4 Semantic Layer)
		await supabase.from("ukg_events").insert({
			type: "ONBOARDING",
			payload: { 
				action: `Tasha captured high-intent lead: ${name} (${email})`,
				lead_id: data.id 
			},
			agent_id: "Tasha-Prime",
		});

		return NextResponse.json({ success: true, leadId: data.id });
	} catch (error) {
		console.error("Receptionist Lead Capture Failure:", error);
		return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
	}
}
