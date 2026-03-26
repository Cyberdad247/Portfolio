function requireEnv(
	name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY",
) {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

export function getSupabaseEnv() {
	return {
		url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
		anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
	};
}

/** Safe variant that returns null instead of throwing when env vars are missing. */
export function getSupabaseEnvSafe() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) return null;
	return { url, anonKey };
}
