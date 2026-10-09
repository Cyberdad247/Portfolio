import {
	BrainCircuit,
	Code,
	Globe,
	Headphones,
	type LucideIcon,
	MessageSquare,
	Search,
	ShieldAlert,
	Swords,
	TrendingUp,
	Wand2,
} from "lucide-react";

export type KnightCategory =
	| "all"
	| "voice"
	| "research"
	| "growth"
	| "strategy"
	| "security";

export type KnightTier = "sovereign" | "operational" | "live";

export type Knight = {
	id: string;
	designation: string;
	name: string;
	title: string;
	category: Exclude<KnightCategory, "all">;
	tier: KnightTier;
	status: "active" | "processing" | "idle";
	capabilities: string[];
	metric: { label: string; value: string };
	description: string;
	rescueSlug: string;
	accentVar: string;
	icon: LucideIcon;
	featured?: boolean;
};

export const KNIGHTS: Knight[] = [
	{
		id: "T-01",
		designation: "T-01",
		name: "Tasha Prime",
		title: "Omni-Receptionist",
		category: "voice",
		tier: "sovereign",
		status: "active",
		featured: true,
		capabilities: [
			"Full-duplex voice conversation",
			"Real-time lead capture & CRM sync",
			"Calendar scheduling via Mastra",
			"LiveKit WebRTC — zero-latency",
		],
		metric: { label: "Leads captured / week", value: "120+" },
		description:
			"Tasha is Invisioned's live voice receptionist — always on, always warm. She greets visitors, captures qualified leads, and schedules consultations in real time. Powered by Deepgram STT, OpenAI TTS, and Gemini 3.1 Flash via CLIProxy.",
		rescueSlug: "tasha",
		accentVar: "var(--primary)",
		icon: Headphones,
	},
	{
		id: "A-02",
		designation: "A-02",
		name: "Lady Apis",
		title: "Intelligence Scout",
		category: "research",
		tier: "sovereign",
		status: "active",
		capabilities: [
			"GEO citation probability modeling",
			"Traditional SEO — LCP, CLS, metadata",
			"AI-native search visibility (GPT-4, Claude, Gemini)",
			"Backlink strength analysis",
		],
		metric: { label: "Domains audited / month", value: "400+" },
		description:
			"Lady Apis maps your digital visibility across both traditional search and generative AI citation landscapes. She tells you exactly where you appear when prospects ask AI assistants about your category.",
		rescueSlug: "apis",
		accentVar: "#fde047",
		icon: Search,
	},
	{
		id: "A-01",
		designation: "A-01",
		name: "Market Scanner",
		title: "Paid Media Optimizer",
		category: "growth",
		tier: "operational",
		status: "active",
		capabilities: [
			"CPL monitoring across all ad platforms",
			"Budget reallocation toward top performers",
			"Lead quality scoring",
			"45,000+ URLs scanned per month",
		],
		metric: { label: "URLs scanned / month", value: "45,000+" },
		description:
			"Monitors cost-per-lead and quality signals across every paid channel, then automatically shifts budget toward campaigns generating real pipeline — not cheap clicks.",
		rescueSlug: "scanner",
		accentVar: "#22c55e",
		icon: TrendingUp,
	},
	{
		id: "A-03",
		designation: "A-03",
		name: "Sentiment Engine",
		title: "Content & SEO Strategist",
		category: "growth",
		tier: "operational",
		status: "processing",
		capabilities: [
			"Search + social + CRM data synthesis",
			"ICP-aligned content brief generation",
			"Pipeline-correlated topic clustering",
			"4–12 content drops / month",
		],
		metric: { label: "Content drops / month", value: "4–12" },
		description:
			"Transforms raw signals from search, social, and CRM into content briefs that map to topics your ideal customers are already searching — and that correlate with real pipeline.",
		rescueSlug: "sentiment",
		accentVar: "#f97316",
		icon: MessageSquare,
	},
	{
		id: "A-04",
		designation: "A-04",
		name: "Strategy Synthesizer",
		title: "CRO & UX Intelligence",
		category: "strategy",
		tier: "operational",
		status: "active",
		capabilities: [
			"High drop-off page identification",
			"A/B test proposal (copy, proof, layout)",
			"10–50 pages monitored continuously",
			"Conversion funnel heat mapping",
		],
		metric: { label: "Pages monitored", value: "10–50" },
		description:
			"Finds the leaky pages killing your conversion rate and proposes data-backed A/B tests for copy, social proof, and layout — turning visitors into booked calls.",
		rescueSlug: "strategy",
		accentVar: "#a855f7",
		icon: BrainCircuit,
	},
	{
		id: "K-02",
		designation: "K-02",
		name: "Competitor Analyst",
		title: "Positioning & Offer Intelligence",
		category: "strategy",
		tier: "operational",
		status: "active",
		capabilities: [
			"Competitor offer & pricing analysis",
			"Search intent mapping",
			"10–20 new positioning hooks / quarter",
			"ICP-aligned guarantee frameworks",
		],
		metric: { label: "New hooks / quarter", value: "10–20" },
		description:
			"Analyzes competitors and search intent to surface new offers, guarantees, and positioning hooks tailored precisely to your ICP — the intelligence layer behind every winning pitch.",
		rescueSlug: "analyst",
		accentVar: "#06b6d4",
		icon: Wand2,
	},
	{
		id: "M-01",
		designation: "M-01",
		name: "SEO Knight",
		title: "Organic Growth Engine",
		category: "growth",
		tier: "operational",
		status: "active",
		capabilities: [
			"Automated keyword research",
			"On-page optimization & schema markup",
			"Backlink monitoring & outreach",
			"250+ keywords ranked",
		],
		metric: { label: "Keywords ranked", value: "250+" },
		description:
			"Handles the full organic SEO stack — research, on-page optimization, technical fixes, and backlink monitoring — so your site climbs rankings without manual effort.",
		rescueSlug: "seo",
		accentVar: "#10b981",
		icon: Globe,
	},
	{
		id: "M-02",
		designation: "M-02",
		name: "Content Knight",
		title: "Narrative & Copy Strategist",
		category: "growth",
		tier: "operational",
		status: "active",
		capabilities: [
			"SEO-optimized long-form articles",
			"Social media copy & scheduling",
			"Trending topic synthesis",
			"50+ pieces generated / month",
		],
		metric: { label: "Articles generated / month", value: "50+" },
		description:
			"Generates search-optimized content, social copy, and campaign narratives at scale — tuned to your brand voice and aligned to topics that drive organic discovery.",
		rescueSlug: "content",
		accentVar: "#f59e0b",
		icon: Code,
	},
	{
		id: "A-07",
		designation: "A-07",
		name: "Sir Sentinel",
		title: "Policy & Security Enforcer",
		category: "security",
		tier: "sovereign",
		status: "active",
		capabilities: [
			"PDG-based policy enforcement",
			"HITL approval for high-risk operations",
			"Vulnerability blocking — 420+ blocked",
			"Compliance audit (GDPR, CCPA)",
		],
		metric: { label: "Vulnerabilities blocked", value: "420+" },
		description:
			"Sentinel enforces security policy across every agent operation. He gates high-risk actions behind HITL approval, audits compliance posture, and ensures your data stack meets sovereign security standards.",
		rescueSlug: "sentinel",
		accentVar: "#ef4444",
		icon: ShieldAlert,
	},
	{
		id: "M-03",
		designation: "M-03",
		name: "Social Knight",
		title: "Community & Engagement Engine",
		category: "growth",
		tier: "operational",
		status: "active",
		capabilities: [
			"Multi-channel social presence management",
			"Automated high-fidelity responses",
			"1,200+ engagements / day",
			"Brand voice consistency enforcement",
		],
		metric: { label: "Engagements / day", value: "1,200" },
		description:
			"Manages your brand's multi-channel social presence — monitoring mentions, crafting on-brand replies, scheduling campaigns, and driving consistent community engagement at scale.",
		rescueSlug: "social",
		accentVar: "#8b5cf6",
		icon: Swords,
	},
];

export const CATEGORY_LABELS: Record<KnightCategory, string> = {
	all: "All Knights",
	voice: "Voice",
	research: "Research",
	growth: "Growth",
	strategy: "Strategy",
	security: "Security",
};

export const TIER_LABELS: Record<KnightTier, string> = {
	sovereign: "Sovereign",
	operational: "Operational",
	live: "Live",
};

export const TIER_COLORS: Record<KnightTier, string> = {
	sovereign: "text-yellow-300 border-yellow-300/30 bg-yellow-300/10",
	operational: "text-blue-400 border-blue-400/30 bg-blue-400/10",
	live: "text-green-400 border-green-400/30 bg-green-400/10",
};

export const STATUS_DOT: Record<Knight["status"], string> = {
	active: "bg-green-400",
	processing: "bg-yellow-400 animate-pulse",
	idle: "bg-zinc-500",
};
