import AgencyAnnouncementBar from "@/components/agency/agency-announcement-bar";
import AgencyHeritageSection from "@/components/agency/agency-heritage-section";
import AgencySolutionsGallery from "@/components/agency/agency-solutions-gallery";
import VirtualAgencyCouncil from "@/components/agency/virtual-agency-council";
import AgenticDashboard from "@/components/agentic-dashboard";
import ContactSection from "@/components/contact-section";
import InvisionedHero from "@/components/invisioned-hero";
import TestimonialsSection from "@/components/testimonials-section";

export default function Home() {
	return (
		<main className="bg-black text-white">
			{/* 1. Top Announcement Bar (Lisa Structure) */}
			<AgencyAnnouncementBar />

			{/* 2. Hero Section */}
			<div id="hero">
				<InvisionedHero />
			</div>

			{/* 3. Founder Heritage & Vision Section (Lisa Structure) */}
			<div id="heritage">
				<AgencyHeritageSection />
			</div>

			{/* 4. Sovereign Virtual Agency Fleet & Council */}
			<div id="agency">
				<VirtualAgencyCouncil />
			</div>

			{/* 5. Handcrafted Solutions Gallery (Lisa Structure) */}
			<div id="solutions">
				<AgencySolutionsGallery />
			</div>

			{/* 6. Agentic Mission Control & Analytics */}
			<AgenticDashboard />

			{/* 7. Client Proof & Testimonials */}
			<TestimonialsSection />

			{/* 8. Direct Contact & Hotline Channel */}
			<ContactSection />
		</main>
	);
}
