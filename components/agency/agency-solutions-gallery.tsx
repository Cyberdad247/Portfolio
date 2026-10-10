"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Cpu, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";
import { defaultAgencyConfig, type AgencySolutionSlot } from "@/config/agency-storefront.config";

interface SolutionsGalleryProps {
	solutions?: AgencySolutionSlot[];
}

export default function AgencySolutionsGallery({ solutions }: SolutionsGalleryProps) {
	const items = solutions || defaultAgencyConfig.solutions;

	return (
		<section id="solutions-gallery" className="relative w-full py-24 px-4 md:px-8 bg-[#090712] text-white overflow-hidden">
			{/* Ambient Neural Backlights */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute top-1/4 -right-40 h-96 w-96 rounded-full bg-[#792cff]/15 blur-[140px]" />
				<div className="absolute bottom-1/4 -left-40 h-96 w-96 rounded-full bg-[#c9a23f]/15 blur-[140px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl">
				{/* Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-3.5 py-1 text-xs font-bold text-purple-300 uppercase tracking-widest mb-4">
						<Sparkles className="h-3 w-3" />
						<span>COMPILED SOLUTIONS · ZERO RETAINER BLOAT</span>
					</div>
					<h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
						Handcrafted Architecture.{" "}
						<span className="bg-linear-to-r from-[#792cff] to-[#c9a23f] bg-clip-text text-transparent">
							Deployed at Machine Speed.
						</span>
					</h2>
					<p className="mt-3 text-sm sm:text-base text-slate-300">
						Explore our core enterprise solutions. Each system is custom-compiled for your brand, rigorously tested through formal logic gates, and delivered with permanent ROI attribution.
					</p>
				</div>

				{/* Solutions Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{items.map((sol, index) => (
						<motion.div
							key={sol.id}
							initial={{ opacity: 0, y: 25 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-linear-to-b from-[#150f24] via-[#100b1d] to-[#0a0714] p-6 shadow-xl hover:border-[#c9a23f]/50 hover:shadow-2xl hover:shadow-[#792cff]/20 transition-all duration-300"
						>
							<div>
								{/* Category & Turnaround */}
								<div className="flex items-center justify-between mb-4">
									<span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#c9a23f]">
										{sol.category}
									</span>
									<span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
										<Clock className="h-3 w-3 text-emerald-400" />
										<span>{sol.turnaround}</span>
									</span>
								</div>

								{/* Title & Tagline */}
								<h3 className="text-lg font-bold text-white group-hover:text-[#c9a23f] transition-colors leading-snug mb-1">
									{sol.title}
								</h3>
								<p className="text-xs text-slate-400 mb-4">{sol.tagline}</p>

								{/* Metric Callout */}
								<div className="rounded-2xl border border-white/10 bg-black/40 p-3 mb-5 flex items-center justify-between">
									<span className="text-[11px] text-slate-400">{sol.metric.label}</span>
									<span className="text-sm font-extrabold text-emerald-400">{sol.metric.value}</span>
								</div>

								{/* Features Checklist */}
								<div className="space-y-2 mb-6">
									{sol.features.map((feature, fIdx) => (
										<div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
											<CheckCircle2 className="h-3.5 w-3.5 text-[#c9a23f] shrink-0 mt-0.5" />
											<span>{feature}</span>
										</div>
									))}
								</div>
							</div>

							{/* Action Footer */}
							<div className="pt-4 border-t border-white/10">
								<Link
									href="/contact"
									className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-2.5 px-4 text-xs font-bold text-white group-hover:bg-linear-to-r group-hover:from-[#792cff] group-hover:to-[#c9a23f] group-hover:border-transparent transition-all"
								>
									<span>Initiate Solution</span>
									<ArrowRight className="h-3.5 w-3.5" />
								</Link>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
