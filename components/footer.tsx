import { BrainCircuit } from "lucide-react"

const footerLinks = {
  Services: [
    "Agentic Research",
    "Data Strategy",
    "Competitive Intelligence",
    "Brand Positioning",
    "Growth Acceleration",
    "AI Consulting",
  ],
  Company: ["About", "Careers", "Blog", "Press"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <div className="flex flex-col leading-none">
                <span className="text-sm italic text-secondary">
                  invisioned
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Marketing
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Turning Dreamers Into Visionaries. AI-powered research and
              consulting for the modern enterprise.
            </p>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {heading}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Invisioned Marketing. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
