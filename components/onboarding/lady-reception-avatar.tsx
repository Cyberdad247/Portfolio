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
		<Card className="sticky top-24 bg-zinc-950 border border-zinc-900 shadow-2xl">
			<CardHeader className="text-center pb-4">
				<div className="mx-auto mb-4 w-32 h-32 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg">
					<div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 flex items-center justify-center">
						<div className="text-center">
							<div className="w-12 h-12 mx-auto bg-white/90 rounded-full mb-1 flex items-center justify-center">
								<User className="h-6 w-6 text-rose-600" />
							</div>
						</div>
					</div>
				</div>
				<CardTitle className="text-2xl text-white">Lady Reception</CardTitle>
				<CardDescription className="text-zinc-400">
					Your Virtual Onboarding Guide
				</CardDescription>
				<Badge className="mt-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit mx-auto">
					Phase {currentPhase}/3
				</Badge>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Avatar Message */}
				<div className="bg-gradient-to-br from-zinc-900 to-zinc-800/80 rounded-lg p-4 border border-zinc-800">
					<p className="text-sm text-zinc-300 leading-relaxed">
						{getAvatarMessage()}
					</p>
				</div>

				{/* Phase Info */}
				<div className="space-y-3">
					<div
						className={`flex items-center gap-3 ${phase.color} p-3 rounded-lg text-white shadow-inner opacity-90`}
					>
						<PhaseIcon className="h-5 w-5" />
						<div>
							<p className="font-medium text-sm">{phase.title}</p>
							<p className="text-xs opacity-90">{phase.description}</p>
						</div>
					</div>
				</div>

				{/* Voice Input Button */}
				<Button
					variant="outline"
					className={`w-full border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all`}
					onClick={onToggleRecording}
				>
					<Mic
						className={`mr-2 h-4 w-4 ${isRecording ? "text-rose-500 animate-pulse" : ""}`}
					/>
					{isRecording ? "Listening..." : "Hold to Speak"}
				</Button>
			</CardContent>
		</Card>
	);
}
