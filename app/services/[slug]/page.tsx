"use client";

import { services } from "@/config/services.config";
import {
    ArrowLeft,
    CheckCircle2,
    HelpCircle,
    Target,
    Terminal,
    Zap,
    ShieldCheck,
    Layers
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { use } from "react";

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const service = services.find((s) => s.slug === slug);

    if (!service) {
        return (
            <div className="flex min-h-screen items-center justify-center pt-24 bg-background">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-foreground mb-4 italic">Protocol Redacted.</h1>
                    <p className="text-muted-foreground mb-8">Service tier identifier invalid or unauthorized // 404.</p>
                    <Link href="/services" className="text-primary font-bold hover:underline underline-offset-4 font-mono uppercase tracking-widest text-xs">
                        RETURN TO REPOSITORY
                    </Link>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <main className="relative min-h-screen bg-background pt-40 pb-32 overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="pointer-events-none absolute left-[-20%] top-[-10%] z-0 h-[60vw] w-[60vw] rounded-full bg-primary/5 blur-[150px]" />
            <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] z-0 h-[40vw] w-[40vw] rounded-full bg-secondary/3 blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
                {/* Breadcrumb */}
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Link href="/services" className="mb-12 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-3 w-3" />
                        Service Directory
                    </Link>
                </motion.div>

                {/* Hero Section */}
                <header className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <div className="mb-6 inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/20">
                            Growth OS Tier // {service.slug.replace("agentic-", "").toUpperCase()}
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tighter text-foreground md:text-8xl mb-8">
                            {service.name.split(" ")[0]} <span className="text-primary italic font-serif font-medium">{service.name.split(" ")[1]}</span>
                        </h1>
                        <p className="max-w-3xl text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                            {service.description}
                        </p>
                    </motion.div>
                </header>

                <div className="grid gap-16 lg:grid-cols-3">
                    {/* Left & Center: Key Features & Deliverables */}
                    <div className="lg:col-span-2 space-y-20">
                        {/* Core Outcomes */}
                        <motion.section variants={containerVariants} initial="hidden" animate="visible">
                            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground mb-10 flex items-center gap-3">
                                <Target className="h-4 w-4 text-primary" />
                                Strategic Outcomes
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-1">
                                {service.outcomes.map((outcome, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={itemVariants}
                                        className="group relative flex items-start gap-5 rounded-2xl border border-border bg-card/40 p-6 transition-all hover:bg-card/60 hover:border-primary/30"
                                    >
                                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <p className="text-lg text-foreground/90 leading-snug">{outcome}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Deliverables */}
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground mb-10 flex items-center gap-3">
                                <Terminal className="h-4 w-4 text-secondary" />
                                Integration Manifest
                            </h2>
                            <div className="grid gap-6">
                                {service.deliverables.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-6 group">
                                        <div className="h-px flex-1 bg-border group-hover:bg-primary/30 transition-colors" />
                                        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Sidebar Info & CTA */}
                    <aside className="space-y-12">
                        {/* Best Fit Card */}
                        <div className="rounded-3xl border border-border bg-muted/20 p-8 backdrop-blur-xl">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Mission Compatibility</h2>
                            <p className="text-lg font-medium text-foreground leading-relaxed italic">
                                "{service.fit}"
                            </p>
                            <div className="mt-8 pt-8 border-t border-border">
                                <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                                    <Zap className="h-3 w-3 text-yellow-500" />
                                    <span>High Experiment Velocity</span>
                                </div>
                                <div className="mt-3 flex items-center gap-3 text-xs font-mono text-muted-foreground">
                                    <ShieldCheck className="h-3 w-3 text-green-500" />
                                    <span>End-to-End Attribution</span>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Quick View */}
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                                <HelpCircle className="h-3 w-3" /> Common Queries
                            </h2>
                            <div className="space-y-6">
                                {service.faqs.map((faq, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <p className="text-sm font-bold text-foreground">{faq.question}</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Static CTA Button */}
                        <Link
                            href="/contact"
                            className="flex h-16 w-full items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            INITIATE AUDIT // 2026
                        </Link>
                    </aside>
                </div>

                {/* Bottom Visual Bridge */}
                <div className="mt-32 pt-24 border-t border-border/50 text-center">
                    <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground opacity-50 mb-12">
                        Sovereign Infrastructure // Secure Protocol // Agentic Outcomes
                    </p>
                    <div className="flex justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        <Layers className="h-8 w-8" />
                        <ShieldCheck className="h-8 w-8" />
                        <Zap className="h-8 w-8" />
                        <Target className="h-8 w-8" />
                    </div>
                </div>
            </div>
        </main>
    );
}
