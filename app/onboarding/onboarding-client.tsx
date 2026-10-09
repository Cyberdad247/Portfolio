"use client";

import dynamic from "next/dynamic";

const OnboardingFlow = dynamic(
	() => import("@/components/onboarding/onboarding-flow").then((m) => ({ default: m.OnboardingFlow })),
	{ ssr: false },
);

export function OnboardingClient() {
	return <OnboardingFlow />;
}
