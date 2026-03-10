import { createClient } from "@/lib/supabase/server";

export async function getProfile(userId: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("profiles")
		.select("id, email, full_name, avatar_url, system_role")
		.eq("id", userId)
		.maybeSingle();

	if (error) {
		return null;
	}

	return data;
}
