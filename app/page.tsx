import Navbar from "@/components/navbar"
import InvisionedHero from "@/components/invisioned-hero"
import ServicesSection from "@/components/services-section"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main>
      <Navbar />
      <div id="hero">
        <InvisionedHero />
      </div>
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
