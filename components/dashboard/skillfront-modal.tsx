"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Zap, Target, BookOpen } from "lucide-react";
import type { SkillContent } from "@/config/skills.data";

interface SkillfrontModalProps {
    skill: SkillContent | null;
    onClose: () => void;
}

export function SkillfrontModal({ skill, onClose }: SkillfrontModalProps) {
    if (!skill) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl md:p-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Ambient Glow */}
                    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />

                    <div className="relative z-10">
                        <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">{skill.title}</h2>
                                    <p className="font-mono text-xs uppercase tracking-widest text-primary/80">
                                        {skill.role}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 transition-colors hover:bg-muted"
                                aria-label="Close modal"
                            >
                                <X className="h-6 w-6 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="mb-8 rounded-xl border border-border/50 bg-muted/30 p-4">
                            <p className="text-sm leading-relaxed text-muted-foreground italic">
                                {skill.description}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                                <Target className="h-4 w-4 text-primary" />
                                Operational Phases
                            </h3>

                            <div className="grid gap-4 md:grid-cols-2">
                                {skill.phases.map((phase, idx) => (
                                    <div
                                        key={phase.title}
                                        className="group rounded-lg border border-border/50 bg-muted/20 p-4 transition-colors hover:border-primary/30"
                                    >
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                {idx + 1}
                                            </span>
                                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary">
                                                {phase.title}
                                            </h4>
                                        </div>
                                        <ul className="space-y-2">
                                            {phase.steps.map((step, sIdx) => (
                                                <li key={sIdx} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                                                    <Zap className="mt-1 h-3 w-3 shrink-0 text-primary/50" />
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-border pt-6 font-mono text-[10px] text-muted-foreground uppercase">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-3 w-3" />
                                <span>Source: Camelot-OS Vault // 03_VAULT</span>
                            </div>
                            <div className="text-primary/60">
                                Authorized: Merlin_Ω
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
