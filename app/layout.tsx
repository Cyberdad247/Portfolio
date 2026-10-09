import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { siteConfig } from "@/config/site";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
});

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair",
});

export const metadata: Metadata = {
	title: {
		default: siteConfig.defaultTitle,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.defaultDescription,
	icons: {
		icon: siteConfig.logo,
		apple: siteConfig.logo,
	},
	metadataBase: new URL(siteConfig.url),
	openGraph: {
		type: "website",
		locale: siteConfig.locale,
		url: siteConfig.url,
		siteName: siteConfig.name,
		images: [{ url: siteConfig.socialImage }],
	},
};

const orgSchema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: siteConfig.name,
	url: siteConfig.url,
	logo: `${siteConfig.url}${siteConfig.logo}`,
	description: siteConfig.defaultDescription,
	address: {
		"@type": "PostalAddress",
		addressLocality: "Digital",
		addressRegion: "Global",
		postalCode: "2026",
		addressCountry: "US",
	},
	contactPoint: {
		"@type": "ContactPoint",
		telephone: "+1-555-INV-2026",
		contactType: "customer service",
	},
};

const serviceSchema = {
	"@context": "https://schema.org",
	"@type": "Service",
	serviceType: "AI-Powered Digital Marketing",
	provider: {
		"@type": "Organization",
		name: siteConfig.name,
	},
	hasOfferCatalog: {
		"@type": "OfferCatalog",
		name: "Marketing OS Tiers",
		itemListElement: [
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "AI Strategy",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Growth Marketing",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "SEO/GEO Optimization",
				},
			},
		],
	},
};

const appSchema = {
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: "Agentic Nexus",
	operatingSystem: "Web-Based / Marketing OS",
	applicationCategory: "BusinessApplication",
	aggregateRating: {
		"@type": "AggregateRating",
		ratingValue: "4.9",
		reviewCount: "1245",
	},
};

export const viewport: Viewport = {
	themeColor: "#09090B",
	width: "device-width",
	initialScale: 1,
};

import { AmbientGlow } from "@/components/ui/neural-interface";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} font-sans antialiased text-white selection:bg-primary/30`}
			>
				<AmbientGlow />
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD schema is safe as it is generated from static data
					dangerouslySetInnerHTML={{
						__html: JSON.stringify([orgSchema, serviceSchema, appSchema]),
					}}
				/>
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
