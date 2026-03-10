"use client";

import { motion } from "framer-motion";
import { Cpu, ShieldCheck, ShoppingCart, Star, Zap } from "lucide-react";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { agents } from "@/config/agents.config";

const glassCard =
	"rounded-2xl border border-border bg-card p-6 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 group";

export default function AgentMarketplacePage() {
	// Filter for non-core agents or specialized ones
	const marketplaceAgents = agents.filter(
		(a) =>
			a.id.startsWith("M-") ||
			(!a.name.includes("(PLAN)") && !a.name.includes("(CODE)")),
	);

	return (
		<main className="relative min-h-screen bg-background pt-32 pb-24 px-4 md:px-8 overflow-hidden">
			<AmbientGlow color="bg-primary/10" position="top-right" />
			<AmbientGlow color="bg-secondary/5" position="bottom-left" />

			<div className="relative z-10 mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-16 text-center"
				>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
						<ShoppingCart className="w-3 h-3" />
						<span>Agentic Marketplace</span>
					</div>
					<h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
						Expand Your <span className="text-primary">Intelligence</span>
					</h1>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Deploy specialized AI agents to automate high-fidelity marketing
						workflows. Select from our pre-trained fleet or request a custom
						build.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{marketplaceAgents.map((agent, idx) => (
						<motion.div
							key={agent.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: idx * 0.1 }}
							className={glassCard}
						>
							<div className="flex justify-between items-start mb-6">
								<div className="p-3 rounded-xl bg-primary/10 text-primary">
									<agent.icon className="w-6 h-6" />
								</div>
								<div className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-wider">
									<Star className="w-3 h-3 fill-current" />
									<span>Premium</span>
								</div>
							</div>

							<h3 className="text-xl font-bold text-white mb-2">
								{agent.name}
							</h3>
							<p className="text-sm text-primary font-medium mb-4">
								{agent.role}
							</p>
							<p className="text-sm text-muted-foreground mb-6 line-clamp-3">
								{agent.description}
							</p>

							<div className="space-y-3 mb-8">
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Zap className="w-3 h-3 text-secondary" />
									<span>Deployment: Instant</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<ShieldCheck className="w-3 h-3 text-green-500" />
									<span>Security Grade: Sovereign</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Cpu className="w-3 h-3 text-blue-400" />
									<span>Kernel: HIVE v2.0</span>
								</div>
							</div>

							<button
								type="button"
								className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm transition-all hover:brightness-110 active:scale-[0.98]"
							>
								Acquire License
							</button>
						</motion.div>
					))}
				</div>
			</div>
		</main>
	);
}
