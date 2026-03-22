import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata = {
	title: "Tasha // Onboarding | Invisioned Marketing",
	description:
		"Meet Tasha, your AI-powered onboarding specialist. Voice-first lead capture for Invisioned Marketing.",
};

export default function OnboardingPage() {
	return (
		<main className="min-h-screen bg-background text-white">
			<OnboardingFlow />
		</main>
	);
}
