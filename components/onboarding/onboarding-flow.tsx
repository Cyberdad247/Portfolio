"use client";

import { useRouter } from "next/navigation";
import { type JSX, useCallback, useEffect, useRef, useState } from "react";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { Progress } from "@/components/ui/progress";
import { useDebounce } from "@/hooks/use-debounce";
import { useReceptionistVoice } from "@/hooks/use-receptionist-voice";
import { emitNexusEvent } from "@/lib/nexus-sync";
import { logToUKG } from "@/lib/ukg-logger";
import { supabase } from "@/lib/supabase";
import { INITIAL_DATA, PHASE_CONFIG } from "./data";
import { LadyReceptionAvatar } from "./lady-reception-avatar";
import { MobileVoiceWidget } from "./mobile-voice-widget";
import { PhaseForm } from "./phase-form";
import { StrategyForgeModal } from "./strategy-forge-modal";
import type {
	OnboardingData,
	OnboardingTranscriptEvent,
	PhaseType,
} from "./types";

type ConversationEntry = {
	role: "user" | "tasha";
	content: string;
	timestamp: number;
};

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
	const [conversation, setConversation] = useState<ConversationEntry[]>([]);
	const [toolsTriggered, setToolsTriggered] = useState<string[]>([]);
	const tashaSessionRef = useRef(crypto.randomUUID());
	const speakRef = useRef<(text: string) => void>(() => {});

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
			return "Hold tight — running that through my neural circuits...";
		}

		const unanswered = phase.questions
			.filter((question) => {
				const value = formData[question.id as keyof OnboardingData];
				return !value;
			})
			.map((question) => question.label);

		if (unanswered.length === 0) {
			return `${phase.title} is all sorted! Hit continue or drop any extra context you want me to note. Cheers!`;
		}

		return `${phase.description}. I still need: ${unanswered.join(", ")}. Speak naturally and I'll capture what I can, bet.`;
	}, [formData, isThinking, phase]);

	const triggerAutonomousResearch = useCallback(
		async (url: string) => {
			if (isThinking) {
				return;
			}

			setIsThinking(true);
			emitNexusEvent({
				agent: "T-01",
				action: `Tasha initiated Intelligence Scout for: ${url}`,
			});

			try {
				const response = await fetch("/api/onboarding/research", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ url }),
				});

				if (!response.ok) throw new Error("Research Scout failure");

				const data = await response.json();

				setFormData((previous) => ({
					...previous,
					company: previous.company || data.company,
					industry: previous.industry || data.industry,
					goals: previous.goals || data.goals,
				}));

				emitNexusEvent({
					agent: "T-01",
					action: `Tasha synthesized background report for ${data.company.toUpperCase()}.`,
				});
			} catch (error) {
				console.error("Intelligence Scout Failure:", error);
				emitNexusEvent({
					agent: "T-01",
					action: `Intelligence Scout failed for ${url}. Manual intake required.`,
				});
			} finally {
				setIsThinking(false);
			}
		},
		[isThinking],
	);

	const handleVoiceTranscript = useCallback(
		async (transcript: string) => {
			setLastTranscript(transcript);

			if (isThinking) {
				return;
			}

			setIsThinking(true);
			emitNexusEvent({
				agent: "T-01",
				action: "Tasha is analyzing your voice input...",
			});

			// Add user message to conversation
			setConversation((prev) => [
				...prev,
				{ role: "user", content: transcript, timestamp: Date.now() },
			]);

			try {
				// Route through Tasha's chat API for AI-powered extraction + response
				const tashaResponse = await fetch("/api/tasha/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						session_id: tashaSessionRef.current,
						utterance: transcript,
					}),
				});

				if (tashaResponse.ok) {
					const tashaData = await tashaResponse.json();

					// Map Tasha's extracted lead data back to onboarding form
					if (tashaData.lead) {
						setFormData((previous) => ({
							...previous,
							name: previous.name || tashaData.lead.full_name || "",
							email: previous.email || tashaData.lead.email || "",
							goals: previous.goals || tashaData.lead.marketing_goal || "",
						}));
					}

					if (tashaData.tools_triggered?.length > 0) {
						setToolsTriggered((prev) => [
							...prev,
							...tashaData.tools_triggered,
						]);
					}

					// Add Tasha's response to conversation
					if (tashaData.response) {
						setConversation((prev) => [
							...prev,
							{
								role: "tasha",
								content: tashaData.response,
								timestamp: Date.now(),
							},
						]);
						setVoiceAssistantMessage(tashaData.response);
						speakRef.current(tashaData.response);
					}
				}

				// Also run the existing regex extraction for form fields
				const extractResponse = await fetch("/api/onboarding/extract", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						transcript,
						currentPhase,
						currentData: formData,
					}),
				});

				if (extractResponse.ok) {
					const extraction = await extractResponse.json();

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

						emitNexusEvent({
							agent: "T-01",
							action: `Tasha captured: ${extraction.summary.join(", ")}`,
						});

						if (extraction.updates.website) {
							triggerAutonomousResearch(extraction.updates.website);
						}
					}
				}
			} catch (error) {
				console.error("Tasha Extraction Failure:", error);
				const fallback =
					"Ope, my wires got crossed! Try that again or type it in manually.";
				setVoiceAssistantMessage(fallback);
				setConversation((prev) => [
					...prev,
					{ role: "tasha", content: fallback, timestamp: Date.now() },
				]);
				speakRef.current(fallback);
			} finally {
				setIsThinking(false);
			}
		},
		[currentPhase, formData, isThinking, triggerAutonomousResearch],
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

	speakRef.current = speak;

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
			agentId: "Tasha-Prime",
		});

		emitNexusEvent({
			agent: "T-01",
			action: `Tasha finalized onboarding for ${formData.company || formData.name} and synced to UKG.`,
		});

		// [L1 Substrate]: Persist lead to Supabase (triggers auto-email to vizion711@gmail.com)
		try {
			await supabase.from("leads").insert({
				name: formData.name,
				email: formData.email,
				query: formData.goals || formData.currentChallenges || null,
				source: "onboarding_flow",
				status: "new",
				metadata: {
					company: formData.company,
					phone: formData.phone,
					industry: formData.industry,
					website: formData.website,
					targetAudience: formData.targetAudience,
					budgetRange: formData.budgetRange,
					preferredChannels: formData.preferredChannels,
					timeline: formData.timeline,
					additionalNotes: formData.additionalNotes,
				},
			});
		} catch (err) {
			console.error("[L1 SUBSTRATE]: Supabase lead sync failure:", err);
		}

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
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold tracking-tight text-white">
						{"Onboarding // Tasha Prime"}
					</h1>
					<p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
						{"Voice-Powered Lead Intake // Invisioned Marketing"}
					</p>
				</div>

				<div className="mx-auto mb-12 max-w-2xl">
					<div className="mb-3 flex items-center justify-between">
						<span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
							{"Tasha Flow // Session Status"}
						</span>
						<span className="font-mono text-[10px] text-rose-400">
							{Math.round(progress)}% COMPLETE
						</span>
					</div>
					<Progress
						value={progress}
						className="h-1.5 overflow-hidden border border-white/[0.08] bg-white/[0.03]"
					/>

					<div className="relative mt-6 flex justify-between px-4">
						<div className="absolute top-1/2 right-0 left-0 -z-10 h-[1px] -translate-y-1/2 bg-white/[0.08]" />

						{[1, 2, 3].map((phaseNum) => (
							<div
								key={phaseNum}
								className="relative z-10 flex flex-col items-center bg-background px-4"
							>
								<div
									className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
										phaseNum <= currentPhase
											? "scale-110 bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-2 ring-background"
											: "border border-white/[0.08] bg-white/[0.03] text-zinc-500 ring-2 ring-background"
									}`}
								>
									{phaseNum < currentPhase ? (
										<span className="text-white">OK</span>
									) : (
										phaseNum
									)}
								</div>
								<span
									className={`mt-3 font-mono text-[10px] uppercase tracking-widest ${
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
					<div className="hidden lg:block lg:col-span-4">
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
							conversation={conversation}
							toolsTriggered={toolsTriggered}
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

			<MobileVoiceWidget
				currentPhase={currentPhase}
				phase={phase}
				isRecording={isListening}
				isThinking={isThinking}
				isSpeaking={isSpeaking}
				isVoiceInputSupported={isSpeechRecognitionSupported}
				isVoiceOutputSupported={isSpeechSynthesisSupported}
				interimTranscript={interimTranscript}
				lastTranscript={lastTranscript}
				conversation={conversation}
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
	);
}
