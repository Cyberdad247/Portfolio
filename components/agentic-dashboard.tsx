"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	Activity,
	BrainCircuit,
	Cpu,
	Database,
	Globe,
	Layers,
	LineChart as LineChartIcon,
	ShieldCheck,
	Zap,
} from "lucide-react";
import Image from "next/image";
import { type JSX, useEffect, useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	type AgentConfig,
	agents as staticAgents,
} from "@/config/agents.config";
import { siteConfig } from "@/config/site";
import type { NexusEvent } from "@/lib/nexus-sync";
import { tryCreateClient } from "@/lib/supabase/client";
import { performanceData, liveFeedLog as staticFeed } from "./dashboard/data";
import { StatusBadge } from "./dashboard/status-badge";

import { NeuralCard } from "@/components/ui/neural-interface";
import { tokens } from "@/lib/utils";

export default function AgenticDashboard(): JSX.Element {
	const [currentTime, setCurrentTime] = useState<string>("");
	const [dynamicLogs, setDynamicLogs] = useState<NexusEvent[]>([]);
	const [agents, setAgents] = useState<AgentConfig[]>(staticAgents);
	const [isLiveFeedAvailable, setIsLiveFeedAvailable] = useState(true);

	useEffect(() => {
		setCurrentTime(new Date().toLocaleTimeString());
		const timer = setInterval(
			() => setCurrentTime(new Date().toLocaleTimeString()),
			1000,
		);
		const browserSupabase = tryCreateClient();

		if (!browserSupabase) {
			setIsLiveFeedAvailable(false);
			return () => {
				clearInterval(timer);
			};
		}

		const supabase = browserSupabase;

		// 1. Initial Data Fetch (L4 Semantic Layer)
		async function fetchInitialLogs() {
			const { data, error } = await supabase
				.from("ukg_events")
				.select("*")
				.order("created_at", { ascending: false })
				.limit(10);

			if (data && !error) {
				const mappedLogs: NexusEvent[] = data.map(
					(event: {
						id: string;
						agent_id: string | null;
						payload: { action?: string };
						type: string;
						created_at: string;
					}) => ({
						id: event.id,
						agent: event.agent_id || "SYSTEM",
						action: event.payload.action || `${event.type} event detected.`,
						time: new Date(event.created_at).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}),
					}),
				);
				setDynamicLogs(mappedLogs);
			}
		}

		fetchInitialLogs();

		// 2. Real-Time Subscription (L5 Agentic Nexus)
		const channel = supabase
			.channel("ukg_live_feed")
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "ukg_events" },
				(payload) => {
					const newEvent = payload.new as {
						id: string;
						agent_id: string | null;
						payload: { action?: string };
						type: string;
						created_at: string;
					};
					const mappedEvent: NexusEvent = {
						id: newEvent.id,
						agent: newEvent.agent_id || "SYSTEM",
						action:
							newEvent.payload.action || `${newEvent.type} event detected.`,
						time: new Date(newEvent.created_at).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}),
					};
					setDynamicLogs((prev) => [mappedEvent, ...prev].slice(0, 10));
				},
			)
			.subscribe();

		// Legacy local event listener
		const handleEvent = (e: Event) => {
			const customEvent = e as CustomEvent<NexusEvent>;
			setDynamicLogs((prev) => [customEvent.detail, ...prev].slice(0, 10));
		};

		window.addEventListener("nexus-dashboard-sync", handleEvent);

		return () => {
			clearInterval(timer);
			supabase.removeChannel(channel);
			window.removeEventListener("nexus-dashboard-sync", handleEvent);
		};
	}, []);

	useEffect(() => {
		async function fetchAgentStatus() {
			try {
				const response = await fetch("/api/v1/agents");
				if (response.ok) {
					const data = await response.json();
					const liveAgents = data.fleet || [];

					// Merge live status with static visual configuration
					setAgents((prev) =>
						prev.map((agent) => {
							const liveMatch = liveAgents.find(
								(la: { id: string; status?: AgentConfig["status"] }) =>
									la.id === agent.id,
							);
							if (liveMatch?.status) {
								return { ...agent, status: liveMatch.status };
							}
							return agent;
						}),
					);
				}
			} catch (error) {
				console.error("Failed to fetch live agent status:", error);
			}
		}

		fetchAgentStatus();
		// Poll every 10 seconds for live updates
		const interval = setInterval(fetchAgentStatus, 10000);
		return () => clearInterval(interval);
	}, []);

	const allLogs = [...dynamicLogs, ...staticFeed].slice(0, 10);

	return (
		<section
			id="dashboard"
			className="relative px-4 py-32 md:px-8"
		>
			<div className="relative z-10 mx-auto max-w-7xl">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={tokens.animation.spring}
					className="mb-24 text-center"
				>
					<h2 className="text-balance text-4xl font-bold text-white md:text-7xl">
						Agentic <span className="text-primary italic">Nexus</span>
					</h2>
					<p className="mx-auto mt-6 max-w-xl text-zinc-500 font-mono uppercase tracking-widest">
						Mission Control // v700.neural.bridge
					</p>
				</motion.div>

				{/* Dashboard Header Bar */}
				<NeuralCard
					className="mb-6 flex flex-col items-center justify-between gap-6 p-8 md:flex-row"
					variant="premium"
				>
					<div className="flex items-center gap-6">
						<div className="relative h-16 w-16 shrink-0">
							<Image
								src={siteConfig.logo}
								alt="Invisioned Logo"
								width={64}
								height={64}
								className="h-full w-full object-contain brightness-0 invert opacity-80"
							/>
							<div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
						</div>
						<div>
							<h3 className="flex items-center gap-3 text-2xl font-bold uppercase tracking-tighter text-white">
								<BrainCircuit className="h-7 w-7 text-primary" />
								{"Agentic Nexus"}
							</h3>
							<p className="font-mono text-xs text-zinc-500 tracking-wider">
								{isLiveFeedAvailable
									? "STATUS: OPTIMAL // ENCRYPTION: ACTIVE"
									: "STATUS: DEGRADED // OFFLINE CACHE ACTIVE"}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-6 rounded-2xl border border-white/5 bg-white/5 px-6 py-3 font-mono text-xs text-zinc-400">
						<div className="flex items-center gap-3">
							<Globe className="h-4 w-4 text-primary" />
							<span className="uppercase tracking-widest">Global Net</span>
						</div>
						<div className="h-4 w-px bg-white/10" />
						<div className="text-white font-bold">{currentTime || "--:--:--"}</div>
					</div>
				</NeuralCard>

				{/* Bento Grid */}
				<div className="grid auto-rows-[minmax(120px,auto)] grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-12">
					{/* Cell 1: Total Processed Tasks */}
					<NeuralCard
						className="col-span-1 flex flex-col justify-between p-8 md:col-span-2 lg:col-span-3"
						glowColor={tokens.colors.primary}
					>
						<div className="flex items-start justify-between">
							<h3 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
								<Cpu className="h-4 w-4" /> Tasks
							</h3>
							<Activity className="h-5 w-5 text-primary animate-pulse" />
						</div>
						<div className="mt-8">
							<div className="flex items-baseline gap-3 font-mono text-4xl font-bold text-white tracking-tighter">
								24,590
								<span className="flex items-center text-xs font-bold text-accent">
									<Zap className="mr-1 h-3 w-3 fill-current" /> +12%
								</span>
							</div>
						</div>
					</NeuralCard>

					{/* Cell 2: Visionary Insights */}
					<NeuralCard
						className="col-span-1 flex flex-col justify-between p-8 md:col-span-2 lg:col-span-3"
						glowColor={tokens.colors.secondary}
					>
						<div className="flex items-start justify-between">
							<h3 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
								<ShieldCheck className="h-4 w-4" /> Insights
							</h3>
							<Layers className="h-5 w-5 text-secondary" />
						</div>
						<div className="mt-8">
							<div className="flex items-baseline gap-3 font-mono text-4xl font-bold text-white tracking-tighter">
								1,245
								<span className="flex items-center text-xs font-bold text-accent">
									<Zap className="mr-1 h-3 w-3 fill-current" /> +5%
								</span>
							</div>
						</div>
					</NeuralCard>

					{/* Cell 3: Agent Fleet */}
					<NeuralCard
						className="col-span-1 row-span-2 flex flex-col p-8 md:col-span-4 lg:col-span-6"
						variant="premium"
					>
						<div className="mb-8 flex items-center justify-between">
							<h3 className="flex items-center gap-3 text-xl font-bold uppercase tracking-tighter text-white">
								<Database className="h-6 w-6 text-primary" />
								Active Fleet
							</h3>
							<StatusBadge status="active" />
						</div>
						<div className="flex-1 space-y-4 overflow-y-auto pr-2">
							{agents.map((agent) => (
								<div
									key={agent.id}
									className="group/agent flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-primary/30 hover:bg-white/10"
								>
									<div className="flex items-center gap-4">
										<div className="rounded-xl border border-white/10 bg-black/40 p-3 group-hover/agent:border-primary/50 transition-colors">
											<agent.icon className="h-6 w-6 text-zinc-400 group-hover/agent:text-primary transition-colors" />
										</div>
										<div>
											<div className="font-bold text-white tracking-tight">
												{agent.name}
											</div>
											<div className="flex flex-col">
												<div className="font-mono text-[10px] uppercase text-zinc-500 tracking-widest">
													{agent.id}
												</div>
												<div className="text-[10px] uppercase font-bold text-primary/70">
													{agent.role}
												</div>
											</div>
										</div>
									</div>
									<div className="flex flex-col items-end gap-2">
										<StatusBadge status={agent.status} />
										<div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
											{agent.metricValue} {agent.metricLabel.split(" ")[0]}
										</div>
									</div>
								</div>
							))}
						</div>
					</NeuralCard>

					{/* Cell 4: Performance Chart */}
					<NeuralCard
						className="col-span-1 row-span-2 min-h-[350px] p-8 md:col-span-4 lg:col-span-6"
					>
						<div className="mb-8 flex items-center justify-between">
							<h3 className="flex items-center gap-3 text-xl font-bold uppercase tracking-tighter text-white">
								<LineChartIcon className="h-6 w-6 text-primary" />
								Output Velocity
							</h3>
							<div className="flex gap-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
								<span className="flex items-center gap-2">
									<span className="h-2 w-2 rounded-full bg-primary" />
									Tasks
								</span>
								<span className="flex items-center gap-2">
									<span className="h-2 w-2 rounded-full bg-secondary" />
									Insights
								</span>
							</div>
						</div>
						<ResponsiveContainer width="100%" height="80%">
							<AreaChart data={performanceData}>
								<defs>
									<linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor={tokens.colors.primary} stopOpacity={0.3} />
										<stop offset="95%" stopColor={tokens.colors.primary} stopOpacity={0} />
									</linearGradient>
									<linearGradient
										id="colorInsights"
										x1="0" y1="0"
										x2="0" y2="1"
									>
										<stop offset="5%" stopColor={tokens.colors.secondary} stopOpacity={0.2} />
										<stop offset="95%" stopColor={tokens.colors.secondary} stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="rgba(255, 255, 255, 0.05)"
									vertical={false}
								/>
								<XAxis
									dataKey="name"
									stroke="#52525B"
									fontSize={10}
									tickLine={false}
									axisLine={false}
									tick={{ fill: '#52525B' }}
								/>
								<YAxis
									stroke="#52525B"
									fontSize={10}
									tickLine={false}
									axisLine={false}
									tick={{ fill: '#52525B' }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: tokens.colors.obsidian,
										borderColor: "rgba(255,255,255,0.1)",
										borderRadius: "16px",
										padding: "12px",
									}}
									itemStyle={{ color: tokens.colors.chrome, fontSize: '12px', fontWeight: 'bold' }}
									labelStyle={{
										color: tokens.colors.primary,
										fontWeight: "bold",
										marginBottom: "8px",
										fontSize: '10px',
										textTransform: 'uppercase',
										letterSpacing: '0.1em'
									}}
								/>
								<Area
									type="monotone"
									dataKey="tasks"
									stroke={tokens.colors.primary}
									fillOpacity={1}
									fill="url(#colorTasks)"
									strokeWidth={3}
								/>
								<Area
									type="monotone"
									dataKey="insights"
									stroke={tokens.colors.secondary}
									fillOpacity={1}
									fill="url(#colorInsights)"
									strokeWidth={2}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</NeuralCard>

					{/* Cell 5: Live Neural Feed */}
					<NeuralCard
						className="col-span-1 row-span-3 flex flex-col p-8 md:col-span-4 lg:col-span-6"
						variant="premium"
						glowColor={tokens.colors.primary}
					>
						<div className="mb-8 flex items-center justify-between">
							<h3 className="flex items-center gap-3 text-xl font-bold uppercase tracking-tighter text-white">
								<Activity className="h-6 w-6 animate-pulse text-primary" />
								Live Neural Feed
							</h3>
							<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
								Stream // Active
							</span>
						</div>
						<div className="relative flex-1 overflow-y-auto pr-4">
							<div className="absolute left-[23px] top-2 bottom-2 w-px bg-white/5" />
							<AnimatePresence mode="popLayout">
								{allLogs.map((log) => (
									<motion.div
										key={log.id}
										initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
										animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
										exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
										transition={{ duration: 0.5 }}
										className="group/log relative mb-8 flex gap-6 pl-2"
									>
										{/* Timeline Node */}
										<div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/60 transition-all group-hover/log:border-primary/50 group-hover/log:bg-primary/10">
											<div className="relative h-2 w-2 rounded-full bg-primary">
												<span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-50" />
											</div>
										</div>
										{/* Log Content */}
										<div className="flex-1 rounded-2xl border border-white/5 bg-white/5 p-5 transition-all group-hover/log:bg-white/10 group-hover/log:border-white/10">
											<div className="mb-2 flex items-start justify-between">
												<span className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
													{log.agent}
												</span>
												<span className="font-mono text-[10px] text-zinc-600">
													{log.time}
												</span>
											</div>
											<p className="text-sm leading-relaxed text-zinc-300 group-hover:text-white transition-colors">
												{log.action}
											</p>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</NeuralCard>

					{/* Cell 6: Strategic Insight */}
					<NeuralCard
						className="col-span-1 flex flex-col justify-center p-8 md:col-span-2 lg:col-span-3"
						glowColor={tokens.colors.secondary}
					>
						<h3 className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
							<Zap className="h-4 w-4 fill-current" /> Insight
						</h3>
						<p className="text-lg font-bold leading-tight text-white tracking-tight">
							{
								'"Competitor pricing model vulnerable. Recommend Q3 blitz."'
							}
						</p>
						<div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-500">
							<span>A-04 // Synthesizer</span>
							<span className="cursor-pointer text-white hover:text-primary transition-colors">
								{"REPORT →"}
							</span>
						</div>
					</NeuralCard>

					{/* Cell 7: System Health */}
					<NeuralCard
						className="col-span-1 flex items-center gap-6 p-8 md:col-span-2 lg:col-span-3"
						glowColor={tokens.colors.accent}
					>
						<div className="rounded-2xl border border-accent/20 bg-accent/10 p-4">
							<ShieldCheck className="h-8 w-8 text-accent" />
						</div>
						<div>
							<h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
								Lattice Health
							</h3>
							<div className="flex items-center gap-2 text-2xl font-bold text-white tracking-tighter">
								99.9% <span className="text-accent text-sm font-mono tracking-normal">OK</span>
							</div>
						</div>
					</NeuralCard>
				</div>
			</div>
		</section>
	);
}
