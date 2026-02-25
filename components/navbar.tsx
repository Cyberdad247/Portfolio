"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Solutions", href: "#services" },
  { label: "Agentic Data", href: "#dashboard" },
  { label: "Philosophy", href: "#about" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed left-1/2 top-6 z-50 w-[92%] max-w-5xl -translate-x-1/2">
      <div className="flex items-center justify-between rounded-full border border-border bg-card backdrop-blur-xl px-6 py-3 md:px-8 md:py-4">
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-3">
          <img
            src="/images/seal.jpg"
            alt="Invisioned seal"
            className="h-9 w-9 rounded-full object-cover animate-pulse"
          />
          <span className="text-lg font-bold uppercase tracking-tighter text-foreground">
            Invisioned{" "}
            <span className="text-primary">Wealth</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className="hidden rounded-full bg-foreground px-5 py-2 text-sm font-bold text-background transition-all hover:bg-primary hover:text-foreground md:inline-block"
        >
          {"INITIATE // 2026"}
        </a>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-foreground md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-2 rounded-2xl border border-border bg-card backdrop-blur-xl"
          >
            <div className="flex flex-col gap-3 px-6 py-5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="mt-2 w-fit rounded-full bg-foreground px-5 py-2 text-sm font-bold text-background"
              >
                {"INITIATE // 2026"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
