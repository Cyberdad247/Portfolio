"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type JSX, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { INITIAL_DATA, PHASE_CONFIG } from "./data";
import { LadyReceptionAvatar } from "./lady-reception-avatar";
import { PhaseForm } from "./phase-form";
import type { OnboardingData, PhaseType } from "./types";

export function OnboardingFlow(): JSX.Element {
	const router = useRouter();
	const [currentPhase, setCurrentPhase] = useState<PhaseType>(1);
	const [formData, setFormData] = useState<OnboardingData>(INITIAL_DATA);
	const [isRecording, setIsRecording] = useState(false);

	const phase = PHASE_CONFIG[currentPhase];
	const progress = (currentPhase / 3) * 100;

	const handleInputChange = (id: string, value: string) => {
		setFormData((prev: OnboardingData) => ({ ...prev, [id]: value }));
	};

	const handleNextPhase = () => {
		if (currentPhase < 3) {
			setCurrentPhase((prev: PhaseType) => (prev + 1) as PhaseType);
		} else {
			handleCompleteOnboarding();
		}
	};

	const handlePreviousPhase = () => {
		if (currentPhase > 1) {
			setCurrentPhase((prev: PhaseType) => (prev - 1) as PhaseType);
		} else {
			router.push("/");
		}
	};

	const handleCompleteOnboarding = async () => {
		// [⚡Strike] EXECUTE: KINETIC COMPRESSION
		// biome-ignore lint/suspicious/noConsole: Logged for development phase confirmation
		console.log("--- ONBOARDING KINETIC SYNC ---");
		// biome-ignore lint/suspicious/noConsole: Logged for development phase confirmation
		console.log(
			"Payload Hashed & Transmitted:",
			JSON.stringify({ ...formData, _v: "CAMELOT_APEX_v200.0" }, null, 2),
		);

		// Simulate API delay, pending actual backend hookup (L1 Substrate)
		await new Promise((resolve) => setTimeout(resolve, 1200));

		// Redirect to home or dashboard after completing
		router.push("/");
	};

	return (
		<div className="relative min-h-screen">
			{/* Ambient glows (L7 Ethereal Layer) */}
			<div className="pointer-events-none absolute left-[-10%] top-[-10%] z-0 h-[50vw] w-[50vw] rounded-full bg-rose-500/5 blur-[150px]" />
			<div className="pointer-events-none absolute bottom-[-10%] right-[-10%] z-0 h-[40vw] w-[40vw] rounded-full bg-violet-600/5 blur-[150px]" />

			<div className="relative z-10 max-w-6xl mx-auto px-4 py-24">
				{/* Progress Bar Section (L6 Governance) */}
				<div className="mb-16 max-w-2xl mx-auto">
					<div className="flex justify-between items-center mb-3">
						<span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
							{"Governance Flow // Session Status"}
						</span>
						<span className="text-xs font-mono text-rose-400">
							{Math.round(progress)}% COMPLETE
						</span>
					</div>
					<Progress
						value={progress}
						className="h-1.5 bg-zinc-900 border border-border/50 overflow-hidden"
					/>

					<div className="flex justify-between mt-6 relative px-4">
						{/* Connecting Line Tracker */}
						<div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-800 -z-10 -translate-y-1/2" />

						{[1, 2, 3].map((phaseNum) => (
							<div
								key={phaseNum}
								className="flex flex-col items-center bg-background px-4 relative z-10"
							>
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
										phaseNum <= currentPhase
											? "bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-2 ring-background scale-110"
											: "bg-zinc-900 text-zinc-500 border border-zinc-800 ring-2 ring-background"
									}`}
								>
									{phaseNum < currentPhase ? (
										<CheckCircle2 className="h-5 w-5" />
									) : (
										phaseNum
									)}
								</div>
								<span
									className={`text-[10px] font-mono uppercase tracking-widest mt-3 ${phaseNum <= currentPhase ? "text-zinc-300" : "text-zinc-600"}`}
								>
									P{phaseNum}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Two-Column Layout (L5 Agentic) */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
					<div className="lg:col-span-4">
						<LadyReceptionAvatar
							currentPhase={currentPhase}
							phase={phase}
							isRecording={isRecording}
							onToggleRecording={() => setIsRecording(!isRecording)}
						/>
					</div>

					<div className="lg:col-span-8">
						<div className="rounded-2xl border border-border bg-card p-1 backdrop-blur-md relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
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
			</div>
		</div>
	);
}
