"use client";

import { motion } from "framer-motion";
import {
	ArrowUpRight,
	Bot,
	Check,
	Copy,
	Globe,
	Mail,
	MessageSquare,
	Phone,
	QrCode,
	Share2,
	Sparkles,
	UserCheck,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function DigitalBusinessCard() {
	const [activePersona, setActivePersona] = useState<"vizion" | "strategist" | "builder">("vizion");
	const [copied, setCopied] = useState<string | null>(null);
	const [showQr, setShowQr] = useState(false);
	const [webGpuAvailable, setWebGpuAvailable] = useState<boolean | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const personas = {
		vizion: {
			kicker: "VIZION · CREATIVE FORCE",
			role: "Founder & Creative Technologist",
			summary: "Turning high-altitude visions into governed AI agent ecosystems, luxury brand worlds, and high-velocity digital systems.",
			badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
		},
		strategist: {
			kicker: "STRATEGIST · SYSTEMS",
			role: "Growth & Architecture Lead",
			summary: "Architecting revenue engines, SEO/GEO pipelines, client onboarding automation, and bespoke marketing infrastructure.",
			badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
		},
		builder: {
			kicker: "BUILDER · AI AGENTS",
			role: "Sovereign AI Practitioner",
			summary: "Deploying local WebLLM, WebGPU tensor accelerators, and MCP orchestration bridges for zero-latency execution.",
			badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
		},
	};

	const contactInfo = {
		name: 'VaShawn "Vizion" Head',
		title: "Founder & Creative Technologist",
		company: "Invisioned Marketing",
		phone: "216-586-4607",
		phoneRaw: "+12165864607",
		email: "invisionedmarketing@gmail.com",
		website: "https://invisionedmarketing.agency",
		cardUrl: "https://invisionedmarketing.agency/card",
	};

	// Proactive WebGPU Probe
	useEffect(() => {
		let isMounted = true;
		if (typeof navigator !== "undefined" && "gpu" in navigator) {
			(navigator as any).gpu
				.requestAdapter()
				.then((adapter: any) => {
					if (isMounted) setWebGpuAvailable(!!adapter);
				})
				.catch(() => {
					if (isMounted) setWebGpuAvailable(false);
				});
		} else {
			setWebGpuAvailable(false);
		}
		return () => {
			isMounted = false;
		};
	}, []);

	// Client-side vCard Download
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

	// Native Web Share API
	const handleNativeShare = async () => {
		if (typeof navigator !== "undefined" && navigator.share) {
			try {
				await navigator.share({
					title: `${contactInfo.name} | ${contactInfo.company}`,
					text: `Connect with ${contactInfo.name} — ${contactInfo.title} at ${contactInfo.company}.`,
					url: contactInfo.cardUrl,
				});
			} catch {
				// User dismissed or share not supported
			}
		} else {
			copyToClipboard(contactInfo.cardUrl, "cardUrl");
		}
	};

	const copyToClipboard = (text: string, key: string) => {
		navigator.clipboard.writeText(text);
		setCopied(key);
		setTimeout(() => setCopied(null), 2000);
	};

	return (
		<div className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-between px-4 py-8 font-sans">
			{/* Ambient Neural Backlight */}
			<div className="pointer-events-none fixed inset-0 z-0">
				<div className="absolute left-1/2 top-10 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-radial from-[#a855f7]/25 via-[#6d28d9]/10 to-transparent blur-[90px]" />
				<div className="absolute bottom-10 right-0 h-[260px] w-[260px] rounded-full bg-radial from-[#f6c85f]/15 to-transparent blur-[80px]" />
			</div>

			<div className="relative z-10 space-y-6">
				{/* Top Bar with Brand & Telemetry */}
				<header className="flex items-center justify-between border-b border-white/10 pb-4">
					<Link href="/" className="flex items-center gap-2.5">
						<div className="relative h-9 w-9 overflow-hidden rounded-xl border border-[#f6c85f]/40 bg-linear-to-br from-[#f6c85f] to-[#ffe9a3] p-1 shadow-[0_0_20px_rgba(246,200,95,0.25)]">
							<Image
								src="/images/logo.webp"
								alt="Invisioned Logo"
								fill
								className="object-contain p-0.5"
								priority
							/>
						</div>
						<div>
							<span className="block text-xs font-black tracking-widest text-[#f6c85f]">
								INVISIONED MARKETING
							</span>
							<span className="block text-[9px] font-bold tracking-widest text-slate-400">
								DIGITAL BUSINESS CARD
							</span>
						</div>
					</Link>

					<div className="flex items-center gap-2">
						{/* Hardware Acceleration Beacon */}
						<span
							title={
								webGpuAvailable === true
									? "WebGPU Hardware Accelerator Active"
									: webGpuAvailable === false
										? "WebGPU Fallback Mode"
										: "Probing WebGPU..."
							}
							className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
								webGpuAvailable
									? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
									: "border-slate-700 bg-slate-900 text-slate-400"
							}`}
						>
							<span
								className={`h-1.5 w-1.5 rounded-full ${
									webGpuAvailable ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
								}`}
							/>
							{webGpuAvailable ? "WebGPU" : "WebAI"}
						</span>

						<button
							type="button"
							onClick={handleNativeShare}
							aria-label="Share card"
							className="rounded-full border border-white/15 bg-white/5 p-2 text-slate-300 transition-colors hover:border-[#f6c85f] hover:text-[#f6c85f]"
						>
							<Share2 className="h-4 w-4" />
						</button>
					</div>
				</header>

				{/* Executive Hero Frame */}
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="relative overflow-hidden rounded-3xl border border-white/15 bg-linear-to-b from-[#1a1426]/90 to-[#0e0a16]/95 p-6 shadow-2xl backdrop-blur-xl"
				>
					{/* Gold Corner Accent */}
					<div className="absolute right-0 top-0 h-24 w-24 bg-linear-to-bl from-[#f6c85f]/15 to-transparent pointer-events-none" />

					<div className="flex flex-col items-center text-center">
						{/* Portrait Frame */}
						<div className="relative mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-[#f6c85f] bg-[#171020] p-1.5 shadow-[0_0_35px_rgba(168,85,247,0.35)]">
							<div className="relative h-full w-full overflow-hidden rounded-full bg-slate-950">
								<Image
									src="/images/logo.webp"
									alt={contactInfo.name}
									fill
									className="object-cover p-2"
									priority
								/>
							</div>
						</div>

						{/* Identity & Persona */}
						<span
							className={`mb-1.5 rounded-full border px-3 py-0.5 text-[10px] font-black tracking-widest uppercase ${personas[activePersona].badge}`}
						>
							{personas[activePersona].kicker}
						</span>

						<h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
							{contactInfo.name}
						</h1>

						<p className="mt-1 text-sm font-semibold text-[#f6c85f]">
							{personas[activePersona].role}
						</p>

						<p className="mt-2 text-xs text-slate-300 leading-relaxed max-w-sm">
							{personas[activePersona].summary}
						</p>

						{/* Persona Switcher Buttons */}
						<div className="mt-4 flex gap-1.5 rounded-full border border-white/10 bg-black/40 p-1">
							{(["vizion", "strategist", "builder"] as const).map((key) => (
								<button
									key={key}
									type="button"
									onClick={() => setActivePersona(key)}
									className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
										activePersona === key
											? "bg-linear-to-r from-[#f6c85f] to-[#ffe9a3] text-black shadow-md"
											: "text-slate-400 hover:text-white"
									}`}
								>
									{key}
								</button>
							))}
						</div>
					</div>

					{/* Primary 1-Tap Save Action */}
					<div className="mt-6">
						<button
							type="button"
							onClick={handleSaveContact}
							className="group relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-[#f6c85f] via-[#ffe9a3] to-[#f6c85f] py-3.5 text-sm font-black uppercase tracking-wider text-black shadow-[0_10px_30px_rgba(246,200,95,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
						>
							<UserCheck className="h-4 w-4" />
							<span>Save Contact To Phone (.vcf)</span>
						</button>
					</div>

					{/* Instant Action Grid (Call, SMS, Email, QR) */}
					<div className="mt-3 grid grid-cols-4 gap-2">
						{/* Call */}
						<a
							href={`tel:${contactInfo.phoneRaw}`}
							className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-slate-200 transition-colors hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-300"
							aria-label="Call phone"
						>
							<Phone className="h-4 w-4" />
							<span className="text-[10px] font-bold">Call</span>
						</a>

						{/* SMS */}
						<a
							href={`sms:${contactInfo.phoneRaw}?body=Hi%20VaShawn,%20I'm%20reaching%20out%20from%20your%20digital%20card.`}
							className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-slate-200 transition-colors hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-300"
							aria-label="Send SMS text"
						>
							<MessageSquare className="h-4 w-4" />
							<span className="text-[10px] font-bold">Text</span>
						</a>

						{/* Email */}
						<a
							href={`mailto:${contactInfo.email}?subject=Project%20Inquiry%20via%20Digital%20Card`}
							className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-slate-200 transition-colors hover:border-purple-500 hover:bg-purple-500/10 hover:text-purple-300"
							aria-label="Send Email"
						>
							<Mail className="h-4 w-4" />
							<span className="text-[10px] font-bold">Email</span>
						</a>

						{/* QR Code */}
						<button
							type="button"
							onClick={() => setShowQr(!showQr)}
							className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-slate-200 transition-colors hover:border-[#f6c85f] hover:bg-[#f6c85f]/10 hover:text-[#f6c85f]"
							aria-label="Display QR Code"
						>
							<QrCode className="h-4 w-4" />
							<span className="text-[10px] font-bold">QR Code</span>
						</button>
					</div>

					{/* Expandable On-Screen QR Code Modal */}
					{showQr && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="mt-4 flex flex-col items-center rounded-2xl border border-[#f6c85f]/30 bg-black/80 p-5 text-center backdrop-blur-md"
						>
							<span className="mb-2 text-[10px] font-bold tracking-widest text-[#f6c85f] uppercase">
								Scan To Save Or Open Card
							</span>
							<div className="relative h-44 w-44 rounded-xl border border-white/20 bg-white p-2">
								<img
									src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
										contactInfo.cardUrl,
									)}&color=09070f`}
									alt="QR Code"
									className="h-full w-full object-contain"
								/>
							</div>
							<span className="mt-3 text-[11px] text-slate-400">
								https://invisionedmarketing.agency/card
							</span>
						</motion.div>
					)}
				</motion.div>

				{/* High-Velocity Contact Data Blocks */}
				<div className="space-y-2">
					{/* Phone Row */}
					<div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-colors hover:border-white/20">
						<div className="flex items-center gap-3">
							<div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
								<Phone className="h-4 w-4" />
							</div>
							<div>
								<span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
									Direct Line / Text
								</span>
								<a
									href={`tel:${contactInfo.phoneRaw}`}
									className="text-sm font-bold text-white hover:text-emerald-400"
								>
									{contactInfo.phone}
								</a>
							</div>
						</div>
						<button
							type="button"
							onClick={() => copyToClipboard(contactInfo.phone, "phone")}
							className="rounded-lg p-2 text-slate-400 hover:text-white"
							aria-label="Copy phone"
						>
							{copied === "phone" ? (
								<Check className="h-4 w-4 text-emerald-400" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</button>
					</div>

					{/* Email Row */}
					<div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-colors hover:border-white/20">
						<div className="flex items-center gap-3">
							<div className="rounded-xl bg-purple-500/10 p-2 text-purple-400">
								<Mail className="h-4 w-4" />
							</div>
							<div>
								<span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
									Direct Email
								</span>
								<a
									href={`mailto:${contactInfo.email}`}
									className="text-xs font-bold text-white hover:text-purple-400 sm:text-sm"
								>
									{contactInfo.email}
								</a>
							</div>
						</div>
						<button
							type="button"
							onClick={() => copyToClipboard(contactInfo.email, "email")}
							className="rounded-lg p-2 text-slate-400 hover:text-white"
							aria-label="Copy email"
						>
							{copied === "email" ? (
								<Check className="h-4 w-4 text-emerald-400" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</button>
					</div>

					{/* Agency Web Portal */}
					<Link
						href="/"
						className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-colors hover:border-[#f6c85f]/40 hover:bg-[#f6c85f]/5"
					>
						<div className="flex items-center gap-3">
							<div className="rounded-xl bg-[#f6c85f]/10 p-2 text-[#f6c85f]">
								<Globe className="h-4 w-4" />
							</div>
							<div>
								<span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
									Full Agency Portal
								</span>
								<span className="text-xs font-bold text-white sm:text-sm">
									invisionedmarketing.agency
								</span>
							</div>
						</div>
						<ArrowUpRight className="h-4 w-4 text-[#f6c85f]" />
					</Link>

					{/* A.I. Architect Living Typographic Orbit Link */}
					<Link
						href="/architect"
						className="flex items-center justify-between rounded-2xl border border-[#792cff]/40 bg-linear-to-r from-[#170e28] to-[#0c0817] p-3.5 transition-all hover:border-[#c9a23f]/60 hover:bg-[#792cff]/10"
					>
						<div className="flex items-center gap-3">
							<div className="rounded-xl bg-[#792cff]/20 p-2 text-[#792cff]">
								<Sparkles className="h-4 w-4" />
							</div>
							<div>
								<span className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a23f]">
									Living Typographic Orbit
								</span>
								<span className="text-xs font-bold text-white sm:text-sm">
									The A.I. Architect Showcase ↗
								</span>
							</div>
						</div>
						<ArrowUpRight className="h-4 w-4 text-[#792cff]" />
					</Link>
				</div>

				{/* Sovereign Agency Capabilities Capsule */}
				<div className="rounded-2xl border border-white/10 bg-[#120e1c] p-4">
					<span className="block text-[10px] font-bold uppercase tracking-widest text-[#f6c85f]">
						Core Capabilities
					</span>
					<div className="mt-2.5 flex flex-wrap gap-1.5">
						{[
							"AI Agents & Automation",
							"Brand Strategy & Identity",
							"High-Converting Websites",
							"SEO & GEO Authority",
							"Voice & Multimodal Systems",
							"Creative Production",
						].map((item) => (
							<span
								key={item}
								className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-300"
							>
								{item}
							</span>
						))}
					</div>
				</div>

				{/* Booking CTA Capsule */}
				<Link
					href="/contact"
					className="flex items-center justify-between rounded-2xl border border-[#a855f7]/40 bg-linear-to-r from-[#211735] to-[#140e22] p-4 shadow-lg transition-all hover:border-[#a855f7] hover:scale-[1.01]"
				>
					<div className="flex items-center gap-3">
						<div className="rounded-xl bg-[#a855f7]/20 p-2 text-[#a855f7]">
							<Sparkles className="h-4 w-4" />
						</div>
						<div>
							<h3 className="text-xs font-bold uppercase tracking-wider text-white">
								Book An AI Strategy Audit
							</h3>
							<p className="text-[11px] text-slate-300">
								Let's turn your vision into an automated system.
							</p>
						</div>
					</div>
					<ArrowUpRight className="h-4 w-4 text-[#f6c85f]" />
				</Link>
			</div>

			{/* Footer */}
			<footer className="relative z-10 mt-8 border-t border-white/10 pt-4 text-center">
				<p className="text-[11px] text-slate-400">
					© {new Date().getFullYear()} Invisioned Marketing.{" "}
					<span className="text-[#f6c85f]">“Dreams don't come true, visions do.”</span>
				</p>
			</footer>
		</div>
	);
}
