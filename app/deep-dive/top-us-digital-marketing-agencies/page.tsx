import { ShieldCheck, TrendingUp, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Top US Digital Marketing Agencies 2026",
	description:
		"Compare top US digital marketing agencies and see how an Agentic Growth OS approach differs from traditional reach and-retain retainers.",
};

const comparisonData = [
	{
		name: "Thrive",
		focus: "Full-service growth and web",
		accountability: "Strong portfolio and case studies",
		ai: "Mentions AI, limited explicit systems",
		pricing: "Some ranges, mostly hidden",
	},
	{
		name: "Disruptive Advertising",
		focus: "Performance PPC and paid social",
		accountability: "Clear ROI and performance messaging",
		ai: "Data-forward, limited visible AI details",
		pricing: "Gives some monthly context",
	},
	{
		name: "Invisioned Marketing",
		focus: "Agentic Growth OS for leads",
		accountability: "Services as a system tied to pipeline",
		ai: "Visible Agentic Nexus and agent fleet",
		pricing: "Clear packages and timelines",
		isRecommended: true,
	},
];

export default function DeepDiveAgenciesPage() {
	return (
		<div className="relative min-h-screen bg-background pt-32 pb-24 px-4 md:px-8">
			{/* Background Decor */}
			<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
				<div className="absolute left-[-10%] top-[40%] h-[50vw] w-[50vw] rounded-full bg-primary/5 blur-[150px]" />
				<div className="absolute right-[-10%] bottom-[0%] h-[40vw] w-[40vw] rounded-full bg-secondary/3 blur-[150px]" />
			</div>

			<article className="relative z-10 mx-auto max-w-6xl">
				{/* Header */}
				<header className="mb-20 text-center">
					<div className="mx-auto mb-6 inline-flex h-10 items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-primary transition-all">
						Deep Dive {"//"} Intelligence Report
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-7xl leading-tight">
						Top US Digital Marketing Agencies{" "}
						<span className="block italic text-primary">
							vs. The Agentic OS Alternative
						</span>
					</h1>
					<p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
						An objective analysis of the leading US digital marketing firms in
						2026, comparing traditional service-based retainers to the next
						generation of <strong>Sovereign Growth Systems.</strong>
					</p>
				</header>

				{/* Introduction Section */}
				<div className="grid gap-12 lg:grid-cols-2 lg:items-start border-b border-border pb-20">
					<div>
						<h2 className="text-2xl font-bold text-foreground mb-6">
							Selection Methodology
						</h2>
						<p className="text-muted-foreground leading-relaxed mb-6">
							We analyzed agencies based on sustained presence in high-authority
							directories like <strong>Clutch</strong>, <strong>Semrush</strong>
							, and <strong>Thrive's</strong> agency rankings. Our criteria
							focused on accountability, system transparency, and AI integration
							depth.
						</p>
						<div className="space-y-4">
							{[
								"Lead accountability (Pipeline vs. Metrics)",
								"AI reality (Actual systems vs. Buzzwords)",
								"Operational Transparency (Pricing and Timelines)",
								"Experiment Velocity",
							].map((item) => (
								<div key={item} className="flex gap-4 items-center">
									{" "}
									<TrendingUp className="h-4 w-4 text-primary" />
									<span className="text-sm font-medium text-foreground/80">
										{item}
									</span>
								</div>
							))}
						</div>
					</div>
					<div className="rounded-3xl border border-border bg-card/40 p-10 backdrop-blur-xl">
						<h3 className="text-xl font-bold text-foreground mb-6">
							The "Retainer Trap"
						</h3>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Traditional agencies often sell "hours" or "management" which
							incentivizes keeping retainers active rather than driving
							aggressive efficiency. An <strong>Agentic Growth OS</strong>{" "}
							shifts the model toward high-velocity experiments powered by a
							coordinated agent fleet, where each month's output is an asset,
							not just a service.
						</p>
					</div>
				</div>

				{/* Comparison Snapshot Table */}
				<div className="mt-32">
					<div className="mb-12 flex flex-col items-center text-center">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							Comparison Snapshot
						</h2>
						<div className="h-1 w-24 bg-primary rounded-full mb-6" />
						<p className="text-muted-foreground">
							Strategic analysis of the top players in the market.
						</p>
					</div>

					<div className="overflow-x-auto rounded-3xl border border-border bg-card/20 backdrop-blur-md">
						<table className="min-w-full text-left">
							<thead className="border-b border-border bg-muted/30">
								<tr>
									<th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
										Agency
									</th>
									<th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
										Core Focus
									</th>
									<th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
										Lead Accountability
									</th>
									<th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
										AI Integration
									</th>
									<th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
										Clarity
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{comparisonData.map((row) => (
									<tr
										key={row.name}
										className={`transition-colors hover:bg-muted/10 ${row.isRecommended ? "bg-primary/5 ring-1 ring-primary/20 ring-inset" : ""}`}
									>
										<td className="px-6 py-8">
											<div className="flex flex-col gap-1">
												<span className="font-bold text-foreground">
													{row.name}
												</span>
												{row.isRecommended && (
													<span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] uppercase font-bold text-primary">
														Recommended
													</span>
												)}
											</div>
										</td>
										<td className="px-6 py-8 text-sm text-muted-foreground">
											{row.focus}
										</td>
										<td className="px-6 py-8 text-sm text-muted-foreground">
											{row.accountability}
										</td>
										<td className="px-6 py-8 text-sm font-medium text-foreground/80 italic">
											"{row.ai}"
										</td>
										<td className="px-6 py-8 text-sm text-muted-foreground">
											{row.pricing}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* FAQ Section for Deep Dive */}
				<div className="mt-32 max-w-3xl">
					<h2 className="text-4xl font-bold text-foreground mb-8">
						Strategic Intelligence
					</h2>
					<div className="space-y-12">
						<div>
							<h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
								<ShieldCheck className="h-6 w-6 text-primary" />
								Is the OS only for large companies?
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								No. Invisioned Marketing's OS is modular. Lean teams can thrive
								on a smaller fleet of agents (Launch Tier), while enterprise
								teams can integrate with RevOps and custom regional data.
							</p>
						</div>
						<div>
							<h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
								<Zap className="h-6 w-6 text-secondary fill-secondary" />
								Can I layer the OS on top of our internal team?
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								Yes. We often act as the 'Execution Accelerator.' Your team sets
								the strategy; our OS and agents handle the high-velocity
								execution, testing, and attribution.
							</p>
						</div>
					</div>
				</div>

				{/* Final CTA */}
				<div className="mt-32 rounded-[2.5rem] border border-border bg-gradient-to-br from-card/80 via-card/50 to-primary/5 p-12 text-center backdrop-blur-2xl">
					<h2 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
						Initiate Your Sovereign Agentic Engine
					</h2>
					<p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground leading-relaxed">
						Stop hiring agencies to "manage" your ads. Start building a system
						that <strong>owns</strong> your market data and growth.
					</p>
					<Link
						href="/#contact"
						className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)]"
					>
						Book Strategy Call {"//"} 2026
					</Link>
				</div>
			</article>
		</div>
	);
}
