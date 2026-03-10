import type { MetadataRoute } from "next";
import { caseStudies } from "@/config/case-studies.config";
import { services } from "@/config/services.config";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = siteConfig.url;

	const staticRoutes = [
		"",
		"/about",
		"/services",
		"/case-studies",
		"/contact",
		"/onboarding",
		"/deep-dive",
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: route === "" ? 1 : 0.8,
	}));

	const serviceRoutes = services.map((service) => ({
		url: `${baseUrl}/services/${service.slug}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	const caseStudyRoutes = caseStudies.map((study) => ({
		url: `${baseUrl}/case-studies/${study.slug}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	return [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes];
}
