# [COMMAND] :: /validate-tasha
**Trigger:** Runs a full End-to-End validation of the Tasha Voice Agent.

**Workflow (The PIV Loop):**
1. **Lint & Type Check:** Run `tsc --noEmit` and `eslint` on the Mastra backend. If errors exist, apply AST-aware patches to fix them automatically.
2. **Database Integrity:** Ping `SpacetimeDB`. Attempt to write a dummy payload using `schemas/tasha_state.json`. If it fails, rewrite the database module and re-test.
3. **API Health:** Send a mock request to the `CLIProxyAPI` endpoint.
4. **Report:** Output a summary of the fixes applied and any remaining blockers requiring Human-in-the-Loop approval.
