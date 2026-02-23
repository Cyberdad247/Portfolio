"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import Image from "next/image"

const pillars = [
  "Autonomous AI agents for continuous market monitoring",
  "Proprietary data pipelines processing 100K+ sources daily",
  "Human-in-the-loop validation for strategic recommendations",
  "Real-time dashboards with actionable intelligence",
]

const stats = [
  { value: "150+", label: "Clients Served" },
  { value: "2.4M", label: "Data Points Daily" },
  { value: "98%", label: "Client Retention" },
  { value: "24/7", label: "Agent Uptime" },
]

export default function AboutSection() {
  return (
    <section id="about" className="relative bg-background px-4 py-24 md:px-8">
      <div className="pointer-events-none absolute bottom-[10%] left-[5%] z-0 h-[25vw] w-[25vw] rounded-full bg-secondary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Image + Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-border">
              <Image
                src="/images/skyline.jpg"
                alt="Invisioned Marketing office"
                width={640}
                height={420}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              {/* Stats overlay */}
              <div className="absolute bottom-0 left-0 right-0 grid grid-cols-2 gap-px bg-border/30 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-background/90 px-4 py-4 text-center backdrop-blur-sm"
                  >
                    <div className="font-mono text-2xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: About Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              About Us
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-4xl">
              Where deep tech meets a visionary mindset
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Invisioned Marketing is a collective of strategists, data
              scientists, and AI engineers bound together by a passion for using
              technology to drive business transformation. We believe the future
              of consulting is autonomous, intelligent, and always on.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {pillars.map((pillar) => (
                <div key={pillar} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{pillar}</span>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-10 rounded-xl border border-primary bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              Learn More About Our Mission
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
