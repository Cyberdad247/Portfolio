import { tryCreateClient } from "@/lib/supabase/client";

/**
 * UKG Logger (L4 Semantic Layer)
 * Logs critical agentic events to the Universal Knowledge Glyph.
 * Transitions from localStorage simulation to Supabase persistence.
 */

export interface UKGEntry {
	id?: string;
	timestamp?: string;
	type: "ONBOARDING" | "STRATEGY" | "AUDIT" | "KINETIC_STRIKE";
	payload: Record<string, unknown>;
	agentId?: string;
	organizationId?: string;
	userId?: string;
}

export const logToUKG = async (entry: Omit<UKGEntry, "timestamp" | "id">) => {
	const timestamp = new Date().toISOString();
	const fullEntry = {
		...entry,
		timestamp,
	};

	console.log(`[L4 SEMANTIC]: Logging to UKG - ${entry.type}`, fullEntry);

	// 1. Kinetic Cache (LocalStorage Fallback)
	try {
		const existingLog = localStorage.getItem("UKG_MEMORY_SIM");
		const logs: UKGEntry[] = existingLog ? JSON.parse(existingLog) : [];
		logs.push(fullEntry);
		const trimmedLogs = logs.slice(-100);
		localStorage.setItem("UKG_MEMORY_SIM", JSON.stringify(trimmedLogs));
	} catch (e) {
		console.warn("L4 Kinetic Cache Write failure (non-critical):", e);
	}

	// 2. Sovereign Persistence (Supabase)
	try {
		const supabase = tryCreateClient();
		if (!supabase) {
			return;
		}

		// Attempt to get the current session if IDs weren't provided
		const orgId = entry.organizationId;
		let uId = entry.userId;

		if (!orgId || !uId) {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session) {
				uId = uId || session.user.id;
				// In a real multi-tenant app, we'd fetch the active org here
				// For this implementation, we'll try to use the provided IDs or fall back to null
			}
		}

		const { error } = await supabase.from("ukg_events").insert({
			type: entry.type,
			payload: entry.payload,
			agent_id: entry.agentId,
			organization_id: orgId,
			user_id: uId,
		});

		if (error) throw error;

		console.log(
			`[L4 SEMANTIC]: Successfully synced ${entry.type} to Sovereign Layer.`,
		);
	} catch (e) {
		console.error("Failed to sync with UKG Semantic Layer (Sovereign):", e);
	}
};
