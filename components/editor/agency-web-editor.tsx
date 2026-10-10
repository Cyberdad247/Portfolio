"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	Activity,
	ArrowRight,
	Bot,
	Check,
	CheckCircle2,
	Clock,
	Code,
	Cpu,
	Download,
	Eye,
	ExternalLink,
	Globe,
	Layers,
	MessageSquare,
	Palette,
	Phone,
	Play,
	RefreshCw,
	RotateCcw,
	Save,
	Send,
	ShieldCheck,
	Sliders,
	Sparkles,
	Terminal,
	Trash2,
	Upload,
	X,
	Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
	defaultAgencyConfig,
	type AgencySolutionSlot,
	type AgencyStorefrontConfig,
	type BackendWorkflow,
	type DeliveryChecklistItem,
	type OpsStatus,
	statusLabels,
	statusTone,
} from "@/config/agency-storefront.config";

type EditorTab = "overview" | "frontend" | "assistant" | "solutions" | "preview";

type ChangeRecord = {
	field: string;
	before: string;
	after: string;
};

type ChatMessage = {
	id: string;
	sender: "operator" | "agent";
	text: string;
	changes?: ChangeRecord[];
	proposedConfig?: AgencyStorefrontConfig;
};

export default function AgencyWebEditor() {
	const [config, setConfig] = useState<AgencyStorefrontConfig>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("invisioned_agency_config");
			if (saved) {
				try {
					return JSON.parse(saved);
				} catch {}
			}
		}
		return defaultAgencyConfig;
	});

	const [activeTab, setActiveTab] = useState<EditorTab>("overview");
	const [saveNotification, setSaveNotification] = useState<string | null>(null);

	// Conversational AI State
	const [chatInput, setChatInput] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
		{
			id: "welcome",
			sender: "agent",
			text: "Greetings, Commander Vizion. I am Sir Helios, High Herald of Telemetry. Tell me what you wish to modify across the Invisioned Marketing storefront — the announcement bar, brand colors, hero headline, founder bio, or solution slots. I will compute a safe diff card for your review before applying changes.",
		},
	]);
	const [pendingProposal, setPendingProposal] = useState<{
		config: AgencyStorefrontConfig;
		changes: ChangeRecord[];
	} | null>(null);
	const chatScrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (chatScrollRef.current) {
			chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
		}
	}, [chatMessages, pendingProposal]);

	const handleSaveConfig = () => {
		localStorage.setItem("invisioned_agency_config", JSON.stringify(config));
		setSaveNotification("Configuration successfully saved to local vault and VFS cache!");
		setTimeout(() => setSaveNotification(null), 3500);
	};

	const handleResetDefaults = () => {
		if (confirm("Reset storefront configuration to canonical Invisioned Marketing defaults?")) {
			setConfig(defaultAgencyConfig);
			localStorage.removeItem("invisioned_agency_config");
			setSaveNotification("Reset to canonical defaults.");
			setTimeout(() => setSaveNotification(null), 3000);
		}
	};

	// Conversational AI Assistant Handler
	const handleSendAssistant = (promptText?: string) => {
		const text = (promptText || chatInput).trim();
		if (!text || isGenerating) return;

		setChatInput("");
		setPendingProposal(null);

		const userMsg: ChatMessage = {
			id: `user-${Date.now()}`,
			sender: "operator",
			text,
		};
		setChatMessages((prev) => [...prev, userMsg]);
		setIsGenerating(true);

		setTimeout(() => {
			const lower = text.toLowerCase();
			let newConfig: AgencyStorefrontConfig = JSON.parse(JSON.stringify(config));
			const changes: ChangeRecord[] = [];
			let reply = "";

			if (lower.includes("announcement") || lower.includes("banner")) {
				const before = newConfig.announcement.text;
				let after = "Special Announcement: Free Enterprise AI Strategy Audits Available Now";
				if (lower.includes("cohort")) {
					after = "Now Onboarding Q4 Enterprise AI Growth Cohorts — Call (216) 586-4607";
				} else if (lower.includes("voice") || lower.includes("hotline") || lower.includes("phone")) {
					after = "24/7 Voice OS Receptionist Live: Call (216) 586-4607 for Instant Intake";
				}
				newConfig.announcement.text = after;
				newConfig.announcement.enabled = true;
				changes.push({ field: "announcement.text", before, after });
				reply = `I have drafted an announcement bar update for you. Notice the changes in the diff card below.`;
			} else if (lower.includes("gold") || lower.includes("accent") || lower.includes("color")) {
				const before = newConfig.brandColors.accent;
				let after = "#c9a23f"; // Luxora Gold
				if (lower.includes("purple") || lower.includes("violet")) {
					after = "#a855f7";
				} else if (lower.includes("emerald") || lower.includes("green")) {
					after = "#10b981";
				} else if (lower.includes("amber")) {
					after = "#f59e0b";
				}
				newConfig.brandColors.accent = after;
				changes.push({ field: "brandColors.accent", before, after });
				reply = `I have adjusted the brand accent token. Color harmony meets the 60/30/10 rule.`;
			} else if (lower.includes("hero") || lower.includes("headline")) {
				const before = `${newConfig.hero.headlineTop} ${newConfig.hero.headlineAccent}`;
				let afterTop = "Dreams Don't Come True";
				let afterAcc = "Visions Do.";
				if (lower.includes("architect") || lower.includes("system")) {
					afterTop = "Architecting Sovereign";
					afterAcc = "Intelligence Engines.";
				} else if (lower.includes("growth") || lower.includes("scale")) {
					afterTop = "Engineering Predictable";
					afterAcc = "Enterprise Growth.";
				}
				newConfig.hero.headlineTop = afterTop;
				newConfig.hero.headlineAccent = afterAcc;
				changes.push({ field: "hero.headline", before, after: `${afterTop} ${afterAcc}` });
				reply = `I've refined the hero headline to maximize high-status positioning and clarity.`;
			} else if (lower.includes("subcopy") || lower.includes("warmer") || lower.includes("copy")) {
				const before = newConfig.hero.subcopy;
				const after =
					"From our sovereign CloudBrain to your bottom line: We build autonomous AI agent systems, generative search dominance (GEO), and high-converting web applications that turn ambition into reality.";
				newConfig.hero.subcopy = after;
				changes.push({ field: "hero.subcopy", before, after });
				reply = `I have updated the hero narrative with a warmer, more commanding tone.`;
			} else if (lower.includes("founder") || lower.includes("bio") || lower.includes("motto")) {
				const before = newConfig.heritage.quote;
				const after = "Visual resonance is the frequency of brand truth.";
				newConfig.heritage.quote = after;
				changes.push({ field: "heritage.quote", before, after });
				reply = `Updated founder philosophy and brand quote from Amara Aura's creative matrix.`;
			} else {
				// Default intelligent touch
				const before = newConfig.announcement.text;
				const after = `Priority Client Channel Active: Call (216) 586-4607 for Instant Intake`;
				newConfig.announcement.text = after;
				changes.push({ field: "announcement.text", before, after });
				reply = `I have interpreted your request ("${text}") and prepared an optimized operational adjustment:`;
			}

			const agentMsg: ChatMessage = {
				id: `agent-${Date.now()}`,
				sender: "agent",
				text: reply,
				changes,
				proposedConfig: newConfig,
			};

			setChatMessages((prev) => [...prev, agentMsg]);
			if (changes.length > 0) {
				setPendingProposal({ config: newConfig, changes });
			}
			setIsGenerating(false);
		}, 600);
	};

	const handleAcceptProposal = () => {
		if (!pendingProposal) return;
		setConfig(pendingProposal.config);
		localStorage.setItem("invisioned_agency_config", JSON.stringify(pendingProposal.config));
		setChatMessages((prev) => [
			...prev,
			{
				id: `agent-accepted-${Date.now()}`,
				sender: "agent",
				text: "✨ Changes accepted & published to the live agency storefront. The preview has been refreshed.",
			},
		]);
		setPendingProposal(null);
		setSaveNotification("Storefront updated and published successfully!");
		setTimeout(() => setSaveNotification(null), 3000);
	};

	const handleDiscardProposal = () => {
		setPendingProposal(null);
		setChatMessages((prev) => [
			...prev,
			{
				id: `agent-discarded-${Date.now()}`,
				sender: "agent",
				text: "Proposal discarded. Your active storefront configuration remains unchanged.",
			},
		]);
	};

	return (
		<div className="min-h-screen bg-[#07050e] text-white">
			{/* Top Executive App Bar */}
			<header className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0817]/90 backdrop-blur-xl px-4 py-3 sm:px-8">
				<div className="mx-auto flex max-w-7xl items-center justify-between">
					{/* Left Title & Status */}
					<div className="flex items-center gap-3">
						<Link
							href="/agency"
							className="rounded-xl border border-white/10 bg-white/5 p-2 text-[#c9a23f] hover:bg-white/10 transition-colors"
							title="Back to Agency Council"
						>
							<RotateCcw className="h-4 w-4" />
						</Link>
						<div>
							<div className="flex items-center gap-2">
								<span className="text-[10px] font-black uppercase tracking-widest text-[#c9a23f]">
									Sovereign Studio
								</span>
								<span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
									LIVE
								</span>
							</div>
							<h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
								<span>Invisioned Marketing</span>
								<span className="text-xs text-slate-400 font-mono hidden sm:inline">
									({config.agencyDomain})
								</span>
							</h1>
						</div>
					</div>

					{/* Center Navigation Tabs */}
					<div className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 text-xs">
						<button
							type="button"
							onClick={() => setActiveTab("overview")}
							className={`rounded-full px-3 py-1.5 font-bold transition-all ${
								activeTab === "overview"
									? "bg-[#c9a23f] text-black shadow-md shadow-[#c9a23f]/20"
									: "text-slate-400 hover:text-white"
							}`}
						>
							Client Ops
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("frontend")}
							className={`rounded-full px-3 py-1.5 font-bold transition-all ${
								activeTab === "frontend"
									? "bg-[#c9a23f] text-black shadow-md shadow-[#c9a23f]/20"
									: "text-slate-400 hover:text-white"
							}`}
						>
							Frontend Controls
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("assistant")}
							className={`rounded-full px-3 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
								activeTab === "assistant"
									? "bg-[#792cff] text-white shadow-md shadow-[#792cff]/20"
									: "text-slate-400 hover:text-white"
							}`}
						>
							<Sparkles className="h-3 w-3" />
							<span>AI Editor</span>
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("solutions")}
							className={`rounded-full px-3 py-1.5 font-bold transition-all ${
								activeTab === "solutions"
									? "bg-[#c9a23f] text-black shadow-md shadow-[#c9a23f]/20"
									: "text-slate-400 hover:text-white"
							}`}
						>
							Solutions Catalog
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("preview")}
							className={`rounded-full px-3 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
								activeTab === "preview"
									? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
									: "text-slate-400 hover:text-white"
							}`}
						>
							<Eye className="h-3 w-3" />
							<span>Split Preview</span>
						</button>
					</div>

					{/* Right Action Buttons */}
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={handleResetDefaults}
							className="rounded-xl border border-white/10 bg-white/5 p-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all hidden sm:flex items-center gap-1"
							title="Reset Defaults"
						>
							<RotateCcw className="h-3.5 w-3.5" />
							<span className="hidden lg:inline">Reset</span>
						</button>
						<button
							type="button"
							onClick={handleSaveConfig}
							className="rounded-xl bg-linear-to-r from-[#792cff] to-[#c9a23f] px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-[#792cff]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
						>
							<Save className="h-3.5 w-3.5" />
							<span>Save & Publish</span>
						</button>
					</div>
				</div>

				{/* Mobile Tab Strip */}
				<div className="flex md:hidden items-center justify-between gap-1 overflow-x-auto pt-3 border-t border-white/10 text-xs">
					{(["overview", "frontend", "assistant", "solutions", "preview"] as EditorTab[]).map(
						(tab) => (
							<button
								key={tab}
								type="button"
								onClick={() => setActiveTab(tab)}
								className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase whitespace-nowrap ${
									activeTab === tab
										? "bg-[#c9a23f] text-black"
										: "text-slate-400 hover:text-white"
								}`}
							>
								{tab}
							</button>
						)
					)}
				</div>
			</header>

			{/* Global Save Notification Toast */}
			<AnimatePresence>
				{saveNotification && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="fixed top-20 right-6 z-50 rounded-2xl border border-emerald-500/40 bg-emerald-950/90 p-4 text-xs font-bold text-emerald-200 shadow-2xl backdrop-blur-md flex items-center gap-2"
					>
						<CheckCircle2 className="h-4 w-4 text-emerald-400" />
						<span>{saveNotification}</span>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Main Workspace Body */}
			<main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
				{/* TAB 1: OVERVIEW & CLIENT OPS DASHBOARD */}
				{activeTab === "overview" && (
					<div className="space-y-8">
						{/* Top Banner Card */}
						<div className="rounded-3xl border border-white/15 bg-linear-to-b from-[#18112b] via-[#100b1d] to-[#090712] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
							<div className="absolute top-0 right-0 h-40 w-40 bg-linear-to-bl from-[#c9a23f]/15 to-transparent pointer-events-none rounded-bl-full" />
							<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
								<div>
									<div className="flex items-center gap-2 mb-2">
										<span className="rounded-full border border-[#c9a23f]/40 bg-[#c9a23f]/10 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#c9a23f]">
											Sovereign Agency Node
										</span>
										<span className="text-xs text-slate-400 font-mono">
											v10001.00-CYBERTRONIA
										</span>
									</div>
									<h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
										Client Operations Control Center
									</h2>
									<p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
										Directly configure Invisioned Marketing storefront parameters, verify backend
										workflow gates, audit WCAG/Z3 invariants, and dispatch live changes without
										touching low-level codebase files.
									</p>
								</div>
								<div className="flex flex-col gap-2 shrink-0">
									<a
										href="https://invisionedmarketing-bay.vercel.app"
										target="_blank"
										rel="noreferrer"
										className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:border-[#c9a23f] hover:text-[#c9a23f] transition-all flex items-center justify-between gap-2"
									>
										<span>View Live Production</span>
										<ExternalLink className="h-3.5 w-3.5" />
									</a>
									<button
										type="button"
										onClick={() => setActiveTab("assistant")}
										className="rounded-xl bg-linear-to-r from-[#792cff] to-[#c9a23f] px-4 py-2 text-xs font-bold text-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
									>
										<Sparkles className="h-3.5 w-3.5" />
										<span>Talk to AI Editor</span>
									</button>
								</div>
							</div>
						</div>

						{/* Status Cards Grid */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
							<div className="rounded-2xl border border-white/10 bg-[#120d20] p-4">
								<span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
									Storefront Domain
								</span>
								<span className="font-bold text-white truncate block">{config.agencyDomain}</span>
							</div>
							<div className="rounded-2xl border border-white/10 bg-[#120d20] p-4">
								<span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
									Direct Hotline
								</span>
								<span className="font-bold text-emerald-400 truncate block">
									{config.operator.phone}
								</span>
							</div>
							<div className="rounded-2xl border border-white/10 bg-[#120d20] p-4">
								<span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
									Midas Loop Lead Engine
								</span>
								<span className="font-bold text-[#c9a23f] truncate block">
									Active & Qualified (94/100)
								</span>
							</div>
							<div className="rounded-2xl border border-white/10 bg-[#120d20] p-4">
								<span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
									CloudBrain Root Tether
								</span>
								<span className="font-mono text-purple-300 truncate block">
									e6374819-50ce-41cf
								</span>
							</div>
						</div>

						{/* Two Column: Backend Workflows & Delivery Checklist */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Backend Workflows */}
							<div className="rounded-3xl border border-white/10 bg-[#100c1c] p-6">
								<div className="flex items-center justify-between mb-5 border-b border-white/10 pb-4">
									<h3 className="text-base font-bold text-white flex items-center gap-2">
										<Cpu className="h-4 w-4 text-[#c9a23f]" />
										<span>Backend Sovereign Workflows</span>
									</h3>
									<span className="text-[10px] font-mono text-emerald-400">5/5 OPERATIONAL</span>
								</div>
								<div className="space-y-3">
									{config.backendWorkflows.map((wf) => (
										<div
											key={wf.key}
											className="rounded-2xl border border-white/5 bg-black/40 p-3.5 flex items-start justify-between gap-3 text-xs"
										>
											<div>
												<span className="font-bold text-white block mb-0.5">{wf.label}</span>
												<span className="text-[11px] text-slate-400">{wf.nextAction}</span>
											</div>
											<span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
												{statusLabels[wf.status]}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Delivery Checklist */}
							<div className="rounded-3xl border border-white/10 bg-[#100c1c] p-6">
								<div className="flex items-center justify-between mb-5 border-b border-white/10 pb-4">
									<h3 className="text-base font-bold text-white flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-emerald-400" />
										<span>Delivery Quality Checklist</span>
									</h3>
									<span className="text-[10px] font-mono text-emerald-400">100% COMPLETE</span>
								</div>
								<div className="space-y-3">
									{config.deliveryChecklist.map((item) => (
										<div
											key={item.key}
											className="rounded-2xl border border-white/5 bg-black/40 p-3.5 flex items-center justify-between gap-3 text-xs"
										>
											<div className="flex items-center gap-2.5">
												<Check className="h-4 w-4 text-emerald-400 shrink-0" />
												<span className="font-medium text-slate-200">{item.label}</span>
											</div>
											<div className="flex items-center gap-2 shrink-0">
												<span className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold text-slate-400">
													{item.owner}
												</span>
												<span className="h-2 w-2 rounded-full bg-emerald-400" />
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* TAB 2: FRONTEND CONTROLS & THEME */}
				{activeTab === "frontend" && (
					<div className="space-y-8">
						<div className="rounded-3xl border border-white/10 bg-[#100c1c] p-6 sm:p-8 space-y-6">
							<h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
								<Sliders className="h-5 w-5 text-[#c9a23f]" />
								<span>Announcement Bar Controls</span>
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
								<div>
									<label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
										Announcement Status
									</label>
									<button
										type="button"
										onClick={() =>
											setConfig((prev) => ({
												...prev,
												announcement: {
													...prev.announcement,
													enabled: !prev.announcement.enabled,
												},
											}))
										}
										className={`w-full rounded-xl border p-3 font-bold transition-all text-left flex items-center justify-between ${
											config.announcement.enabled
												? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
												: "border-white/10 bg-black/40 text-slate-500"
										}`}
									>
										<span>
											{config.announcement.enabled
												? "Announcement Bar Enabled"
												: "Announcement Bar Hidden"}
										</span>
										<span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
									</button>
								</div>
								<div>
									<label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
										Badge Text
									</label>
									<input
										type="text"
										value={config.announcement.badge}
										onChange={(e) =>
											setConfig((prev) => ({
												...prev,
												announcement: { ...prev.announcement, badge: e.target.value },
											}))
										}
										className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-white outline-none focus:border-[#c9a23f]"
									/>
								</div>
								<div className="md:col-span-2">
									<label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
										Announcement Copy
									</label>
									<input
										type="text"
										value={config.announcement.text}
										onChange={(e) =>
											setConfig((prev) => ({
												...prev,
												announcement: { ...prev.announcement, text: e.target.value },
											}))
										}
										className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-white outline-none focus:border-[#c9a23f]"
									/>
								</div>
							</div>
						</div>

						{/* Hero Section Controls */}
						<div className="rounded-3xl border border-white/10 bg-[#100c1c] p-6 sm:p-8 space-y-6">
							<h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
								<Sparkles className="h-5 w-5 text-[#792cff]" />
								<span>Hero Offer & Typography</span>
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
								<div>
									<label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
										Headline Top
									</label>
									<input
										type="text"
										value={config.hero.headlineTop}
										onChange={(e) =>
											setConfig((prev) => ({
												...prev,
												hero: { ...prev.hero, headlineTop: e.target.value },
											}))
										}
										className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-white outline-none focus:border-[#c9a23f]"
									/>
								</div>
								<div>
									<label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
										Headline Accent (Gradient)
									</label>
									<input
										type="text"
										value={config.hero.headlineAccent}
										onChange={(e) =>
											setConfig((prev) => ({
												...prev,
												hero: { ...prev.hero, headlineAccent: e.target.value },
											}))
										}
										className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-white outline-none focus:border-[#c9a23f]"
									/>
								</div>
								<div className="md:col-span-2">
									<label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
										Hero Subcopy
									</label>
									<textarea
										rows={3}
										value={config.hero.subcopy}
										onChange={(e) =>
											setConfig((prev) => ({
												...prev,
												hero: { ...prev.hero, subcopy: e.target.value },
											}))
										}
										className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-white outline-none focus:border-[#c9a23f]"
									/>
								</div>
								<div>
									<label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
										Primary CTA Label
									</label>
									<input
										type="text"
										value={config.hero.primaryCta}
										onChange={(e) =>
											setConfig((prev) => ({
												...prev,
												hero: { ...prev.hero, primaryCta: e.target.value },
											}))
										}
										className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-white outline-none focus:border-[#c9a23f]"
									/>
								</div>
								<div>
									<label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
										Secondary CTA Label
									</label>
									<input
										type="text"
										value={config.hero.secondaryCta}
										onChange={(e) =>
											setConfig((prev) => ({
												...prev,
												hero: { ...prev.hero, secondaryCta: e.target.value },
											}))
										}
										className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-white outline-none focus:border-[#c9a23f]"
									/>
								</div>
							</div>
						</div>

						{/* Brand Chromatic Tokens */}
						<div className="rounded-3xl border border-white/10 bg-[#100c1c] p-6 sm:p-8 space-y-6">
							<h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
								<Palette className="h-5 w-5 text-[#c9a23f]" />
								<span>DTCG Chromatic Brand Tokens (60/30/10 Rule)</span>
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
								<div>
									<label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
										60% Primary (Obsidian)
									</label>
									<div className="flex items-center gap-2">
										<input
											type="color"
											value={config.brandColors.primary}
											onChange={(e) =>
												setConfig((prev) => ({
													...prev,
													brandColors: { ...prev.brandColors, primary: e.target.value },
												}))
											}
											className="h-10 w-10 cursor-pointer rounded-lg border border-white/20 bg-transparent p-0.5"
										/>
										<span className="font-mono text-slate-300">
											{config.brandColors.primary}
										</span>
									</div>
								</div>
								<div>
									<label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
										30% Accent (Luxora Gold)
									</label>
									<div className="flex items-center gap-2">
										<input
											type="color"
											value={config.brandColors.accent}
											onChange={(e) =>
												setConfig((prev) => ({
													...prev,
													brandColors: { ...prev.brandColors, accent: e.target.value },
												}))
											}
											className="h-10 w-10 cursor-pointer rounded-lg border border-white/20 bg-transparent p-0.5"
										/>
										<span className="font-mono text-slate-300">
											{config.brandColors.accent}
										</span>
									</div>
								</div>
								<div>
									<label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
										10% Secondary (Royal Purple)
									</label>
									<div className="flex items-center gap-2">
										<input
											type="color"
											value={config.brandColors.secondary}
											onChange={(e) =>
												setConfig((prev) => ({
													...prev,
													brandColors: { ...prev.brandColors, secondary: e.target.value },
												}))
											}
											className="h-10 w-10 cursor-pointer rounded-lg border border-white/20 bg-transparent p-0.5"
										/>
										<span className="font-mono text-slate-300">
											{config.brandColors.secondary}
										</span>
									</div>
								</div>
								<div>
									<label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
										Neutral Canvas
									</label>
									<div className="flex items-center gap-2">
										<input
											type="color"
											value={config.brandColors.neutral}
											onChange={(e) =>
												setConfig((prev) => ({
													...prev,
													brandColors: { ...prev.brandColors, neutral: e.target.value },
												}))
											}
											className="h-10 w-10 cursor-pointer rounded-lg border border-white/20 bg-transparent p-0.5"
										/>
										<span className="font-mono text-slate-300">
											{config.brandColors.neutral}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* TAB 3: CONVERSATIONAL AI THREAD CONTROL PAD */}
				{activeTab === "assistant" && (
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
						{/* Chat Stream Column */}
						<div className="lg:col-span-7 flex flex-col rounded-3xl border border-white/15 bg-linear-to-b from-[#150f24] to-[#090712] shadow-2xl h-[650px] overflow-hidden">
							{/* Chat Header */}
							<div className="border-b border-white/10 p-4 sm:p-5 flex items-center justify-between bg-black/40">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-xl border border-purple-500/30 bg-purple-500/20 text-purple-300">
										<Bot className="h-5 w-5" />
									</div>
									<div>
										<h3 className="text-sm font-bold text-white flex items-center gap-2">
											<span>Sir Helios & Merlin Omega</span>
											<span className="text-[10px] text-[#c9a23f] font-mono">
												[SAFE_MODE · ZOD_CONTAINED]
											</span>
										</h3>
										<p className="text-[11px] text-slate-400">
											Natural language storefront editor · Computes proposal diffs without arbitrary code execution
										</p>
									</div>
								</div>
								<span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
							</div>

							{/* Messages Log */}
							<div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
								{chatMessages.map((msg) => (
									<div
										key={msg.id}
										className={`flex flex-col ${
											msg.sender === "operator" ? "items-end" : "items-start"
										}`}
									>
										<div
											className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
												msg.sender === "operator"
													? "bg-linear-to-r from-[#792cff] to-[#5b1dc2] text-white font-medium"
													: "border border-white/10 bg-[#120d20] text-slate-200"
											}`}
										>
											<p>{msg.text}</p>
										</div>
									</div>
								))}

								{/* Diff Card Proposal */}
								{pendingProposal && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className="w-full rounded-2xl border border-[#c9a23f]/50 bg-linear-to-b from-[#1b122c] to-[#100a1d] p-5 shadow-2xl"
									>
										<div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
											<span className="text-[10px] font-black uppercase tracking-widest text-[#c9a23f]">
												⚡ Proposed Storefront Diff Card
											</span>
											<span className="text-[10px] font-mono text-purple-300">
												{pendingProposal.changes.length} change(s) detected
											</span>
										</div>

										<div className="space-y-2 mb-4">
											{pendingProposal.changes.map((c, i) => (
												<div
													key={i}
													className="rounded-xl border border-white/5 bg-black/50 p-3 text-[11px]"
												>
													<span className="font-mono text-[#c9a23f] block mb-1">
														{c.field}
													</span>
													<div className="grid grid-cols-2 gap-2 text-xs">
														<div className="text-red-400 font-mono line-through truncate">
															- {c.before}
														</div>
														<div className="text-emerald-400 font-mono truncate">
															+ {c.after}
														</div>
													</div>
												</div>
											))}
										</div>

										<div className="flex items-center gap-3">
											<button
												type="button"
												onClick={handleAcceptProposal}
												className="flex-1 rounded-xl bg-linear-to-r from-[#792cff] to-[#c9a23f] py-2 px-4 text-xs font-bold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
											>
												<Check className="h-3.5 w-3.5" />
												<span>Accept & Publish Live</span>
											</button>
											<button
												type="button"
												onClick={handleDiscardProposal}
												className="rounded-xl border border-white/15 bg-white/5 py-2 px-4 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
											>
												<X className="h-3.5 w-3.5" />
												<span>Discard</span>
											</button>
										</div>
									</motion.div>
								)}

								{isGenerating && (
									<div className="flex items-center gap-2 text-slate-400 italic">
										<Zap className="h-3.5 w-3.5 animate-spin text-[#c9a23f]" />
										<span>Sir Helios is computing verified Zod schema patch...</span>
									</div>
								)}
							</div>

							{/* Chat Input Bar */}
							<div className="border-t border-white/10 p-4 bg-black/60">
								{/* Quick Starters */}
								<div className="flex flex-wrap gap-1.5 mb-3">
									{[
										"Update announcement bar for Q4 AI Growth cohorts",
										"Make brand accent color Luxora Gold",
										"Highlight 24/7 Voice hotline (216) 586-4607",
										"Rewrite hero subcopy warmer",
									].map((starter) => (
										<button
											key={starter}
											type="button"
											onClick={() => handleSendAssistant(starter)}
											className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-slate-300 hover:border-[#c9a23f] hover:text-[#c9a23f] transition-all"
										>
											{starter}
										</button>
									))}
								</div>

								<div className="flex gap-2">
									<input
										type="text"
										value={chatInput}
										onChange={(e) => setChatInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") handleSendAssistant();
										}}
										placeholder="Tell Sir Helios what to change on your storefront..."
										className="flex-1 rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#792cff]"
									/>
									<button
										type="button"
										onClick={() => handleSendAssistant()}
										disabled={isGenerating}
										className="rounded-xl bg-linear-to-r from-[#792cff] to-[#c9a23f] px-5 py-2.5 text-xs font-bold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
									>
										<Send className="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>

						{/* Live Preview Sidecard */}
						<div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#100c1c] p-6 space-y-4">
							<div className="flex items-center justify-between border-b border-white/10 pb-3">
								<h3 className="text-sm font-bold text-white flex items-center gap-2">
									<Eye className="h-4 w-4 text-emerald-400" />
									<span>Instant Storefront Preview</span>
								</h3>
								<button
									type="button"
									onClick={() => setActiveTab("preview")}
									className="text-[11px] font-bold text-[#c9a23f] hover:underline"
								>
									Full View →
								</button>
							</div>

							{/* Mini Announcement Mockup */}
							{config.announcement.enabled && (
								<div className="rounded-xl border border-[#c9a23f]/30 bg-linear-to-r from-[#1b102e] to-[#0d0717] p-2 text-center text-[10px]">
									<span className="font-bold text-[#c9a23f] mr-1">
										[{config.announcement.badge}]
									</span>
									<span className="text-slate-200">{config.announcement.text}</span>
								</div>
							)}

							{/* Mini Hero Mockup */}
							<div className="rounded-2xl border border-white/10 bg-black/60 p-5 text-center space-y-2">
								<span className="inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[9px] font-bold text-purple-300">
									{config.hero.badge}
								</span>
								<h4 className="text-lg font-black text-white leading-tight">
									{config.hero.headlineTop}{" "}
									<span style={{ color: config.brandColors.accent }}>
										{config.hero.headlineAccent}
									</span>
								</h4>
								<p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
									{config.hero.subcopy}
								</p>
								<div className="pt-2 flex justify-center gap-2">
									<span
										className="rounded-lg px-3 py-1.5 text-[10px] font-bold text-white shadow-sm"
										style={{ backgroundColor: config.brandColors.accent, color: "#000" }}
									>
										{config.hero.primaryCta}
									</span>
									<span className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-300">
										{config.hero.secondaryCta}
									</span>
								</div>
							</div>

							{/* Mini Founder Heritage */}
							<div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-xs space-y-1.5">
								<span className="text-[10px] font-bold uppercase tracking-wider text-[#c9a23f]">
									Founder Statement
								</span>
								<p className="text-[11px] italic text-slate-300">
									&ldquo;{config.heritage.quote}&rdquo;
								</p>
								<span className="text-[10px] text-slate-500 block">
									— {config.operator.name} ({config.operator.title})
								</span>
							</div>
						</div>
					</div>
				)}

				{/* TAB 4: SOLUTIONS & SERVICE SLOTS */}
				{activeTab === "solutions" && (
					<div className="space-y-6">
						<div className="flex items-center justify-between border-b border-white/10 pb-4">
							<div>
								<h3 className="text-xl font-bold text-white">Agency Solutions Catalog</h3>
								<p className="text-xs text-slate-400">
									Configure individual offerings, SLAs, metrics, and feature checklists.
								</p>
							</div>
							<span className="text-xs font-mono text-[#c9a23f]">
								{config.solutions.length} Core Solutions Active
							</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{config.solutions.map((sol, index) => (
								<div
									key={sol.id}
									className="rounded-3xl border border-white/10 bg-[#100c1c] p-6 space-y-4"
								>
									<div className="flex items-center justify-between">
										<span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-[#c9a23f] uppercase">
											{sol.category}
										</span>
										<span className="text-xs text-emerald-400 font-bold">{sol.turnaround}</span>
									</div>

									<div>
										<input
											type="text"
											value={sol.title}
											onChange={(e) => {
												const updated = [...config.solutions];
												updated[index].title = e.target.value;
												setConfig((prev) => ({ ...prev, solutions: updated }));
											}}
											className="w-full text-base font-bold text-white bg-transparent border-b border-transparent focus:border-[#c9a23f] outline-none"
										/>
										<input
											type="text"
											value={sol.tagline}
											onChange={(e) => {
												const updated = [...config.solutions];
												updated[index].tagline = e.target.value;
												setConfig((prev) => ({ ...prev, solutions: updated }));
											}}
											className="w-full text-xs text-slate-400 bg-transparent border-b border-transparent focus:border-white/20 outline-none mt-1"
										/>
									</div>

									<div className="grid grid-cols-2 gap-2 text-xs">
										<div className="rounded-xl border border-white/10 bg-black/40 p-2.5">
											<span className="text-[10px] text-slate-500 block">Metric Label</span>
											<input
												type="text"
												value={sol.metric.label}
												onChange={(e) => {
													const updated = [...config.solutions];
													updated[index].metric.label = e.target.value;
													setConfig((prev) => ({ ...prev, solutions: updated }));
												}}
												className="w-full font-bold text-white bg-transparent outline-none"
											/>
										</div>
										<div className="rounded-xl border border-white/10 bg-black/40 p-2.5">
											<span className="text-[10px] text-slate-500 block">Metric Value</span>
											<input
												type="text"
												value={sol.metric.value}
												onChange={(e) => {
													const updated = [...config.solutions];
													updated[index].metric.value = e.target.value;
													setConfig((prev) => ({ ...prev, solutions: updated }));
												}}
												className="w-full font-bold text-emerald-400 bg-transparent outline-none"
											/>
										</div>
									</div>

									<div className="space-y-1.5 pt-2">
										<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
											Deliverable Features
										</span>
										{sol.features.map((feat, fIdx) => (
											<div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
												<CheckCircle2 className="h-3.5 w-3.5 text-[#c9a23f] shrink-0" />
												<span>{feat}</span>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* TAB 5: SPLIT PREVIEW */}
				{activeTab === "preview" && (
					<div className="space-y-8">
						<div className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-center justify-between text-xs">
							<div className="flex items-center gap-2 text-slate-300">
								<Eye className="h-4 w-4 text-emerald-400" />
								<span>
									Showing live full-page mockup of <strong>invisionedmarketing.agency</strong> based
									on LisaCustomKeychains.com structure.
								</span>
							</div>
							<button
								type="button"
								onClick={handleSaveConfig}
								className="rounded-xl bg-[#c9a23f] text-black px-4 py-1.5 font-bold hover:scale-105 transition-transform"
							>
								Save Current State
							</button>
						</div>

						{/* Mock Storefront Canvas */}
						<div className="rounded-3xl border border-white/20 bg-[#07050e] overflow-hidden shadow-2xl">
							{/* 1. Announcement Bar */}
							{config.announcement.enabled && (
								<div className="border-b border-[#c9a23f]/30 bg-linear-to-r from-[#090712] via-[#1a0e2e] to-[#090712] px-4 py-2.5 text-center text-xs text-white flex items-center justify-center gap-2">
									<span className="rounded-full border border-[#c9a23f]/40 bg-[#c9a23f]/15 px-2 py-0.5 text-[9px] font-extrabold uppercase text-[#c9a23f]">
										{config.announcement.badge}
									</span>
									<span className="font-medium text-slate-200">{config.announcement.text}</span>
									<span className="text-[#c9a23f] font-bold underline cursor-pointer">
										{config.announcement.linkText} →
									</span>
								</div>
							)}

							{/* 2. Hero Section */}
							<div className="py-20 px-6 sm:px-12 text-center max-w-4xl mx-auto space-y-6">
								<span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-widest text-purple-300">
									{config.hero.badge}
								</span>
								<h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
									{config.hero.headlineTop}{" "}
									<span style={{ color: config.brandColors.accent }}>
										{config.hero.headlineAccent}
									</span>
								</h1>
								<p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
									{config.hero.subcopy}
								</p>
								<div className="flex flex-wrap items-center justify-center gap-4 pt-2">
									<span
										className="rounded-xl px-6 py-3 text-sm font-bold shadow-lg"
										style={{ backgroundColor: config.brandColors.accent, color: "#000" }}
									>
										{config.hero.primaryCta}
									</span>
									<span className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white">
										{config.hero.secondaryCta}
									</span>
								</div>
							</div>

							{/* 3. Founder Heritage Section */}
							<div className="py-16 px-6 sm:px-12 border-t border-b border-white/10 bg-[#090712]">
								<div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
									<div className="md:col-span-5 rounded-2xl border border-[#c9a23f]/30 bg-[#120d20] p-6 text-center space-y-3">
										<div className="h-16 w-16 mx-auto rounded-2xl border-2 border-[#c9a23f] p-2 bg-black flex items-center justify-center">
											<span className="text-xl font-black text-[#c9a23f]">IM</span>
										</div>
										<h4 className="text-lg font-bold text-white">{config.operator.name}</h4>
										<span className="text-xs text-[#c9a23f] block">
											{config.operator.title}
										</span>
										<p className="text-[11px] text-slate-400 italic">
											&ldquo;{config.heritage.quote}&rdquo;
										</p>
									</div>
									<div className="md:col-span-7 space-y-4 text-xs text-slate-300 leading-relaxed">
										<h3 className="text-xl font-bold text-white">
											{config.heritage.headline} {config.heritage.subheadline}
										</h3>
										<p>{config.heritage.narrativeParagraph1}</p>
										<p>{config.heritage.narrativeParagraph2}</p>
									</div>
								</div>
							</div>

							{/* 4. Solutions Catalog Grid */}
							<div className="py-16 px-6 sm:px-12">
								<div className="text-center max-w-2xl mx-auto mb-10">
									<h3 className="text-2xl font-bold text-white">Featured Agency Solutions</h3>
									<p className="text-xs text-slate-400 mt-1">
										Custom-compiled execution pipelines with verified attribution.
									</p>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
									{config.solutions.map((s) => (
										<div
											key={s.id}
											className="rounded-2xl border border-white/10 bg-[#120d20] p-5 space-y-3 text-xs"
										>
											<div className="flex justify-between items-center">
												<span className="text-[10px] font-bold text-[#c9a23f]">
													{s.category}
												</span>
												<span className="text-[10px] text-emerald-400 font-bold">
													{s.turnaround}
												</span>
											</div>
											<h4 className="font-bold text-white text-sm">{s.title}</h4>
											<div className="rounded-xl bg-black/40 p-2 flex justify-between">
												<span className="text-slate-500">{s.metric.label}</span>
												<span className="font-bold text-emerald-400">{s.metric.value}</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
