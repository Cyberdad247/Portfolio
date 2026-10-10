"use client";

import { motion } from "framer-motion";
import { ArrowRight, Award, CheckCircle, Cpu, Phone, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { defaultAgencyConfig } from "@/config/agency-storefront.config";

interface HeritageSectionProps {
	config?: typeof defaultAgencyConfig.heritage;
	operator?: typeof defaultAgencyConfig.operator;
}

export default function AgencyHeritageSection({ config, operator }: HeritageSectionProps) {
	const hConfig = config || defaultAgencyConfig.heritage;
	const opConfig = operator || defaultAgencyConfig.operator;

	return (
		<section className="relative w-full py-24 px-4 md:px-8 bg-[#07050e] text-white overflow-hidden border-t border-b border-white/10">
			{/* Ambient Neural Backlights */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-[#792cff]/15 blur-[120px]" />
				<div className="absolute bottom-1/3 -right-32 h-80 w-80 rounded-full bg-[#c9a23f]/15 blur-[120px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl">
				{/* Top Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<div className="inline-flex items-center gap-2 rounded-full border border-[#c9a23f]/40 bg-[#c9a23f]/10 px-3.5 py-1 text-xs font-bold text-[#c9a23f] uppercase tracking-widest mb-4">
						<Sparkles className="h-3 w-3" />
						<span>{hConfig.sectionBadge}</span>
					</div>
					<h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
						{hConfig.headline}{" "}
						<span className="bg-linear-to-r from-[#792cff] via-[#d4af37] to-[#c9a23f] bg-clip-text text-transparent">
							{hConfig.subheadline}
						</span>
					</h2>
					<p className="mt-4 text-base italic text-slate-300">
						&ldquo;{hConfig.quote}&rdquo;
					</p>
				</div>

				{/* Two-Column Founder & Philosophy Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
					{/* Left: Founder Profile Card */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="lg:col-span-5 relative"
					>
						<div className="relative overflow-hidden rounded-3xl border border-[#c9a23f]/30 bg-linear-to-b from-[#161026] via-[#100c1c] to-[#090712] p-8 shadow-2xl">
							{/* Corner Gold Accent */}
							<div className="absolute top-0 right-0 h-28 w-28 bg-linear-to-bl from-[#c9a23f]/20 to-transparent pointer-events-none rounded-bl-3xl" />

							{/* Avatar / Visage */}
							<div className="flex items-center gap-4 mb-6">
								<div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-[#c9a23f] shadow-lg shadow-[#792cff]/20">
									<Image
										src="/images/logo.webp"
										alt={opConfig.name}
										fill
										className="object-contain p-2 bg-black"
									/>
								</div>
								<div>
									<span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c9a23f]">
										{opConfig.title}
									</span>
									<h3 className="text-2xl font-bold text-white">{opConfig.name}</h3>
									<p className="text-xs text-slate-400">{opConfig.location}</p>
								</div>
							</div>

							{/* Founder Statement */}
							<blockquote className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-slate-300 mb-6 italic">
								&ldquo;{opConfig.bio}&rdquo;
							</blockquote>

							{/* Key Metrics / Highlights */}
							<div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
								<div className="rounded-xl border border-white/10 bg-white/5 p-3">
									<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
										Agency Hotline
									</span>
									<a
										href={`tel:${opConfig.phone.replace(/[^0-9+]/g, "")}`}
										className="font-bold text-emerald-400 hover:underline flex items-center gap-1.5"
									>
										<Phone className="h-3.5 w-3.5" />
										<span>{opConfig.phone}</span>
									</a>
								</div>
								<div className="rounded-xl border border-white/10 bg-white/5 p-3">
									<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
										Security Posture
									</span>
									<span className="font-bold text-[#c9a23f] flex items-center gap-1.5">
										<ShieldCheck className="h-3.5 w-3.5" />
										<span>Air-Gapped Vault</span>
									</span>
								</div>
							</div>

							{/* Verification Badge */}
							<div className="mt-6 flex items-center justify-between text-[11px] text-slate-400">
								<span className="inline-flex items-center gap-1 text-[#c9a23f]">
									<Award className="h-3.5 w-3.5" />
									<span>{hConfig.credentialsBadge}</span>
								</span>
								<Link
									href="/contact"
									className="font-bold text-white hover:text-[#c9a23f] inline-flex items-center gap-1 transition-colors"
								>
									<span>Direct Line</span>
									<ArrowRight className="h-3 w-3" />
								</Link>
							</div>
						</div>
					</motion.div>

					{/* Right: Narrative & The Sovereign Philosophy */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="lg:col-span-7 space-y-6"
					>
						<div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
							<Cpu className="h-3 w-3" />
							<span>FUSING ARTISAN PRECISION & COMPILED INTELLIGENCE</span>
						</div>

						<h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
							Why We Built an AI-Native Operating System Instead of a Conventional Agency
						</h3>

						<p className="text-sm sm:text-base leading-relaxed text-slate-300">
							{hConfig.narrativeParagraph1}
						</p>

						<p className="text-sm sm:text-base leading-relaxed text-slate-300">
							{hConfig.narrativeParagraph2}
						</p>

						{/* Pillars Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
							<div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#120d20] p-4">
								<CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
								<div>
									<h4 className="text-sm font-bold text-white">Zero Retainer Bloat</h4>
									<p className="text-xs text-slate-400 mt-1">
										No account managers juggling dozens of clients. You receive dedicated, deterministic execution DAGs.
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#120d20] p-4">
								<CheckCircle className="h-5 w-5 text-[#c9a23f] shrink-0 mt-0.5" />
								<div>
									<h4 className="text-sm font-bold text-white">Mathematical Proof Gates</h4>
									<p className="text-xs text-slate-400 mt-1">
										Every campaign and web application passes Z3 formal verification and WCAG 2.1 AA accessibility checks.
									</p>
								</div>
							</div>
						</div>

						{/* Bottom Action Bar */}
						<div className="pt-4 flex flex-wrap items-center gap-4">
							<Link
								href="/contact"
								className="rounded-xl bg-linear-to-r from-[#792cff] to-[#c9a23f] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-[#792cff]/20 hover:scale-105 active:scale-95 transition-all"
							>
								Schedule Founder Consultation
							</Link>
							<Link
								href="/agency"
								className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-slate-200 hover:border-white/30 hover:bg-white/10 transition-all"
							>
								Explore Sovereign Council
							</Link>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
