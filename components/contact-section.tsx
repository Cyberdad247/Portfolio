"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

export default function ContactSection() {
  return (
    <section id="contact" className="relative bg-background px-4 py-24 md:px-8">
      <div className="pointer-events-none absolute right-[5%] top-[30%] z-0 h-[20vw] w-[20vw] rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-5xl">
            Get in Touch
          </h2>
        </motion.div>

        {/* Contact Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-border bg-card p-8 backdrop-blur-md"
        >
          <form className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="John"
                  suppressHydrationWarning
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Doe"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="john@company.com"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Tell us about your project..."
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              suppressHydrationWarning
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-lg hover:shadow-primary/25"
            >
              Send Message
              <ArrowUpRight className="h-4 w-4" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
