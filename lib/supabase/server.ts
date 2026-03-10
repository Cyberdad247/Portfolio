import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function createClient() {
	const cookieStore = await cookies();
	const { url, anonKey } = getSupabaseEnv();

	return createServerClient(url, anonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(
				cookiesToSet: Array<{
					name: string;
					value: string;
					options?: Parameters<typeof cookieStore.set>[2];
				}>,
			) {
				try {
					for (const { name, value, options } of cookiesToSet) {
						cookieStore.set(name, value, options);
					}
				} catch {
					// Middleware owns cookie persistence during RSC renders.
				}
			},
		},
	});
}
