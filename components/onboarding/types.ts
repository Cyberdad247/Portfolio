import type { LucideIcon } from "lucide-react";

export type PhaseType = 1 | 2 | 3;

export interface Question {
	id: string;
	label: string;
	icon: LucideIcon;
	placeholder?: string;
	type?: "text" | "select" | "textarea" | "email" | "tel";
	options?: string[];
}

export interface PhaseData {
	title: string;
	description: string;
	icon: LucideIcon;
	color: string;
	questions: Question[];
}

export interface OnboardingData {
	name: string;
	email: string;
	company: string;
	phone: string;
	industry: string;
	website: string;
	goals: string;
	targetAudience: string;
	currentChallenges: string;
	budgetRange: string;
	preferredChannels: string;
	timeline: string;
	additionalNotes: string;
}
