"use client";

import { motion } from "framer-motion";
import { Mic, Play, Search, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NeuralCard } from "@/components/ui/neural-interface";
import { tokens } from "@/lib/utils";

const MotionLink = motion(Link);

export default function InvisionedHero() {
	const [url, setUrl] = useState("");
	const [status, setStatus] = useState<"idle" | "thinking" | "done" | "error">("idle");
	const router = useRouter();

	const handleAudit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!url) return;
		setStatus("thinking");

		try {
			const res = await fetch("/api/v1/audit/seo-geo", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ target_url: url, deep_scan: false }),
			});
			if (!res.ok) throw new Error("Audit failed");
			setStatus("done");
			setTimeout(() => router.push(`/audit?url=${encodeURIComponent(url)}`), 1500);
		} catch {
			setStatus("error");
			setTimeout(() => setStatus("idle"), 3000);
		}
	};

	return (
		<section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
			{/* VIDEO BG - High Contrast Noir */}
			<div className="absolute inset-0 z-0">
				<video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-30 grayscale contrast-150 brightness-50">
					<source src="/video/skyline-motion.mp4" type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
			</div>

			{/* CONTENT */}
			<motion.div
				initial="hidden"
				animate="visible"
				variants={tokens.animation.stagger(0.15)}
				className="relative z-10 flex flex-col items-center px-6 text-center max-w-5xl"
			>
				<motion.div
					variants={{
						hidden: { opacity: 0, scale: 0.8 },
						visible: { opacity: 1, scale: 1, transition: tokens.animation.spring }
					}}
					className="mb-8 rounded-full border border-white/10 bg-white/5 px-6 py-2 backdrop-blur-md"
				>
					<span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-primary">
						Initiate // Project Crusade v700
					</span>
				</motion.div>

				<motion.h1 
					variants={{
						hidden: { opacity: 0, y: 30 },
						visible: { opacity: 1, y: 0, transition: tokens.animation.spring }
					}}
					className="text-7xl font-extrabold tracking-tighter text-white md:text-9xl lg:text-[10rem] leading-[0.8]"
				>
					<span className="block font-serif text-5xl font-normal italic lowercase text-secondary md:text-7xl lg:text-8xl mb-[-0.1em] relative z-10">
						invisioned
					</span>
					<span className="uppercase block text-zinc-200">MARKETING</span>
				</motion.h1>

				<motion.p 
					variants={{
						hidden: { opacity: 0 },
						visible: { opacity: 1, transition: { delay: 0.5 } }
					}}
					className="mt-12 max-w-2xl text-xl font-medium text-zinc-400 md:text-3xl tracking-tight leading-snug"
				>
					Turning <span className="text-white font-bold">Dreamers</span> into <span className="text-primary italic">Visionaries.</span>
				</motion.p>

				{/* LIGHTNING AUDIT INTAKE */}
				<motion.div 
					variants={{
						hidden: { opacity: 0, y: 40 },
						visible: { opacity: 1, y: 0, transition: { ...tokens.animation.spring, delay: 0.6 } }
					}}
					className="mt-16 w-full max-w-2xl"
				>
					<NeuralCard variant="premium" className="p-2">
						<form onSubmit={handleAudit} className="flex flex-col gap-3 p-3 sm:flex-row">
							<div className="relative flex-1">
								<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
								<input
									type="url"
									placeholder="https://your-domain.com"
									required
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									className="w-full rounded-2xl border-none bg-black/40 py-4 pl-12 pr-6 text-sm font-mono text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-primary/50 transition-all"
								/>
							</div>
							<button
								type="submit"
								disabled={status === "thinking"}
								className="group relative flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-black text-black transition-all hover:bg-primary hover:text-white disabled:opacity-50 overflow-hidden"
							>
								{status === "thinking" ? (
									<div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
								) : (
									<Zap className="h-5 w-5 fill-current" />
								)}
								<span className="relative z-10 font-bold">{status === "thinking" ? "ANALYZING..." : "FREE GEO AUDIT"}</span>
							</button>
						</form>
						{status === "done" && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								className="px-6 pb-4 text-left border-t border-white/5 mt-2 pt-4"
							>
								<div className="flex items-center gap-3">
									<div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
									<p className="font-mono text-[10px] uppercase tracking-widest text-accent">
										Audit Complete // Shadow Trace Successful
									</p>
								</div>
								<p className="text-xs text-zinc-500 mt-1 pl-5">Routing to results...</p>
							</motion.div>
						)}
						{status === "error" && (
							<div className="px-6 pb-4 text-left border-t border-white/5 mt-2 pt-4">
								<p className="font-mono text-[10px] uppercase tracking-widest text-red-500">
									⚠ Pipeline Fault // Retrying...
								</p>
							</div>
						)}

						{/* LYRIA 3 — AI Receptionist Surface */}
						<div className="flex items-center justify-center gap-2 border-t border-white/5 px-4 py-3">
							<Mic className="h-3 w-3 text-zinc-600" />
							<Link
								href="/tasha"
								className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-primary"
							>
								or speak with Tasha // AI Receptionist →
							</Link>
						</div>
					</NeuralCard>
				</motion.div>

				<motion.div 
					variants={{
						hidden: { opacity: 0 },
						visible: { opacity: 1, transition: { delay: 1 } }
					}}
					className="mt-20 flex flex-col items-center gap-8 md:flex-row"
				>
					<MotionLink
						href="/onboarding"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="group flex items-center gap-4 rounded-full bg-primary px-10 py-5 text-lg font-bold text-white transition-all hover:bg-primary/80 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
					>
						<Play className="h-5 w-5 fill-current" />
						INITIATE PROJECT
					</MotionLink>
					<div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
						<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
						{"System Live // 2026"}
					</div>
				</motion.div>
			</motion.div>

			{/* AMBIENT MESH */}
			<div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] bg-primary/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
			<div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
		</section>
	);
}
