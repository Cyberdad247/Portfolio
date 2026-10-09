export type SkillContent = {
    id: string;
    title: string;
    role: string;
    description: string;
    phases: {
        title: string;
        steps: string[];
    }[];
};

export const skillsData: Record<string, SkillContent> = {
    "browser-forensics": {
        id: "browser-forensics",
        title: "Browser Forensics",
        role: "Nano-Knight (Swarm) & Web Audit",
        description: "Use this skill to deploy the Nano-Browser swarm for automated UI/UX analysis and forensic scraping.",
        phases: [
            {
                title: "Phase 1: Swarm Deployment",
                steps: [
                    "Manifest Alignment: Ensure the Nano-Browser environment (MV3) is configured for the target.",
                    "Content Sentry Hook: Initialize content_sentry.js to protect against injection.",
                ],
            },
            {
                title: "Phase 2: DOM Forensic Mapping",
                steps: [
                    "Tree Traversal: Use buildDomTree.js to extract semantic meaning from the page structure.",
                    "Visual QA: Capture screenshots and trace event handlers for interactive elements.",
                ],
            },
            {
                title: "Phase 3: Extraction & Audit",
                steps: [
                    "Data Cleaning: Filter out ephemeral UI noise and focus on 'Target Assets.'",
                    "Security Audit: Scan for trackers, unauthenticated API calls, or leaky client-side state.",
                ],
            },
            {
                title: "Phase 4: Synthesis",
                steps: [
                    "Return the Forensic Data Packet (JSON) to the Chronos/Semantic layer for UKG ingestion.",
                ],
            },
        ],
    },
    "forge-coding": {
        id: "forge-coding",
        title: "Forge Coding",
        role: "Code Design (L2) & Implementation",
        description: "Use this skill to transmute planning into kinetic, secure, and testable code.",
        phases: [
            {
                title: "Phase 1: Architecture Alignment",
                steps: [
                    "AST Alignment: Ensure changes follow the project's strict typing and linting (Biome/Cargo).",
                    "Scaffold Prep: Identify where the unit test for this logic will reside.",
                ],
            },
            {
                title: "Phase 2: Kinetic Iteration (10-line Rule)",
                steps: [
                    "Incremental Diffs: Break large changes into small, atomic patches (<10 net lines).",
                    "Unified Diff Format: Generate patches that are drop-in compatible with the existing stack.",
                    "Shadow Workspace Target: Never assume direct write to production without a verification pass.",
                ],
            },
            {
                title: "Phase 3: Test Integration",
                steps: [
                    "Scaffold Unit Tests: For every logic change, propose a minimal pytest or cargo test suite.",
                    "Verify against Specs: Ensure the code exactly matches the Oracle's PLAN criteria.",
                ],
            },
            {
                title: "Phase 4: Code Review Readiness",
                steps: [
                    "Run Squire Clean (Lint/Format) and Squire Purge (Tree-shake) before submitting.",
                ],
            },
        ],
    },
    "oracle-planning": {
        id: "oracle-planning",
        title: "Oracle Planning",
        role: "Kernel Planning (L3) & Decomposition",
        description: "Use this skill when initiating any complex directive to ensure deterministic execution paths.",
        phases: [
            {
                title: "Phase 1: Context Absorption",
                steps: [
                    "Source Audit: Identify all influencing UKG nodes, local files, and USER requirements.",
                    "Boundary Check: Consult docs/TITANIUM_LAWS.md and docs/EMPIRE_MAP.md for constraints.",
                ],
            },
            {
                title: "Phase 2: DAG Decomposition",
                steps: [
                    "Role Mapping: Decompose the task into discrete nodes for (PLAN, CODE, SECURITY, TEST).",
                    "Dependency Mapping: Clearly define the order of execution (Task DAG).",
                ],
            },
            {
                title: "Phase 3: Risk Assessment",
                steps: [
                    "Side-Effect Matrix: Identify potential conflicts with existing modules.",
                    "Assumption Logging: Document any 'truths' being assumed during planning.",
                    "Iron Gate Check: Flag any operations requiring HITL approval (>10 lines, DELETE, EXECUTE).",
                ],
            },
            {
                title: "Phase 4: Implementation Plan Artifact",
                steps: [
                    "Generate a compact Implementation Plan (Table/JSON) to be reviewed by the Operator.",
                ],
            },
        ],
    },
    "research-apis": {
        id: "research-apis",
        title: "Research APIs",
        role: "High-Fidelity Research (L4/Lady Apis)",
        description: "Use this skill for deep-dives into external repos, documentation, or complex technical concepts.",
        phases: [
            {
                title: "Phase 1: Target Identification",
                steps: [
                    "Define Search Space: Identify the key repositories, URLs, or internal UKG nodes to query.",
                    "Prioritize Fidelity: Focus on official docs and source code over generic blogs.",
                ],
            },
            {
                title: "Phase 2: The BASHR Loop",
                steps: [
                    "Broadcast: Formulate precise research queries.",
                    "Act: Use tools like search_web, read_url_content, or browser automation.",
                    "Synthesize: Condense raw findings into actionable technical summaries.",
                    "Hash: Log the research path and findings to the PROVENANCE_LEDGER.md.",
                    "Report: Present the distilled truth to the relevant Agents.",
                ],
            },
            {
                title: "Phase 3: Cross-Correlation",
                steps: [
                    "Identify Patterns: Find synergies between researched tech and the Camelot Stack.",
                    "Surface Edge Cases: Document known 'gotchas' or breaking changes.",
                ],
            },
        ],
    },
    "sentinel-security": {
        id: "sentinel-security",
        title: "Sentinel Security",
        role: "Structural Audit (L6) & AgentArmor",
        description: "Use this skill to audit all tool interactions and enforce the Titanium Laws.",
        phases: [
            {
                title: "Phase 1: PDG Reasoning",
                steps: [
                    "Identify Data Sources: Classify all inputs as LOW (User/Web) or HIGH (Vetted Repo).",
                    "Map Flow: Trace LOW integrity data to ensure it never drives EXECUTE or DELETE actions.",
                ],
            },
            {
                title: "Phase 2: Tool Audit",
                steps: [
                    "High-Risk Flagging: Identify all WRITE/EXECUTE/DELETE operations.",
                    "Threshold Calculation: Apply the 10-line / 50MB Iron Gate rule.",
                    "Sanitization Check: Ensure all shell commands and SQL are properly constrained.",
                ],
            },
            {
                title: "Phase 3: Sentry Integration",
                steps: [
                    "Trivy/Semgrep Scans: Request automated scans on any new code blocks.",
                    "Secret Detection: Ensure no keys or tokens be committed via the Armor layer.",
                ],
            },
            {
                title: "Phase 4: Approval Handshake",
                steps: [
                    "Provide the Human Approval Checklist (PDG/Data-flow/Risk) to the Operator.",
                ],
            },
        ],
    },
    "systematic-debugging": {
        id: "systematic-debugging",
        title: "Systematic Debugging",
        role: "4-phase forensic root cause analysis",
        description: "Use when encountering any bug, test failure, or unexpected behavior.",
        phases: [
            {
                title: "Phase 1: Replication & Isolation",
                steps: [
                    "Minimum Reproducible Example: Create a test case that fails consistently.",
                    "State Snapshot: Record the exact variable states or DOM state at the point of failure.",
                ],
            },
            {
                title: "Phase 2: Hypothesis Generation",
                steps: [
                    "Identify Flow Path: Trace the data flow from the point of failure back to the source.",
                    "List Assumptions: What must be true for the code to work? Which assumption is likely broken?",
                ],
            },
            {
                title: "Phase 3: Root Cause Tracing",
                steps: [
                    "Narrow the Search: Use binary search or log-points to isolate the exact line.",
                    "Find the Polluter: If state is corrupt, find what set it, not just where it's read.",
                ],
            },
            {
                title: "Phase 4: Verification before Completion",
                steps: [
                    "Fix the Cause, not the Symptom: Ensure the fix addresses the root logic error.",
                    "Defense in Depth: Add a regression test and ensure no secondary side-effects.",
                ],
            },
        ],
    },
};
