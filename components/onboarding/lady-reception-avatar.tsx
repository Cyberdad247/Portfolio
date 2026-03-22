"use client";

import {
	Activity,
	Headphones,
	Mic,
	MicOff,
	Volume2,
	VolumeX,
	Waves,
	Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PhaseData, PhaseType } from "./types";

type ConversationEntry = {
	role: "user" | "tasha";
	content: string;
	timestamp: number;
};

interface TashaAvatarProps {
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
	toolsTriggered?: string[];
	onToggleRecording: () => void;
	onReplayMessage?: () => void;
	onStopSpeaking?: () => void;
}

export function LadyReceptionAvatar({
	currentPhase,
	phase,
	isRecording,
	isThinking = false,
	isSpeaking = false,
	isVoiceInputSupported = false,
	isVoiceOutputSupported = false,
	interimTranscript = "",
	lastTranscript = "",
	voiceError = null,
	conversation = [],
	toolsTriggered = [],
	onToggleRecording,
	onReplayMessage,
	onStopSpeaking,
}: TashaAvatarProps) {
	const PhaseIcon = phase.icon;

	const getAvatarMessage = () => {
		switch (currentPhase) {
			case 1:
				return "Right then! I'm Tasha, your onboarding specialist. Let's get the basics sorted — name, email, that whole main character intro.";
			case 2:
				return "Lovely! Now let's talk goals and who you're trying to reach. Bet you've got some big ideas.";
			case 3:
				return "Ope, we're in the final stretch! Let's lock in the timeline. Cheers for sticking with me!";
			default:
				return "Right then, hello! Ready to start your onboarding journey?";
		}
	};

	const displayMessage = isThinking
		? "Hold tight — running that through my neural circuits..."
		: getAvatarMessage();

	const lastTashaMessage = [...conversation]
		.reverse()
		.find((e) => e.role === "tasha");

	const recentConversation = conversation.slice(-4);

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

	return (
		<div className="sticky top-24 space-y-4">
			{/* Main Avatar Card — Glassmorphism */}
			<div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-2xl backdrop-blur-2xl">
				{/* Top gradient line */}
				<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />
				{/* Inner glow */}
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

				<div className="relative z-10 p-6">
					{/* Avatar + Status */}
					<div className="flex items-center gap-4">
						{/* Avatar Ring */}
						<div className="relative h-16 w-16 shrink-0">
							<div
								className={`absolute inset-0 rounded-full blur-lg transition-all duration-700 ${
									isThinking
										? "bg-amber-500/25 animate-spin"
										: isSpeaking
											? "bg-violet-500/25 animate-pulse"
											: isRecording
												? "bg-rose-500/25 animate-pulse"
												: "bg-rose-500/15"
								}`}
							/>
							<div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-violet-600 p-[2px]">
								<div className="flex h-full w-full items-center justify-center rounded-full bg-background">
									<Headphones
										className={`h-6 w-6 transition-colors duration-300 ${
											isThinking
												? "text-amber-400"
												: isSpeaking
													? "text-violet-400"
													: "text-rose-400"
										}`}
									/>
								</div>
							</div>
							{/* Status dot */}
							<div
								className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background ${
									isThinking
										? "animate-bounce bg-amber-400"
										: isRecording
											? "animate-pulse bg-rose-400"
											: "bg-emerald-400"
								}`}
							/>
						</div>

						{/* Name + Status */}
						<div className="min-w-0 flex-1">
							<h3 className="text-base font-bold tracking-tight text-white">
								Tasha Prime
							</h3>
							<div className="mt-0.5 flex items-center gap-2">
								<Activity
									className={`h-3 w-3 ${statusColor} ${isRecording || isSpeaking ? "animate-pulse" : ""}`}
								/>
								<span
									className={`font-mono text-[10px] uppercase tracking-widest ${statusColor}`}
								>
									{statusText}
								</span>
							</div>
						</div>

						{/* Phase Badge */}
						<Badge
							variant="outline"
							className="shrink-0 border-white/10 bg-white/[0.04] font-mono text-[9px] text-zinc-400"
						>
							P{currentPhase}
						</Badge>
					</div>

					{/* Audio Waveform Visualizer */}
					{(isRecording || isSpeaking) && (
						<div className="mt-4 flex items-center justify-center gap-[3px]">
							{Array.from({ length: 24 }, (_, i) => `waveform-${i}`).map(
								(id, i) => (
									<div
										key={id}
										className={`w-[2px] rounded-full ${isSpeaking ? "bg-violet-400/60" : "bg-rose-400/60"}`}
										style={{
											height: `${Math.random() * 20 + 4}px`,
											animation: `pulse ${0.3 + Math.random() * 0.4}s ease-in-out infinite alternate`,
											animationDelay: `${i * 0.03}s`,
										}}
									/>
								),
							)}
						</div>
					)}

					{/* Tasha's Message Bubble */}
					<div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
						<p className="text-[13px] leading-relaxed text-zinc-300">
							{lastTashaMessage?.content || displayMessage}
						</p>
					</div>

					{/* Phase Info — Compact */}
					<div className="mt-3 flex items-center gap-3 rounded-lg bg-white/[0.02] px-3 py-2">
						<PhaseIcon className="h-3.5 w-3.5 text-rose-400" />
						<span className="text-[11px] font-medium text-zinc-400">
							{phase.title}
						</span>
					</div>
				</div>
			</div>

			{/* Voice Controls Card */}
			<div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-2xl">
				<div className="grid grid-cols-2 gap-2">
					<Button
						type="button"
						variant="ghost"
						disabled={!isVoiceInputSupported}
						onClick={onToggleRecording}
						className={`relative h-12 rounded-xl border transition-all duration-300 ${
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
						className={`h-12 rounded-xl border transition-all duration-300 ${
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

				{/* STT/TTS Status */}
				<div className="mt-3 flex items-center justify-center gap-4 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
					<span className="flex items-center gap-1">
						<Waves className="h-2.5 w-2.5" />
						{isVoiceInputSupported ? "STT" : "No STT"}
					</span>
					<span className="h-2 w-px bg-white/[0.08]" />
					<span className="flex items-center gap-1">
						<Waves className="h-2.5 w-2.5" />
						{isVoiceOutputSupported ? "TTS" : "No TTS"}
					</span>
				</div>
			</div>

			{/* Live Transcript + Conversation */}
			<div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl">
				{/* Transcript */}
				<div className="border-b border-white/[0.06] p-4">
					<div className="mb-2 flex items-center gap-2">
						<div
							className={`h-1.5 w-1.5 rounded-full ${isRecording ? "animate-pulse bg-rose-400" : "bg-zinc-700"}`}
						/>
						<span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
							Live Transcript
						</span>
					</div>
					<p className="min-h-6 text-[13px] leading-relaxed text-zinc-300">
						{interimTranscript ||
							lastTranscript ||
							"Voice transcript will appear here..."}
					</p>
					{voiceError && (
						<p className="mt-1.5 text-[11px] text-rose-400">{voiceError}</p>
					)}
				</div>

				{/* Mini Conversation Feed */}
				{recentConversation.length > 0 && (
					<div className="max-h-48 space-y-2 overflow-y-auto p-4">
						<span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
							Recent
						</span>
						{recentConversation.map((entry) => (
							<div
								key={`${entry.role}-${entry.timestamp}`}
								className={`rounded-lg px-3 py-2 text-[12px] leading-relaxed ${
									entry.role === "user"
										? "ml-4 bg-blue-500/10 text-blue-200"
										: "mr-4 border border-white/[0.05] bg-white/[0.02] text-zinc-300"
								}`}
							>
								<span className="mb-0.5 block font-mono text-[8px] uppercase tracking-widest text-zinc-600">
									{entry.role === "user" ? "You" : "Tasha"}
								</span>
								{entry.content.length > 120
									? `${entry.content.slice(0, 120)}...`
									: entry.content}
							</div>
						))}
					</div>
				)}

				{/* Tools Triggered */}
				{toolsTriggered.length > 0 && (
					<div className="border-t border-white/[0.06] px-4 py-3">
						<div className="flex items-center gap-2">
							<Zap className="h-3 w-3 text-emerald-400" />
							<span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
								Tools
							</span>
							{[...new Set(toolsTriggered)].map((tool) => (
								<Badge
									key={tool}
									variant="outline"
									className="border-emerald-500/20 bg-emerald-500/5 py-0 text-[8px] text-emerald-400"
								>
									{tool}
								</Badge>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
