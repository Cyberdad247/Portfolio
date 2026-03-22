"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	Activity,
	ChevronDown,
	Mic,
	MicOff,
	Volume2,
	VolumeX,
} from "lucide-react";
import { type JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PhaseData, PhaseType } from "./types";

type ConversationEntry = {
	role: "user" | "tasha";
	content: string;
	timestamp: number;
};

interface MobileVoiceWidgetProps {
	currentPhase: PhaseType;
	phase: PhaseData;
	isRecording: boolean;
	isThinking?: boolean;
	isSpeaking?: boolean;
	isVoiceInputSupported?: boolean;
	isVoiceOutputSupported?: boolean;
	interimTranscript?: string;
	lastTranscript?: string;
	voiceError?: string | null;
	conversation?: ConversationEntry[];
	onToggleRecording: () => void;
	onReplayMessage?: () => void;
	onStopSpeaking?: () => void;
}

function StatusDot({
	isThinking,
	isSpeaking,
	isRecording,
}: {
	isThinking: boolean;
	isSpeaking: boolean;
	isRecording: boolean;
}) {
	const color = isThinking
		? "bg-amber-400"
		: isSpeaking
			? "bg-violet-400"
			: isRecording
				? "bg-rose-400"
				: "bg-emerald-400";

	const shouldPulse = isThinking || isSpeaking || isRecording;

	return (
		<span className="relative flex h-3 w-3 shrink-0">
			{shouldPulse && (
				<span
					className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${color}`}
				/>
			)}
			<span className={`relative inline-flex h-3 w-3 rounded-full ${color}`} />
		</span>
	);
}

function MiniWaveform({ isSpeaking }: { isSpeaking: boolean }) {
	return (
		<div className="flex items-center justify-center gap-[2px]">
			{Array.from({ length: 16 }, (_, i) => `mobile-wave-${i}`).map((id, i) => (
				<div
					key={id}
					className={`w-[2px] rounded-full ${isSpeaking ? "bg-violet-400/60" : "bg-rose-400/60"}`}
					style={{
						height: `${Math.random() * 16 + 3}px`,
						animation: `pulse ${0.3 + Math.random() * 0.4}s ease-in-out infinite alternate`,
						animationDelay: `${i * 0.03}s`,
					}}
				/>
			))}
		</div>
	);
}

export function MobileVoiceWidget({
	isRecording,
	isThinking = false,
	isSpeaking = false,
	isVoiceInputSupported = false,
	isVoiceOutputSupported = false,
	interimTranscript = "",
	lastTranscript = "",
	voiceError = null,
	conversation = [],
	onToggleRecording,
	onReplayMessage,
	onStopSpeaking,
}: MobileVoiceWidgetProps): JSX.Element {
	const [isExpanded, setIsExpanded] = useState(false);

	const statusText = isThinking
		? "Processing"
		: isSpeaking
			? "Speaking"
			: isRecording
				? "Listening"
				: "Ready";

	const statusColor = isThinking
		? "text-amber-400"
		: isSpeaking
			? "text-violet-400"
			: isRecording
				? "text-rose-400"
				: "text-emerald-400";

	const lastTashaMessage = [...conversation]
		.reverse()
		.find((e) => e.role === "tasha");

	return (
		<div className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
			<AnimatePresence mode="wait">
				{isExpanded ? (
					<motion.div
						key="expanded"
						initial={{ height: 64, opacity: 0.9 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 64, opacity: 0.9 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/90 shadow-2xl backdrop-blur-2xl"
					>
						{/* Top gradient line */}
						<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

						<div className="p-4">
							{/* Collapse header */}
							<div className="mb-3 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<StatusDot
										isThinking={isThinking}
										isSpeaking={isSpeaking}
										isRecording={isRecording}
									/>
									<span className="text-sm font-semibold text-white">
										Tasha Prime
									</span>
									<span
										className={`font-mono text-[10px] uppercase tracking-widest ${statusColor}`}
									>
										{statusText}
									</span>
								</div>
								<button
									type="button"
									onClick={() => setIsExpanded(false)}
									className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-zinc-400 transition-colors hover:bg-white/[0.12] hover:text-white"
									aria-label="Collapse voice widget"
								>
									<ChevronDown className="h-4 w-4" />
								</button>
							</div>

							{/* Tasha message bubble */}
							{lastTashaMessage && (
								<div className="mb-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
									<p className="text-[13px] leading-relaxed text-zinc-300">
										{lastTashaMessage.content.length > 200
											? `${lastTashaMessage.content.slice(0, 200)}...`
											: lastTashaMessage.content}
									</p>
								</div>
							)}

							{/* Mini waveform */}
							{(isRecording || isSpeaking) && (
								<div className="mb-3">
									<MiniWaveform isSpeaking={isSpeaking} />
								</div>
							)}

							{/* Voice controls */}
							<div className="mb-3 grid grid-cols-2 gap-2">
								<Button
									type="button"
									variant="ghost"
									disabled={!isVoiceInputSupported}
									onClick={onToggleRecording}
									className={`relative h-12 min-h-[44px] rounded-xl border transition-all duration-300 ${
										isRecording
											? "border-rose-500/40 bg-rose-500/10 text-rose-300"
											: "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white"
									}`}
								>
									{isRecording ? (
										<>
											<div className="absolute inset-0 animate-pulse rounded-xl bg-rose-500/5" />
											<MicOff className="mr-2 h-4 w-4" />
											<span className="font-mono text-[10px] uppercase tracking-wider">
												Stop
											</span>
										</>
									) : (
										<>
											<Mic className="mr-2 h-4 w-4" />
											<span className="font-mono text-[10px] uppercase tracking-wider">
												Speak
											</span>
										</>
									)}
								</Button>
								<Button
									type="button"
									variant="ghost"
									disabled={!isVoiceOutputSupported}
									onClick={isSpeaking ? onStopSpeaking : onReplayMessage}
									className={`h-12 min-h-[44px] rounded-xl border transition-all duration-300 ${
										isSpeaking
											? "border-violet-500/40 bg-violet-500/10 text-violet-300"
											: "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white"
									}`}
								>
									{isSpeaking ? (
										<VolumeX className="mr-2 h-4 w-4" />
									) : (
										<Volume2 className="mr-2 h-4 w-4" />
									)}
									<span className="font-mono text-[10px] uppercase tracking-wider">
										{isSpeaking ? "Mute" : "Replay"}
									</span>
								</Button>
							</div>

							{/* Live transcript */}
							<div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
								<div className="mb-1 flex items-center gap-2">
									<div
										className={`h-1.5 w-1.5 rounded-full ${isRecording ? "animate-pulse bg-rose-400" : "bg-zinc-700"}`}
									/>
									<span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
										Live Transcript
									</span>
								</div>
								<p className="min-h-5 text-[12px] leading-relaxed text-zinc-300">
									{interimTranscript ||
										lastTranscript ||
										"Voice transcript will appear here..."}
								</p>
								{voiceError && (
									<p className="mt-1 text-[11px] text-rose-400">{voiceError}</p>
								)}
							</div>
						</div>
					</motion.div>
				) : (
					<motion.div
						key="collapsed"
						initial={{ opacity: 0.9 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0.9 }}
						transition={{ duration: 0.2 }}
						className="relative overflow-hidden rounded-full border border-white/[0.08] bg-zinc-950/90 shadow-2xl backdrop-blur-2xl"
					>
						{/* Top gradient line */}
						<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

						<div className="flex h-14 items-center gap-3 py-2 pr-2 pl-4">
							{/* Status indicator + text (tappable to expand) */}
							<button
								type="button"
								onClick={() => setIsExpanded(true)}
								className="flex min-w-0 flex-1 items-center gap-3"
								aria-label="Expand voice widget"
							>
								<StatusDot
									isThinking={isThinking}
									isSpeaking={isSpeaking}
									isRecording={isRecording}
								/>
								<div className="flex items-center gap-2 overflow-hidden">
									<span className="truncate text-sm font-medium text-white">
										Tasha
									</span>
									<Activity
										className={`h-3 w-3 shrink-0 ${statusColor} ${isRecording || isSpeaking ? "animate-pulse" : ""}`}
									/>
									<span
										className={`shrink-0 font-mono text-[10px] uppercase tracking-widest ${statusColor}`}
									>
										{statusText}
									</span>
								</div>
							</button>

							{/* Mic button */}
							<button
								type="button"
								disabled={!isVoiceInputSupported}
								onClick={onToggleRecording}
								className={`flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-all duration-300 ${
									isRecording
										? "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]"
										: "bg-white/[0.08] text-zinc-400 hover:bg-white/[0.15] hover:text-white"
								}`}
								aria-label={isRecording ? "Stop recording" : "Start recording"}
							>
								{isRecording ? (
									<MicOff className="h-5 w-5" />
								) : (
									<Mic className="h-5 w-5" />
								)}
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
