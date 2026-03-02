import Link from "next/link";
import { services } from "@/config/services.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Services",
    description: "Explore Invisioned Marketing's Agentic Growth OS service tiers for launch, scale, and enterprise growth.",
};

export default function ServicesPage() {
    return (
        <div className="relative min-h-screen bg-background pt-32 pb-24 px-4 md:px-8">
            {/* Ambient background glows */}
            <div className="pointer-events-none absolute left-[-10%] top-[10%] z-0 h-[60vw] w-[60vw] rounded-full bg-primary/5 blur-[150px]" />
            <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] z-0 h-[40vw] w-[40vw] rounded-full bg-secondary/3 blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-6xl">
                <header className="mb-16 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                        Agentic Growth <span className="text-primary italic font-serif">OS</span> Services
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        Choose the level of Agentic Growth OS that matches your current stage. All tiers share the same principles:
                        measurable lead growth, experiment velocity, and clear attribution.
                    </p>
                </header>

                <div className="grid gap-8 md:grid-cols-3">
                    {services.map((s) => (
                        <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
                        >
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                            <div className="relative z-10">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-6 text-primary border border-primary/20">
                                    <span className="font-mono text-lg font-bold">0{services.indexOf(s) + 1}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-4">{s.name}</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6 italic">"{s.summary}"</p>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">Best For</p>
                                    <p className="text-sm text-foreground/80">{s.fit}</p>
                                </div>
                            </div>

                            <div className="relative z-10 mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary group-hover:gap-4 transition-all duration-300">
                                <span>View Details</span>
                                <span>//</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-20 rounded-3xl border border-border bg-card/30 p-12 backdrop-blur-md text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Not sure which tier you need?</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Let's run a free Agentic Audit against your current funnel and campaigns to identify the most immediate growth levers.
                    </p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground hover:scale-105 active:scale-95 transition-all"
                    >
                        Book Your Free Audit // 2026
                    </Link>
                </div>
            </div>
        </div>
    );
}
