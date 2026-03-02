import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, TrendingUp, Clock, Zap } from "lucide-react";
import AgenticDashboard from "@/components/agentic-dashboard";
import { caseStudies } from "@/config/case-studies.config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Case Study | Analysis & Results",
    description: "Detailed performance analysis and real-world results from the Invisioned AI-powered marketing OS.",
};

export default async function CaseStudyDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = caseStudies.find((cs) => cs.slug === slug);

    if (!study) {
        notFound();
    }

    return (
        <div className="relative min-h-screen bg-background pt-32 pb-24 px-4 md:px-8">
            {/* Ambient background beams */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-5%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
            </div>

            <div className="mx-auto max-w-7xl">
                <Link
                    href="/case-studies"
                    className="group mb-12 inline-flex items-center text-sm font-bold tracking-widest text-muted-foreground transition-colors hover:text-primary"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    BACK TO REPORTS
                </Link>

                <header className="mb-20">
                    <div className="mb-6 inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/20">
                        {study.tag} // CASE_REPORT
                    </div>
                    <h1 className="mb-8 max-w-4xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
                        {study.title}
                    </h1>
                    <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
                        {study.objective}
                    </p>
                </header>

                {/* Impact Metrics */}
                <div className="mb-24 grid gap-8 md:grid-cols-3">
                    <div className="rounded-3xl border border-border bg-card/30 p-8 backdrop-blur-sm">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                            <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">Core Impact</h3>
                        <p className="text-3xl font-bold text-foreground">{study.impact}</p>
                    </div>
                    <div className="rounded-3xl border border-border bg-card/30 p-8 backdrop-blur-sm">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                            <Clock className="h-6 w-6 text-blue-500" />
                        </div>
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">Timeframe</h3>
                        <p className="text-3xl font-bold text-foreground">{study.time}</p>
                    </div>
                    <div className="rounded-3xl border border-border bg-card/30 p-8 backdrop-blur-sm">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10">
                            <Zap className="h-6 w-6 text-purple-500" />
                        </div>
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">Status</h3>
                        <p className="text-3xl font-bold text-foreground underline decoration-primary decoration-4 underline-offset-8">OPTIMIZED</p>
                    </div>
                </div>

                {/* Results Section */}
                <div className="mb-24 grid gap-16 lg:grid-cols-2">
                    <div>
                        <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">Strategic Outcomes</h2>
                        <div className="space-y-6">
                            {study.results.map((result, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="mt-1 flex-shrink-0">
                                        <CheckCircle2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <p className="text-lg leading-relaxed text-muted-foreground">
                                        {result}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-3xl border border-border bg-muted/20">
                        {/* Interactive Data Visualization or High-quality Image */}
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-blue-500/5 px-12 py-8">
                            <div className="w-full space-y-4 opacity-50">
                                <div className="h-2 w-3/4 rounded-full bg-primary/20" />
                                <div className="h-2 w-full rounded-full bg-primary/10" />
                                <div className="h-2 w-1/2 rounded-full bg-primary/20" />
                                <div className="h-2 w-5/6 rounded-full bg-primary/10" />
                                <div className="h-2 w-2/3 rounded-full bg-primary/20" />
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/40">DATA_VIZ_ACTIVE</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Integration */}
                <section className="mb-24">
                    <header className="mb-12">
                        <h2 className="mb-4 text-3xl font-bold text-foreground tracking-tight">Real-time Performance Architecture</h2>
                        <p className="text-muted-foreground">Visualization of the agentic mesh operating within this environment.</p>
                    </header>
                    <div className="overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-xl">
                        <AgenticDashboard />
                    </div>
                </section>

                {/* CTA */}
                <div className="rounded-[2rem] bg-foreground p-12 text-background md:p-20 text-center">
                    <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">Ready for these results?</h2>
                    <p className="mx-auto mb-10 max-w-xl text-lg text-background/70">
                        Deploy the Invisioned Agentic Growth OS to your ecosystem and witness the leap in performance.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/contact"
                            className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground transition-all hover:scale-105"
                        >
                            GET YOUR AUDIT
                        </Link>
                        <Link
                            href="/services"
                            className="inline-flex h-14 items-center justify-center rounded-full border border-background/20 px-8 text-sm font-bold transition-all hover:bg-background/10"
                        >
                            VIEW TIERS
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
