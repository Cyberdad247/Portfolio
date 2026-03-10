"use client";

import { motion } from "framer-motion";
import { Globe, Search, Zap } from "lucide-react";
import { AmbientGlow } from "@/components/ui/ambient-glow";

const glassCard =
	"rounded-2xl border border-border bg-card p-6 backdrop-blur-md relative overflow-hidden group";

export default function SEOGEOPage() {
	return (
		<main className="relative min-h-screen bg-background pt-32 pb-24 px-4 md:px-8 overflow-hidden">
			<AmbientGlow color="bg-primary/10" position="top-left" />
			<AmbientGlow color="bg-secondary/5" position="bottom-right" />

			<div className="relative z-10 mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-16 text-center"
				>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
						<Search className="w-3 h-3" />
						<span>SEO + GEO Optimization</span>
					</div>
					<h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
						Visibility <span className="text-primary">Evolved</span>
					</h1>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Traditional search is dead. We combine classic SEO with Generative
						Engine Optimization (GEO) to ensure your brand is the definitive
						answer for both humans and AI.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className={glassCard}
					>
						<h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
							<Search className="text-primary w-6 h-6" />
							Precision SEO
						</h3>
						<ul className="space-y-4">
							{[
								"Neural-semantic keyword mapping",
								"Contextual backlink orchestration",
								"Core Web Vitals kinetic tuning",
								"Entity-based schema architecture",
							].map((item) => (
								<li
									key={item}
									className="flex items-center gap-3 text-muted-foreground"
								>
									{" "}
									<Zap className="w-3 h-3 text-primary" />
									{item}
								</li>
							))}
						</ul>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className={glassCard}
					>
						<h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
							<Globe className="text-secondary w-6 h-6" />
							Generative GEO
						</h3>
						<ul className="space-y-4">
							{[
								"LLM citation-probability modeling",
								"Generative search result shadowing",
								"AI-answer engine data priming",
								"RAG-compliant documentation stores",
							].map((item) => (
								<li
									key={item}
									className="flex items-center gap-3 text-muted-foreground"
								>
									{" "}
									<Zap className="w-3 h-3 text-secondary" />
									{item}
								</li>
							))}
						</ul>
					</motion.div>
				</div>

				{/* Live Stats Simulation */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="rounded-3xl border border-border bg-card/30 p-8 backdrop-blur-xl"
				>
					<div className="flex flex-col md:flex-row justify-between items-center gap-8">
						<div>
							<h4 className="text-xl font-bold text-white mb-2">
								Real-time Visibility Index
							</h4>
							<p className="text-sm text-muted-foreground">
								Monitoring 50,000+ generative nodes and search queries.
							</p>
						</div>
						<div className="flex gap-12">
							<div className="text-center">
								<p className="text-3xl font-bold text-primary">98.2%</p>
								<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
									Search Authority
								</p>
							</div>
							<div className="text-center">
								<p className="text-3xl font-bold text-secondary">84.5%</p>
								<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
									AI Citation Rate
								</p>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</main>
	);
}
