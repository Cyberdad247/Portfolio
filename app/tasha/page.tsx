import { redirect } from "next/navigation";

export const metadata = {
	title: "Tasha // Omni-Receptionist | Invisioned Marketing",
	description:
		"Meet Tasha, your AI-powered onboarding specialist at Invisioned Marketing.",
};

export default function TashaPage() {
	redirect("/onboarding");
}
