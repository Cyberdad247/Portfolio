"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	Bot,
	CheckCircle2,
	ChevronRight,
	Clock,
	Cpu,
	ExternalLink,
	Headphones,
	Layers,
	MessageSquare,
	Phone,
	Radio,
	Send,
	ShieldCheck,
	Sparkles,
	Terminal,
	Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
	CATEGORY_LABELS,
	KNIGHTS,
	type Knight,
	type KnightCategory,
	STATUS_DOT,
	TIER_COLORS,
	TIER_LABELS,
} from "@/config/knights.config";

export default function VirtualAgencyCouncil() {
	const [selectedCategory, setSelectedCategory] = useState<KnightCategory>("all");
	const [activeKnight, setActiveKnight] = useState<Knight>(KNIGHTS[0]);
	const [clientInquiry, setClientInquiry] = useState("");
	const [simulatedResponse, setSimulatedResponse] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const filteredKnights =
		selectedCategory === "all"
			? KNIGHTS
			: KNIGHTS.filter((k) => k.category === selectedCategory);

	const handleSimulateBrief = (promptText?: string) => {
		const text = promptText || clientInquiry;
		if (!text.trim()) return;

		setIsProcessing(true);
		setSimulatedResponse(null);

		setTimeout(() => {
			let response = "";
			switch (activeKnight.id) {
				case "M-OMEGA":
					response = `[MERLIN_Ω]: System-2 strategy formulated for "${text}". Formulating 4-step execution DAG: 1. Semantic intent extraction via Anya Gate. 2. Creative brand resonance mapping. 3. Kinetic web system compilation. 4. Living tissue memory crystallization. Estimated turnaround: 48 hours.`;
					break;
				case "ANYA-01":
					response = `[ANYA_Ω]: Ingress intent sanitized: "${text}". Entropy stripped. Coerced to TOON specification: |🧠⊗(⚡💬)⟩ ⟨Omega:Invisioned_Intake⟩. Zero semantic drift detected. Permitted through Anya Gate.`;
					break;
				case "STRAT-01":
					response = `[GENERAL_STRATEGOS]: The Midas Loop engaged for "${text}". Tree of Thoughts (ToT) simulating 3 futures: 1. Aggressive (GEO AI saturation). 2. Balanced (Living orbit web + high-intent citation capture). 3. Guerrilla (Niche programmatic authority). Pre-Mortem risk analysis complete. Selected branch: Balanced.`;
					break;
				case "AURA-01":
					response = `[AMARA 'AURA']: Creative auteur pulse activated for "${text}". Formulating Afro-Futurist chromatic logic. Visual resonance is the frequency of brand truth. Encoding high-status cultural symbols into emotional brand archetyping.`;
					break;
				case "VISAGE-01":
					response = `[SIR_VISAGE]: Visual resonance engine locked. DTCG design token matrix initiated: 60% Obsidian Black (#090712), 30% Luxora Gold (#c9a23f), 10% Royal Purple (#792cff). Neuro-aesthetic contrast ratio: 14.8:1 (Surpasses AAA).`;
					break;
				case "B-01":
					response = `[SIR_BORIS]: Systems architecture and brand worlds initialised for "${text}". Deploying Obsidian-Gold aesthetic matrix. Typography set to brutalist high-contrast serif/sans balance. Luxury copy vectors formulated.`;
					break;
				case "HYDRON-01":
					response = `[SIR_HYDRON]: Isomorphic Island Architecture compiling for "${text}". HTMX hypermedia outer shell + React 19 interactive WebGPU islands. Bundle size reduced by 82%. Zero layout shift (CLS: 0.00).`;
					break;
				case "STITCH-01":
					response = `[SIR_STITCH]: Kinetic mesh woven. WebGPU hardware-accelerated shaders synchronized to 60 FPS. Living Typographic Orbit particles linked via bidirectional WebSocket sockets. Motion layering locked.`;
					break;
				case "F-01":
					response = `[SIR_FORGE]: Technical architecture compiled. Next.js 15 App Router + Tailwind 4 runtime locked. Estimated Time-to-First-Byte (TTFB): 38ms. Z3 formal proof gates passed. Zero performance degradation.`;
					break;
				case "H-01":
					response = `[SIR_HELIOS]: High-altitude telemetry cockpit synchronized. Living Typographic Orbit engine configured. WebGPU client-side shader pipeline rendering at 60 FPS. Central "I" visual anchor locked to CloudBrain tether.`;
					break;
				case "A-02":
					response = `[LADY_APIS]: Generative Search (GEO) audit initialized for "${text}". Mapping citation probabilities across ChatGPT Search, Perplexity Pro, and Google Gemini. Keyword clusters deployed to programmatic knowledge nodes. Ranking velocity: 94.2% citation capture.`;
					break;
				case "T-01":
					response = `[TASHA_PRIME]: Voice session ready. Call hotline at (216) 586-4607 for real-time conversational intake or I can schedule a founder consultation with VaShawn "Vizion" Head directly on your calendar right now.`;
					break;
				case "G-01":
					response = `[SIR_GHOST]: Security perimeter sealed. Client NDA air-gap active. Program Dependency Graph confirms zero external cloud leaks. All client credentials stored in encrypted local vault under Ed25519 signing keys.`;
					break;
				case "M-02":
					response = `[LADY_MNEMOSYNE]: Knowledge fabric synchronized. Client context crystal minted in WorldTree VFS (node UUID: a0a4bfb9-e847-4c38). Zero context rot across infinite campaign cycles.`;
					break;
				case "GIDEON-01":
					response = `[SIR_GIDEON & SALLY]: Formal quality & compliance verdict: SATISFIABLE AND SEALED. WCAG 2.1 AA accessibility proof passed. Zero color contrast or keyboard trap violations. Formal invariants verified.`;
					break;
				default:
					response = `[${activeKnight.name}]: Tactical mission brief received for "${text}". Assigned to department queue with priority dispatch.`;
			}
			setSimulatedResponse(response);
			setIsProcessing(false);
		}, 800);
	};

	return (
		<section className="relative w-full py-16 px-4 md:px-8 bg-[#090712] text-white overflow-hidden">
			{/* Ambient Neural Backlights */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute top-1/4 -left-40 h-96 w-96 rounded-full bg-[#792cff]/20 blur-[130px]" />
				<div className="absolute bottom-1/4 -right-40 h-96 w-96 rounded-full bg-[#c9a23f]/15 blur-[130px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl">
				{/* Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-12">
					<div className="inline-flex items-center gap-2 rounded-full border border-[#c9a23f]/40 bg-[#c9a23f]/10 px-3.5 py-1 text-xs font-bold text-[#c9a23f] uppercase tracking-widest mb-4">
						<Radio className="h-3 w-3 animate-pulse" />
						<span>CAMELOT-OS CLOUDBRAIN · VIRTUAL DIGITAL AGENCY</span>
					</div>
					<h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-white">
						The Sovereign <span className="bg-linear-to-r from-[#792cff] to-[#c9a23f] bg-clip-text text-transparent">Agency Council</span>
					</h2>
					<p className="mt-3 text-sm sm:text-base text-slate-300">
						Not a traditional agency with bloated retainers. Invisioned Marketing is an AI-Native Digital Agency operated by autonomous, specialized Knights running on sovereign CloudBrain architecture.
					</p>
				</div>

				{/* Category Filters */}
				<div className="flex flex-wrap items-center justify-center gap-2 mb-10">
					{(Object.keys(CATEGORY_LABELS) as KnightCategory[]).map((categoryKey) => (
						<button
							key={categoryKey}
							type="button"
							onClick={() => setSelectedCategory(categoryKey)}
							className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
								selectedCategory === categoryKey
									? "bg-linear-to-r from-[#792cff] to-[#c9a23f] text-white shadow-lg shadow-[#792cff]/20"
									: "border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20"
							}`}
						>
							{CATEGORY_LABELS[categoryKey]}
						</button>
					))}
				</div>

				{/* Two-Column Command Deck */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
					{/* LEFT: Knights Pantheon Grid */}
					<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
						{filteredKnights.map((knight) => {
							const IconComponent = knight.icon;
							const isSelected = activeKnight.id === knight.id;
							return (
								<div
									key={knight.id}
									onClick={() => {
										setActiveKnight(knight);
										setSimulatedResponse(null);
									}}
									className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
										isSelected
											? "border-[#c9a23f] bg-[#161026] shadow-xl shadow-[#792cff]/20 scale-[1.02]"
											: "border-white/10 bg-[#100c1c]/80 hover:border-white/25 hover:bg-[#140e24]"
									}`}
								>
									{/* Top Header Row */}
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center gap-2.5">
											<div
												className="p-2 rounded-xl border border-white/10"
												style={{ backgroundColor: `${knight.accentVar}20`, color: knight.accentVar }}
											>
												<IconComponent className="h-4 w-4" />
											</div>
											<div>
												<span className="block text-[10px] font-extrabold tracking-widest text-[#c9a23f]">
													{knight.designation}
												</span>
												<h3 className="text-sm font-bold text-white group-hover:text-[#c9a23f] transition-colors">
													{knight.name}
												</h3>
											</div>
										</div>

										<div className="flex items-center gap-1.5">
											<span className={`h-2 w-2 rounded-full ${STATUS_DOT[knight.status]}`} />
											<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
												{knight.status}
											</span>
										</div>
									</div>

									{/* Subtitle / Role */}
									<p className="text-xs font-semibold text-slate-300 mb-2">
										{knight.title}
									</p>

									{/* Metric Pill */}
									<div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px]">
										<span className="text-slate-400">{knight.metric.label}</span>
										<span className="font-bold text-emerald-400">{knight.metric.value}</span>
									</div>
								</div>
							);
						})}
					</div>

					{/* RIGHT: Active Knight Operational Station */}
					<div className="lg:col-span-5 lg:sticky lg:top-24 rounded-3xl border border-white/15 bg-linear-to-b from-[#18112b] via-[#110c1f] to-[#0a0714] p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
						{/* Station Header */}
						<div className="flex items-start justify-between border-b border-white/10 pb-5 mb-5">
							<div>
								<div className="flex items-center gap-2 mb-1">
									<span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${TIER_COLORS[activeKnight.tier]}`}>
										{TIER_LABELS[activeKnight.tier]}
									</span>
									<span className="text-[10px] font-mono text-slate-400">
										ID: {activeKnight.id}
									</span>
								</div>
								<h3 className="text-xl font-black text-white">{activeKnight.name}</h3>
								<p className="text-xs text-[#c9a23f] font-semibold">{activeKnight.title}</p>
							</div>

							<div
								className="p-3 rounded-2xl border border-white/10"
								style={{ backgroundColor: `${activeKnight.accentVar}25`, color: activeKnight.accentVar }}
							>
								{React.createElement(activeKnight.icon, { className: "h-6 w-6" })}
							</div>
						</div>

						{/* Substrate & CloudBrain Coordinate */}
						<div className="mb-4 space-y-1.5 rounded-xl border border-white/10 bg-black/40 p-3 text-[11px]">
							<div className="flex items-center justify-between text-slate-400">
								<span>Cognitive Substrate:</span>
								<span className="font-semibold text-white">{activeKnight.substrate || "Gemini 3.8 / FastMCP"}</span>
							</div>
							{activeKnight.cloudbrainUuid && (
								<div className="flex items-center justify-between text-slate-400">
									<span>CloudBrain Notebook:</span>
									<span className="font-mono text-xs text-purple-300 truncate max-w-[170px]">
										{activeKnight.cloudbrainUuid}
									</span>
								</div>
							)}
						</div>

						{/* Description */}
						<p className="text-xs leading-relaxed text-slate-300 mb-4">
							{activeKnight.description}
						</p>

						{/* Capabilities Checklist */}
						<div className="mb-6 space-y-1.5">
							<span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#c9a23f] mb-1">
								Operational Capabilities
							</span>
							{activeKnight.capabilities.map((cap, i) => (
								<div key={i} className="flex items-center gap-2 text-xs text-slate-300">
									<CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
									<span>{cap}</span>
								</div>
							))}
						</div>

						{/* Interactive Brief Dispatch Console */}
						<div className="border-t border-white/10 pt-5">
							<span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#c9a23f] mb-2">
								Dispatch Tactical Brief to {activeKnight.name}
							</span>

							{/* Sample Quick-Click Prompts */}
							<div className="flex flex-wrap gap-1.5 mb-3">
								{[
									"Run The Midas Loop",
									"Audit our brand positioning",
									"Generate GEO search strategy",
									"Build conversion web engine",
									"Prove formal Z3 invariants",
								].map((samplePrompt) => (
									<button
										key={samplePrompt}
										type="button"
										onClick={() => {
											setClientInquiry(samplePrompt);
											handleSimulateBrief(samplePrompt);
										}}
										className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-slate-300 hover:border-[#c9a23f] hover:text-[#c9a23f] transition-all"
									>
										{samplePrompt}
									</button>
								))}
							</div>

							{/* Input and Submit */}
							<div className="flex gap-2">
								<input
									type="text"
									value={clientInquiry}
									onChange={(e) => setClientInquiry(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") handleSimulateBrief();
									}}
									placeholder={`Ask ${activeKnight.name} for a tactical plan...`}
									className="flex-1 rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#792cff]"
								/>
								<button
									type="button"
									onClick={() => handleSimulateBrief()}
									disabled={isProcessing}
									className="rounded-xl bg-linear-to-r from-[#792cff] to-[#c9a23f] px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
								>
									{isProcessing ? <Zap className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
								</button>
							</div>

							{/* Simulated Tactical Response Box */}
							<AnimatePresence>
								{simulatedResponse && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 5 }}
										className="mt-4 rounded-xl border border-purple-500/30 bg-purple-950/20 p-3.5 text-xs text-purple-200 leading-relaxed font-mono"
									>
										{simulatedResponse}
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* 1-Tap Hotline & Founder Booking */}
						<div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
							<a
								href="tel:+12165864607"
								className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:underline"
							>
								<Phone className="h-3.5 w-3.5" />
								<span>Call (216) 586-4607</span>
							</a>
							<Link
								href="/contact"
								className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c9a23f] hover:underline"
							>
								<span>Book Consultation</span>
								<ArrowRight className="h-3.5 w-3.5" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
