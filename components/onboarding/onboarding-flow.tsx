"use client";

import { useRouter } from "next/navigation";
import { type JSX, useCallback, useEffect, useState } from "react";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { Progress } from "@/components/ui/progress";
import { useDebounce } from "@/hooks/use-debounce";
import { useReceptionistVoice } from "@/hooks/use-receptionist-voice";
import { emitNexusEvent } from "@/lib/nexus-sync";
import { extractOnboardingFromTranscript } from "@/lib/onboarding/voice-intake";
import { logToUKG } from "@/lib/ukg-logger";
import { INITIAL_DATA, PHASE_CONFIG } from "./data";
import { LadyReceptionAvatar } from "./lady-reception-avatar";
import { PhaseForm } from "./phase-form";
import { StrategyForgeModal } from "./strategy-forge-modal";
import type {
	OnboardingData,
	OnboardingTranscriptEvent,
	PhaseType,
} from "./types";

export function OnboardingFlow(): JSX.Element {
	const router = useRouter();
	const [currentPhase, setCurrentPhase] = useState<PhaseType>(1);
	const [formData, setFormData] = useState<OnboardingData>(INITIAL_DATA);
	const [isThinking, setIsThinking] = useState(false);
	const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
	const [lastTranscript, setLastTranscript] = useState("");
	const [voiceAssistantMessage, setVoiceAssistantMessage] = useState("");
	const [transcriptLog, setTranscriptLog] = useState<
		OnboardingTranscriptEvent[]
	>([]);
	const [isRemoteSessionLoading, setIsRemoteSessionLoading] = useState(true);
	const [remoteSaveState, setRemoteSaveState] = useState<
		"idle" | "saving" | "saved" | "error"
	>("idle");

	const debouncedWebsite = useDebounce(formData.website, 1500);
	const debouncedRemotePayload = useDebounce(
		JSON.stringify({
			currentPhase,
			formData,
			transcriptLog,
		}),
		1200,
	);

	const phase = PHASE_CONFIG[currentPhase];
	const progress = (currentPhase / 3) * 100;

	const buildPhasePrompt = useCallback(() => {
		if (isThinking) {
			return "Please wait while I analyze your digital footprint and calibrate the strategy.";
		}

		const unanswered = phase.questions
			.filter((question) => {
				const value = formData[question.id as keyof OnboardingData];
				return !value;
			})
			.map((question) => question.label);

		if (unanswered.length === 0) {
			return `${phase.title} is complete. You can continue to the next phase, or give me any extra context you want me to note.`;
		}

		return `${phase.description}. I still need: ${unanswered.join(", ")}. You can speak naturally and I will capture what I can.`;
	}, [formData, isThinking, phase]);

	const handleVoiceTranscript = useCallback(
		(transcript: string) => {
			setLastTranscript(transcript);

			const extraction = extractOnboardingFromTranscript(
				transcript,
				currentPhase,
				formData,
			);

			if (Object.keys(extraction.updates).length > 0) {
				setFormData((previous) => ({
					...previous,
					...extraction.updates,
				}));
				setTranscriptLog((previous) => [
					...previous,
					{
						transcript,
						phase: currentPhase,
						capturedFields: Object.keys(extraction.updates),
						capturedValues: extraction.updates,
						createdAt: new Date().toISOString(),
					},
				]);

				const summary =
					extraction.summary.length > 0
						? `I captured ${extraction.summary.join(", ")}.`
						: "I captured new onboarding details.";

				setVoiceAssistantMessage(summary);
				emitNexusEvent({
					agent: "A-04",
					action: `Voice intake updated phase ${currentPhase}: ${summary}`,
				});
			} else {
				const fallbackMessage =
					"I heard you, but I could not confidently map that to the active fields. You can keep speaking or type the details manually.";
				setVoiceAssistantMessage(fallbackMessage);
			}
		},
		[currentPhase, formData],
	);

	const {
		isSpeechRecognitionSupported,
		isSpeechSynthesisSupported,
		isListening,
		isSpeaking,
		interimTranscript,
		error: voiceError,
		startListening,
		stopListening,
		speak,
		stopSpeaking,
	} = useReceptionistVoice({
		onFinalTranscript: handleVoiceTranscript,
	});

	useEffect(() => {
		const savedData = localStorage.getItem("AOS_ONBOARDING_DATA");
		if (savedData) {
			try {
				const parsed = JSON.parse(savedData) as Partial<{
					currentPhase: PhaseType;
					formData: OnboardingData;
					transcriptLog: OnboardingTranscriptEvent[];
				}>;

				if (parsed.formData) {
					setFormData((previous) => ({ ...previous, ...parsed.formData }));
				}
				if (parsed.currentPhase) {
					setCurrentPhase(parsed.currentPhase);
				}
				if (parsed.transcriptLog) {
					setTranscriptLog(parsed.transcriptLog);
				}
			} catch (error) {
				console.error("Kinetic Cache Read Failure:", error);
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(
			"AOS_ONBOARDING_DATA",
			JSON.stringify({
				currentPhase,
				formData,
				transcriptLog,
			}),
		);
	}, [currentPhase, formData, transcriptLog]);

	useEffect(() => {
		let isMounted = true;

		const loadRemoteSession = async () => {
			try {
				const response = await fetch("/api/onboarding/session", {
					method: "GET",
					cache: "no-store",
				});

				if (!response.ok) {
					if (response.status >= 500 && isMounted) {
						setRemoteSaveState("error");
					}
					return;
				}

				const payload = (await response.json()) as {
					session: null | {
						current_phase: PhaseType;
						form_data: Partial<OnboardingData>;
						transcript_log: OnboardingTranscriptEvent[];
					};
				};
				const session = payload.session;

				if (!isMounted || !session) {
					return;
				}

				setCurrentPhase(session.current_phase);
				setFormData((previous) => ({
					...previous,
					...session.form_data,
				}));
				setTranscriptLog(session.transcript_log || []);
			} catch {
				if (isMounted) {
					setRemoteSaveState("error");
				}
			} finally {
				if (isMounted) {
					setIsRemoteSessionLoading(false);
				}
			}
		};

		void loadRemoteSession();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		if (isRemoteSessionLoading) {
			return;
		}

		let isCancelled = false;

		const saveRemoteSession = async () => {
			const payload = JSON.parse(debouncedRemotePayload) as {
				currentPhase: PhaseType;
				formData: OnboardingData;
				transcriptLog: OnboardingTranscriptEvent[];
			};
			setRemoteSaveState("saving");

			try {
				const response = await fetch("/api/onboarding/session", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						currentPhase: payload.currentPhase,
						formData: payload.formData,
						transcriptLog: payload.transcriptLog,
						status: "draft",
					}),
				});

				if (!response.ok) {
					if (
						(response.status === 401 || response.status === 403) &&
						!isCancelled
					) {
						setRemoteSaveState("idle");
						return;
					}
					if (!isCancelled) {
						setRemoteSaveState("error");
					}
					return;
				}

				if (!isCancelled) {
					setRemoteSaveState("saved");
				}
			} catch {
				if (!isCancelled) {
					setRemoteSaveState("error");
				}
			}
		};

		void saveRemoteSession();

		return () => {
			isCancelled = true;
		};
	}, [debouncedRemotePayload, isRemoteSessionLoading]);

	const triggerAutonomousResearch = useCallback(
		async (url: string) => {
			if (isThinking) {
				return;
			}

			setIsThinking(true);
			emitNexusEvent({
				agent: "A-01",
				action: `Initiated Nano-Browser scan for: ${url}`,
			});

			await new Promise((resolve) => setTimeout(resolve, 3000));

			const companyName = url
				.replace("https://", "")
				.replace("http://", "")
				.replace("www.", "")
				.split(".")[0];

			setFormData((previous) => ({
				...previous,
				company:
					previous.company ||
					companyName.charAt(0).toUpperCase() + companyName.slice(1),
				industry: previous.industry || "Technology",
				goals:
					previous.goals ||
					"Accelerate growth and optimize digital presence via Agentic Nexus protocols.",
			}));

			emitNexusEvent({
				agent: "A-02",
				action: `Synthesized background report for ${companyName.toUpperCase()}. Industry: Technology.`,
			});

			setIsThinking(false);
		},
		[isThinking],
	);

	useEffect(() => {
		if (
			debouncedWebsite &&
			debouncedWebsite.length > 8 &&
			debouncedWebsite.includes(".")
		) {
			void triggerAutonomousResearch(debouncedWebsite);
		}
	}, [debouncedWebsite, triggerAutonomousResearch]);

	const handleInputChange = (id: string, value: string) => {
		setFormData((previous: OnboardingData) => ({ ...previous, [id]: value }));
	};

	const handleCompleteOnboarding = async () => {
		logToUKG({
			type: "ONBOARDING",
			payload: formData as unknown as Record<string, unknown>,
			agentId: "Lady-Anya",
		});

		emitNexusEvent({
			agent: "A-03",
			action: `Onboarding Session for ${formData.company || formData.name} finalized and synced to UKG.`,
		});

		try {
			await fetch("/api/onboarding/session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					currentPhase,
					formData,
					transcriptLog,
					status: "completed",
				}),
			});
		} catch {
			setRemoteSaveState("error");
		}

		setIsStrategyModalOpen(true);
	};

	const handleNextPhase = () => {
		if (currentPhase < 3) {
			setCurrentPhase((previous: PhaseType) => (previous + 1) as PhaseType);
			return;
		}

		void handleCompleteOnboarding();
	};

	const handlePreviousPhase = () => {
		if (currentPhase > 1) {
			setCurrentPhase((previous: PhaseType) => (previous - 1) as PhaseType);
			return;
		}

		router.push("/");
	};

	const handleFinalRedirect = () => {
		setIsStrategyModalOpen(false);
		router.push("/dashboard");
	};

	const handleToggleRecording = () => {
		if (isListening) {
			stopListening();
			return;
		}

		startListening();
	};

	const handleReplayMessage = useCallback(() => {
		const message = voiceAssistantMessage || buildPhasePrompt();
		if (isSpeechSynthesisSupported) {
			speak(message);
		}
	}, [
		buildPhasePrompt,
		isSpeechSynthesisSupported,
		speak,
		voiceAssistantMessage,
	]);

	useEffect(() => {
		const message = buildPhasePrompt();
		setVoiceAssistantMessage(message);
		if (isSpeechSynthesisSupported) {
			speak(message);
		}
	}, [buildPhasePrompt, isSpeechSynthesisSupported, speak]);

	return (
		<div className="relative min-h-screen">
			<AmbientGlow color="bg-rose-500/5" position="top-left" />
			<AmbientGlow color="bg-violet-600/5" position="bottom-right" />

			<div className="relative z-10 mx-auto max-w-6xl px-4 py-24">
				<div className="mx-auto mb-16 max-w-2xl">
					<div className="mb-3 flex items-center justify-between">
						<span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
							{"Governance Flow // Session Status"}
						</span>
						<span className="text-xs font-mono text-rose-400">
							{Math.round(progress)}% COMPLETE
						</span>
					</div>
					<Progress
						value={progress}
						className="h-1.5 overflow-hidden border border-border/50 bg-zinc-900"
					/>

					<div className="relative mt-6 flex justify-between px-4">
						<div className="absolute top-1/2 right-0 left-0 -z-10 h-[1px] -translate-y-1/2 bg-zinc-800" />

						{[1, 2, 3].map((phaseNum) => (
							<div
								key={phaseNum}
								className="relative z-10 flex flex-col items-center bg-background px-4"
							>
								<div
									className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
										phaseNum <= currentPhase
											? "scale-110 bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-2 ring-background"
											: "border border-zinc-800 bg-zinc-900 text-zinc-500 ring-2 ring-background"
									}`}
								>
									{phaseNum < currentPhase ? (
										<span className="text-white">OK</span>
									) : (
										phaseNum
									)}
								</div>
								<span
									className={`mt-3 text-[10px] font-mono uppercase tracking-widest ${
										phaseNum <= currentPhase ? "text-zinc-300" : "text-zinc-600"
									}`}
								>
									P{phaseNum}
								</span>
							</div>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<LadyReceptionAvatar
							currentPhase={currentPhase}
							phase={phase}
							isRecording={isListening}
							isThinking={isThinking}
							isSpeaking={isSpeaking}
							isVoiceInputSupported={isSpeechRecognitionSupported}
							isVoiceOutputSupported={isSpeechSynthesisSupported}
							interimTranscript={interimTranscript}
							lastTranscript={lastTranscript}
							voiceError={
								voiceError ||
								(remoteSaveState === "error"
									? "Authenticated onboarding save is currently unavailable."
									: null)
							}
							onToggleRecording={handleToggleRecording}
							onReplayMessage={handleReplayMessage}
							onStopSpeaking={stopSpeaking}
						/>
					</div>

					<div className="lg:col-span-8">
						<div className="relative overflow-hidden rounded-2xl border border-border bg-card p-1 backdrop-blur-md">
							<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
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
