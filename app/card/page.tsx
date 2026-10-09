import type { Metadata } from "next";
import DigitalBusinessCard from "@/components/digital-business-card";

export const metadata: Metadata = {
	title: 'VaShawn "Vizion" Head | Invisioned Marketing Digital Card',
	description:
		'Founder & Creative Technologist at Invisioned Marketing. Strategy, AI Agents, Web Experiences & Systems. 216-586-4607.',
	openGraph: {
		title: 'VaShawn "Vizion" Head | Digital Business Card',
		description:
			"Dreams don't come true, visions do. Connect with Invisioned Marketing.",
		url: "https://invisionedmarketing.agency/card",
		siteName: "Invisioned Marketing",
		images: [
			{
				url: "/images/logo.webp",
				width: 512,
				height: 512,
				alt: "Invisioned Marketing",
			},
		],
		type: "profile",
	},
	twitter: {
		card: "summary",
		title: 'VaShawn "Vizion" Head | Digital Business Card',
		description: "Invisioned Marketing · Strategy · Systems · Storytelling",
	},
};

export default function CardPage() {
	return (
		<main className="min-h-screen bg-black text-foreground antialiased selection:bg-[#a855f7]/30 selection:text-[#f6c85f]">
			<DigitalBusinessCard />
		</main>
	);
}
