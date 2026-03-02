import ContactSection from "@/components/contact-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Invisioned Marketing",
    description: "Get in touch with Invisioned Marketing and schedule your AI-powered marketing audit today.",
};

export default function ContactPage() {
    return (
        <main className="pt-32">
            <ContactSection />
        </main>
    );
}
