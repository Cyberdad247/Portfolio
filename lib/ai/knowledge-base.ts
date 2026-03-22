// lib/ai/knowledge-base.ts
// Structured Invisioned Marketing knowledge base for Tasha

export type KnowledgeEntry = {
	category: string;
	keywords: string[];
	content: string;
};

export const COMPANY_INFO = {
	name: "Invisioned Marketing",
	tagline: "AI-Powered Marketing for the Autonomous Era",
	location: "Cleveland, OH",
	workModel: "Remote-first",
	website: "invisionedmarketing.com",
	founded: "2024",
} as const;

export const BUSINESS_HOURS = {
	timezone: "America/New_York (Eastern)",
	weekday: "Monday – Friday, 9:00 AM – 6:00 PM ET",
	weekend: "Closed (async support available)",
	consultations:
		"30-minute discovery calls available Monday–Friday, 10 AM – 4 PM ET",
} as const;

export const CONSULTATION_TYPES = [
	{
		name: "Discovery Call",
		duration: "30 minutes",
		description:
			"Free introductory call to understand your marketing goals and see if we're a fit.",
	},
	{
		name: "Strategy Session",
		duration: "60 minutes",
		description:
			"Deep-dive into your current marketing stack with actionable recommendations.",
	},
	{
		name: "Agent Fleet Demo",
		duration: "45 minutes",
		description:
			"Live walkthrough of our autonomous agent fleet and how it can transform your workflow.",
	},
] as const;

export const PRICING_TIERS = [
	{
		name: "Starter",
		price: "$500/mo",
		description:
			"Perfect for small businesses getting started with AI marketing. Includes brand audit, basic automation setup, and one agent deployment.",
	},
	{
		name: "Growth",
		price: "$1,500/mo",
		description:
			"For scaling companies ready to automate their marketing engine. Includes multi-channel automation, full agent fleet access, and weekly strategy calls.",
	},
	{
		name: "Enterprise",
		price: "Custom pricing",
		description:
			"Tailored solutions for large organizations. Includes custom agent development, dedicated account team, SLA guarantees, and white-glove onboarding.",
	},
] as const;

export const SERVICES = [
	{
		name: "AI-Powered Marketing Automation",
		keywords: [
			"automation",
			"ai",
			"marketing",
			"campaigns",
			"automated",
			"workflows",
		],
		description:
			"End-to-end marketing automation powered by our zero-burn inference stack. From email sequences to social media scheduling, our agents handle the heavy lifting.",
	},
	{
		name: "Web Development",
		keywords: [
			"web",
			"website",
			"development",
			"app",
			"site",
			"build",
			"design",
		],
		description:
			"Modern, performant web applications built with Next.js and cutting-edge frameworks. Every site is optimized for conversion and integrated with our AI stack.",
	},
	{
		name: "Brand Strategy",
		keywords: [
			"brand",
			"branding",
			"strategy",
			"identity",
			"positioning",
			"messaging",
		],
		description:
			"Data-driven brand positioning and messaging strategy. We help you find your voice and amplify it across every channel.",
	},
	{
		name: "Agentic Workflow Design",
		keywords: [
			"agent",
			"agentic",
			"workflow",
			"autonomous",
			"fleet",
			"process",
		],
		description:
			"Custom autonomous agent workflows that handle repetitive tasks, qualify leads, and run marketing operations 24/7 without human intervention.",
	},
] as const;

export const DIFFERENTIATORS = [
	{
		name: "Zero-Burn Inference Stack",
		keywords: ["zero-burn", "inference", "cost", "free", "cheap", "affordable"],
		description:
			"Our proprietary inference routing eliminates per-token costs by cascading through free and low-cost providers. You get GPT-class output without the GPT-class bill.",
	},
	{
		name: "Autonomous Agent Fleet",
		keywords: ["agent", "fleet", "autonomous", "team", "agents", "ai team"],
		description:
			"A coordinated team of AI agents that work together: Tasha (receptionist & onboarding), Oracle (analytics & insights), Forge (content creation), Sentinel (brand monitoring), and Debug (QA & testing).",
	},
	{
		name: "Full-Duplex Voice AI",
		keywords: ["voice", "call", "phone", "duplex", "receptionist", "talk"],
		description:
			"Real-time voice AI with barge-in detection, natural turn-taking, and sub-200ms latency. Callers can't tell they're talking to an AI.",
	},
] as const;

export const AGENT_FLEET = [
	{
		name: "Tasha",
		role: "Lead Receptionist & Onboarding Specialist",
		description:
			"First point of contact for all leads. Handles qualification, scheduling, and warm handoffs with personality and professionalism.",
	},
	{
		name: "Oracle",
		role: "Analytics & Insights Agent",
		description:
			"Monitors campaign performance, surfaces insights, and generates data-driven recommendations in real time.",
	},
	{
		name: "Forge",
		role: "Content Creation Agent",
		description:
			"Generates marketing copy, social posts, email sequences, and creative assets aligned to brand voice.",
	},
	{
		name: "Sentinel",
		role: "Brand Monitoring Agent",
		description:
			"Tracks brand mentions, competitor activity, and market sentiment across the web 24/7.",
	},
	{
		name: "Debug",
		role: "QA & Testing Agent",
		description:
			"Ensures all systems, integrations, and automations are running flawlessly. Catches issues before clients do.",
	},
] as const;

export const FAQ_ENTRIES: KnowledgeEntry[] = [
	{
		category: "general",
		keywords: ["who", "about", "company", "what do you do", "tell me about"],
		content: `Invisioned Marketing is an AI-powered marketing agency based in Cleveland, OH. We combine autonomous AI agents with human creativity to deliver marketing that runs itself. Our remote-first team specializes in marketing automation, web development, brand strategy, and agentic workflow design.`,
	},
	{
		category: "services",
		keywords: [
			"services",
			"offer",
			"provide",
			"help with",
			"what can you do",
			"capabilities",
		],
		content: `We offer four core services: AI-Powered Marketing Automation, Web Development, Brand Strategy, and Agentic Workflow Design. Each is powered by our zero-burn inference stack and autonomous agent fleet.`,
	},
	{
		category: "pricing",
		keywords: [
			"price",
			"cost",
			"how much",
			"pricing",
			"budget",
			"afford",
			"rate",
			"fee",
			"charge",
			"expensive",
			"cheap",
		],
		content: `We have three tiers: Starter at $500/mo (great for small businesses), Growth at $1,500/mo (for scaling companies), and Enterprise with custom pricing (for large organizations). Every tier includes access to our AI agent fleet.`,
	},
	{
		category: "scheduling",
		keywords: [
			"schedule",
			"meeting",
			"call",
			"consultation",
			"appointment",
			"book",
			"available",
			"calendar",
			"time",
		],
		content: `We offer free 30-minute discovery calls Monday through Friday between 10 AM and 4 PM ET. I can help you get one on the calendar right now! We also have 60-minute strategy sessions and 45-minute agent fleet demos.`,
	},
	{
		category: "location",
		keywords: [
			"where",
			"location",
			"office",
			"based",
			"city",
			"state",
			"address",
			"cleveland",
		],
		content: `We're headquartered in Cleveland, OH but operate as a remote-first company. Our team and AI agents work from everywhere — the beauty of an autonomous stack.`,
	},
	{
		category: "technology",
		keywords: [
			"technology",
			"tech",
			"stack",
			"how does it work",
			"ai",
			"tools",
			"platform",
		],
		content: `Our stack is built on zero-burn inference (free LLM routing), SpacetimeDB (real-time data), Mastra (agentic workflows), and full-duplex voice AI. We use Next.js for web, and our agent fleet runs 24/7 autonomously.`,
	},
	{
		category: "agents",
		keywords: [
			"agent",
			"agents",
			"fleet",
			"tasha",
			"oracle",
			"forge",
			"sentinel",
			"debug",
			"team",
			"ai team",
		],
		content: `Our agent fleet includes five specialized AI team members: Tasha (that's me — receptionist & onboarding), Oracle (analytics), Forge (content creation), Sentinel (brand monitoring), and Debug (QA & testing). We work together around the clock.`,
	},
	{
		category: "getting_started",
		keywords: [
			"get started",
			"start",
			"begin",
			"sign up",
			"onboard",
			"first step",
			"how to",
			"next step",
		],
		content: `Getting started is easy! I'll just need your name, email, and a quick idea of your marketing goals. Then we'll set up a free discovery call so our team can put together a custom plan for you.`,
	},
	{
		category: "hours",
		keywords: [
			"hours",
			"open",
			"business hours",
			"when",
			"available",
			"weekend",
			"closed",
		],
		content: `Our business hours are Monday through Friday, 9 AM to 6 PM Eastern. But hey, I'm available 24/7 — perks of being AI! For live consultations, we book between 10 AM and 4 PM ET on weekdays.`,
	},
];
