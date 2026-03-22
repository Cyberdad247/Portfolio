// lib/mastra/tools/insert-lead.ts

import type { LeadData } from "@/lib/mastra/tasha-workflow";

type InsertLeadResult = {
	success: boolean;
	lead_id?: string;
	error?: string;
	storage: "supabase" | "spacetimedb";
};

export async function insertSpacetimeDBLead(
	sessionId: string,
	lead: LeadData,
): Promise<InsertLeadResult> {
	// Strategy: Try Supabase first (existing infra), SpacetimeDB as write-through cache
	try {
		// 1. Write to Supabase (primary)
		const supabaseResult = await fetch("/api/receptionist/lead", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: lead.full_name,
				email: lead.email,
				query: lead.marketing_goal,
			}),
		});

		if (!supabaseResult.ok) {
			throw new Error(`Supabase write failed: ${supabaseResult.status}`);
		}

		const { leadId } = await supabaseResult.json();

		// 2. Write-through to SpacetimeDB (if available)
		try {
			const spacetimeUrl =
				process.env.SPACETIMEDB_URL || "http://localhost:3000";
			await fetch(`${spacetimeUrl}/database/tasha/call/insert_lead`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					args: [sessionId, lead.full_name, lead.email, lead.marketing_goal],
				}),
			});
			console.log(
				"[SpacetimeDB] Write-through cache updated for lead:",
				leadId,
			);
		} catch {
			// SpacetimeDB is optional - don't fail if unavailable
			console.warn(
				"[SpacetimeDB] Write-through cache unavailable, Supabase is primary",
			);
		}

		return { success: true, lead_id: leadId, storage: "supabase" };
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : String(error);
		console.error("[INSERT_LEAD] Failed:", errMsg);
		return { success: false, error: errMsg, storage: "supabase" };
	}
}
