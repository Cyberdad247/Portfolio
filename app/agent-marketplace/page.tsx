"use client";

import { motion } from "framer-motion";
import {
	ChevronRight,
	Crown,
	Swords,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { QrDispatchModal } from "@/components/marketplace/qr-dispatch-modal";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import {
	CATEGORY_LABELS,
	KNIGHTS,
	STATUS_DOT,
	TIER_COLORS,
	TIER_LABELS,
	type Knight,
	type KnightCategory,
} from "@/config/knights.config";

const CATEGORIES: KnightCategory[] = [
	"all",
	"voice",
	"research",
	"growth",
	"strategy",
	"security",
];


function KnightCard({ knight, index }: { knight: Knight; index: number }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
			className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
		>
			{/* Accent glow on hover */}
			<div
				className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-15"
				style={{ backgroundColor: knight.accentVar }}
			/>

			{/* Header row */}
			<div className="mb-5 flex items-start justify-between">
				<div
					className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
					style={{ backgroundColor: `${knight.accentVar}18` }}
				>
					<knight.icon
						className="h-6 w-6"
						style={{ color: knight.accentVar }}
					/>
				</div>
				<span
					className={`rounded-md border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${TIER_COLORS[knight.tier]}`}
				>
					{TIER_LABELS[knight.tier]}
				</span>
			</div>

			{/* Designation + name */}
			<p className="mb-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
				{knight.designation}
			</p>
			<h3 className="mb-1 text-xl font-bold text-foreground">{knight.name}</h3>
			<p className="mb-4 text-sm font-medium text-primary">{knight.title}</p>

			{/* Description */}
			<p className="mb-5 text-sm text-muted-foreground leading-relaxed line-clamp-3">
				{knight.description}
			</p>

			{/* Capabilities */}
			<ul className="mb-5 space-y-1.5">
				{knight.capabilities.map((cap) => (
					<li key={cap} className="flex items-start gap-2 text-xs text-muted-foreground">
						<ChevronRight
							className="mt-0.5 h-3 w-3 shrink-0"
							style={{ color: knight.accentVar }}
						/>
						{cap}
					</li>
				))}
			</ul>

			{/* Metric */}
			<div className="mb-5 rounded-xl border border-border bg-background/50 px-4 py-3">
				<p className="font-mono text-[10px] text-muted-foreground mb-0.5">
					{knight.metric.label}
				</p>
				<p className="text-lg font-bold text-foreground">{knight.metric.value}</p>
			</div>

			{/* Status */}
			<div className="mb-5 flex items-center gap-2">
				<span className={`h-2 w-2 rounded-full ${STATUS_DOT[knight.status]}`} />
				<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
					{knight.status}
				</span>
			</div>

			{/* CTAs */}
			<div className="mt-auto flex flex-col gap-2">
				<Link
					href={knight.id === "T-01" ? "/onboarding" : "/#contact"}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
				>
					<Zap className="h-4 w-4" />
					Deploy Knight
				</Link>
				<QrDispatchModal knight={knight} />
			</div>
		</motion.div>
	);
}

function FeaturedKnightCard({ knight }: { knight: Knight }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.55, ease: "easeOut" }}
			className="group relative col-span-full rounded-2xl border border-primary/30 bg-card p-8 backdrop-blur-md overflow-hidden"
		>
			{/* Background glow */}
			<div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/5 blur-3xl" />

			<div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center">
				{/* Left: Identity */}
				<div className="flex-1">
					<div className="mb-4 flex items-center gap-3">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
							<knight.icon className="h-8 w-8 text-primary" />
						</div>
						<div>
							<div className="flex items-center gap-2 mb-1">
								<Crown className="h-3.5 w-3.5 text-secondary" />
								<span className="font-mono text-[10px] font-bold uppercase tracking-widest text-secondary">
									Featured Knight
								</span>
							</div>
							<p className="font-mono text-xs text-muted-foreground">{knight.designation}</p>
						</div>
					</div>

					<h2 className="mb-1 text-3xl font-bold text-foreground md:text-4xl">
						{knight.name}
					</h2>
					<p className="mb-4 text-lg font-medium text-primary">{knight.title}</p>
					<p className="mb-6 max-w-xl text-muted-foreground leading-relaxed">
						{knight.description}
					</p>

					<ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
						{knight.capabilities.map((cap) => (
							<li key={cap} className="flex items-start gap-2 text-sm text-muted-foreground">
								<ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
								{cap}
							</li>
						))}
					</ul>
				</div>

				{/* Right: Stats + CTAs */}
				<div className="flex flex-col gap-4 md:w-64">
					{/* Live metric */}
					<div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
						<div className="mb-1 flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
							<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
								Live
							</span>
						</div>
						<p className="font-mono text-[11px] text-muted-foreground mb-1">
							{knight.metric.label}
						</p>
						<p className="text-3xl font-bold text-foreground">{knight.metric.value}</p>
					</div>

					{/* Tier badge */}
					<div className={`rounded-xl border px-4 py-2.5 text-center font-mono text-[11px] font-bold uppercase tracking-widest ${TIER_COLORS[knight.tier]}`}>
						{TIER_LABELS[knight.tier]} Tier
					</div>

					{/* CTAs */}
					<Link
						href="/onboarding"
						className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
					>
						<Zap className="h-4 w-4" />
						Speak with Tasha
					</Link>
					<QrDispatchModal knight={knight} />
				</div>
			</div>
		</motion.div>
	);
}

export default function MarketplacePage() {
	const [activeCategory, setActiveCategory] = useState<KnightCategory>("all");

	const featured = KNIGHTS.find((k) => k.featured);
	const grid = KNIGHTS.filter(
		(k) =>
			!k.featured &&
			(activeCategory === "all" || k.category === activeCategory),
	);

	const totalActive = KNIGHTS.filter((k) => k.status === "active").length;

	return (
		<main className="relative min-h-screen bg-background pt-32 pb-32 px-4 md:px-8 overflow-hidden">
			<AmbientGlow color="bg-primary/10" position="top-right" />
			<AmbientGlow color="bg-secondary/5" position="bottom-left" />

			<div className="relative z-10 mx-auto max-w-7xl">
				{/* ── Page Header ── */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.55 }}
					className="mb-16 text-center"
				>
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
						<Swords className="h-3 w-3" />
						<span>Camelot-OS · Knight Fleet</span>
					</div>

					<h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
						Knights{" "}
						<span className="text-primary">for Hire</span>
					</h1>
					<p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
						Deploy specialized AI agents to automate your marketing stack.
						Each Knight is a sovereign intelligence — trained, tested, and ready
						to operate on your behalf.
					</p>

					{/* Stats bar */}
					<div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-6 text-center">
						{[
							{ label: "Active Knights", value: `${totalActive}` },
							{ label: "Tasks Processed", value: "24,590+" },
							{ label: "Uptime", value: "99.9%" },
							{ label: "Security Grade", value: "Sovereign" },
						].map((stat) => (
							<div key={stat.label} className="flex flex-col items-center">
								<span className="text-xl font-bold text-foreground">{stat.value}</span>
								<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
									{stat.label}
								</span>
							</div>
						))}
					</div>
				</motion.div>

				{/* ── Featured Knight ── */}
				{featured && (
					<div className="mb-8 grid grid-cols-1">
						<FeaturedKnightCard knight={featured} />
					</div>
				)}

				{/* ── Category Filter ── */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.15 }}
					className="mb-8 flex flex-wrap items-center gap-2"
				>
					{CATEGORIES.map((cat) => (
						<button
							key={cat}
							type="button"
							onClick={() => setActiveCategory(cat)}
							className={`rounded-full border px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
								activeCategory === cat
									? "border-primary bg-primary/10 text-primary"
									: "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
							}`}
						>
							{CATEGORY_LABELS[cat]}
						</button>
					))}
				</motion.div>

				{/* ── Knight Grid ── */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{grid.map((knight: Knight, i: number) => (
						<KnightCard key={knight.id} knight={knight} index={i} />
					))}
				</div>

				{/* ── Custom Knight CTA ── */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="mt-16 rounded-2xl border border-border bg-card p-8 text-center relative overflow-hidden"
				>
					<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
					<div className="relative z-10">
						<div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
							<Crown className="h-7 w-7 text-primary" />
						</div>
						<h3 className="mb-3 text-2xl font-bold text-foreground">
							Need a Custom Knight?
						</h3>
						<p className="mx-auto mb-6 max-w-lg text-muted-foreground">
							Every operation is different. If none of our standard Knights
							fit your mission, we forge custom agents built precisely for
							your workflow, data sources, and goals.
						</p>
						<Link
							href="/onboarding"
							className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
						>
							<Swords className="h-4 w-4" />
							Commission a Knight
							<ChevronRight className="h-4 w-4" />
						</Link>
					</div>
				</motion.div>
			</div>
		</main>
	);
}
