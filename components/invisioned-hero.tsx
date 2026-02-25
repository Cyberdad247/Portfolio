"use client"

import { motion } from "framer-motion"
import { BrainCircuit, Zap } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
}

export default function InvisionedHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Parallax Skyline Background */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-[url('/images/skyline.jpg')] bg-cover bg-center grayscale"
      />

      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 z-[1] h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[180px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 z-[1] h-[30vw] w-[30vw] rounded-full bg-secondary/5 blur-[120px]" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-32 text-center"
      >
        {/* System Status Badge */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2"
        >
          <Zap className="h-3 w-3 text-secondary" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {"System Status: Active // Agentic Research"}
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-balance text-6xl font-extrabold leading-[0.9] tracking-tighter md:text-8xl lg:text-9xl"
        >
          <span className="text-foreground">TURNING </span>
          <span className="bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
            DREAMERS
          </span>
          <br />
          <span className="text-foreground">INTO </span>
          <span className="font-serif italic font-normal lowercase tracking-normal text-secondary">
            visionaries.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          A hyper-realistic interface for{" "}
          <span className="text-foreground font-medium">Invisioned Marketing</span>.
          Bridging the gap between human intuition and agentic intelligence.
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants} className="mt-12">
          <motion.a
            href="#services"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 60px rgba(168, 85, 247, 0.5)",
            }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 rounded-2xl bg-primary px-10 py-5 text-base font-bold text-primary-foreground shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-shadow"
          >
            <BrainCircuit className="h-6 w-6" />
            DEPLOY AGENTS
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  )
}
