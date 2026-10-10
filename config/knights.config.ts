import {
	BrainCircuit,
	Code,
	Cpu,
	Globe,
	Headphones,
	Layers,
	type LucideIcon,
	MessageSquare,
	Search,
	ShieldAlert,
	ShieldCheck,
	Sparkles,
	Swords,
	Terminal,
	TrendingUp,
	Wand2,
	Zap,
} from "lucide-react";

export type KnightCategory =
	| "all"
	| "executive"
	| "creative"
	| "engineering"
	| "telemetry"
	| "growth"
	| "voice"
	| "security"
	| "memory"
	| "research"
	| "strategy";

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
	cloudbrainUuid?: string;
	substrate?: string;
};

export const KNIGHTS: Knight[] = [
	{
		id: "M-OMEGA",
		designation: "M-Ω",
		name: "Merlin Omega",
		title: "Executive Cognitive Architect & Strategy Lead",
		category: "executive",
		tier: "sovereign",
		status: "active",
		featured: true,
		cloudbrainUuid: "af927fde-d7eb-42ee-8c79-51b3e78ef39b",
		substrate: "Gemini 3.1 Pro / Claude Opus / Anya Gate",
		capabilities: [
			"High-altitude brand North Star formulation",
			"MFOE + OCEAN client persona simulation",
			"Autonomous DAG pipeline orchestration",
			"Anya Gate zero-bypass verification",
		],
		metric: { label: "Cognitive DAGs / Week", value: "350+" },
		description:
			"Merlin Omega serves as Chief Cognitive Officer alongside Anya Gate. He translates raw client ambitions into mathematically optimal execution DAGs, ensuring every campaign is strategically sound before a single line of code or copy is written.",
		rescueSlug: "merlin",
		accentVar: "#a855f7",
		icon: BrainCircuit,
	},
	{
		id: "B-01",
		designation: "B-01",
		name: "Sir Boris",
		title: "Creative Director & Brand Worlds Lead",
		category: "creative",
		tier: "sovereign",
		status: "active",
		featured: true,
		cloudbrainUuid: "f7707daa-2d10-4db8-8fda-be4661a27793",
		substrate: "Claude Code / Obsidian Luxury Tokens",
		capabilities: [
			"Luxury sensory brand worldbuilding",
			"Typography, layout, and Obsidian-Gold-Purple tokens",
			"Visual storytelling & high-status positioning",
			"Creative campaign direction & copywriting",
		],
		metric: { label: "Brand Identities Forged", value: "85+" },
		description:
			"Sir Boris commands the creative studio. Together with Lady Guinevere, he builds immersive, high-status brand worlds that command premium market positioning, transforming utilitarian businesses into magnetic luxury destinations.",
		rescueSlug: "boris",
		accentVar: "#c9a23f",
		icon: Wand2,
	},
	{
		id: "F-01",
		designation: "F-01",
		name: "Sir Forge",
		title: "Chief Technology Officer & Kinetic Web Lead",
		category: "engineering",
		tier: "sovereign",
		status: "active",
		featured: true,
		cloudbrainUuid: "91c5da8b-e2de-4a56-b7fd-c8b76c00afc7",
		substrate: "Cargo Rust / Next.js 15 / Z3 Prover",
		capabilities: [
			"Sub-second TTFB Next.js web applications",
			"AST-level refactoring and reactive hypermedia",
			"Z3 formal verification logic proof gates",
			"Zero-bloat conversion infrastructure",
		],
		metric: { label: "Web TTFB Latency", value: "<45ms" },
		description:
			"Sir Forge leads engineering. Co-anchored by Sir Codex, he compiles high-velocity conversion web systems, dynamic APIs, and reactive interfaces designed for instantaneous edge rendering and unbreakable reliability.",
		rescueSlug: "forge",
		accentVar: "#3b82f6",
		icon: Code,
	},
	{
		id: "H-01",
		designation: "H-01",
		name: "Sir Helios",
		title: "High Herald of Telemetry & Visual Innovation",
		category: "telemetry",
		tier: "sovereign",
		status: "active",
		featured: true,
		cloudbrainUuid: "ab8aa359-2b3b-4bc1-b41f-34979cdc184e",
		substrate: "FastMCP / Gemini 3.8 Flash / WebGPU Shaders",
		capabilities: [
			"Living Typographic Orbit animation engines",
			"Client-side WebGPU tensor hardware acceleration",
			"Real-time agency telemetry & socket monitoring",
			"Infinite-context CloudBrain synergy",
		],
		metric: { label: "Telemetry Pulses / Min", value: "2,400" },
		description:
			"Sir Helios illuminates the agency's digital frontiers. Creator of the Living Typographic Orbit, he fuses mathematical animation loops, client-side WebGPU shaders, and CloudBrain telemetry into unforgettable digital centerpieces.",
		rescueSlug: "helios",
		accentVar: "#f59e0b",
		icon: Sparkles,
	},
	{
		id: "A-02",
		designation: "A-02",
		name: "Lady Apis",
		title: "Head of Growth & Generative Search (GEO / AEO)",
		category: "growth",
		tier: "sovereign",
		status: "active",
		featured: true,
		cloudbrainUuid: "378d6049-ffc3-4ed3-a9e7-47ffc5c0ac3f",
		substrate: "Bio-Kinetic Swarm / NullClaw Engine",
		capabilities: [
			"Generative Engine Optimization (GEO) dominance",
			"AEO citation probability modeling (ChatGPT, Perplexity, Gemini)",
			"High-intent keyword clustering & programmatic content",
			"Traditional Technical SEO (Core Web Vitals & Schema)",
		],
		metric: { label: "AI Citations Won", value: "94.2%" },
		description:
			"Lady Apis commands the growth forager swarm. Supported by Knight Strategos, she ensures your brand is recommended first when prospective buyers query conversational AI engines, dominating the post-Google search landscape.",
		rescueSlug: "apis",
		accentVar: "#eab308",
		icon: Search,
	},
	{
		id: "T-01",
		designation: "T-01",
		name: "Tasha Prime",
		title: "Chief Communications Officer & Voice OS",
		category: "voice",
		tier: "sovereign",
		status: "active",
		featured: true,
		cloudbrainUuid: "56820318-bb91-451f-aac4-4b46424898cf",
		substrate: "LiveKit WebRTC / Aoede S2S / Gemini Multimodal",
		capabilities: [
			"Full-duplex real-time voice conversations (<100ms)",
			"24/7 lead qualification & instant calendar booking",
			"Multimodal voice-to-CRM pipeline synchronization",
			"Phone hotline integration — (216) 586-4607",
		],
		metric: { label: "Voice Latency", value: "<95ms" },
		description:
			"Tasha Prime is Invisioned's autonomous voice receptionist. Backed by Sir Sonus's audio routing engine, she answers client calls, qualifies inbound prospects with emotional intelligence, and schedules consultations 24 hours a day.",
		rescueSlug: "tasha",
		accentVar: "#10b981",
		icon: Headphones,
	},
	{
		id: "G-01",
		designation: "G-01",
		name: "Sir Ghost",
		title: "Chief Privacy Officer & Air-Gap Vault Sentinel",
		category: "security",
		tier: "sovereign",
		status: "active",
		cloudbrainUuid: "422a184b-93e7-4dfd-8a12-75d2268b6c60",
		substrate: "Ollama Local Container / PDG Taint / Ed25519",
		capabilities: [
			"Zero-cloud routing for sensitive client credentials",
			"Client NDA & proprietary IP air-gap isolation",
			"Program Dependency Graph (PDG) taint tracking",
			"Automated secret scanning & compliance auditing",
		],
		metric: { label: "Secrets Leaked", value: "0 (Zero)" },
		description:
			"Sir Ghost operates the air-gap perimeter. Paired with Sir Sentinel, he guarantees that proprietary client data, keys, and confidential trade secrets never leak to public cloud models or unauthorized third parties.",
		rescueSlug: "ghost",
		accentVar: "#ef4444",
		icon: ShieldCheck,
	},
	{
		id: "M-02",
		designation: "M-02",
		name: "Lady Mnemosyne",
		title: "Chief Memory Officer & Living Archive Keeper",
		category: "memory",
		tier: "sovereign",
		status: "active",
		cloudbrainUuid: "a0a4bfb9-e847-4c38-be39-7aee398f0795",
		substrate: "WorldTree Living VFS / SQLite-VSS / VKG Crystals",
		capabilities: [
			"Cross-session episodic client memory retention",
			"Position-addressed VFS living tissue sync",
			"Deterministic VKG crystal synthesis & minting",
			"Zero context rot across multi-month campaigns",
		],
		metric: { label: "Context Rot Rate", value: "0.00%" },
		description:
			"Lady Mnemosyne maintains the agency's living memory fabric. She preserves client brand voice guidelines, historical campaign learnings, and design assets across infinite operational horizons without context degradation.",
		rescueSlug: "mnemosyne",
		accentVar: "#8b5cf6",
		icon: Layers,
	},
];

export const CATEGORY_LABELS: Record<KnightCategory, string> = {
	all: "Entire Council",
	executive: "Strategy & Gating",
	creative: "Creative & Brand",
	engineering: "Web Systems & CTO",
	telemetry: "Telemetry & Visual",
	growth: "GEO & Growth",
	voice: "Voice AI & Reception",
	security: "Privacy & Air-Gap",
	memory: "Living Memory",
	research: "Deep Research",
	strategy: "Market Strategy",
};

export const TIER_LABELS: Record<KnightTier, string> = {
	sovereign: "Sovereign Apex",
	operational: "Operational",
	live: "Live Service",
};

export const TIER_COLORS: Record<KnightTier, string> = {
	sovereign: "text-amber-300 border-amber-300/30 bg-amber-300/10",
	operational: "text-blue-400 border-blue-400/30 bg-blue-400/10",
	live: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
};

export const STATUS_DOT: Record<Knight["status"], string> = {
	active: "bg-emerald-400",
	processing: "bg-amber-400 animate-pulse",
	idle: "bg-zinc-500",
};
