"use client";

import { motion } from "framer-motion";
import { 
	Activity, 
	ArrowRight, 
	Box, 
	Download,
	Globe, 
	Lock, 
	Monitor, 
	QrCode,
	Shield, 
	Smartphone, 
	Terminal, 
	Zap 
} from "lucide-react";
import { useState } from "react";

const nodes = [
	{ id: "phoneclaw", name: "PhoneClaw", type: "Android", status: "online", icon: Smartphone },
	{ id: "termux", name: "Termux", type: "CLI", status: "online", icon: Terminal },
	{ id: "superpowers", name: "Superpowers", type: "Browser", status: "online", icon: Globe },
	{ id: "rustdesk", name: "Rescue", type: "Remote", status: "offline", icon: Monitor },
];

export default function SovereignDashboard() {
	const [activeNode, setActiveNode] = useState<string | null>(null);
	const [isPillGenerating, setIsPillGenerating] = useState(false);
	const [pillUrl, setPillUrl] = useState<string | null>(null);

	const generatePill = () => {
		setIsPillGenerating(true);
		setTimeout(() => {
			setPillUrl(`https://invisionedmarketing.agency/pill/sync-${Date.now()}`);
			setIsPillGenerating(false);
		}, 3000);
	};

	return (
		<div className="flex flex-col gap-6">
			{/* STATUS BAR */}
			<div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
						<Shield className="h-5 w-5" />
					</div>
					<div>
						<h3 className="font-bold text-white">Iron Gate v1.1</h3>
						<p className="text-[10px] uppercase tracking-widest text-zinc-500">Security Protocol: ACTIVE</p>
					</div>
				</div>
				<div className="flex items-center gap-6">
					<div className="flex flex-col items-end">
						<span className="text-[10px] uppercase tracking-widest text-zinc-500">System Load</span>
						<span className="font-mono text-sm text-green-500">14.2%</span>
					</div>
					<div className="flex flex-col items-end">
						<span className="text-[10px] uppercase tracking-widest text-zinc-500">Latency</span>
						<span className="font-mono text-sm text-yellow-500">12ms</span>
					</div>
					<div className="flex flex-col items-end">
						<span className="text-[10px] uppercase tracking-widest text-zinc-500">Encryption</span>
						<span className="font-mono text-sm text-blue-500">AES-256</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* FLEET STATUS */}
				<div className="flex flex-col gap-4 lg:col-span-1">
					<h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
						<Box className="h-4 w-4" /> Fleet Nodes
					</h4>
					<div className="flex flex-col gap-2">
						{nodes.map((node) => (
							<button
								key={node.id}
								onClick={() => setActiveNode(node.id)}
								className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
									activeNode === node.id 
										? "border-primary bg-primary/10" 
										: "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
								}`}
							>
								<div className="flex items-center gap-3">
									<node.icon className={`h-5 w-5 ${node.status === "online" ? "text-green-500" : "text-zinc-600"}`} />
									<div className="text-left">
										<div className="text-sm font-bold text-white">{node.name}</div>
										<div className="text-[10px] uppercase text-zinc-500">{node.type}</div>
									</div>
								</div>
								<div className={`h-2 w-2 rounded-full ${node.status === "online" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-zinc-800"}`} />
							</button>
						))}
					</div>
				</div>

				{/* LIVE TELEMETRY */}
				<div className="flex flex-col gap-4 lg:col-span-2">
					<h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
						<Activity className="h-4 w-4" /> Live Telemetry
					</h4>
					<div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
						<div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
							<div className="flex items-center gap-2">
								<Zap className="h-4 w-4 text-yellow-500" />
								<span className="font-mono text-xs text-white">Trace ID: IM-700-ALPHA-SYNC</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
								<span className="font-mono text-[10px] uppercase text-zinc-500">Real-time Stream</span>
							</div>
						</div>

						<div className="space-y-4 font-mono text-xs">
							<div className="flex gap-4">
								<span className="text-zinc-600">[17:52:10]</span>
								<span className="text-primary">INFO</span>
								<span className="text-zinc-300">Merlin forge initialized for project INVISIONED_V700</span>
							</div>
							<div className="flex gap-4">
								<span className="text-zinc-600">[17:52:12]</span>
								<span className="text-green-500">SUCCESS</span>
								<span className="text-zinc-300">Lady Apis forage complete: 12 GEO gaps identified</span>
							</div>
							<div className="flex gap-4">
								<span className="text-zinc-600">[17:52:15]</span>
								<span className="text-yellow-500">WARN</span>
								<span className="text-zinc-300">Sir Syntax stripping redundant Next.js tokens...</span>
							</div>
							<div className="flex gap-4">
								<span className="text-zinc-600">[17:52:20]</span>
								<span className="text-blue-400">BRIDGE</span>
								<span className="text-zinc-300">Alex_Link establishing handshake with Vercel Edge</span>
							</div>
							<div className="animate-pulse flex gap-4">
								<span className="text-zinc-600">[17:52:25]</span>
								<span className="text-zinc-500">PENDING</span>
								<span className="text-zinc-300">Awaiting Sovereign approval for .smolmachine build...</span>
							</div>
						</div>

						<div className="mt-8 flex justify-end">
							<button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition-all hover:bg-primary/80">
								AUTHORIZE ALL PENDING <ArrowRight className="h-3 w-3" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* EDGE CONTROLS & PILL PROTOCOL */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
					<div className="flex items-center gap-4">
						<div className="rounded-full bg-blue-500/20 p-3">
							<Lock className="h-6 w-6 text-blue-500" />
						</div>
						<div>
							<span className="text-xs font-bold text-white uppercase tracking-wider block">Iron Gate Status</span>
							<span className="text-[10px] font-mono text-green-500 uppercase">Sealed // No Leaks Detected</span>
						</div>
					</div>
					<button className="text-xs text-zinc-500 hover:text-white underline">VIEW LOGS</button>
				</div>

				<div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6">
					<div className="flex items-center justify-between">
						<h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
							<QrCode className="h-4 w-4 text-purple-500" /> Pill Protocol
						</h4>
						<span className="text-[10px] font-mono text-zinc-500">v700.pill.beta</span>
					</div>

					{pillUrl ? (
						<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-6 p-4 rounded-xl bg-white">
							<img 
								src={`https://chart.googleapis.com/chart?cht=qr&chs=120x120&chl=${pillUrl}`} 
								alt="Sovereign Pill QR" 
								className="h-24 w-24 border border-zinc-100"
							/>
							<div className="flex-1">
								<p className="text-xs font-bold text-zinc-900 uppercase">Sovereign Pill Generated</p>
								<p className="text-[10px] text-zinc-500 mt-1">Scan to deliver .smolmachine to client terminal.</p>
								<button 
									onClick={() => setPillUrl(null)}
									className="mt-3 text-[10px] font-bold text-purple-600 hover:text-purple-700"
								>
									GENERATE NEW PILL
								</button>
							</div>
						</motion.div>
					) : (
						<div className="flex flex-col gap-4">
							<p className="text-xs text-zinc-500">Compress current workspace into a zero-dependency .smolmachine for same-day delivery.</p>
							<button 
								onClick={generatePill}
								disabled={isPillGenerating}
								className="flex items-center justify-center gap-3 rounded-xl bg-purple-600 py-3 text-sm font-bold text-white transition-all hover:bg-purple-500 disabled:opacity-50"
							>
								{isPillGenerating ? (
									<>
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
										COMPRESSING...
									</>
								) : (
									<>
										<Download className="h-4 w-4" />
										GENERATE SOVEREIGN PILL
									</>
								)}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
