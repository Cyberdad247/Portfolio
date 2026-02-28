"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Invisioned Marketing transformed our digital presence. Their AI-driven strategies increased our engagement by 300% in just three months.",
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
  },
  {
    quote:
      "The personalized AI chatbot they developed for us has revolutionized our customer service. Response times are down 80%.",
    name: "Michael Chen",
    role: "Marketing Director, GlobalTech",
  },
  {
    quote:
      "Their data-driven approach to social media management helped us target the right audience. Our ROI has never been better.",
    name: "Emma Rodriguez",
    role: "Founder, EcoStyle",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 80 },
  },
}

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative bg-background px-4 py-24 md:px-8"
    >
      <div className="pointer-events-none absolute left-[10%] top-[30%] z-0 h-[25vw] w-[25vw] rounded-full bg-secondary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-5xl">
            What Our Clients Say
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              className="group flex flex-col rounded-2xl border border-border bg-card p-8 backdrop-blur-sm transition-colors hover:border-primary/30"
            >
              <Quote className="mb-4 h-8 w-8 text-primary/40" />
              <p className="flex-1 text-base leading-relaxed text-muted-foreground italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-border pt-6">
                <h4 className="text-base font-bold text-foreground">
                  {testimonial.name}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
