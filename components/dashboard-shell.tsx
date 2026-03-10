"use client";

import { motion } from "framer-motion";
import { Bell, LayoutDashboard, Settings, Share2 } from "lucide-react";
import AgenticDashboard from "@/components/agentic-dashboard";
import { AmbientGlow } from "@/components/ui/ambient-glow";

const glassHeader =
	"relative mb-8 flex items-center justify-between overflow-hidden rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md";

type DashboardShellProps = {
	orgName: string;
	role: string;
	userLabel: string;
};

export default function DashboardShell({
	orgName,
	role,
	userLabel,
}: DashboardShellProps) {
	return (
		<main className="relative min-h-screen overflow-hidden bg-background px-4 pt-32 pb-24 md:px-8">
			<AmbientGlow
				color="bg-primary/5"
				position="center"
				className="opacity-10"
			/>
			<AmbientGlow color="bg-secondary/5" position="top-right" />

			<div className="relative z-10 mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: -12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className={glassHeader}
				>
					<div className="flex items-center gap-4">
						<div className="rounded-lg bg-primary/10 p-2 text-primary">
							<LayoutDashboard className="h-5 w-5" />
						</div>
						<div>
							<h1 className="text-lg font-bold tracking-tight text-white">
								Mission Control
							</h1>
							<p className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">
								{orgName} / {role}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="hidden cursor-default items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground md:flex">
							<Share2 className="h-3 w-3" />
							<span>{userLabel}</span>
						</div>
						<div className="cursor-default rounded-lg p-2 text-muted-foreground">
							<Bell className="h-4 w-4" />
						</div>
						<div className="cursor-default rounded-lg p-2 text-muted-foreground">
							<Settings className="h-4 w-4" />
						</div>
						<div className="mx-1 h-6 w-px bg-border" />
						<div className="flex items-center gap-2 pl-2">
							<div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-secondary/30 bg-secondary/20 text-xs font-bold text-secondary">
								OP
							</div>
						</div>
					</div>
				</motion.div>

				<div className="relative">
					<AgenticDashboard />
				</div>

				<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
					{[
						{
							label: "Network Status",
							value: "Optimal",
							color: "text-green-400",
						},
						{ label: "Sync Latency", value: "1.2ms", color: "text-blue-400" },
						{ label: "Compute Load", value: "22%", color: "text-secondary" },
						{
							label: "Tenant Scope",
							value: orgName,
							color: "text-primary",
						},
					].map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 + index * 0.1 }}
							className="rounded-xl border border-border bg-card/30 p-4 backdrop-blur-sm"
						>
							<p className="mb-1 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">
								{stat.label}
							</p>
							<p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
						</motion.div>
					))}
				</div>
			</div>
		</main>
	);
}
