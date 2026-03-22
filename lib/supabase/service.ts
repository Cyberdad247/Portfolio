import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client using the service role key.
 * Use this for server-side operations that bypass RLS (e.g., queue processing).
 */
export function createServiceClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!url || !serviceKey) {
		throw new Error(
			"Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
		);
	}

	return createSupabaseClient(url, serviceKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}
