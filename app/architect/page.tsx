import type { Metadata } from "next";
import Link from "next/link";
import AIArchitectOrbit from "@/components/ai-architect-orbit";

export const metadata: Metadata = {
	title: "The A.I. Architect | Living Typographic Orbit",
	description:
		"Invisioned Marketing's A.I. Architect: A living typographic orbit surrounding the central ocular intelligence core on pure white canvas.",
	openGraph: {
		title: "The A.I. Architect | Living Typographic Orbit",
		description:
			"Ideas orbiting an intelligence engine. Words circulate around the central I with unpredictable flashes and dynamic positioning.",
		url: "https://invisionedmarketing.agency/architect",
		images: [
			{
				url: "/images/ai-architect-i.png",
				width: 1536,
				height: 1024,
				alt: "A.I. Architect Central I",
			},
		],
	},
};

export default function ArchitectPage() {
	return (
		<main className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-[#792cff]/20 selection:text-[#792cff]">
			{/* Top Bar Navigation */}
			<header className="w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
				<Link
					href="/"
					className="flex items-center gap-3 text-neutral-900 font-extrabold tracking-tight group"
				>
					<span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#792cff] to-[#c9a23f] flex items-center justify-center text-white text-sm font-black shadow-md">
						I
					</span>
					<span className="text-sm tracking-wider uppercase font-black">
						INVISIONED <span className="text-[#c9a23f]">MARKETING</span>
					</span>
				</Link>

				<div className="flex items-center gap-4">
					<Link
						href="/card"
						className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#792cff] transition-colors"
					>
						Digital Card
					</Link>
					<Link
						href="/ai-agents"
						className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#792cff] transition-colors"
					>
						HIVE Fleet
					</Link>
					<a
						href="tel:+12165864607"
						className="px-4 py-2 rounded-full border border-[#c9a23f] text-[#c9a23f] hover:bg-[#c9a23f] hover:text-white transition-all text-xs font-bold tracking-wider uppercase"
					>
						Call (216) 586-4607
					</a>
				</div>
			</header>

			{/* The Pure White Living Typographic Orbit */}
			<div className="flex-1 flex items-center justify-center">
				<AIArchitectOrbit />
			</div>

			{/* Footer Attribution */}
			<footer className="w-full border-t border-neutral-100 py-6 px-6 text-center text-xs text-neutral-400">
				<span>
					© {new Date().getFullYear()} Invisioned Marketing. The A.I. Architect Living Typographic Orbit.
				</span>
				<div className="mt-1 flex items-center justify-center gap-4">
					<a href="mailto:invisionedmarketing@gmail.com" className="hover:text-[#792cff]">
						invisionedmarketing@gmail.com
					</a>
					<span>•</span>
					<a href="tel:+12165864607" className="hover:text-[#c9a23f]">
						(216) 586-4607
					</a>
				</div>
			</footer>
		</main>
	);
}
