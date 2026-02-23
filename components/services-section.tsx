"use client"

import { motion } from "framer-motion"
import {
  BrainCircuit,
  BarChart3,
  Search,
  Target,
  Zap,
  Users,
} from "lucide-react"

const services = [
  {
    icon: BrainCircuit,
    title: "Agentic Market Research",
    description:
      "Autonomous AI agents that continuously scan, analyze, and synthesize market intelligence across thousands of data sources in real time.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Strategy",
    description:
      "Transform complex datasets into clear strategic roadmaps with our proprietary analytics frameworks and predictive modeling.",
  },
  {
    icon: Search,
    title: "Competitive Intelligence",
    description:
      "Deep-dive competitive analysis using AI-powered monitoring systems that track market movements, pricing shifts, and emerging threats.",
  },
  {
    icon: Target,
    title: "Brand Positioning",
    description:
      "Precision brand strategy informed by sentiment analysis, audience segmentation, and cultural trend mapping at scale.",
  },
  {
    icon: Zap,
    title: "Growth Acceleration",
    description:
      "Identify and exploit high-impact growth vectors through automated opportunity scoring and rapid market validation.",
  },
  {
    icon: Users,
    title: "Human+AI Consulting",
    description:
      "Expert consultants augmented by AI copilots deliver strategic guidance that blends human intuition with machine precision.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80 },
  },
}

export default function ServicesSection() {
  return (
    <section id="services" className="relative bg-background px-4 py-24 md:px-8">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute right-[10%] top-[20%] z-0 h-[30vw] w-[30vw] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            What We Do
          </span>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-bold text-foreground md:text-5xl">
            Our collection of AI-powered services spans every stage of business
            transformation.
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Explore how we help businesses transform with autonomous research
            agents and strategic consulting.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-muted/30"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-6">
                <span className="text-sm font-medium text-primary transition-colors group-hover:text-secondary">
                  Learn more
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
