"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Target,
    Zap,
    ShieldCheck,
    Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OnboardingData } from "./types";

interface StrategyForgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: OnboardingData;
}

export function StrategyForgeModal({ isOpen, onClose, formData }: StrategyForgeModalProps) {
    // Logic to generate strategy based on goals
    const generateStrategy = (goals: string) => {
        const strategyPoints = [
            {
                title: "Immediate Infrastructure Audit",
                description: "Our Paladin swarm will begin a deep forensic analysis of your current stack.",
                icon: ShieldCheck,
                color: "text-blue-400"
            },
            {
                title: "Growth Vector Mapping",
                description: `Tailoring agentic workflows to specifically address your goal: "${goals.slice(0, 60)}..."`,
                icon: Target,
                color: "text-rose-400"
            },
            {
                title: "Agent Deployment (Phase 1)",
                description: "Provisioning Sir Forge and Squire Clean for local repo optimization.",
                icon: Rocket,
                color: "text-violet-400"
            }
        ];

        if (goals.toLowerCase().includes("growth") || goals.toLowerCase().includes("scale")) {
            strategyPoints[1] = {
                title: "Exponential Scaling Protocol",
                description: "Activating high-temperature Videneptus loops for rapid market expansion.",
                icon: Zap,
                color: "text-amber-400"
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
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-br from-zinc-900 to-black border-b border-zinc-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-rose-500/10 p-2 rounded-lg">
                                    <Sparkles className="h-5 w-5 text-rose-500" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    Strategy Forge: Initiated
                                </h2>
                            </div>
                            <p className="text-zinc-400 text-sm">
                                The Nexus has synthesized a custom roadmap for <span className="text-white font-medium">{formData.company || "your organization"}</span>.
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {points.map((point, index) => (
                                <motion.div
                                    key={point.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                    className="flex gap-4 group"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <point.icon className={`h-5 w-5 ${point.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                                            {point.title}
                                        </h3>
                                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                            {point.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-zinc-900/50 flex flex-col gap-3">
                            <Button
                                onClick={onClose}
                                className="w-full bg-white text-black hover:bg-zinc-200 font-bold py-6 rounded-xl transition-all active:scale-[0.98]"
                            >
                                Access Nexus Dashboard
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <p className="text-[10px] text-center text-zinc-600 uppercase tracking-widest font-medium">
                                Sovereign Authorization Required • L5 Agentic Clear
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
