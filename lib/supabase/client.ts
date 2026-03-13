import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createClient() {
	const { url, anonKey } = getSupabaseEnv();

	return createBrowserClient(url, anonKey);
}

export function tryCreateClient() {
	try {
		return createClient();
	} catch (error) {
		console.error("Supabase browser client unavailable:", error);
		return null;
	}
}
