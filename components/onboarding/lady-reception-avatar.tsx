"use client";

import { Mic, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { PhaseData, PhaseType } from "./types";

interface LadyReceptionAvatarProps {
	currentPhase: PhaseType;
	phase: PhaseData;
	isRecording: boolean;
	onToggleRecording: () => void;
}

export function LadyReceptionAvatar({
	currentPhase,
	phase,
	isRecording,
	onToggleRecording,
}: LadyReceptionAvatarProps) {
	const PhaseIcon = phase.icon;

	const getAvatarMessage = () => {
		switch (currentPhase) {
			case 1:
				return `Welcome! I'm Lady Reception, and I'll be guiding you through our onboarding process. Let's start with some basic information about you and your business.`;
			case 2:
				return `Excellent! Now I need to understand your marketing goals and who you're trying to reach. This will help our team create the perfect strategy for you.`;
			case 3:
				return `Almost there! Let's finalize our strategy alignment and discuss the timeline. Your answers will help us tailor our approach perfectly.`;
			default:
				return "Hello! Ready to start your onboarding journey?";
		}
	};

	return (
		<Card className="sticky top-24 bg-card/30 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden group">
			{/* Animated Gradient Border (Ethereal Effect) */}
			<div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

			<CardHeader className="text-center pb-4 relative z-10">
				<div className="mx-auto mb-6 w-32 h-32 rounded-full relative">
					{/* Outer Pulse */}
					<div className="absolute inset-0 rounded-full bg-rose-500/20 animate-pulse blur-xl" />

					<div className="relative w-full h-full rounded-full bg-gradient-to-br from-rose-400 to-rose-600 p-0.5 shadow-lg">
						<div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
							<div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500/10 to-violet-600/10 flex items-center justify-center">
								<User className="h-10 w-10 text-rose-500" />
							</div>
						</div>
					</div>

					{/* Status Node */}
					<div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-zinc-950 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
				</div>

				<CardTitle className="text-2xl font-bold tracking-tight text-white">
					{"Lady Reception // Anya"}
				</CardTitle>
				<CardDescription className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] mt-1">
					{"Neural Interface v2.0"}
				</CardDescription>
				<Badge
					variant="outline"
					className="mt-4 bg-rose-500/5 text-rose-400 border-rose-500/20 font-mono text-[10px] py-0"
				>
					{"PHASE_" + currentPhase + "_READY"}
				</Badge>
			</CardHeader>

			<CardContent className="space-y-6 relative z-10">
				{/* Avatar Message - Anya's Voice (L7) */}
				<div className="bg-zinc-900/40 rounded-xl p-5 border border-white/5 relative group/msg">
					<div className="absolute -left-1 top-4 w-2 h-2 bg-zinc-900 border-l border-t border-white/5 rotate-[-45deg]" />
					<p className="text-sm text-zinc-300 leading-relaxed font-medium">
						{getAvatarMessage()}
					</p>
				</div>

				{/* Phase Info (L5) */}
				<div className="space-y-3">
					<div
						className={`flex items-center gap-4 ${phase.color}/10 border border-${phase.color}/20 p-4 rounded-xl text-white transition-all duration-500 hover:bg-${phase.color}/20`}
					>
						<div className={`p-2 rounded-lg ${phase.color}/20`}>
							<PhaseIcon className="h-5 w-5 text-white" />
						</div>
						<div>
							<p className="font-bold text-xs uppercase tracking-widest text-zinc-200">
								{phase.title}
							</p>
							<p className="text-xs text-zinc-400 mt-0.5">
								{phase.description}
							</p>
						</div>
					</div>
				</div>

				{/* Voice Input Button (L2 Kinetic) */}
				<Button
					variant="ghost"
					className={`w-full h-12 rounded-xl border border-border/50 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white transition-all duration-300 relative overflow-hidden group/btn`}
					onClick={onToggleRecording}
				>
					{isRecording && (
						<div className="absolute inset-0 bg-rose-500/10 animate-pulse" />
					)}
					<Mic
						className={`mr-3 h-4 w-4 transition-colors ${isRecording ? "text-rose-500" : "group-hover/btn:text-rose-400"}`}
					/>
					<span className="font-mono text-[10px] uppercase tracking-[0.2em]">
						{isRecording ? "Listening to Signal..." : "Initiate Voice Comms"}
					</span>
				</Button>
			</CardContent>
		</Card>
	);
}
