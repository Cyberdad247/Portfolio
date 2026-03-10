"use client";

import { motion } from "framer-motion";
import { Activity, Database, Lock, Shield, Terminal } from "lucide-react";
import { AmbientGlow } from "@/components/ui/ambient-glow";

const glassCard =
	"relative overflow-hidden rounded-2xl border border-border bg-card p-6 backdrop-blur-md group";

type AdminShellProps = {
	userRole: string;
};

export default function AdminShell({ userRole }: AdminShellProps) {
	return (
		<main className="relative min-h-screen overflow-hidden bg-background px-4 pt-32 pb-24 md:px-8">
			<AmbientGlow color="bg-red-500/10" position="top-left" />

			<div className="relative z-10 mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-12"
				>
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
						<Lock className="h-3 w-3" />
						<span>Internal Kernel Access / {userRole}</span>
					</div>
					<h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
						Fleet Command
					</h1>
					<p className="max-w-xl text-muted-foreground">
						Global administrative control for the Camelot Kernel and tenant-safe
						operator workflows.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{[
						{
							title: "System Status",
							value: "Operational",
							icon: Activity,
							color: "text-green-400",
						},
						{
							title: "Active Nodes",
							value: "128",
							icon: Database,
							color: "text-blue-400",
						},
						{
							title: "Governance",
							value: "Strict",
							icon: Shield,
							color: "text-red-400",
						},
					].map((stat, index) => (
						<motion.div
							key={stat.title}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: index * 0.1 }}
							className={glassCard}
						>
							<stat.icon className={`mb-4 h-6 w-6 ${stat.color}`} />
							<h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">
								{stat.title}
							</h3>
							<p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
						</motion.div>
					))}
				</div>

				<div className="mt-8 rounded-2xl border border-border bg-card/30 p-8 font-mono text-sm text-green-500">
					<div className="mb-4 flex items-center gap-2">
						<Terminal className="h-4 w-4" />
						<span>Kernel Log Stream</span>
					</div>
					<div className="space-y-1 opacity-80">
						<p>
							[11:22:45] SYSLOG: Agent LPO initiating hero optimization
							sequence...
						</p>
						<p>
							[11:22:48] SYSLOG: Lukas_Edge establishing Vercel deployment
							bridge...
						</p>
						<p>
							[11:23:01] SYSLOG: Anya_Refined intake gate closed for Session_99.
						</p>
						<p className="animate-pulse">
							[11:23:05] SYSLOG: Strategos branch simulation in progress_
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
