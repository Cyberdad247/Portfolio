import { redirect } from "next/navigation";
import AdminShell from "@/components/admin-shell";
import { getProfile } from "@/lib/auth/get-profile";
import { requireSession } from "@/lib/auth/get-session";
import { INTERNAL_ROLES } from "@/lib/auth/roles";

export default async function AdminPage() {
	const { user } = await requireSession();
	const profile = await getProfile(user.id);

	if (!profile || !INTERNAL_ROLES.includes(profile.system_role)) {
		redirect("/dashboard");
	}

	return <AdminShell userRole={profile.system_role} />;
}
