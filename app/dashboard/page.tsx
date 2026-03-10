import DashboardShell from "@/components/dashboard-shell";
import { getActiveMembership } from "@/lib/auth/get-active-membership";
import { getProfile } from "@/lib/auth/get-profile";
import { requireSession } from "@/lib/auth/get-session";

export default async function DashboardPage() {
	const { user } = await requireSession();
	const [membership, profile] = await Promise.all([
		getActiveMembership(user.id),
		getProfile(user.id),
	]);
	const organization = Array.isArray(membership?.organizations)
		? membership.organizations[0]
		: membership?.organizations;

	if (!membership || !organization) {
		return (
			<main className="container py-16">
				<h1 className="text-3xl font-semibold">No organization access</h1>
				<p className="mt-4 text-white/70">
					Your account is signed in, but no organization membership was found.
				</p>
			</main>
		);
	}

	return (
		<DashboardShell
			orgName={organization.name}
			role={membership.role}
			userLabel={profile?.full_name ?? user.email ?? "Authenticated user"}
		/>
	);
}
