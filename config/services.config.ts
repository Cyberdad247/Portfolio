export type ServiceConfig = {
	slug: string;
	name: string;
	summary: string;
	fit: string;
	description: string;
	outcomes: string[];
	deliverables: string[];
	faqs: { question: string; answer: string }[];
};

export const services: ServiceConfig[] = [
	{
		slug: "agentic-launch",
		name: "Agentic Launch",
		summary: "Stand up your first Agentic Growth OS and lead-gen engine.",
		fit: "New or early-stage brands that need a structured, testable marketing system.",
		description:
			"Stand up your first Agentic Growth OS, connect your key channels, and start generating measurable leads with a system that can scale.",
		outcomes: [
			"Clear view of which channels drive leads you actually want.",
			"At least one validated offer and landing page that can be scaled.",
			"A simple OS you can continue to build on with future experiments.",
		],
		deliverables: [
			"Agentic Growth OS blueprint tailored to your funnel and ICP.",
			"Initial Agentic Nexus setup with 3–4 core agents activated.",
			"Launch of priority channels (e.g., Google Ads, Meta, landing pages) with tracking.",
			"Core dashboards for leads, CPL, and basic pipeline visibility.",
		],
		faqs: [
			{
				question: "How long does Agentic Launch take?",
				answer:
					"Most Agentic Launch engagements run 8–12 weeks from kickoff to a stable baseline of experiments and dashboards.",
			},
			{
				question: "What does pricing look like?",
				answer:
					"Pricing depends on your channel mix and complexity. Most Agentic Launch clients fall in the low-to-mid four-figure monthly range.",
			},
		],
	},
	{
		slug: "agentic-scale",
		name: "Agentic Scale",
		summary:
			"Scale winning channels and expand into new ones with system-level visibility.",
		fit: "Growing brands with traction that need more experiments and better attribution.",
		description:
			"Accelerate your growth by scaling validated channels and systematically testing new ones through the Agentic Nexus fleet.",
		outcomes: [
			"Significant increase in lead volume while maintaining quality.",
			"Expanded channel footprint (e.g., YouTube, TikTok, LinkedIn) with calibrated attribution.",
			"Aggressive experiment cadence (20+ tests/month) to find new winners.",
		],
		deliverables: [
			"Full Agentic Nexus integration (6+ specialized agents).",
			"Custom Attribution modeling to see the true value of every touchpoint.",
			"Content velocity engine to power multi-channel creative testing.",
		],
		faqs: [
			{
				question: "Is this for e-commerce or B2B?",
				answer:
					"Both. The logic of the Growth OS adapts to your sales cycle, whether it's a 1-day impulse buy or a 6-month enterprise deal.",
			},
		],
	},
	{
		slug: "agentic-enterprise",
		name: "Agentic Enterprise",
		summary:
			"Integrate Agentic Growth OS with RevOps, sales, and multi-region teams.",
		fit: "Mature organizations that need alignment across marketing and revenue teams.",
		description:
			"Unify your marketing stack, sales CRM, and regional operations into a single Sovereign Intelligence Layer.",
		outcomes: [
			"Total alignment between marketing spend and sales-closed revenue.",
			"Reduced operational friction across multi-region marketing teams.",
			"Predictable pipeline modeling based on historical agent performance.",
		],
		deliverables: [
			"RevOps & CRM deep-sync for 'Lead-to-Revenue' visibility.",
			"Custom Agent Training on your proprietary business data.",
			"Bespoke Dashboarding for C-suite and regional leaders.",
		],
		faqs: [
			{
				question: "Do you replace our internal marketing team?",
				answer:
					"No. We empower them. We provide the 'Sovereign Engine' that your team uses to execute at 10x speed.",
			},
		],
	},
];
