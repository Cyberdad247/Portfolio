"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutSection() {
  return (
    <section id="about" className="relative bg-background px-4 py-24 md:px-8">
      <div className="pointer-events-none absolute bottom-[10%] left-[5%] z-0 h-[25vw] w-[25vw] rounded-full bg-secondary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-border">
              <Image
                src="/images/skyline.jpg"
                alt="Invisioned Marketing - AI-powered digital marketing"
                width={640}
                height={420}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Right: About Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
              About Us
            </h2>
            <h3 className="mt-4 text-xl font-semibold text-primary md:text-2xl">
              Shaping the Future of Digital Marketing with AI
            </h3>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              At Invisioned Marketing, we revolutionize the digital landscape by
              merging cutting-edge artificial intelligence with human creativity.
              Our mission is clear: to deliver AI-powered marketing strategies
              that are smarter, faster, and designed to drive measurable results.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              As a team of data experts, creative storytellers, and technology
              innovators, we empower businesses to thrive in an increasingly
              competitive digital world. From personalized customer experiences
              to dynamic advertising campaigns and real-time data-driven
              insights, we specialize in transforming how brands engage and grow
              their audiences.
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-card p-6 backdrop-blur-sm">
              <p className="text-sm font-medium leading-relaxed text-foreground">
                Ready to transform your marketing?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Schedule a one-on-one consultation with a member of our team
                today and discover how Invisioned Marketing can unlock your
                business&apos;s full potential.
              </p>
              <motion.a
                href="#contact"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 24px rgba(168, 85, 247, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
              >
                Schedule Your Consultation
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
