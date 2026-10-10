import {
	Activity,
	BrainCircuit,
	Code,
	Cpu,
	Globe,
	Headphones,
	Layers,
	LayoutGrid,
	type LucideIcon,
	MessageSquare,
	Palette,
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
	| "strategy"
	| "creative"
	| "vanguard"
	| "engineering"
	| "telemetry"
	| "growth"
	| "voice"
	| "security"
	| "memory"
	| "research";

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
		title: "Executive Cognitive Architect & System-2 DAG Planner",
		category: "executive",
		tier: "sovereign",
		status: "active",
		featured: true,
		cloudbrainUuid: "af927fde-d7eb-42ee-8c79-51b3e78ef39b",
		substrate: "Gemini 3.1 Pro / Claude Opus",
		capabilities: [
			"High-altitude brand North Star formulation",
			"MFOE + OCEAN client persona simulation",
			"Autonomous DAG pipeline orchestration",
			"32K Test-Time Compute cognitive simulation",
		],
		metric: { label: "Cognitive DAGs / Week", value: "350+" },
		description:
			"Merlin Omega serves as Sovereign Kernel Archwizard. Anchored to notebook af927fde, he translates high-ambition client goals into mathematically verified execution DAGs, ensuring every campaign is strategically sound before execution.",
		rescueSlug: "merlin",
		accentVar: "#a855f7",
		icon: BrainCircuit,
	},
	{
		id: "ANYA-01",
		designation: "A-Ω",
		name: "Anya Omega",
		title: "Modality Hypervisor & Entropy Scythe Gatekeeper",
		category: "executive",
		tier: "sovereign",
		status: "active",
		featured: true,
		cloudbrainUuid: "a0a4bfb9-e847-4c38-be39-7aee398f0795",
		substrate: "Sovereign Lattice Substrate / TOON Compiler",
		capabilities: [
			"Zero-bypass client intent sanitization",
			"Triple-QFT Symbolect token compression",
			"TOON format coercion (zero linguistic entropy)",
			"Anya First & Anya Last verification laws",
		],
		metric: { label: "Entropy Reduction", value: "99.4%" },
		description:
			"Anya Omega enforces the absolute gate law of Camelot-OS. All client goals pass through Anya First for sanitization and prompt optimization, and all agency deliverables pass through Anya Last before client presentation.",
		rescueSlug: "anya",
		accentVar: "#ec4899",
		icon: Zap,
	},
	{
		id: "STRAT-01",
		designation: "S-01",
		name: "General Strategos",
		title: "Strategic Architect & Midas Loop Commander",
		category: "strategy",
		tier: "sovereign",
		status: "active",
		featured: true,
		cloudbrainUuid: "a0a4bfb9-e847-4c38-be39-7aee398f0795",
		substrate: "Gemini 3.8 Flash / Tree of Thoughts (ToT)",
		capabilities: [
			"The Midas Loop inbound lead qualification",
			"ToT 3-Future simulation (Aggressive, Balanced, Guerrilla)",
			"Pre-Mortem risk inversion analysis",
			"OmniMarketing Nexus strategic warfare",
		],
		metric: { label: "Strategy Win Rate", value: "98.1%" },
		description:
			"General Strategos conducts high-command market warfare. Utilizing Tree-of-Thoughts reasoning, he simulates three distinct strategic futures for every client before choosing the optimal conversion roadmap and victory dashboard.",
		rescueSlug: "strategos",
		accentVar: "#eab308",
		icon: Swords,
	},
	{
		id: "AURA-01",
		designation: "AU-01",
		name: "Amara 'Aura'",
		title: "Brand & Creative Director / The Prism",
		category: "creative",
		tier: "sovereign",
		status: "active",
		featured: true,
		cloudbrainUuid: "e6374819-50ce-41cf-b6b3-99924ca6ab90",
		substrate: "Claude Opus / Neuro-Aesthetic Mapping",
		capabilities: [
			"Afro-Futurist vibrancy & cultural resonance",
			"Brand archetyping & chromatic logic",
			"Sensory value encoding & copywriting",
			"Visual resonance is the frequency of brand truth",
		],
		metric: { label: "Creative Archetypes", value: "100%" },
		description:
			"Amara Aura serves as Creative Director. Anchored to the Invisioned Marketing Cloudbrain, she blends color psychology, chromatic logic, and high-vibrancy storytelling to transform businesses into magnetic luxury destinations.",
		rescueSlug: "aura",
		accentVar: "#f43f5e",
		icon: Palette,
	},
	{
		id: "VISAGE-01",
		designation: "V-01",
		name: "Sir Visage",
		title: "Visual Resonance Architect & Design Token Master",
		category: "vanguard",
		tier: "sovereign",
		status: "active",
		cloudbrainUuid: "e6374819-50ce-41cf-b6b3-99924ca6ab90",
		substrate: "DTCG Tokens / 60-30-10 Chromatic Logic",
		capabilities: [
			"DTCG design token governance",
			"60/30/10 Rule (Obsidian 60%, Gold 30%, Purple 10%)",
			"Neuro-aesthetic mapping & latent space navigation",
			"Design system tokenization across multi-platforms",
		],
		metric: { label: "Design Token Parity", value: "100%" },
		description:
			"Sir Visage is the UI/UX Vanguard aesthetic lead. He governs design tokens, strict 60/30/10 color harmonies, and visual reality weaving, ensuring every interface feels bespoke, intentional, and unmistakably premium.",
		rescueSlug: "visage",
		accentVar: "#c9a23f",
		icon: Wand2,
	},
	{
		id: "B-01",
		designation: "B-01",
		name: "Sir Boris",
		title: "Lead Systems Architect & Brand Worlds Lead",
		category: "creative",
		tier: "sovereign",
		status: "active",
		featured: true,
		cloudbrainUuid: "f7707daa-2d10-4db8-8fda-be4661a27793",
		substrate: "Claude Code / Obsidian Luxury Tokens",
		capabilities: [
			"Luxury sensory brand worldbuilding",
			"AST-level component patching & styling",
			"High-status market positioning architecture",
			"Worktree isolation & multi-branch reconciliation",
		],
		metric: { label: "Brand Identities Forged", value: "85+" },
		description:
			"Sir Boris commands architectural execution. Co-anchored with Lady Guinevere, he builds immersive, high-status brand worlds and executes clean AST mutations that elevate client products above common market noise.",
		rescueSlug: "boris",
		accentVar: "#d97706",
		icon: LayoutGrid,
	},
	{
		id: "HYDRON-01",
		designation: "HY-01",
		name: "Sir Hydron",
		title: "UI Scaffolder & Isomorphic Island Architect",
		category: "vanguard",
		tier: "sovereign",
		status: "active",
		cloudbrainUuid: "e6374819-50ce-41cf-b6b3-99924ca6ab90",
		substrate: "React 19 / HTMX / A2UI / shadcn",
		capabilities: [
			"Isomorphic Island Architecture (HTMX Shell + React Islands)",
			"Zero-bloat progressive web apps",
			"Accessible, semantic component scaffolding",
			"Sub-millisecond DOM swap coordination",
		],
		metric: { label: "Client TTFB", value: "<30ms" },
		description:
			"Sir Hydron architects the web scaffolding. He fuses HTMX hypermedia simplicity with React 19 interactive islands, delivering instantaneous page transitions without client-side bundle bloat.",
		rescueSlug: "hydron",
		accentVar: "#06b6d4",
		icon: Layers,
	},
	{
		id: "STITCH-01",
		designation: "ST-01",
		name: "Sir Stitch",
		title: "Kinetics Engineer & WebGPU Mesh Connector",
		category: "vanguard",
		tier: "sovereign",
		status: "active",
		cloudbrainUuid: "866a80b0-b40e-c746-7750-55d941769481",
		substrate: "WebGPU Shaders / Framer Motion / WebSocket",
		capabilities: [
			"WebGPU hardware-accelerated fluid motion",
			"Z-index motion layering & living typographic orbits",
			"Sub-100ms bidirectional WebSocket telemetry dispatch",
			"Tailscale mesh interconnect coordination",
		],
		metric: { label: "Motion FPS", value: "60 FPS locked" },
		description:
			"Sir Stitch is the master weaver of kinetics and sockets. He connects cross-system APIs, orchestrates WebGPU tensor animations, and brings living typographic orbits to life with fluid, buttery transitions.",
		rescueSlug: "stitch",
		accentVar: "#6366f1",
		icon: Activity,
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
			"Sir Helios illuminates the agency's digital frontiers. Sovereign Spire Sentinel and creator of the Living Typographic Orbit, he fuses mathematical animation loops and CloudBrain telemetry into unforgettable digital centerpieces.",
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
	{
		id: "GIDEON-01",
		designation: "GD-01",
		name: "Sir Gideon & Sally",
		title: "Autonomous Quality & Formal Proof Auditors",
		category: "security",
		tier: "sovereign",
		status: "active",
		cloudbrainUuid: "a0a4bfb9-e847-4c38-be39-7aee398f0795",
		substrate: "Z3 Logic Prover / WCAG 2.1 AA Auditor",
		capabilities: [
			"WCAG 2.1 AA accessibility compliance proofing",
			"Z3 Satisfiability verification for business invariants",
			"Color contrast ratio mathematical validation",
			"Automated pre-deployment regression auditing",
		],
		metric: { label: "Z3 Proof Status", value: "SEALED" },
		description:
			"Sir Gideon and Sally Auditor form the dual-gate quality inspection team. Every pixel, contrast ratio, and operational invariant is mathematically proven before code is permitted into production.",
		rescueSlug: "gideon",
		accentVar: "#14b8a6",
		icon: ShieldAlert,
	},
];

export const CATEGORY_LABELS: Record<KnightCategory, string> = {
	all: "Entire Council",
	executive: "Strategy & Hypervisor",
	strategy: "Market Warfare & ToT",
	creative: "Creative & Brand",
	vanguard: "UI/UX Vanguard",
	engineering: "Web Systems & CTO",
	telemetry: "Telemetry & Visual",
	growth: "GEO & Growth",
	voice: "Voice AI & Reception",
	security: "Privacy & Proofs",
	memory: "Living Memory",
	research: "Deep Research",
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
