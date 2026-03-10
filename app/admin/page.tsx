"use client";

import { motion } from "framer-motion";
import { Shield, Users, Activity, Lock, Database, Terminal } from "lucide-react";
import { AmbientGlow } from "@/components/ui/ambient-glow";

const glassCard = "rounded-2xl border border-border bg-card p-6 backdrop-blur-md relative overflow-hidden group";

export default function AdminPage() {
    return (
        <main className="relative min-h-screen bg-background pt-32 pb-24 px-4 md:px-8 overflow-hidden">
            <AmbientGlow color="bg-red-500/10" position="top-left" />
            
            <div className="relative z-10 mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium mb-6">
                        <Lock className="w-3 h-3" />
                        <span>Internal Kernel Access</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Fleet Command</h1>
                    <p className="text-muted-foreground max-w-xl">
                        Global administrative control for the Camelot Kernel and agent swarm clusters.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "System Status", value: "Operational", icon: Activity, color: "text-green-400" },
                        { title: "Active Nodes", value: "128", icon: Database, color: "text-blue-400" },
                        { title: "Governance", value: "Strict", icon: Shield, color: "text-red-400" }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={glassCard}
                        >
                            <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</h3>
                            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 rounded-2xl border border-border bg-card/30 p-8 font-mono text-sm text-green-500">
                    <div className="flex items-center gap-2 mb-4">
                        <Terminal className="w-4 h-4" />
                        <span>Kernel Log Stream</span>
                    </div>
                    <div className="space-y-1 opacity-80">
                        <p>[11:22:45] SYSLOG: Agent LPO initiating hero optimization sequence...</p>
                        <p>[11:22:48] SYSLOG: Lukas_Edge establishing Vercel deployment bridge...</p>
                        <p>[11:23:01] SYSLOG: Anya_Refined intake gate closed for Session_99.</p>
                        <p className="animate-pulse">[11:23:05] SYSLOG: Strategos branch simulation in progress_</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
