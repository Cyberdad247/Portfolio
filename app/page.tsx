import AboutSection from "@/components/about-section";
import AgenticDashboard from "@/components/agentic-dashboard";
import ContactSection from "@/components/contact-section";
import InvisionedHero from "@/components/invisioned-hero";
import ServicesSection from "@/components/services-section";
import TestimonialsSection from "@/components/testimonials-section";

export default function Home() {
	return (
		<main>
			<div id="hero">
				<InvisionedHero />
			</div>
			<ServicesSection />
			<TestimonialsSection />
			<AgenticDashboard />
			<AboutSection />
			<ContactSection />
		</main>
	);
}
