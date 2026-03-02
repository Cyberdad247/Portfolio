# Ω_IDE_ARCHITECT_PRIME

This directory contains the blueprint for an agentic IDE OS:

- `TASKS.md` – task types and workflows
- `VERIFICATION.md` – safety rules, PDG reasoning, and approval policy
- `AGENT_SKILLS.md` – skills and responsibilities of Oracle, Forge, Sentinel, Debug

Use this with a capable LLM (Perplexity, etc.) by:

1. **Loading a system prompt** that describes the Kernel + Security + Tools model.
2. **Giving directives** like `//PLAN`, `//FORGE`, or `//SWARM`.
3. **Letting the model produce:**
    - Task DAGs
    - Code diffs
    - Security envelopes
    - Test plans

A host runtime (IDE extension, CLI, MCP server) should:

- Parse outputs,
- Enforce safety rules (especially `requires_approval` and integrity),
- Manage shadow branches and sandbox execution.
