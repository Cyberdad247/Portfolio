"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import {
	User,
	MessageSquare,
	Building,
	Phone,
	Globe,
	TrendingUp,
	Users,
	Shield,
	Zap,
	CheckCircle2,
} from "lucide-react";
import { LadyReceptionAvatar } from "./lady-reception-avatar";
import { PhaseForm } from "./phase-form";
import type { PhaseType, PhaseData, OnboardingData } from "./types";

const INITIAL_DATA: OnboardingData = {
	name: "",
	email: "",
	company: "",
	phone: "",
	industry: "",
	website: "",
	goals: "",
	targetAudience: "",
	currentChallenges: "",
	budgetRange: "",
	preferredChannels: "",
	timeline: "",
};

const PHASE_CONFIG: Record<PhaseType, PhaseData> = {
	1: {
		title: "Welcome & Basic Information",
		description: "Let's start by getting to know you and your business",
		icon: User,
		color: "bg-rose-500",
		questions: [
			{
				id: "name",
				label: "Your Full Name",
				icon: User,
				placeholder: "Lady Anisette",
			},
			{
				id: "email",
				label: "Email Address",
				icon: MessageSquare,
				placeholder: "anisette@example.com",
				type: "email",
			},
			{
				id: "company",
				label: "Company Name",
				icon: Building,
				placeholder: "The Royal Court",
			},
			{
				id: "phone",
				label: "Phone Number",
				icon: Phone,
				placeholder: "+1 (555) 123-4567",
				type: "tel",
			},
			{
				id: "industry",
				label: "Industry",
				icon: Building,
				type: "select",
				options: [
					"Technology",
					"E-commerce",
					"Healthcare",
					"Finance",
					"Education",
					"Professional Services",
					"Other",
				],
			},
			{
				id: "website",
				label: "Website",
				icon: Globe,
				placeholder: "https://example.com",
			},
		],
	},
	2: {
		title: "Business Goals & Target Audience",
		description:
			"Help us understand your marketing objectives and ideal customers",
		icon: TrendingUp,
		color: "bg-amber-500",
		questions: [
			{
				id: "goals",
				label: "What are your primary marketing goals?",
				icon: TrendingUp,
				type: "textarea",
				placeholder: "Increase brand awareness, generate more leads...",
			},
			{
				id: "targetAudience",
				label: "Describe your target audience",
				icon: Users,
				type: "textarea",
				placeholder: "Age range, interests, location, pain points...",
			},
			{
				id: "currentChallenges",
				label: "What are your biggest marketing challenges?",
				icon: Shield,
				type: "textarea",
				placeholder: "Limited budget, lack of time, inconsistent results...",
			},
			{
				id: "budgetRange",
				label: "Monthly Marketing Budget Range",
				icon: TrendingUp,
				type: "select",
				options: [
					"Less than $1,000",
					"$1,000 - $5,000",
					"$5,000 - $10,000",
					"$10,000 - $25,000",
					"$25,000+",
					"Not sure",
				],
			},
			{
				id: "preferredChannels",
				label: "Preferred Marketing Channels",
				icon: MessageSquare,
				type: "select",
				options: [
					"Social Media",
					"Email Marketing",
					"SEO",
					"PPC",
					"Content Marketing",
					"Multi-channel",
				],
			},
		],
	},
	3: {
		title: "Strategy Alignment & Timeline",
		description: "Let's align on your strategy and implementation timeline",
		icon: Zap,
		color: "bg-violet-500",
		questions: [
			{
				id: "timeline",
				label: "When would you like to start?",
				icon: Zap,
				type: "select",
				options: [
					"Immediately",
					"Within 1 week",
					"Within 1 month",
					"Just exploring",
					"Flexible",
				],
			},
			{
				id: "goals",
				label: "Additional Notes or Requirements",
				icon: MessageSquare,
				type: "textarea",
				placeholder: "Any specific requirements, preferences, or questions...",
			},
		],
	},
};

export function OnboardingFlow() {
	const router = useRouter();
	const [currentPhase, setCurrentPhase] = useState<PhaseType>(1);
	const [formData, setFormData] = useState<OnboardingData>(INITIAL_DATA);
	const [isRecording, setIsRecording] = useState(false);

	const phase = PHASE_CONFIG[currentPhase];
	const progress = (currentPhase / 3) * 100;

	const handleInputChange = (id: string, value: string) => {
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleNextPhase = () => {
		if (currentPhase < 3) {
			setCurrentPhase((prev) => (prev + 1) as PhaseType);
		} else {
			handleCompleteOnboarding();
		}
	};

	const handlePreviousPhase = () => {
		if (currentPhase > 1) {
			setCurrentPhase((prev) => (prev - 1) as PhaseType);
		} else {
			router.push("/");
		}
	};

	const handleCompleteOnboarding = async () => {
		console.log("--- ONBOARDING COMPLETED ---");
		console.log("Payload Data:", JSON.stringify(formData, null, 2));

		// Simulate API delay, pending actual backend hookup
		await new Promise((resolve) => setTimeout(resolve, 800));
		alert("Onboarding Data Logged to Console successfully!");

		// Redirect to home or dashboard after completing
		router.push("/");
	};

	return (
		<div className="max-w-6xl mx-auto px-4 py-12">
			{/* Progress Bar Section */}
			<div className="mb-12 max-w-2xl mx-auto">
				<div className="flex justify-between items-center mb-2">
					<span className="text-sm text-zinc-400">Onboarding Progress</span>
					<span className="text-sm font-medium text-rose-400">
						{Math.round(progress)}%
					</span>
				</div>
				<Progress
					value={progress}
					className="h-2 bg-zinc-900 border border-zinc-800"
				/>

				<div className="flex justify-between mt-4 relative">
					{/* Connecting Line Tracker */}
					<div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-800 -z-10 -translate-y-1/2" />

					{[1, 2, 3].map((phaseNum) => (
						<div
							key={phaseNum}
							className="flex flex-col items-center bg-zinc-950 px-2 relative z-10"
						>
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${phaseNum <= currentPhase
										? "bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-lg shadow-rose-500/25 ring-2 ring-zinc-950"
										: "bg-zinc-900 text-zinc-500 border border-zinc-800 ring-2 ring-zinc-950"
									}`}
							>
								{phaseNum < currentPhase ? (
									<CheckCircle2 className="h-4 w-4" />
								) : (
									phaseNum
								)}
							</div>
							<span
								className={`text-xs mt-2 font-medium ${phaseNum <= currentPhase ? "text-zinc-300" : "text-zinc-600"}`}
							>
								Phase {phaseNum}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Two-Column Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-1">
					<LadyReceptionAvatar
						currentPhase={currentPhase}
						phase={phase}
						isRecording={isRecording}
						onToggleRecording={() => setIsRecording(!isRecording)}
					/>
				</div>

				<div className="lg:col-span-2">
					<PhaseForm
						currentPhase={currentPhase}
						phase={phase}
						formData={formData}
						onInputChange={handleInputChange}
						onNextPhase={handleNextPhase}
						onPreviousPhase={handlePreviousPhase}
					/>
				</div>
			</div>
		</div>
	);
}
