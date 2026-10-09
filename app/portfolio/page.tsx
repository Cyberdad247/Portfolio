import type { Metadata } from "next";
import PortfolioDigitalCard from "@/components/portfolio-digital-card";

export const metadata: Metadata = {
	title: 'Portfolio & Digital Business Card | VaShawn "Vizion" Head',
	description:
		'Official portfolio and executive digital business card of VaShawn "Vizion" Head. AI Operations, Brand Worlds, Living Typographic Orbit, and 1-tap contact. 216-586-4607.',
	openGraph: {
		title: 'Portfolio & Digital Business Card | VaShawn "Vizion" Head',
		description:
			"Ideas shaped into reality. Explore selected works and save contact directly.",
		url: "https://invisionedmarketing.agency/portfolio",
		siteName: "Invisioned Marketing",
		images: [
			{
				url: "/images/ai-architect-i.png",
				width: 1536,
				height: 1024,
				alt: "Invisioned Marketing Portfolio & Digital Business Card",
			},
		],
		type: "profile",
	},
};

export default function PortfolioPage() {
	return (
		<main className="min-h-screen bg-[#07050d] text-foreground antialiased selection:bg-[#792cff]/30 selection:text-[#c9a23f]">
			<PortfolioDigitalCard />
		</main>
	);
}
