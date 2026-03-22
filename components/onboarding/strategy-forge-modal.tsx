"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	Rocket,
	ShieldCheck,
	Sparkles,
	Target,
	Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OnboardingData } from "./types";

interface StrategyForgeModalProps {
	isOpen: boolean;
	onClose: () => void;
	formData: OnboardingData;
}

export function StrategyForgeModal({
	isOpen,
	onClose,
	formData,
}: StrategyForgeModalProps) {
	const generateStrategy = (goals: string) => {
		const strategyPoints = [
			{
				title: "Immediate Infrastructure Audit",
				description:
					"Our Paladin swarm will begin a deep forensic analysis of your current stack.",
				icon: ShieldCheck,
				color: "text-blue-400",
				bgColor: "from-blue-500/20 to-blue-600/10",
			},
			{
				title: "Growth Vector Mapping",
				description: `Tailoring agentic workflows to specifically address your goal: "${goals.slice(0, 60)}..."`,
				icon: Target,
				color: "text-rose-400",
				bgColor: "from-rose-500/20 to-rose-600/10",
			},
			{
				title: "Agent Deployment (Phase 1)",
				description:
					"Provisioning Sir Forge and Squire Clean for local repo optimization.",
				icon: Rocket,
				color: "text-violet-400",
				bgColor: "from-violet-500/20 to-violet-600/10",
			},
		];

		if (
			goals.toLowerCase().includes("growth") ||
			goals.toLowerCase().includes("scale")
		) {
			strategyPoints[1] = {
				title: "Exponential Scaling Protocol",
				description:
					"Activating high-temperature Videneptus loops for rapid market expansion.",
				icon: Zap,
				color: "text-amber-400",
				bgColor: "from-amber-500/20 to-amber-600/10",
			};
		}

		return strategyPoints;
	};

	const points = generateStrategy(formData.goals);

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-black/80 backdrop-blur-md"
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ type: "spring", duration: 0.5 }}
						className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-2xl backdrop-blur-2xl"
					>
						{/* Top gradient line */}
						<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

						{/* Header */}
						<div className="relative border-b border-white/[0.06] p-6">
							<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
							<div className="relative flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-violet-600/20 ring-1 ring-white/[0.08]">
									<Sparkles className="h-5 w-5 text-rose-400" />
								</div>
								<div>
									<h2 className="text-lg font-bold tracking-tight text-white">
										{"Strategy Forge // Initiated"}
									</h2>
									<p className="mt-0.5 text-[12px] text-zinc-500">
										{"Right then! Tasha has synthesized a custom roadmap for "}
										<span className="font-medium text-zinc-300">
											{formData.company || "your organization"}
										</span>
									</p>
								</div>
							</div>
						</div>

						{/* Strategy Points */}
						<div className="space-y-4 p-6">
							{points.map((point, index) => (
								<motion.div
									key={point.title}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.12 + 0.2 }}
									className="group flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
								>
									<div className="shrink-0">
										<div
											className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${point.bgColor} ring-1 ring-white/[0.08]`}
										>
											<point.icon className={`h-4 w-4 ${point.color}`} />
										</div>
									</div>
									<div>
										<h3 className="text-[13px] font-semibold text-zinc-200 transition-colors group-hover:text-white">
											{point.title}
										</h3>
										<p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
											{point.description}
										</p>
									</div>
								</motion.div>
							))}
						</div>

						{/* Footer */}
						<div className="border-t border-white/[0.06] p-6">
							<Button
								onClick={onClose}
								className="w-full gap-2 bg-gradient-to-r from-rose-500 to-violet-600 py-6 font-bold text-white shadow-lg shadow-rose-500/20 transition-all hover:from-rose-600 hover:to-violet-700 hover:shadow-rose-500/30 active:scale-[0.98]"
							>
								<span className="font-mono text-[11px] uppercase tracking-wider">
									Access Nexus Dashboard
								</span>
								<ArrowRight className="h-4 w-4" />
							</Button>
							<p className="mt-3 text-center font-mono text-[9px] uppercase tracking-widest text-zinc-600">
								{"Sovereign Authorization Required // L5 Agentic Clear"}
							</p>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
