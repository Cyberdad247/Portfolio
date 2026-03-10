import { createClient } from "@/lib/supabase/server";

export async function getActiveMembership(userId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("organization_members")
		.select(
			`
      organization_id,
      role,
      is_default,
      organizations (
        id,
        name,
        slug,
        plan
      )
    `,
		)
		.eq("user_id", userId)
		.order("is_default", { ascending: false })
		.order("created_at", { ascending: true })
		.limit(1)
		.maybeSingle();

	if (error) {
		return null;
	}

	return data;
}
