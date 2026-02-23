"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"

export default function ContactSection() {
  return (
    <section id="contact" className="relative bg-background px-4 py-24 md:px-8">
      <div className="pointer-events-none absolute right-[5%] top-[30%] z-0 h-[20vw] w-[20vw] rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Join Us
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-5xl">
              Ready to turn your vision into reality?
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
              We are the strategic architects of Invisioned Marketing -- a
              leading AI-powered consultancy helping businesses succeed in their
              most important transformations.
            </p>

            <div className="mt-10 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-sm">contact@invisioned.marketing</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-sm">+1 (555) 234-5678</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-3xl border border-border bg-card p-8 backdrop-blur-md"
          >
            <h3 className="text-xl font-bold text-foreground">
              Start a conversation
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us about your project and we&apos;ll get back within 24
              hours.
            </p>

            <form className="mt-8 flex flex-col gap-5">
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
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-lg hover:shadow-primary/25"
              >
                Send Message
                <ArrowUpRight className="h-4 w-4" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
