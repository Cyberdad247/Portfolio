"use client"

import { motion } from "framer-motion"
import {
  ArrowUpRight,
  BrainCircuit,
  LineChart,
  ShieldCheck,
} from "lucide-react"
import Image from "next/image"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100 },
  },
}

export default function InvisionedHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground md:p-8">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] z-0 h-[40vw] w-[40vw] rounded-full bg-primary/20 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] z-0 h-[30vw] w-[30vw] rounded-full bg-secondary/10 blur-[150px]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
      >
        {/* CELL 1: PRIMARY HERO (Spans 2 cols, 2 rows on large screens) */}
        <motion.div
          variants={itemVariants}
          className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card backdrop-blur-md md:col-span-2 lg:row-span-2"
        >
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-30">
            <Image
              src="/images/skyline.jpg"
              alt=""
              fill
              className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
              priority
            />
          </div>

          <div className="relative z-10 p-8">
            <h1 className="text-balance text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
              <span className="mb-[-10px] block text-3xl italic text-secondary md:text-4xl">
                invisioned
              </span>
              <span
                className="uppercase tracking-tighter text-foreground"
                style={{ textShadow: "0 0 25px rgba(168, 85, 247, 0.4)" }}
              >
                MARKETING
              </span>
            </h1>
            <h2 className="mt-4 text-xl font-light text-muted-foreground md:text-2xl">
              Agentic Research &{" "}
              <span className="font-medium text-primary">
                Business Consulting.
              </span>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              We deploy autonomous AI agents to decode market complexities,
              turning raw data into actionable business visions.
            </p>
          </div>

          <div className="relative z-10 p-8 pt-0">
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 30px rgba(168, 85, 247, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
              className="group mt-12 flex w-fit items-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30"
            >
              <BrainCircuit className="h-6 w-6 group-hover:animate-pulse" />
              DEPLOY RESEARCH AGENTS
            </motion.button>
          </div>
        </motion.div>

        {/* CELL 2: BRAND PHILOSOPHY */}
        <motion.div
          variants={itemVariants}
          className="group col-span-1 flex items-center gap-6 overflow-hidden rounded-3xl border border-border bg-card backdrop-blur-md transition-colors hover:border-primary/50 lg:col-span-2"
        >
          <div className="relative shrink-0 p-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="relative z-10"
            >
              <Image
                src="/images/seal.jpg"
                alt="Turning Dreamers Into Visionaries Seal"
                width={128}
                height={128}
                className="h-24 w-24 rounded-full object-cover md:h-32 md:w-32"
              />
            </motion.div>
            <div className="absolute inset-0 z-0 rounded-full bg-primary/40 blur-[40px]" />
          </div>
          <div className="pr-6">
            <h3 className="flex items-center gap-2 text-xl font-bold uppercase tracking-wider text-foreground">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              The Visionary Protocol
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Our core mission: bridging the gap between abstract ideas and
              concrete market dominance. We turn &quot;what if&quot; into
              &quot;what is.&quot;
            </p>
          </div>
        </motion.div>

        {/* CELL 3: METRICS / AGENT STATUS */}
        <motion.div
          variants={itemVariants}
          className="group col-span-1 flex flex-col justify-between rounded-3xl border border-border bg-card p-6 backdrop-blur-md transition-colors hover:bg-muted/50"
        >
          <div className="flex items-start justify-between">
            <LineChart className="h-8 w-8 text-primary" />
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
          </div>
          <div className="mt-8">
            <div className="font-mono text-4xl font-bold text-foreground">
              8,420+
            </div>
            <div className="mt-1 text-sm uppercase tracking-wider text-muted-foreground">
              Data Points Analyzed/Hr
            </div>
          </div>
        </motion.div>

        {/* CELL 4: SECONDARY CTA */}
        <motion.div
          variants={itemVariants}
          className="group relative col-span-1 flex cursor-pointer flex-col justify-end overflow-hidden rounded-3xl border border-border bg-card p-6 backdrop-blur-md"
        >
          <div className="absolute right-0 top-0 p-6 opacity-50 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100">
            <ArrowUpRight className="h-8 w-8 text-secondary" />
          </div>
          <h3 className="relative z-10 text-xl font-bold text-foreground">
            Explore Consulting Services
          </h3>
          <p className="relative z-10 mt-2 text-sm text-muted-foreground transition-colors group-hover:text-foreground/80">
            See how our human+AI hybrid models redefine strategy.
          </p>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </motion.div>
      </motion.div>
    </section>
  )
}
