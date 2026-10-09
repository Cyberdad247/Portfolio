import type { Metadata } from "next";
import PortfolioDigitalCard from "@/components/portfolio-digital-card";

export const metadata: Metadata = {
	title: 'VaShawn "Vizion" Head | Portfolio & Digital Business Card',
	description:
		'Founder & Creative Technologist at Invisioned Marketing. Explore our portfolio, autonomous AI agents, living typographic orbit, and save digital card. 216-586-4607.',
	openGraph: {
		title: 'VaShawn "Vizion" Head | Portfolio & Digital Business Card',
		description:
			"Dreams don't come true, visions do. Explore portfolio works and connect directly with Invisioned Marketing.",
		url: "https://invisionedmarketing.agency/card",
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
	twitter: {
		card: "summary_large_image",
		title: 'VaShawn "Vizion" Head | Portfolio & Digital Business Card',
		description: "Invisioned Marketing · Strategy · Systems · Storytelling · 216-586-4607",
		images: ["/images/ai-architect-i.png"],
	},
};

export default function CardPage() {
	return (
		<main className="min-h-screen bg-[#07050d] text-foreground antialiased selection:bg-[#792cff]/30 selection:text-[#c9a23f]">
			<PortfolioDigitalCard />
		</main>
	);
}
