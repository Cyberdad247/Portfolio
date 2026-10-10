export type OpsStatus = "ready" | "needs_setup" | "blocked";

export type AgencySolutionSlot = {
	id: string;
	title: string;
	tagline: string;
	category: string;
	turnaround: string;
	metric: { label: string; value: string };
	features: string[];
	status: OpsStatus;
};

export type BackendWorkflow = {
	key: string;
	label: string;
	status: OpsStatus;
	nextAction: string;
};

export type DeliveryChecklistItem = {
	key: string;
	label: string;
	owner: "Strategy" | "Creative" | "Engineering" | "Deployment" | "Operations";
	status: OpsStatus;
};

export type AgencyStorefrontConfig = {
	clientName: string;
	agencyDomain: string;
	storefrontProject: string;
	motto: string;
	operator: {
		name: string;
		title: string;
		phone: string;
		email: string;
		location: string;
		bio: string;
	};
	brandColors: {
		primary: string;
		accent: string;
		secondary: string;
		neutral: string;
	};
	announcement: {
		enabled: boolean;
		badge: string;
		text: string;
		linkText: string;
		linkUrl: string;
	};
	hero: {
		badge: string;
		headlineTop: string;
		headlineAccent: string;
		subcopy: string;
		primaryCta: string;
		primaryCtaLink: string;
		secondaryCta: string;
		secondaryCtaLink: string;
		featuredLabel: string;
		featuredCaption: string;
	};
	heritage: {
		sectionBadge: string;
		headline: string;
		subheadline: string;
		narrativeParagraph1: string;
		narrativeParagraph2: string;
		quote: string;
		credentialsBadge: string;
	};
	solutions: AgencySolutionSlot[];
	backendWorkflows: BackendWorkflow[];
	deliveryChecklist: DeliveryChecklistItem[];
	updatedAt: string;
};

export const defaultAgencyConfig: AgencyStorefrontConfig = {
	clientName: "Invisioned Marketing Inc.",
	agencyDomain: "invisionedmarketing.agency",
	storefrontProject: "Cyberdad247/Portfolio",
	motto: "Dreams don't come true, visions do",
	operator: {
		name: "VaShawn 'Vizion' Head",
		title: "Founder & Chief Sovereign Architect",
		phone: "(216) 586-4607",
		email: "invisionedmarketing@gmail.com",
		location: "Cleveland, OH / Global Sovereign Edge",
		bio: "We don't build generic websites or bloated retainers. We forge sovereign AI operating systems, high-converting digital storefronts, and autonomous multi-agent councils grounded in truth and measurable ROI.",
	},
	brandColors: {
		primary: "#090712",
		accent: "#c9a23f", // Luxora Gold
		secondary: "#792cff", // Royal Purple
		neutral: "#18112b",
	},
	announcement: {
		enabled: true,
		badge: "LIVE ADVISORY",
		text: "Now onboarding Q4 Enterprise AI Growth cohorts — Direct hotline active",
		linkText: "Call (216) 586-4607",
		linkUrl: "tel:+12165864607",
	},
	hero: {
		badge: "AI-NATIVE SOVEREIGN GROWTH OS",
		headlineTop: "Dreams Don't Come True",
		headlineAccent: "Visions Do.",
		subcopy:
			"We engineer autonomous AI agent systems, generative search dominance (GEO), and sub-second conversion web applications for ambitious enterprises.",
		primaryCta: "Initiate Architecture",
		primaryCtaLink: "/contact",
		secondaryCta: "Explore Sovereign Council",
		secondaryCtaLink: "/agency",
		featuredLabel: "Living Typographic Orbit Centerpiece",
		featuredCaption: "Randomized orbital flash engine with WebGPU acceleration",
	},
	heritage: {
		sectionBadge: "SOVEREIGN ORIGINS · CRAFT & CODE",
		headline: "Architected by Hand.",
		subheadline: "Compiled by Autonomous Intelligence.",
		narrativeParagraph1:
			"Founded in Cleveland, OH by VaShawn 'Vizion' Head, Invisioned Marketing emerged from a fundamental realization: modern digital agencies are suffocating under bloated retainers and slow execution. We replaced bureaucratic friction with compiled intelligence.",
		narrativeParagraph2:
			"Every product we launch combines bespoke artisan aesthetics (DTCG design tokens, 60/30/10 color ratios, and brutalist luxury) with mathematically proven software engineering (Isomorphic Island Architecture, sub-45ms TTFB, and Z3 formal verification).",
		quote: "Visual resonance is the frequency of brand truth.",
		credentialsBadge: "100% Sovereign Node · Air-Gapped Vault Security",
	},
	solutions: [
		{
			id: "sol-ai-strategy",
			title: "System-2 Strategy & Cognitive DAGs",
			tagline: "High-altitude enterprise roadmap formulation",
			category: "Executive",
			turnaround: "48 Hours",
			metric: { label: "Reasoning Depth", value: "32K TTC" },
			features: [
				"Tree-of-Thoughts (ToT) 3-future simulations",
				"Pre-Mortem risk inversion matrix",
				"Zero-bypass Anya Gate intent sanitization",
				"Living UKG crystal memory archival",
			],
			status: "ready",
		},
		{
			id: "sol-geo-growth",
			title: "Generative Search Dominance (GEO)",
			tagline: "Post-Google AI search engine citation capture",
			category: "Growth",
			turnaround: "Continuous",
			metric: { label: "AI Citation Win Rate", value: "94.2%" },
			features: [
				"ChatGPT Search, Perplexity Pro & Gemini ranking",
				"Programmatic authority knowledge clusters",
				"High-intent semantic entity graph insertion",
				"Traditional Technical SEO & Core Web Vitals",
			],
			status: "ready",
		},
		{
			id: "sol-web-systems",
			title: "Kinetic Web Systems & Living Orbit",
			tagline: "Sub-45ms TTFB conversion web applications",
			category: "Engineering",
			turnaround: "5-7 Days",
			metric: { label: "TTFB Latency", value: "<38ms" },
			features: [
				"Next.js 15 App Router & React 19 Islands",
				"Hardware-accelerated WebGPU tensor shaders",
				"Living Typographic Orbit centerpiece integration",
				"Z3 formal verification & WCAG 2.1 AA proofs",
			],
			status: "ready",
		},
		{
			id: "sol-voice-os",
			title: "24/7 Autonomous Voice Receptionist",
			tagline: "Sub-100ms full-duplex conversational telephony",
			category: "Voice AI",
			turnaround: "Instant Live",
			metric: { label: "Voice Turn Latency", value: "<95ms" },
			features: [
				"Direct line integration via (216) 586-4607",
				"Emotional intelligence & natural cadence",
				"Automated CRM qualification & calendar booking",
				"Air-gapped client credentials with zero cloud leaks",
			],
			status: "ready",
		},
	],
	backendWorkflows: [
		{
			key: "midas-loop",
			label: "The Midas Loop Inbound Lead Engine",
			status: "ready",
			nextAction: "Firecrawl ingestion and ToT 3-future simulation active.",
		},
		{
			key: "voice-gateway",
			label: "LiveKit WebRTC Voice Gateway (216-586-4607)",
			status: "ready",
			nextAction: "Sub-100ms Aoede S2S audio routing live.",
		},
		{
			key: "cloudbrain-sync",
			label: "CloudBrain WorldTree Sync (UUID: e6374819)",
			status: "ready",
			nextAction: "Bi-directional VFS tissue synchrony verified.",
		},
		{
			key: "formal-proofs",
			label: "Z3 Logic Invariant Proof Gate (Sir Gideon & Sally)",
			status: "ready",
			nextAction: "All constraints SATISFIABLE and sealed.",
		},
		{
			key: "production-deploy",
			label: "Vercel Production Deployment Pipeline",
			status: "ready",
			nextAction: "Production alias invisionedmarketing-bay.vercel.app active.",
		},
	],
	deliveryChecklist: [
		{
			key: "brand-architecture",
			label: "Executive Brand North Star & Intent Formulation",
			owner: "Strategy",
			status: "ready",
		},
		{
			key: "chromatic-tokens",
			label: "DTCG Design Tokens (Obsidian 60%, Gold 30%, Purple 10%)",
			owner: "Creative",
			status: "ready",
		},
		{
			key: "scaffolding",
			label: "Isomorphic Island Scaffolding & Sub-45ms TTFB",
			owner: "Engineering",
			status: "ready",
		},
		{
			key: "formal-audit",
			label: "WCAG 2.1 AA Accessibility & Contrast Verification",
			owner: "Operations",
			status: "ready",
		},
		{
			key: "airgap-security",
			label: "Zero-Cloud Credential Isolation & NDA Air-Gap",
			owner: "Operations",
			status: "ready",
		},
		{
			key: "deployment-live",
			label: "Vercel Edge Promotion & DNS Alignment",
			owner: "Deployment",
			status: "ready",
		},
	],
	updatedAt: new Date().toISOString(),
};

export const statusLabels: Record<OpsStatus, string> = {
	ready: "Active & Verified",
	needs_setup: "Needs Setup",
	blocked: "Blocked",
};

export const statusTone: Record<OpsStatus, "success" | "warning" | "critical"> = {
	ready: "success",
	needs_setup: "warning",
	blocked: "critical",
};
