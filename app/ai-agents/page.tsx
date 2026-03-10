"use client";

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import { useEffect, useState } from "react";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import {
	type AgentConfig,
	agents as staticAgents,
} from "@/config/agents.config";

const glassCard =
	"rounded-2xl border border-border bg-card p-8 backdrop-blur-md relative overflow-hidden group";

export default function AIAgentsPage() {
	const [agents, setAgents] = useState<AgentConfig[]>(staticAgents);

	useEffect(() => {
		async function fetchAgentStatus() {
			try {
				const response = await fetch("/api/v1/agents");
				if (response.ok) {
					const data = await response.json();
					const liveAgents = data.fleet || [];

					// Merge live status with static visual configuration
					setAgents((prev) =>
						prev.map((agent) => {
							const liveMatch = liveAgents.find(
								(la: { id: string; status?: AgentConfig["status"] }) =>
									la.id === agent.id,
							);
							if (liveMatch?.status) {
								return { ...agent, status: liveMatch.status };
							}
							return agent;
						}),
					);
				}
			} catch (error) {
				console.error("Failed to fetch live agent status:", error);
			}
		}

		fetchAgentStatus();
		// Poll every 10 seconds for live updates
		const interval = setInterval(fetchAgentStatus, 10000);
		return () => clearInterval(interval);
	}, []);

	return (
		<main className="relative min-h-screen bg-background pt-32 pb-24 px-4 md:px-8 overflow-hidden">
			<AmbientGlow color="bg-secondary/10" position="top-left" />
			<AmbientGlow color="bg-primary/5" position="bottom-right" />

			<div className="relative z-10 mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-16"
				>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-medium mb-6">
						<Cpu className="w-3 h-3" />
						<span>The HIVE Fleet</span>
					</div>
					<h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
						Autonomous <span className="text-secondary">Intelligence</span>{" "}
						System
					</h1>
					<p className="max-w-2xl text-lg text-muted-foreground">
						A deep-dive into the specialized neural architectures that power
						your marketing operations. Each agent is built on a custom kinetic
						stack for maximum fidelity.
					</p>
				</motion.div>

				<div className="space-y-12">
					{agents.map((agent, idx) => (
						<motion.div
							key={agent.id}
							initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 0.6 }}
							className={glassCard}
						>
							<div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
								<div className="md:col-span-1 flex justify-center md:justify-start">
									<div className="p-5 rounded-2xl bg-secondary/10 text-secondary ring-1 ring-secondary/20 group-hover:scale-110 transition-transform">
										<agent.icon className="w-8 h-8" />
									</div>
								</div>

								<div className="md:col-span-7">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="text-2xl font-bold text-white">
											{agent.name}
										</h3>
										<span
											className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
												agent.status === "active"
													? "bg-green-500/20 text-green-400 border border-green-500/30"
													: agent.status === "processing"
														? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
														: "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30"
											}`}
										>
											{agent.status}
										</span>
									</div>
									<p className="text-primary text-sm font-medium mb-4 uppercase tracking-widest">
										{agent.role}
									</p>
									<p className="text-muted-foreground leading-relaxed">
										{agent.description}
									</p>
								</div>

								<div className="md:col-span-4 bg-background/50 rounded-xl p-6 border border-border/50">
									<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
										Metric Profile
									</p>
									<div className="space-y-4">
										<div>
											<p className="text-2xl font-bold text-secondary">
												{agent.metricValue}
											</p>
											<p className="text-xs text-muted-foreground">
												{agent.metricLabel}
											</p>
										</div>
										<div className="h-1 w-full bg-secondary/10 rounded-full overflow-hidden">
											<motion.div
												initial={{ width: 0 }}
												whileInView={{ width: "70%" }}
												transition={{ duration: 1, delay: 0.5 }}
												className="h-full bg-secondary"
											/>
										</div>
										<button
											type="button"
											className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest"
										>
											{" "}
											View Intelligence Log →
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</main>
	);
}
