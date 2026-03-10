"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Settings, Bell, User, Maximize2, Share2 } from "lucide-react";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import AgenticDashboard from "@/components/agentic-dashboard";

const glassHeader =
	"rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md relative overflow-hidden flex items-center justify-between mb-8";

export default function DashboardPage() {
	return (
		<main className="relative min-h-screen bg-background pt-32 pb-24 px-4 md:px-8 overflow-hidden">
			<AmbientGlow color="bg-primary/5" position="center" className="opacity-10" />
			<AmbientGlow color="bg-secondary/5" position="top-right" />

			<div className="relative z-10 mx-auto max-w-7xl">
				{/* Custom Dashboard Header */}
				<motion.div
					initial={{ opacity: 0, y: -12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className={glassHeader}
				>
					<div className="flex items-center gap-4">
						<div className="p-2 rounded-lg bg-primary/10 text-primary">
							<LayoutDashboard className="w-5 h-5" />
						</div>
						<div>
							<h1 className="text-lg font-bold text-white tracking-tight">Mission Control</h1>
							<p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">HIVE OS v2.0</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border text-xs text-muted-foreground cursor-pointer hover:bg-border transition-colors">
							<Share2 className="w-3 h-3" />
							<span>Export Logic</span>
						</div>
						<div className="p-2 rounded-lg hover:bg-border text-muted-foreground transition-colors cursor-pointer">
							<Bell className="w-4 h-4" />
						</div>
						<div className="p-2 rounded-lg hover:bg-border text-muted-foreground transition-colors cursor-pointer">
							<Settings className="w-4 h-4" />
						</div>
						<div className="w-px h-6 bg-border mx-1" />
						<div className="flex items-center gap-2 pl-2 cursor-pointer group">
							<div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/30 overflow-hidden flex items-center justify-center text-secondary text-xs font-bold group-hover:scale-105 transition-transform">
								Ω
							</div>
						</div>
					</div>
				</motion.div>

				{/* Reuse the core dashboard component for consistency */}
				<div className="relative">
					<AgenticDashboard />
				</div>
				
				{/* Secondary Stats/Grid could go here */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
					{[
						{ label: "Network Status", value: "Optimal", color: "text-green-400" },
						{ label: "Sync Latency", value: "1.2ms", color: "text-blue-400" },
						{ label: "Compute Load", value: "22%", color: "text-secondary" },
						{ label: "Sovereign Link", value: "Encrypted", color: "text-primary" }
					].map((stat, i) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 + i * 0.1 }}
							className="rounded-xl border border-border bg-card/30 p-4 backdrop-blur-sm"
						>
							<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
							<p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
						</motion.div>
					))}
				</div>
			</div>
		</main>
	);
}
