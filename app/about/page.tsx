import type { Metadata } from "next";
import AboutSection from "@/components/about-section";

export const metadata: Metadata = {
	title: "About Us | Invisioned Marketing",
	description:
		"Learn how Invisioned Marketing is shaping the future of digital marketing with AI-driven strategies and human creativity.",
};

export default function AboutPage() {
	return (
		<main className="pt-20">
			<AboutSection />
		</main>
	);
}
