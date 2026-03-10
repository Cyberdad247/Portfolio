"use client";

import { motion } from "framer-motion";
import { Search, Globe, FileCheck, Zap, AlertCircle, BarChart } from "lucide-react";
import { AmbientGlow } from "@/components/ui/ambient-glow";

const glassCard = "rounded-2xl border border-border bg-card p-8 backdrop-blur-md relative overflow-hidden transition-all hover:border-primary/30";

export default function AuditPage() {
    return (
        <main className="relative min-h-screen bg-background pt-32 pb-24 px-4 md:px-8 overflow-hidden">
            <AmbientGlow color="bg-blue-500/10" position="top-right" />
            
            <div className="relative z-10 mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                        <Globe className="w-3 h-3" />
                        <span>Intelligence Scout [Lady Apis]</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">SEO/GEO Audit Hub</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Benchmark your digital visibility across traditional search engines and generative AI citation engines.
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto mb-16">
                    <div className="flex flex-col md:flex-row gap-4 p-2 rounded-2xl border border-border bg-card/50 backdrop-blur-xl">
                        <input 
                            type="text" 
                            placeholder="Enter target URL (e.g., https://yourbrand.com)"
                            className="flex-1 bg-transparent border-none px-6 py-4 text-white focus:outline-none focus:ring-0"
                        />
                        <button className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2">
                            <Search className="w-4 h-4" />
                            Run Deep Audit
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={glassCard}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Traditional SEO</h3>
                        </div>
                        <p className="text-muted-foreground mb-6">Deep scan of metadata, LCP, CLS, and contextual backlink weight.</p>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Mobile Optimization</span>
                                <span className="text-green-400 font-mono">98%</span>
                            </div>
                            <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                                <div className="h-full bg-green-400 w-[98%]" />
                            </div>
                        </div>
                    </div>

                    <div className={glassCard}>
                        <div className="flex items-center gap-4 mb-6 text-secondary">
                            <div className="p-3 rounded-xl bg-secondary/10">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Generative GEO</h3>
                        </div>
                        <p className="text-muted-foreground mb-6">Probability modeling for AI answer citations (GPT-4, Claude, Gemini).</p>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Citation Probability</span>
                                <span className="text-secondary font-mono">82%</span>
                            </div>
                            <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                                <div className="h-full bg-secondary w-[82%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
