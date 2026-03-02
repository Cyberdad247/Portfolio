"use client";

import { useRouter } from "next/navigation";
import { type JSX, useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useDebounce } from "@/hooks/use-debounce";
import { emitNexusEvent } from "@/lib/nexus-sync";
import { logToUKG } from "@/lib/ukg-logger";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { INITIAL_DATA, PHASE_CONFIG } from "./data";
import { LadyReceptionAvatar } from "./lady-reception-avatar";
import { PhaseForm } from "./phase-form";
import { StrategyForgeModal } from "./strategy-forge-modal";
import type { OnboardingData, PhaseType } from "./types";

export function OnboardingFlow(): JSX.Element {
	const router = useRouter();
	const [currentPhase, setCurrentPhase] = useState<PhaseType>(1);
	const [formData, setFormData] = useState<OnboardingData>(INITIAL_DATA);
	const [isRecording, setIsRecording] = useState(false);
	const [isThinking, setIsThinking] = useState(false);
	const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);

	const debouncedWebsite = useDebounce(formData.website, 1500);

	// [🧠 Neural Persistence]: Load initial state from L2 Kinetic Cache (localStorage)
	useEffect(() => {
		const savedData = localStorage.getItem("AOS_ONBOARDING_DATA");
		if (savedData) {
			try {
				setFormData(JSON.parse(savedData));
			} catch (e) {
				console.error("Kinetic Cache Read Failure:", e);
			}
		}
	}, []);

	// [🧠 Neural Persistence]: Auto-save to L2 Kinetic Cache
	useEffect(() => {
		localStorage.setItem("AOS_ONBOARDING_DATA", JSON.stringify(formData));
	}, [formData]);

	// [🕵️ Intelligence Scout]: Trigger autonomous reconnaissance on Website URL
	useEffect(() => {
		if (
			debouncedWebsite &&
			debouncedWebsite.length > 8 &&
			debouncedWebsite.includes(".")
		) {
			triggerAutonomousResearch(debouncedWebsite);
		}
	}, [debouncedWebsite]);

	const phase = PHASE_CONFIG[currentPhase];
	const progress = (currentPhase / 3) * 100;

	const handleInputChange = (id: string, value: string) => {
		setFormData((prev: OnboardingData) => ({ ...prev, [id]: value }));
	};

	const triggerAutonomousResearch = async (url: string) => {
		if (isThinking) return;
		setIsThinking(true);

		// [⚡Nexus Sync]: Broadcast scan initiation
		emitNexusEvent({
			agent: "A-01",
			action: `Initiated Nano-Browser scan for: ${url}`,
		});

		// [⚡Kinetic Strike]: Simulating Nano-Browser Intelligence Gathering
		await new Promise((resolve) => setTimeout(resolve, 3000));

		const companyName = url
			.replace("https://", "")
			.replace("http://", "")
			.replace("www.", "")
			.split(".")[0];

		setFormData((prev) => ({
			...prev,
			company: prev.company || companyName.charAt(0).toUpperCase() + companyName.slice(1),
			industry: prev.industry || "Technology",
			goals:
				prev.goals ||
				"Accelerate growth and optimize digital presence via Agentic Nexus protocols.",
		}));

		emitNexusEvent({
			agent: "A-02",
			action: `Synthesized background report for ${companyName.toUpperCase()}. Industry: Technology.`,
		});

		setIsThinking(false);
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

	const handleCompleteOnboarding = () => {
		// [L4 Semantic]: Commit session to UKG
		logToUKG({
			type: "ONBOARDING",
			payload: formData as unknown as Record<string, unknown>,
			agentId: "Lady-Anya",
		});

		// [L5 Agentic]: Final sync to Dashboard
		emitNexusEvent({
			agent: "A-03",
			action: `Onboarding Session for ${formData.company || formData.name} finalized and synced to UKG.`,
		});

		setIsStrategyModalOpen(true);
	};

	const handleFinalRedirect = () => {
		setIsStrategyModalOpen(false);
		router.push("/dashboard");
	};

	return (
		<div className="relative min-h-screen">
			{/* Ambient glows (L7 Ethereal Layer) */}
			<AmbientGlow color="bg-rose-500/5" position="top-left" />
			<AmbientGlow color="bg-violet-600/5" position="bottom-right" />

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
									className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${phaseNum <= currentPhase
										? "bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-2 ring-background scale-110"
										: "bg-zinc-900 text-zinc-500 border border-zinc-800 ring-2 ring-background"
										}`}
								>
									{phaseNum < currentPhase ? (
										<span className="text-white">✓</span>
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
							isThinking={isThinking}
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

							<StrategyForgeModal
								isOpen={isStrategyModalOpen}
								onClose={handleFinalRedirect}
								formData={formData}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
