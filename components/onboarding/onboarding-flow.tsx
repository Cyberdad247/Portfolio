"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { type JSX, useCallback, useEffect, useRef, useState } from "react";
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

import { NeuralCard } from "@/components/ui/neural-interface";
import { tokens, cn } from "@/lib/utils";

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
		<div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden">
			<div className="relative z-10 w-full max-w-7xl px-4 py-24">
				<motion.div
					initial="hidden"
					animate="visible"
					variants={tokens.animation.stagger(0.15)}
					className="flex flex-col gap-16"
				>
					{/* HEADER AREA */}
					<div className="text-center space-y-6">
						<motion.div 
							variants={{
								hidden: { opacity: 0, scale: 0.8 },
								visible: { opacity: 1, scale: 1, transition: tokens.animation.spring }
							}}
							className="flex justify-center"
						>
							<div className="rounded-full border border-white/10 bg-white/5 px-6 py-2 backdrop-blur-md">
								<span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-primary">
									Handshake Protocol // v700.sync
								</span>
							</div>
						</motion.div>
						<motion.h1 
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0, transition: tokens.animation.spring }
							}}
							className="text-5xl font-extrabold tracking-tighter text-white md:text-8xl uppercase leading-none"
						>
							Neural <span className="text-primary italic">Sync</span>
						</motion.h1>
						<div className="mx-auto max-w-xl">
							<div className="flex justify-between items-end mb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
								<span>Progress // Phase {currentPhase}</span>
								<span className="text-primary font-bold">{Math.round(progress)}%</span>
							</div>
							<div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
								<motion.div 
									className="h-full bg-primary shadow-[0_0_15px_rgba(168,85,247,0.5)]"
									initial={{ width: 0 }}
									animate={{ width: `${progress}%` }}
									transition={{ duration: 1, ease: "circOut" }}
								/>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
						{/* LEFT: AVATAR & METRICS */}
						<div className="hidden lg:flex lg:col-span-4 flex-col gap-8">
							<NeuralCard variant="premium" className="p-10 aspect-square flex items-center justify-center">
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
											? "Sync unavailable."
											: null)
									}
									onToggleRecording={handleToggleRecording}
									onReplayMessage={handleReplayMessage}
									onStopSpeaking={stopSpeaking}
								/>
							</NeuralCard>
							
							<NeuralCard className="p-8">
								<h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6">Neural Pathways</h3>
								<div className="space-y-4">
									{[1, 2, 3].map((p) => (
										<div key={p} className="flex items-center gap-4">
											<div className={cn(
												"h-2 w-2 rounded-full transition-all duration-700",
												p <= currentPhase ? "bg-primary shadow-[0_0_10px_rgba(168,85,247,0.8)] scale-125" : "bg-white/10"
											)} />
											<span className={cn(
												"text-xs font-mono uppercase tracking-widest",
												p === currentPhase ? "text-white font-bold" : "text-zinc-600"
											)}>
												{PHASE_CONFIG[p as PhaseType].title}
											</span>
										</div>
									))}
								</div>
							</NeuralCard>
						</div>

						{/* RIGHT: FORM ENGINE */}
						<div className="lg:col-span-8">
							<NeuralCard variant="premium" className="p-8 md:p-16 min-h-[600px] flex flex-col">
								<AnimatePresence mode="wait">
									<motion.div
										key={currentPhase}
										initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
										animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
										exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
										transition={tokens.animation.spring}
										className="flex-1"
									>
										<PhaseForm
											currentPhase={currentPhase}
											phase={phase}
											formData={formData}
											onInputChange={handleInputChange}
											onNextPhase={handleNextPhase}
											onPreviousPhase={handlePreviousPhase}
										/>
									</motion.div>
								</AnimatePresence>
							</NeuralCard>

							<StrategyForgeModal
								isOpen={isStrategyModalOpen}
								onClose={handleFinalRedirect}
								formData={formData}
							/>
						</div>
					</div>
				</motion.div>
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
						? "Sync unavailable."
						: null)
				}
				onToggleRecording={handleToggleRecording}
				onReplayMessage={handleReplayMessage}
				onStopSpeaking={stopSpeaking}
			/>
		</div>
	);
}
