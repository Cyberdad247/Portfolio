import {
	BrainCircuit,
	Bug,
	Code,
	Globe,
	type LucideIcon,
	MessageSquare,
	Search,
	ShieldAlert,
	Terminal,
} from "lucide-react";

export type AgentConfig = {
	id: string;
	name: string;
	role: string;
	status: "active" | "processing" | "idle";
	metricLabel: string;
	metricValue: string;
	description: string;
	icon: LucideIcon;
};

export const agents: AgentConfig[] = [
	{
		id: "A-01",
		name: "Market Scanner",
		role: "Paid Media & Budgets",
		status: "active",
		metricLabel: "URLs Scanned / month",
		metricValue: "45,000+",
		description:
			"Monitors CPL and lead quality, then shifts budget toward top-performing campaigns instead of cheap clicks.",
		icon: Globe,
	},
	{
		id: "A-02",
		name: "Competitor Analyst",
		role: "Positioning & Offers",
		status: "processing",
		metricLabel: "New hooks / quarter",
		metricValue: "10–20",
		description:
			"Analyzes competitors and search intent to synthesize new offers, guarantees, and hooks tailored to your ICP.",
		icon: Search,
	},
	{
		id: "A-03",
		name: "Sentiment Engine",
		role: "Content & SEO",
		status: "idle",
		metricLabel: "Content drops / month",
		metricValue: "4–12",
		description:
			"Turns search, social, and CRM data into content briefs aligned to topics that correlate with pipeline.",
		icon: MessageSquare,
	},
	{
		id: "A-04",
		name: "Strategy Synthesizer",
		role: "CRO & UX",
		status: "active",
		metricLabel: "Pages monitored",
		metricValue: "10–50",
		description:
			"Flags leaky pages with high drop-off and proposes A/B tests for copy, proof, and layout.",
		icon: BrainCircuit,
	},
	{
		id: "A-05",
		name: "Oracle (PLAN)",
		role: "Kernel Planner",
		status: "active",
		metricLabel: "BPM tasks / month",
		metricValue: "500+",
		description:
			"Orchestrates multi-agent workflows into DAG architectures using Sovereign protocols.",
		icon: Terminal,
	},
	{
		id: "A-06",
		name: "Forge (CODE)",
		role: "Kinetic Builder",
		status: "processing",
		metricLabel: "Lines merged / week",
		metricValue: "1,200",
		description:
			"Produces high-fidelity React/Next.js and Rust/Go binaries with unified diff-generation.",
		icon: Code,
	},
	{
		id: "A-07",
		name: "Sentinel (SECURITY)",
		role: "Policy Enforcement",
		status: "active",
		metricLabel: "Vulns blocked",
		metricValue: "420",
		description:
			"Enforces PDG-based safety rules and HITL approval for high-risk system operations.",
		icon: ShieldAlert,
	},
	{
		id: "A-08",
		name: "Debug (TEST)",
		role: "Sandbox Sentry",
		status: "idle",
		metricLabel: "Cases verified",
		metricValue: "1,800",
		description:
			"Executes automated tests in isolated sandboxes and oversees branch-revert protocols.",
		icon: Bug,
	},
	{
		id: "M-01",
		name: "SEO Agent",
		role: "Organic Growth",
		status: "active",
		metricLabel: "Keywords Ranked",
		metricValue: "250+",
		description:
			"Automates keyword research, on-page optimization, and backlink monitoring.",
		icon: Search,
	},
	{
		id: "M-02",
		name: "Content Agent",
		role: "Narrative Strategy",
		status: "active",
		metricLabel: "Articles Generated",
		metricValue: "50+",
		description:
			"Generates SEO-optimized articles and social media copy based on trending topics.",
		icon: MessageSquare,
	},
	{
		id: "M-03",
		name: "Social Agent",
		role: "Community Engagement",
		status: "active",
		metricLabel: "Engagements / Day",
		metricValue: "1,200",
		description:
			"Manages multi-channel social presence and automates high-fidelity responses.",
		icon: Globe,
	},
];
