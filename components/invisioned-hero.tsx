"use client"

import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
}

export default function InvisionedHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-32 md:px-8">
      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 z-0 h-[50vw] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-[30vw] w-[30vw] rounded-full bg-secondary/5 blur-[120px]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        {/* Brand Name */}
        <motion.div variants={itemVariants}>
          <h1 className="text-balance text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
            <span className="block text-3xl italic text-secondary md:text-4xl lg:text-5xl">
              Invisioned
            </span>
            <span
              className="uppercase text-foreground"
              style={{ textShadow: "0 0 40px rgba(168, 85, 247, 0.3)" }}
            >
              Marketing
            </span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mt-8 max-w-2xl text-xl font-light leading-relaxed text-muted-foreground md:text-2xl"
        >
          Dreams don&apos;t come true,{" "}
          <span className="font-medium text-primary">visions</span> do
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.a
            href="#services"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20"
          >
            Our Services
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-border bg-card px-8 py-4 text-base font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary/50"
          >
            Get in Touch
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  )
}
