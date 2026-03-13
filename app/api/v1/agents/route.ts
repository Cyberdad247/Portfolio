import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const runtime = "edge";

export async function GET() {
	try {
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

		const { error } = await supabase
			.from("agent_runs")
			.select("agent_name, status, payload")
			.order("created_at", { ascending: false });

		if (error) {
			console.warn("Fleet status query degraded:", error);
			return NextResponse.json({
				fleet: [
					{
						id: "A-01",
						name: "Oracle",
						status: "idle",
						role: "Strategic Planner",
					},
					{
						id: "A-02",
						name: "Forge",
						status: "active",
						role: "Kinetic Coder",
					},
					{
						id: "A-03",
						name: "Sentinel",
						status: "active",
						role: "Security Auditor",
					},
					{
						id: "A-04",
						name: "Debug",
						status: "idle",
						role: "Self-Healing QA",
					},
				],
				lastUpdated: new Date().toISOString(),
				system: "DEGRADED",
			});
		}

		const fleet = [
			{ id: "A-01", name: "Oracle", status: "idle", role: "Strategic Planner" },
			{ id: "A-02", name: "Forge", status: "active", role: "Kinetic Coder" },
			{
				id: "A-03",
				name: "Sentinel",
				status: "active",
				role: "Security Auditor",
			},
			{ id: "A-04", name: "Debug", status: "idle", role: "Self-Healing QA" },
		];

		return NextResponse.json({
			fleet,
			lastUpdated: new Date().toISOString(),
			system: "OPTIMAL",
		});
	} catch (error) {
		console.error("Fleet Status Failure:", error);
		return NextResponse.json({
			fleet: [
				{
					id: "A-01",
					name: "Oracle",
					status: "idle",
					role: "Strategic Planner",
				},
				{
					id: "A-02",
					name: "Forge",
					status: "active",
					role: "Kinetic Coder",
				},
				{
					id: "A-03",
					name: "Sentinel",
					status: "active",
					role: "Security Auditor",
				},
				{
					id: "A-04",
					name: "Debug",
					status: "idle",
					role: "Self-Healing QA",
				},
			],
			lastUpdated: new Date().toISOString(),
			system: "DEGRADED",
		});
	}
}
