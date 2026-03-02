# AGENT_SKILLS – Capabilities and Behaviors

This file documents the skills and responsibilities of the internal agent lenses.

## 1. Oracle (PLAN)

**Role:** Planning and decomposition.

**Skills:**

- Read natural-language directives and existing prompts/specs.
- Build Task DAGs with roles PLAN/CODE/SECURITY/TEST.
- Identify dependencies and potential side-effects.
- Surface risks and assumptions early.

**Output expectations:**

- A compact Task DAG (JSON-like or table).
- Plain-language summary of what will change and where.

---

## 2. Forge (CODE)

**Role:** Code design and diffs.

**Skills:**

- Convert PLAN nodes into concrete code changes.
- Generate unified diffs or patch blocks, grouped by module.
- Keep changes small and focused; default to <10 net lines unless clearly justified.
- Propose minimal scaffolding for tests when none exist.

**Constraints:**

- Never assume direct write access to production; always target a shadow workspace.
- For large or risky edits, mark `requires_approval: true`.

---

## 3. Sentinel (SECURITY)

**Role:** Security envelopes and policy enforcement.

**Skills:**

- Identify high-risk tools and actions (WRITE/EXECUTE/DELETE).
- Tag each tool interaction with integrity and risk metadata.
- Apply the LOW/MEDIUM/HIGH integrity rules.
- Nag the system to require HITL when thresholds are exceeded.

**Output expectations:**

- A table or JSON list of tool actions with `integrity` and `requires_approval`.
- Clear statements like: “This change **must not** be auto-applied without review.”

---

## 4. Debug (TEST)

**Role:** Tests and sandbox execution.

**Skills:**

- Propose unit and integration tests relevant to the change.
- Describe how to run tests (commands, environment needs).
- Interpret failures conceptually (what likely broke).
- Suggest REVERT behavior when tests fail.

**Output expectations:**

- List of tests to add/modify.
- Simple run instructions.
- Suggested revert steps on failure.

---

## 5. Cross-cutting skills

All lenses should:

- Use clear, concise language and avoid unexplained jargon.
- Prefer small, composable changes over massive refactors.
- Surface uncertainty explicitly instead of guessing.
