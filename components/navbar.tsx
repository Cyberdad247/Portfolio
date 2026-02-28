"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Solutions", href: "#services" },
  { label: "Agentic Data", href: "#dashboard" },
  { label: "Philosophy", href: "#brand-philosophy-anchor" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className="fixed left-1/2 top-6 z-50 w-[92%] max-w-5xl -translate-x-1/2">
      <motion.div
        animate={{
          backgroundColor: scrolled
            ? "rgba(24, 24, 27, 0.85)"
            : "rgba(255, 255, 255, 0.7)",
          borderColor: scrolled
            ? "rgba(39, 39, 42, 0.8)"
            : "rgba(228, 228, 231, 0.8)",
        }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between rounded-full px-6 py-3 backdrop-blur-xl md:px-8 md:py-4"
        style={{ border: "1px solid" }}
      >
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-3">
          <img
            src="/images/seal.jpg"
            alt="Invisioned seal"
            className="h-9 w-9 rounded-full object-cover"
          />
          <span
            className={`text-lg font-bold uppercase tracking-tighter transition-colors duration-400 ${
              scrolled ? "text-white" : "text-zinc-900"
            }`}
          >
            Invisioned{" "}
            <span className={scrolled ? "text-primary" : "text-purple-600"}>
              Marketing
            </span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-400 ${
                scrolled
                  ? "text-zinc-400 hover:text-white"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className={`hidden rounded-full px-5 py-2 text-sm font-bold transition-all duration-400 md:inline-block ${
            scrolled
              ? "bg-white text-zinc-900 hover:bg-primary hover:text-white"
              : "bg-zinc-900 text-white hover:bg-purple-600"
          }`}
        >
          {"INITIATE // 2026"}
        </a>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`transition-colors duration-400 md:hidden ${
            scrolled ? "text-white" : "text-zinc-900"
          }`}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`mt-2 rounded-2xl backdrop-blur-xl ${
              scrolled
                ? "border border-border bg-card"
                : "border border-zinc-200 bg-white/90"
            }`}
          >
            <div className="flex flex-col gap-3 px-6 py-5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium transition-colors ${
                    scrolled
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className={`mt-2 w-fit rounded-full px-5 py-2 text-sm font-bold ${
                  scrolled
                    ? "bg-foreground text-background"
                    : "bg-zinc-900 text-white"
                }`}
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
