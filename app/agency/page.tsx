import type { Metadata } from "next";
import Link from "next/link";
import VirtualAgencyCouncil from "@/components/agency/virtual-agency-council";

export const metadata: Metadata = {
	title: "Sovereign Virtual Digital Agency | Invisioned Marketing",
	description:
		"An AI-Native Digital Agency operated by an orchestrated council of specialized Sovereign Knights from the Camelot-OS CloudBrain. High-altitude strategy, luxury brand worlds, sub-second web systems, and 24/7 voice operations.",
	openGraph: {
		title: "Sovereign Virtual Digital Agency | Invisioned Marketing",
		description:
			"An AI-Native Digital Agency operated by specialized Knights from the Camelot-OS CloudBrain. High-altitude strategy, luxury brand worlds, sub-second web systems, and 24/7 voice operations.",
		url: "https://invisionedmarketing.agency/agency",
		siteName: "Invisioned Marketing",
		images: [
			{
				url: "/images/ai-architect-i.png",
				width: 1536,
				height: 1024,
				alt: "Invisioned Marketing Sovereign Virtual Digital Agency",
			},
		],
		type: "website",
	},
};

export default function AgencyPage() {
	return (
		<main className="min-h-screen bg-[#090712] text-foreground antialiased selection:bg-[#792cff]/30 selection:text-[#c9a23f]">
			{/* Breadcrumb Header */}
			<div className="pt-24 pb-6 px-6 max-w-7xl mx-auto flex items-center justify-between border-b border-white/10">
				<div className="flex items-center gap-3">
					<Link
						href="/"
						className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
					>
						Home
					</Link>
					<span className="text-slate-600">/</span>
					<span className="text-xs font-bold uppercase tracking-wider text-[#c9a23f]">
						Virtual Agency Fleet
					</span>
				</div>

				<div className="flex items-center gap-4">
					<Link
						href="/card"
						className="text-xs font-bold uppercase tracking-wider text-purple-300 hover:text-white transition-colors"
					>
						Digital Card
					</Link>
					<Link
						href="/architect"
						className="text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-white transition-colors"
					>
						A.I. Orbit
					</Link>
				</div>
			</div>

			{/* Full Virtual Agency Council Command Deck */}
			<VirtualAgencyCouncil />
		</main>
	);
}
