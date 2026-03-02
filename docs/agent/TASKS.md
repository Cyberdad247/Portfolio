# TASKS – IDE Architect Prime Blueprint

This file defines the core tasks and workflows for the Ω_IDE_ARCHITECT_PRIME agentic IDE.

## 1. High-level goals

- Turn natural-language directives (`//PLAN`, `//FORGE`, `//SWARM`) into:
  - Clear task DAGs (PLAN)
  - Safe code diffs and tests (FORGE + TEST)
  - Security envelopes for every tool interaction (SECURITY)
- Keep all changes in a shadow workspace until tests pass and a human approves.

---

## 2. Core workflows

### 2.1 //PLAN – Planning-only workflow

**Trigger:**  
`//PLAN "Short description of change"`

**Steps:**

1. **Parse intent and scope.**
2. **Emit a Task DAG** with nodes shaped as:

    ```json
    {
      "id": "plan-1",
      "role": "PLAN",
      "summary": "Analyze current auth implementation and dependencies",
      "depends_on": []
    }
    ```

3. **Include CODE / SECURITY / TEST nodes** as needed, but do not emit code.
4. **Add a short risk assessment:**
    - Complexity (Low/Medium/High)
    - Potential impact areas (e.g., auth, billing, infra)
5. **Output sections:**

    - ## Task DAG

    - ## Risks & Assumptions

    - ## Recommended next commands (//FORGE, //SWARM)

### 2.2 //FORGE – Implementation workflow

**Trigger:**  
`//FORGE "Implement feature X"`

**Precondition:**

- Ideally a prior PLAN DAG (but can generate a quick inline plan if missing).

**Steps:**

1. **Summarize the plan** in 3–5 bullet points.
2. **For each CODE task:**
    - Propose code changes as **unified diffs** against a shadow branch.
    - Estimate net lines added/removed.
3. **For each TEST task:**
    - Propose test files/updates and how to run them (e.g., `npm test`, `go test ./...`).
4. **Attach a security envelope** to each tool-level action (filesystem writes, git ops, sandbox runs).
5. **Output sections:**

    - ## Plan recap

    - ## Proposed diffs

    - ## Tests to add/run

    - ## Security envelopes

### 2.3 //SWARM – Full pipeline (plan + code + security + tests)

**Trigger:**  
`//SWARM "Migrate sessions to Redis with zero downtime"`

**Steps:**

1. Run the //PLAN workflow (Task DAG + risks).
2. Run the //FORGE workflow (diffs + tests + envelopes).
3. **Add explicit instructions for the host runtime:**
    - Which diffs belong to the shadow branch.
    - Which tests to run in sandbox.
    - Which steps require human approval.
4. **Output sections:**

    - ## Task DAG

    - ## Implementation (diffs)

    - ## Tests & sandbox steps

    - ## Security & approval checklist

    - ## Host runtime instructions

## 3. Task roles and IDs

- **PLAN – Oracle:** planning + decomposition
- **CODE – Forge:** code design / diffs
- **SECURITY – Sentinel:** PDG reasoning + envelopes
- **TEST – Debug:** tests + sandbox execution plan

**Naming convention:**
`<role>-<short-scope>-<increment>`, e.g.:

- `plan-auth-1`
- `code-auth-adapter-1`
- `security-auth-redis-1`
- `test-auth-redis-1`

## 4. Shadow workspace protocol

All code changes target a **shadow branch/workspace** first.
Only after:

1. Tests pass in sandbox, and
2. HITL approval is granted for high-risk changes,
does the host apply patches to main.

The agent must always state:

- `shadow_branch_name` (suggested)
- `tests_to_run`
- `requires_approval` flags per change
