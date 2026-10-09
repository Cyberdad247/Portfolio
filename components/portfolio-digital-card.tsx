"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowUpRight,
	Bot,
	Check,
	Code2,
	Compass,
	Copy,
	Cpu,
	ExternalLink,
	Eye,
	Globe,
	Layers,
	Mail,
	MessageSquare,
	Phone,
	QrCode,
	Share2,
	ShieldCheck,
	Sparkles,
	Terminal,
	UserCheck,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import AIArchitectOrbit from "@/components/ai-architect-orbit";

interface ProjectItem {
	id: string;
	title: string;
	subtitle: string;
	category: "ai" | "brand" | "web" | "creative";
	description: string;
	tags: string[];
	badge: string;
	gradient: string;
	metrics?: string;
}

const PORTFOLIO_PROJECTS: ProjectItem[] = [
	{
		id: "camelot-ai",
		title: "Camelot AI Operations Engine",
		subtitle: "Sovereign Multi-Agent Ecosystem",
		category: "ai",
		description:
			"A modular autonomous agent architecture orchestrating research, AST compilation, formal Z3 verification, and living tissue memory into a unified workflow.",
		tags: ["Agent Orchestration", "Formal Verification", "Living Memory VFS"],
		badge: "AI Systems · Concept Lab",
		gradient: "from-purple-900/60 via-indigo-950/80 to-black",
		metrics: "<100ms Routing Latency",
	},
	{
		id: "head-artworks",
		title: "Head Artworks: Essence for the Soul",
		subtitle: "Artisan Luxury Brand World",
		category: "brand",
		description:
			"Sensory identity and luxury commerce direction for a handcrafted lifestyle house, fusing earthy minimalism with deep storytelling and Shopify architecture.",
		tags: ["Brand Direction", "Luxury E-Commerce", "Content Strategy"],
		badge: "Brand + Commerce",
		gradient: "from-amber-950/70 via-stone-900/80 to-black",
		metrics: "100% Bespoke Identity",
	},
	{
		id: "conversion-web",
		title: "The Conversion-Ready Digital Engine",
		subtitle: "High-Velocity Web Experience",
		category: "web",
		description:
			"A responsive digital front door engineered for maximum conversion, featuring dynamic lead qualification, sub-second TTFB, and fluid hypermedia.",
		tags: ["Next.js 15", "Conversion Architecture", "Reactive UI"],
		badge: "Digital Product",
		gradient: "from-blue-950/70 via-slate-900/80 to-black",
		metrics: "Sub-50ms TTFB",
	},
	{
		id: "tasha-voice",
		title: "Tasha Autonomous Voice OS",
		subtitle: "Real-Time Bidirectional Voice Assistant",
		category: "ai",
		description:
			"Duplex voice orchestration layer connecting LiveKit WebRTC, Gemini multimodal streaming, and autonomous booking into conversational workflows.",
		tags: ["LiveKit WebRTC", "Gemini Live API", "Sub-100ms VAD"],
		badge: "Voice Systems",
		gradient: "from-emerald-950/70 via-teal-950/80 to-black",
		metrics: "<120ms Voice Turn",
	},
	{
		id: "culture-motion",
		title: "Culture in Motion",
		subtitle: "Campaign & Creative Direction",
		category: "creative",
		description:
			"Social-first visual storytelling, 3D motion design systems, kinetic video pacing, and authentic brand narrative built for high engagement.",
		tags: ["Creative Direction", "Motion Concepts", "Visual Narrative"],
		badge: "Creative Studio",
		gradient: "from-fuchsia-950/70 via-rose-950/80 to-black",
		metrics: "Viral Social Reach",
	},
];

export default function PortfolioDigitalCard() {
	const [activePersona, setActivePersona] = useState<"vizion" | "strategist" | "builder">("vizion");
	const [selectedCategory, setSelectedCategory] = useState<"all" | "ai" | "brand" | "web" | "creative">("all");
	const [copied, setCopied] = useState<string | null>(null);
	const [showQr, setShowQr] = useState(false);
	const [webGpuStatus, setWebGpuStatus] = useState<"checking" | "active" | "unsupported">("checking");
	const [showOrbitModal, setShowOrbitModal] = useState(false);

	// Contact Information
	const contactInfo = {
		name: 'VaShawn "Vizion" Head',
		title: "Founder & Creative Technologist",
		company: "Invisioned Marketing",
		phone: "(216) 586-4607",
		phoneRaw: "+12165864607",
		email: "invisionedmarketing@gmail.com",
		website: "https://invisionedmarketing.agency",
		cardUrl: "https://invisionedmarketing.agency/card",
	};

	// Personas Definition
	const personas = {
		vizion: {
			kicker: "VIZION · CREATIVE FORCE",
			role: "Founder & Creative Technologist",
			summary:
				"Transforming ambitious visions into governed AI agent ecosystems, luxury brand worlds, and high-velocity digital experiences.",
			avatar: "/assets/avatar-wealth.jpg",
			color: "#792cff",
			accentBorder: "border-[#792cff]/50",
			badge: "bg-[#792cff]/15 text-purple-300 border-[#792cff]/30",
		},
		strategist: {
			kicker: "STRATEGIST · SYSTEMS",
			role: "Growth & Architecture Lead",
			summary:
				"Architecting revenue engines, SEO & GEO search authority, automated client onboarding pipelines, and friction-free operational infrastructure.",
			avatar: "/assets/avatar-focus.jpg",
			color: "#c9a23f",
			accentBorder: "border-[#c9a23f]/50",
			badge: "bg-[#c9a23f]/15 text-amber-300 border-[#c9a23f]/30",
		},
		builder: {
			kicker: "BUILDER · AI AGENTS",
			role: "Sovereign AI Practitioner",
			summary:
				"Deploying local WebLLM runtimes, WebGPU tensor accelerators, and MCP orchestration bridges for zero-latency autonomous execution.",
			avatar: "/assets/avatar-vizion.jpg",
			color: "#10b981",
			accentBorder: "border-emerald-500/50",
			badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
		},
	};

	// Probe Hardware for WebGPU Support
	useEffect(() => {
		if (typeof navigator !== "undefined" && "gpu" in navigator) {
			(navigator as any).gpu
				.requestAdapter()
				.then((adapter: any) => {
					setWebGpuStatus(adapter ? "active" : "unsupported");
				})
				.catch(() => {
					setWebGpuStatus("unsupported");
				});
		} else {
			setWebGpuStatus("unsupported");
		}
	}, []);

	// Copy to clipboard helper
	const copyToClipboard = (text: string, label: string) => {
		if (typeof navigator !== "undefined" && navigator.clipboard) {
			navigator.clipboard.writeText(text);
			setCopied(label);
			setTimeout(() => setCopied(null), 2500);
		}
	};

	// Save vCard download (.vcf)
	const handleSaveContact = () => {
		const vcard = `BEGIN:VCARD
VERSION:3.0
N:Head;VaShawn;;;
FN:VaShawn "Vizion" Head
ORG:Invisioned Marketing
TITLE:${personas[activePersona].role}
TEL;TYPE=CELL,VOICE,PREF:${contactInfo.phoneRaw}
EMAIL;TYPE=WORK,INTERNET,PREF:${contactInfo.email}
URL:${contactInfo.website}
NOTE:Dreams don't come true, visions do. Invisioned Marketing.
REV:${new Date().toISOString()}
END:VCARD`.trim();

		const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "VaShawn_Vizion_Head.vcf";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	// Native share API
	const handleShare = async () => {
		if (typeof navigator !== "undefined" && navigator.share) {
			try {
				await navigator.share({
					title: `${contactInfo.name} | ${contactInfo.company}`,
					text: `Connect with ${contactInfo.name} — ${contactInfo.title} at ${contactInfo.company}.`,
					url: contactInfo.cardUrl,
				});
			} catch {
				// Dismissed
			}
		} else {
			copyToClipboard(contactInfo.cardUrl, "cardUrl");
		}
	};

	const filteredProjects =
		selectedCategory === "all"
			? PORTFOLIO_PROJECTS
			: PORTFOLIO_PROJECTS.filter((p) => p.category === selectedCategory);

	return (
		<div className="relative min-h-screen bg-[#07050d] text-slate-100 antialiased selection:bg-[#792cff]/30 selection:text-[#c9a23f]">
			{/* Ambient Cosmic Background Lighting */}
			<div className="pointer-events-none fixed inset-0 overflow-hidden">
				<div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-[#792cff]/15 blur-[120px]" />
				<div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-[#c9a23f]/10 blur-[140px]" />
				<div className="absolute bottom-10 left-10 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[130px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-16">
				{/* Top Branding Navigation Bar */}
				<header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
					<Link href="/" className="flex items-center gap-3 group">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-[#792cff] to-[#c9a23f] text-lg font-black text-white shadow-lg transition-transform group-hover:scale-105">
							V
						</div>
						<div>
							<span className="block text-sm font-black tracking-wider uppercase text-white">
								INVISIONED <span className="text-[#c9a23f]">MARKETING</span>
							</span>
							<span className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
								PORTFOLIO & DIGITAL BUSINESS CARD
							</span>
						</div>
					</Link>

					<div className="flex items-center gap-3">
						{/* WebGPU Status Indicator */}
						<div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300">
							<Cpu className="h-3.5 w-3.5 text-[#c9a23f]" />
							<span>
								{webGpuStatus === "active"
									? "WebGPU Accelerated"
									: webGpuStatus === "checking"
										? "Probing GPU..."
										: "Hardware Shaders Ready"}
							</span>
						</div>

						{/* Direct Contact Button */}
						<a
							href={`tel:${contactInfo.phoneRaw}`}
							className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-500/20"
						>
							<Phone className="h-3.5 w-3.5" />
							<span>Call Direct</span>
						</a>
					</div>
				</header>

				{/* Two-Column Responsive Grid */}
				<div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
					{/* ================= LEFT COLUMN: DIGITAL BUSINESS CARD CONSOLE ================= */}
					<aside className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start space-y-6">
						<div className="relative overflow-hidden rounded-3xl border border-white/15 bg-linear-to-b from-[#140e22] via-[#0f0b1a] to-[#0a0712] p-6 shadow-2xl backdrop-blur-xl">
							{/* Persona Selector Tabs */}
							<div className="mb-5 flex rounded-2xl border border-white/10 bg-black/40 p-1">
								{(["vizion", "strategist", "builder"] as const).map((personaKey) => (
									<button
										key={personaKey}
										type="button"
										onClick={() => setActivePersona(personaKey)}
										className={`relative flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider transition-all rounded-xl ${
											activePersona === personaKey
												? "bg-white/15 text-white shadow-md"
												: "text-slate-400 hover:text-slate-200"
										}`}
									>
										{personaKey}
										{activePersona === personaKey && (
											<motion.div
												layoutId="activePersonaPill"
												className="absolute inset-0 rounded-xl border border-white/20"
												transition={{ duration: 0.2 }}
											/>
										)}
									</button>
								))}
							</div>

							{/* Identity Header */}
							<div className="flex flex-col items-center text-center">
								{/* Avatar Frame with Dynamic Aura */}
								<div className="relative mb-4">
									<div
										className="absolute -inset-2 rounded-full blur-md transition-all duration-500"
										style={{ backgroundColor: `${personas[activePersona].color}40` }}
									/>
									<div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-white/20 bg-[#1e152d] shadow-xl">
										<Image
											src={personas[activePersona].avatar}
											alt={contactInfo.name}
											fill
											className="object-cover"
											priority
										/>
									</div>
									<span className="absolute bottom-1 right-1 flex h-4 w-4">
										<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
										<span className="relative inline-flex h-4 w-4 rounded-full border-2 border-[#0f0b1a] bg-emerald-500" />
									</span>
								</div>

								{/* Role Badge */}
								<span
									className={`mb-2 inline-block rounded-full border px-3 py-0.5 text-[10px] font-extrabold tracking-widest uppercase ${personas[activePersona].badge}`}
								>
									{personas[activePersona].kicker}
								</span>

								{/* Name & Title */}
								<h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
									{contactInfo.name}
								</h1>
								<p className="mt-1 text-xs font-medium text-slate-300">
									{personas[activePersona].role}
								</p>
								<p className="mt-0.5 text-[11px] font-bold tracking-wider text-[#c9a23f] uppercase">
									{contactInfo.company}
								</p>

								{/* Dynamic Mission Pitch */}
								<p className="mt-4 text-xs leading-relaxed text-slate-300 border-t border-b border-white/10 py-3 text-center">
									“{personas[activePersona].summary}”
								</p>
							</div>

							{/* 1-Tap Core Action Matrix */}
							<div className="mt-6 grid grid-cols-2 gap-2.5">
								<button
									type="button"
									onClick={handleSaveContact}
									className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#c9a23f] to-[#e4bc58] py-3 text-xs font-black uppercase tracking-wider text-black shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
								>
									<UserCheck className="h-4 w-4" />
									<span>Save Contact (.vcf)</span>
								</button>

								<a
									href={`tel:${contactInfo.phoneRaw}`}
									className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-3 text-xs font-bold text-emerald-400 transition-colors hover:bg-emerald-500/20"
								>
									<Phone className="h-4 w-4" />
									<span>Call (216) 586-4607</span>
								</a>

								<a
									href={`mailto:${contactInfo.email}?subject=Project%20Inquiry%20via%20Portfolio%20Card`}
									className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-slate-200 transition-colors hover:border-[#792cff] hover:bg-[#792cff]/10 hover:text-white"
								>
									<Mail className="h-4 w-4" />
									<span>Direct Email</span>
								</a>

								<button
									type="button"
									onClick={() => setShowQr(!showQr)}
									className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-slate-200 transition-colors hover:border-[#c9a23f] hover:bg-[#c9a23f]/10 hover:text-[#c9a23f]"
								>
									<QrCode className="h-4 w-4" />
									<span>Show QR Code</span>
								</button>
							</div>

							{/* Expandable QR Code Dropdown */}
							<AnimatePresence>
								{showQr && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className="mt-4 flex flex-col items-center rounded-2xl border border-[#c9a23f]/40 bg-black/90 p-4 text-center backdrop-blur-md"
									>
										<span className="mb-2 text-[10px] font-extrabold tracking-widest text-[#c9a23f] uppercase">
											Scan to Open On Mobile
										</span>
										<div className="relative h-44 w-44 rounded-xl border border-white/20 bg-white p-2">
											<img
												src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
													contactInfo.cardUrl,
												)}&color=09070f`}
												alt="QR Code"
												className="h-full w-full object-contain"
											/>
										</div>
										<span className="mt-2 text-[10px] text-slate-400">
											invisionedmarketing.agency/card
										</span>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Direct Contact Detail Rows */}
							<div className="mt-6 space-y-2">
								<div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
									<div className="flex items-center gap-2.5">
										<Phone className="h-3.5 w-3.5 text-emerald-400" />
										<span className="text-xs font-bold text-white">216-586-4607</span>
									</div>
									<button
										type="button"
										onClick={() => copyToClipboard(contactInfo.phoneRaw, "phone")}
										className="text-slate-400 hover:text-white"
										aria-label="Copy Phone"
									>
										{copied === "phone" ? (
											<Check className="h-3.5 w-3.5 text-emerald-400" />
										) : (
											<Copy className="h-3.5 w-3.5" />
										)}
									</button>
								</div>

								<div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
									<div className="flex items-center gap-2.5">
										<Mail className="h-3.5 w-3.5 text-[#792cff]" />
										<span className="text-xs font-bold text-white truncate max-w-[200px]">
											{contactInfo.email}
										</span>
									</div>
									<button
										type="button"
										onClick={() => copyToClipboard(contactInfo.email, "email")}
										className="text-slate-400 hover:text-white"
										aria-label="Copy Email"
									>
										{copied === "email" ? (
											<Check className="h-3.5 w-3.5 text-emerald-400" />
										) : (
											<Copy className="h-3.5 w-3.5" />
										)}
									</button>
								</div>

								<div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
									<div className="flex items-center gap-2.5">
										<Globe className="h-3.5 w-3.5 text-[#c9a23f]" />
										<span className="text-xs font-bold text-white">
											invisionedmarketing.agency
										</span>
									</div>
									<button
										type="button"
										onClick={handleShare}
										className="text-slate-400 hover:text-[#c9a23f]"
										aria-label="Share"
									>
										{copied === "cardUrl" ? (
											<Check className="h-3.5 w-3.5 text-emerald-400" />
										) : (
											<Share2 className="h-3.5 w-3.5" />
										)}
									</button>
								</div>
							</div>
						</div>

						{/* Quick Pitch Callout */}
						<div className="rounded-2xl border border-white/10 bg-[#120d20] p-4 text-center">
							<span className="block text-[11px] font-extrabold tracking-wider text-[#c9a23f] uppercase">
								Philosophy
							</span>
							<p className="mt-1 text-xs italic text-slate-300">
								“Dreams don't come true, visions do.”
							</p>
						</div>
					</aside>

					{/* ================= RIGHT COLUMN: INTERACTIVE PORTFOLIO & SHOWCASE ================= */}
					<main className="lg:col-span-7 space-y-12">
						{/* 1. EMBEDDED FLAGSHIP: THE A.I. ARCHITECT LIVING TYPOGRAPHIC ORBIT */}
						<section className="relative overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl">
							<div className="p-4 sm:p-6 pb-0 flex items-center justify-between border-b border-slate-100">
								<div>
									<span className="block text-[10px] font-extrabold tracking-[0.2em] text-[#c9a23f] uppercase">
										CENTRAL INTELLIGENCE ENGINE
									</span>
									<h2 className="text-lg sm:text-2xl font-black text-slate-900 uppercase">
										The A.I. Architect · Living Orbit
									</h2>
								</div>
								<Link
									href="/architect"
									className="inline-flex items-center gap-1.5 rounded-full border border-[#792cff]/30 bg-[#792cff]/10 px-3 py-1 text-[11px] font-bold text-[#792cff] hover:bg-[#792cff] hover:text-white transition-all"
								>
									<span>Full Screen</span>
									<ExternalLink className="h-3 w-3" />
								</Link>
							</div>

							<AIArchitectOrbit showHeadings={false} className="py-6 sm:py-10" />
						</section>

						{/* 2. SELECTED WORK & CONCEPT LAB */}
						<section className="space-y-6">
							<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
								<div>
									<span className="text-xs font-extrabold tracking-widest text-[#c9a23f] uppercase">
										SELECTED WORK & SYSTEMS
									</span>
									<h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
										Ideas, Shaped Into <span className="text-[#c9a23f]">Realities</span>
									</h2>
								</div>

								{/* Category Filter Pills */}
								<div className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1">
									{(["all", "ai", "brand", "web", "creative"] as const).map((cat) => (
										<button
											key={cat}
											type="button"
											onClick={() => setSelectedCategory(cat)}
											className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
												selectedCategory === cat
													? "bg-[#792cff] text-white shadow-sm"
													: "text-slate-400 hover:text-white"
											}`}
										>
											{cat}
										</button>
									))}
								</div>
							</div>

							{/* Portfolio Cards Grid */}
							<div className="grid grid-cols-1 gap-4">
								{filteredProjects.map((project) => (
									<div
										key={project.id}
										className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#110c1c] p-5 transition-all duration-300 hover:border-white/25 hover:bg-[#161025]"
									>
										<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
											<div>
												<span className="inline-block rounded-md bg-white/10 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase text-[#c9a23f]">
													{project.badge}
												</span>
												<h3 className="mt-2 text-lg font-bold text-white group-hover:text-[#c9a23f] transition-colors">
													{project.title}
												</h3>
												<p className="text-xs font-semibold text-slate-400">
													{project.subtitle}
												</p>
											</div>

											{project.metrics && (
												<span className="self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
													{project.metrics}
												</span>
											)}
										</div>

										<p className="mt-3 text-xs leading-relaxed text-slate-300">
											{project.description}
										</p>

										<div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
											{project.tags.map((tag) => (
												<span
													key={tag}
													className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400"
												>
													{tag}
												</span>
											))}
										</div>
									</div>
								))}
							</div>
						</section>

						{/* 3. CORE AGENCY CAPABILITIES */}
						<section className="space-y-4">
							<span className="text-xs font-extrabold tracking-widest text-[#c9a23f] uppercase">
								SYSTEMS & COMPETENCIES
							</span>
							<h2 className="text-2xl font-black text-white uppercase tracking-tight">
								What We Architect & Build
							</h2>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{[
									{
										icon: Bot,
										title: "Autonomous AI Agents",
										desc: "Custom fleet orchestration, Z3 formal proof gates, and reactive voice systems.",
									},
									{
										icon: Compass,
										title: "Brand Strategy & Worldbuilding",
										desc: "Comprehensive positioning, visual direction, luxury identity, and narrative tone.",
									},
									{
										icon: Globe,
										title: "High-Converting Digital Products",
										desc: "Conversion-minded web architecture, landing funnels, and sub-second TTFB.",
									},
									{
										icon: Zap,
										title: "Growth Engines & SEO/GEO",
										desc: "Generative Engine Optimization (GEO), content automation, and search dominance.",
									},
									{
										icon: Terminal,
										title: "WebGPU & Edge Acceleration",
										desc: "Client-side tensor processing, WebLLM execution, and offline-first interfaces.",
									},
									{
										icon: ShieldCheck,
										title: "Business Systems & Workflows",
										desc: "Automated client onboarding, CRM pipelines, and operations reducing friction.",
									},
								].map((cap, i) => (
									<div
										key={i}
										className="rounded-xl border border-white/10 bg-[#120e1f] p-4 transition-all hover:border-[#792cff]/40"
									>
										<div className="flex items-center gap-3 mb-2">
											<div className="rounded-lg bg-[#792cff]/20 p-2 text-[#792cff]">
												<cap.icon className="h-4 w-4" />
											</div>
											<h4 className="text-xs font-bold uppercase tracking-wider text-white">
												{cap.title}
											</h4>
										</div>
										<p className="text-[11px] leading-relaxed text-slate-400">
											{cap.desc}
										</p>
									</div>
								))}
							</div>
						</section>

						{/* 4. INSTANT PROJECT INQUIRY FORM */}
						<section className="rounded-3xl border border-[#792cff]/40 bg-linear-to-b from-[#18102a] to-[#0c0817] p-6 sm:p-8 shadow-xl">
							<div className="mb-6">
								<span className="text-[10px] font-extrabold tracking-widest text-[#c9a23f] uppercase">
									START A CONVERSATION
								</span>
								<h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
									Have A Vision? Let&apos;s Build The System.
								</h2>
								<p className="mt-1 text-xs text-slate-300">
									Direct transmission to VaShawn &ldquo;Vizion&rdquo; Head. Call/text{" "}
									<a href="tel:+12165864607" className="text-emerald-400 font-bold hover:underline">
										(216) 586-4607
									</a>{" "}
									or send an inquiry below.
								</p>
							</div>

							<form
								onSubmit={(e) => {
									e.preventDefault();
									const form = e.currentTarget;
									const name = (form.elements.namedItem("name") as HTMLInputElement).value;
									const email = (form.elements.namedItem("email") as HTMLInputElement).value;
									const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
									const subject = encodeURIComponent(`Project Inquiry from ${name}`);
									const body = encodeURIComponent(
										`Name: ${name}\nEmail: ${email}\n\nProject Scope:\n${message}`,
									);
									window.location.href = `mailto:invisionedmarketing@gmail.com?subject=${subject}&body=${body}`;
								}}
								className="space-y-3"
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<input
										type="text"
										name="name"
										placeholder="Your Name"
										required
										className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#792cff]"
									/>
									<input
										type="email"
										name="email"
										placeholder="Your Email"
										required
										className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#792cff]"
									/>
								</div>
								<textarea
									name="message"
									placeholder="Tell me about your idea, challenge, or timeline..."
									rows={3}
									required
									className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#792cff]"
								/>
								<button
									type="submit"
									className="w-full rounded-xl bg-linear-to-r from-[#792cff] to-[#c9a23f] py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-[1.01]"
								>
									Send Direct Inquiry ↗
								</button>
							</form>
						</section>
					</main>
				</div>

				{/* Page Footer */}
				<footer className="mt-16 border-t border-white/10 pt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
					<span>
						© {new Date().getFullYear()} Invisioned Marketing. VaShawn &ldquo;Vizion&rdquo; Head.
					</span>
					<div className="flex items-center gap-4 text-[11px]">
						<a href="tel:+12165864607" className="hover:text-emerald-400">
							(216) 586-4607
						</a>
						<span>•</span>
						<a href="mailto:invisionedmarketing@gmail.com" className="hover:text-[#c9a23f]">
							invisionedmarketing@gmail.com
						</a>
						<span>•</span>
						<Link href="/architect" className="hover:text-[#792cff]">
							A.I. Orbit
						</Link>
					</div>
				</footer>
			</div>
		</div>
	);
}
