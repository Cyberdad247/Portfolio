import SovereignDashboard from "@/components/dashboard/sovereign-dashboard";
import type { Metadata } from "next";
import { Activity, Lock, Radio, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
	title: "Dev Dashboard | Sovereign Command Center",
	description:
		"Secure gateway for fleet node management and real-time system telemetry.",
};

const CAMELOT_PHASES = [
	{ name: "CLIProxyAPI", port: "8080", status: "LIVE" },
	{ name: "Defense Grid", port: "—", status: "LIVE" },
	{ name: "Kinetic Edge", port: "3001", status: "LIVE" },
	{ name: "Cloud Brain", port: "RPC", status: "LIVE" },
	{ name: "Warp Terminal", port: "—", status: "FUSED" },
	{ name: "Sovereign Harness", port: "—", status: "LIVE" },
	{ name: "Bio-Swarm (Nano)", port: "—", status: "LIVE" },
	{ name: "Edge PWA", port: "3000", status: "LIVE" },
] as const;

const IRON_GATE_RULES = [
	"NO_RAW_PROMPTS_TO_CLIENTS: ENABLED",
	"NO_GLOBAL_MEMORY_TO_CLIENTS: ENABLED",
	"NO_CROSS_TENANT_DATA: ENABLED",
	"IRON_GATE_V1_1: SEALED",
	"SMOLMACHINE_ISOLATION: ENABLED",
	"HITL_MERGE_GATE: REQUIRED",
] as const;

function StatusPill({ status }: { status: string }) {
	const color =
		status === "LIVE"
			? "text-green-400 border-green-500/30 bg-green-500/10"
			: status === "FUSED"
				? "text-purple-400 border-purple-500/30 bg-purple-500/10"
				: "text-zinc-500 border-zinc-700 bg-zinc-800/40";
	return (
		<span
			className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${color}`}
		>
			{status}
		</span>
	);
}

export default function DevDashboardPage() {
	const now = new Date().toISOString();

	return (
		<main className="min-h-screen bg-black px-6 py-24">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<div className="mb-12 flex items-center justify-between">
					<div>
						<h1 className="font-mono text-4xl font-extrabold uppercase tracking-tight text-white md:text-5xl">
							Sovereign Spire HUD
						</h1>
						<p className="mt-2 font-mono text-sm text-zinc-500">
							ACCESS_LEVEL: 0 (SOVEREIGN) // PROTOCOL: PROJECT_CRUSADE
						</p>
					</div>
					<div className="hidden md:block">
						<div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2">
							<span className="animate-pulse font-mono text-[10px] uppercase text-primary">
								Connection: SECURE
							</span>
						</div>
					</div>
				</div>

				{/* Sovereign Dashboard (existing) */}
				<SovereignDashboard />

				{/* Camelot-OS Live Telemetry */}
				<div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-white">
							<Radio className="h-4 w-4 text-purple-400" />
							Camelot-OS v400.1.0 — Boot Telemetry
						</h2>
						<span className="font-mono text-[9px] text-zinc-600">
							{now.replace("T", " ").slice(0, 19)} UTC
						</span>
					</div>
					<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
						{CAMELOT_PHASES.map((phase) => (
							<div
								key={phase.name}
								className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/40 px-4 py-3"
							>
								<div>
									<p className="font-mono text-[10px] font-semibold text-white">
										{phase.name}
									</p>
									{phase.port !== "—" && (
										<p className="font-mono text-[9px] text-zinc-600">
											:{phase.port}
										</p>
									)}
								</div>
								<StatusPill status={phase.status} />
							</div>
						))}
					</div>
				</div>

				{/* Agentic Stats Row */}
				<div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
					{[
						{ label: "Active Knights", value: "15", icon: Activity, color: "text-purple-400" },
						{ label: "Switchboard Models", value: "39", icon: Zap, color: "text-yellow-400" },
						{ label: "Cloud Brain Notebooks", value: "139", icon: Radio, color: "text-blue-400" },
						{ label: "Iron Gate Status", value: "SEALED", icon: Shield, color: "text-green-400" },
					].map(({ label, value, icon: Icon, color }) => (
						<div
							key={label}
							className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5"
						>
							<Icon className={`mb-3 h-5 w-5 ${color}`} />
							<p className={`font-mono text-2xl font-bold ${color}`}>{value}</p>
							<p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
								{label}
							</p>
						</div>
					))}
				</div>

				{/* Kernel Constraints + Deployment Gate */}
				<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
						<h3 className="mb-4 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-white">
							<div className="h-1 w-1 rounded-full bg-blue-500" />
							Kernel Constraints
						</h3>
						<ul className="space-y-2 font-mono text-xs text-zinc-500">
							{IRON_GATE_RULES.map((rule) => (
								<li key={rule}>- {rule}</li>
							))}
						</ul>
					</div>

					<div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
						<h3 className="mb-4 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-white">
							<div className="h-1 w-1 rounded-full bg-purple-500" />
							Deployment Gate
						</h3>
						<div className="space-y-2">
							{[
								{ label: "Vercel Edge Pipeline", value: "ACTIVE", ok: true },
								{ label: "Shadow Branch Guard", value: "ENFORCED", ok: true },
								{ label: "HITL Merge Approval", value: "REQUIRED", ok: true },
								{ label: "smolmachine Isolation", value: "MicroVM", ok: true },
							].map(({ label, value, ok }) => (
								<div
									key={label}
									className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/40 p-3"
								>
									<span className="font-mono text-[10px] text-zinc-400">
										{label}
									</span>
									<div className="flex items-center gap-1.5">
										<Lock className={`h-3 w-3 ${ok ? "text-green-500" : "text-zinc-600"}`} />
										<span
											className={`font-mono text-[10px] uppercase ${ok ? "text-green-400" : "text-zinc-500"}`}
										>
											{value}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
