import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata = {
	title: "Onboarding | Invisioned Marketing",
	description: "Begin your journey with the Mystical Knights of Evolution.",
};

export default function OnboardingPage() {
	return (
		<main className="min-h-screen bg-zinc-950 text-white">
			<OnboardingFlow />
		</main>
	);
}
