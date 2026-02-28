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
import { agentStatus, liveFeedLog, performanceData } from "./dashboard/data";
import { StatusBadge } from "./dashboard/status-badge";

const glassCard =
	"rounded-2xl border border-border bg-card p-4 backdrop-blur-md relative overflow-hidden";

export default function AgenticDashboard(): JSX.Element {
	const [currentTime, setCurrentTime] = useState<string>("");

	useEffect(() => {
		setCurrentTime(new Date().toLocaleTimeString());
		const timer = setInterval(
			() => setCurrentTime(new Date().toLocaleTimeString()),
			1000,
		);
		return () => clearInterval(timer);
	}, []);

	return (
		<section
			id="dashboard"
			className="relative bg-background px-4 py-24 md:px-8"
		>
			{/* Ambient glows */}
			<div className="pointer-events-none absolute left-[-10%] top-[-10%] z-0 h-[50vw] w-[50vw] rounded-full bg-primary/5 blur-[150px]" />
			<div className="pointer-events-none absolute bottom-[-10%] right-[-10%] z-0 h-[40vw] w-[40vw] rounded-full bg-secondary/3 blur-[150px]" />

			<div className="relative z-10 mx-auto max-w-7xl">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.6 }}
					className="mb-12 text-center"
				>
					<h2 className="text-balance text-3xl font-bold text-foreground md:text-5xl">
						Agentic Nexus
					</h2>
					<p className="mx-auto mt-4 max-w-xl text-muted-foreground">
						Real-time mission control for your AI-powered marketing fleet.
					</p>
				</motion.div>

				{/* Dashboard Header Bar */}
				<motion.header
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className={`${glassCard} mb-4 flex flex-col items-center justify-between gap-4 md:flex-row`}
				>
					<div className="flex items-center gap-4">
						<div className="relative h-12 w-12 shrink-0">
							<Image
								src="/images/seal.jpg"
								alt="Invisioned Seal"
								width={48}
								height={48}
								className="h-full w-full rounded-full object-cover opacity-80"
							/>
							<div className="absolute inset-0 rounded-full bg-primary/30 blur-xl" />
						</div>
						<div>
							<h3 className="flex items-center gap-2 text-xl font-bold uppercase tracking-wider text-foreground">
								<BrainCircuit className="h-6 w-6 text-primary" />
								{"Agentic Nexus // Dashboard"}
							</h3>
							<p className="font-mono text-sm text-muted-foreground">
								{"Hello, Client User. System Status: OPTIMAL."}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 px-4 py-2 font-mono text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Globe className="h-4 w-4" />
							<span>{"GLOBAL NET: ACTIVE"}</span>
						</div>
						<div className="h-4 w-px bg-border" />
						<div>{currentTime || "--:--:--"}</div>
					</div>
				</motion.header>

				{/* Bento Grid */}
				<div className="grid auto-rows-[minmax(100px,auto)] grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-12">
					{/* Cell 1: Total Processed Tasks */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.05 }}
						className={`${glassCard} group col-span-1 flex flex-col justify-between transition-colors hover:border-primary/50 md:col-span-2 lg:col-span-3`}
					>
						<div className="flex items-start justify-between">
							<h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
								<Cpu className="h-4 w-4" /> Total Processed Tasks
							</h3>
							<Activity className="h-5 w-5 text-primary" />
						</div>
						<div className="mt-4">
							<div className="flex items-baseline gap-2 font-mono text-3xl font-bold text-foreground">
								24,590
								<span className="flex items-center text-sm font-medium text-green-400">
									<Zap className="mr-1 h-3 w-3" /> +12%
								</span>
							</div>
						</div>
						<div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
					</motion.div>

					{/* Cell 2: Visionary Insights */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className={`${glassCard} group col-span-1 flex flex-col justify-between transition-colors hover:border-secondary/50 md:col-span-2 lg:col-span-3`}
					>
						<div className="flex items-start justify-between">
							<h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
								<ShieldCheck className="h-4 w-4" /> Visionary Insights
							</h3>
							<Layers className="h-5 w-5 text-secondary" />
						</div>
						<div className="mt-4">
							<div className="flex items-baseline gap-2 font-mono text-3xl font-bold text-foreground">
								1,245
								<span className="flex items-center text-sm font-medium text-green-400">
									<Zap className="mr-1 h-3 w-3" /> +5%
								</span>
							</div>
						</div>
						<div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
					</motion.div>

					{/* Cell 3: Agent Fleet */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.15 }}
						className={`${glassCard} col-span-1 row-span-2 flex flex-col md:col-span-4 lg:col-span-6`}
					>
						<div className="mb-4 flex items-center justify-between">
							<h3 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-foreground">
								<Database className="h-5 w-5 text-primary" />
								Active Agent Fleet
							</h3>
							<StatusBadge status="active" />
						</div>
						<div className="flex-1 space-y-3 overflow-y-auto pr-2">
							{agentStatus.map((agent) => (
								<div
									key={agent.id}
									className="group/agent flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3 transition-colors hover:border-primary/30"
								>
									<div className="flex items-center gap-3">
										<div className="rounded-md border border-border bg-background p-2 transition-colors group-hover/agent:border-primary/50">
											<agent.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover/agent:text-primary" />
										</div>
										<div>
											<div className="font-medium text-foreground">
												{agent.name}
											</div>
											<div className="font-mono text-xs text-muted-foreground">
												{"ID: "}
												{agent.id}
											</div>
										</div>
									</div>
									<StatusBadge status={agent.status} />
								</div>
							))}
						</div>
					</motion.div>

					{/* Cell 4: Performance Chart */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.2 }}
						className={`${glassCard} col-span-1 row-span-2 min-h-[300px] md:col-span-4 lg:col-span-6`}
					>
						<div className="mb-6 flex items-center justify-between">
							<h3 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-foreground">
								<LineChartIcon className="h-5 w-5 text-primary" />
								System Output Velocity
							</h3>
							<div className="flex gap-3 font-mono text-xs text-muted-foreground">
								<span className="flex items-center gap-1">
									<span className="inline-block h-3 w-3 rounded-full bg-primary/50" />
									Tasks
								</span>
								<span className="flex items-center gap-1">
									<span className="inline-block h-3 w-3 rounded-full bg-secondary/50" />
									Insights
								</span>
							</div>
						</div>
						<ResponsiveContainer width="100%" height="80%">
							<AreaChart data={performanceData}>
								<defs>
									<linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
									</linearGradient>
									<linearGradient
										id="colorInsights"
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop offset="5%" stopColor="#FDE047" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#FDE047" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="rgba(39, 39, 42, 0.5)"
									vertical={false}
								/>
								<XAxis
									dataKey="name"
									stroke="#A1A1AA"
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke="#A1A1AA"
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "#09090B",
										borderColor: "#27272A",
										borderRadius: "8px",
										boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
									}}
									itemStyle={{ color: "#FAFAFA" }}
									labelStyle={{
										color: "#A1A1AA",
										fontWeight: "bold",
										marginBottom: "4px",
									}}
								/>
								<Area
									type="monotone"
									dataKey="tasks"
									stroke="#A855F7"
									fillOpacity={1}
									fill="url(#colorTasks)"
									strokeWidth={2}
								/>
								<Area
									type="monotone"
									dataKey="insights"
									stroke="#FDE047"
									fillOpacity={1}
									fill="url(#colorInsights)"
									strokeWidth={2}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</motion.div>

					{/* Cell 5: Live Neural Feed */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.25 }}
						className={`${glassCard} col-span-1 row-span-3 flex flex-col md:col-span-4 lg:col-span-6`}
					>
						<div className="mb-4 flex items-center justify-between">
							<h3 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-foreground">
								<Activity className="h-5 w-5 animate-pulse text-primary" />
								Live Neural Feed
							</h3>
							<span className="rounded-md border border-border bg-muted/30 px-2 py-1 font-mono text-xs text-muted-foreground">
								REAL-TIME LOG
							</span>
						</div>
						<div className="relative flex-1 overflow-y-auto pr-2">
							<div className="absolute bottom-2 left-[19px] top-2 w-px bg-border" />
							<AnimatePresence>
								{liveFeedLog.map((log, index) => (
									<motion.div
										key={log.id}
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
										className="group/log relative mb-6 flex gap-4 pl-2"
									>
										{/* Timeline Node */}
										<div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50 transition-colors group-hover/log:border-primary">
											<div className="relative h-3 w-3 rounded-full bg-primary">
												<span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-50" />
											</div>
										</div>
										{/* Log Content */}
										<div className="flex-1 rounded-lg border border-border/30 bg-muted/20 p-3 transition-colors group-hover/log:bg-muted/40">
											<div className="mb-1 flex items-start justify-between">
												<span className="font-mono text-sm font-bold text-primary">
													{"AGENT: "}
													{log.agent}
												</span>
												<span className="font-mono text-xs text-muted-foreground">
													{log.time}
												</span>
											</div>
											<p className="text-sm leading-relaxed text-foreground">
												{log.action}
											</p>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</motion.div>

					{/* Cell 6: Strategic Insight */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.3 }}
						className={`${glassCard} group col-span-1 flex flex-col justify-center border-secondary/20 bg-gradient-to-br from-card to-secondary/5 transition-colors hover:border-secondary/50 md:col-span-2 lg:col-span-3`}
					>
						<div className="pointer-events-none absolute inset-0 rounded-full bg-secondary/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
						<h3 className="relative z-10 mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-secondary">
							<Zap className="h-4 w-4" /> Latest Strategic Insight
						</h3>
						<p className="relative z-10 text-lg font-bold leading-tight text-foreground">
							{
								'"Competitor pricing model is vulnerable in the mid-market segment. Recommend a targeted Q3 acquisition campaign."'
							}
						</p>
						<div className="relative z-10 mt-4 flex items-center justify-between font-mono text-xs text-muted-foreground">
							<span>{"Source: A-04 (Synthesizer)"}</span>
							<span className="cursor-pointer text-foreground hover:underline">
								{"VIEW REPORT >"}
							</span>
						</div>
					</motion.div>

					{/* Cell 7: System Health */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.35 }}
						className={`${glassCard} group col-span-1 flex items-center gap-4 transition-colors hover:border-green-500/50 md:col-span-2 lg:col-span-3`}
					>
						<div className="rounded-full border border-green-500/30 bg-green-500/20 p-3">
							<ShieldCheck className="h-6 w-6 text-green-500" />
						</div>
						<div>
							<h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
								System Health
							</h3>
							<div className="flex items-center gap-2 text-xl font-bold text-green-500">
								99.9% Uptime
							</div>
							<div className="mt-1 font-mono text-xs text-muted-foreground">
								{"All neural pathways operational."}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
