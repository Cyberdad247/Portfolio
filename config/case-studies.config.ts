export type CaseStudyConfig = {
	slug: string;
	title: string;
	tag: string;
	impact: string;
	objective: string;
	time: string;
	results: string[];
	summary: string; // For the list page
};

export const caseStudies: CaseStudyConfig[] = [
	{
		slug: "saas-beta",
		title: "Scale-Tier SaaS Expansion // Beta Protocol",
		tag: "Scale Tier",
		impact: "+342% Lead Volume",
		objective:
			"Rapid scaling of qualified lead volume via AI-managed organic and paid search sync.",
		time: "6 Months // 2025",
		summary:
			"Transforming SaaS lead generation through high-velocity AI experiment cycles.",
		results: [
			"Cost-per-Lead reduced from $42.00 to $11.50 using AI-optimized bid strategies.",
			"Content velocity increased by 400% through Agentic Content Pipelines.",
			"Zero human interaction required for top-of-funnel conversion sequences.",
		],
	},
	{
		slug: "enterprise-sync",
		title: "Enterprise Revenue Operations Synchronization",
		tag: "Enterprise Tier",
		impact: "24-Hour Lead Routing",
		objective:
			"Modernizing a fragmented marketing stack through a centralized Agentic OS middleware.",
		time: "12 Months // 2024-2025",
		summary:
			"Universal data synchronization across fragmented marketing ecosystems.",
		results: [
			"Replaced 12 separate SaaS subscriptions with 3 core Agentic flows.",
			"Average response time dropped from 4.5 hours to 15 seconds.",
			"Client acquisition cost decreased by 18% in the first quarter of deployment.",
		],
	},
];
