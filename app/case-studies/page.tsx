import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/config/case-studies.config";

export const metadata: Metadata = {
	title: "Case Studies | Agentic Outcome Reports",
	description:
		"Explore performance data and real-world results from the Invisioned Agentic Growth OS across various industries.",
};

export default function CaseStudiesPage() {
	return (
		<div className="relative min-h-screen bg-background pt-40 pb-24 px-4 md:px-8">
			<div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08),transparent_70%)]" />

			<div className="relative z-10 mx-auto max-w-6xl">
				<header className="mb-20">
					<h1 className="text-4xl font-extrabold tracking-tighter text-foreground md:text-7xl">
						Agentic <span className="text-primary italic">Outcomes.</span>
					</h1>
					<p className="mt-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
						Performance reports and real-world results from our AI-powered
						marketing OS. Confidentiality is paramount; specific brand names are
						redacted unless explicitly authorized.
					</p>
				</header>

				<div className="grid gap-8 md:grid-cols-2">
					{/* Dynamic Case Study Cards */}
					{caseStudies.map((cs) => (
						<div
							key={cs.slug}
							className="group relative rounded-3xl border border-border bg-card/40 p-12 backdrop-blur-xl transition-all hover:border-primary/50"
						>
							<div className="mb-6 inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/20">
								{cs.tag}
							</div>
							<h2 className="text-3xl font-bold text-foreground mb-4">
								{cs.title.split("//")[0]}
							</h2>
							<p className="text-4xl font-mono font-bold text-primary mb-8">
								{cs.impact}
							</p>
							<Link
								href={`/case-studies/${cs.slug}`}
								className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-bold text-foreground transition-all hover:bg-primary hover:text-primary-foreground group-hover:scale-105"
							>
								VIEW REPORT {"//"} 2026
							</Link>
						</div>
					))}
				</div>

				<div className="mt-20 flex justify-center">
					<Link
						href="/"
						className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Command Center
					</Link>
				</div>
			</div>
		</div>
	);
}
