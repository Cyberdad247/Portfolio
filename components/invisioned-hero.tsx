"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play } from "lucide-react";

const MotionLink = motion(Link);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 80, damping: 20 },
  },
};

export default function InvisionedHero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white text-zinc-900">
      {/* VIDEO LAYER */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-30 grayscale contrast-125"
        >
          <source src="/video/skyline-motion.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      </div>

      {/* CONTENT LAYER */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center px-6 pt-24 text-center"
      >
        {/* Main Heading - Z-Pattern Typography */}
        <motion.h1
          variants={itemVariants}
          className="text-balance text-6xl font-extrabold leading-[0.85] tracking-tighter md:text-8xl lg:text-9xl"
        >
          <span className="relative z-20 mb-[-0.5rem] block font-serif text-4xl font-normal italic lowercase tracking-normal text-yellow-500 md:mb-[-1rem] md:text-5xl lg:mb-[-1.5rem] lg:text-6xl">
            invisioned
          </span>
          <span className="uppercase text-zinc-800 drop-shadow-sm">
            MARKETING
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-zinc-600 md:text-2xl"
        >
          Turning <span className="font-bold text-zinc-900">Dreamers</span>{" "}
          into <span className="italic text-purple-600">Visionaries.</span>
        </motion.p>

        {/* CTA Cluster */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col items-center gap-6 md:flex-row md:justify-center"
        >
          <MotionLink
            href="/onboarding"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-3 rounded-full bg-zinc-900 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-purple-600"
          >
            <Play className="h-5 w-5 fill-current" />
            INITIATE PROJECT
          </MotionLink>
          <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-zinc-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            {"System Live // 2026"}
          </div>
        </motion.div>
      </motion.div>

      {/* BRAND ANCHOR: Grey Circle */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-200 bg-zinc-100 opacity-50">
          <div className="h-4 w-4 rounded-full bg-zinc-400" />
        </div>
      </div>

      {/* Bottom fade to dark - bridge to next section */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
