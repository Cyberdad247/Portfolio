# Supabase Auth And Tenancy Setup

This project now includes:

- Supabase-based web authentication
- organization membership tenancy
- RLS-ready SQL migrations
- protected Next.js `/dashboard` and `/admin` routes
- FastAPI bearer-token verification and org access checks

## Current Repo Mapping

The auth integration is wired to the current repo layout:

- Next.js app: `app/`, `lib/`, `components/`, `middleware.ts`
- Python API: `api/app`
- SQL migrations: `infra/sql`

It does not require the older `apps/web` or `apps/api` monorepo structure.

## Required Environment Variables

Frontend in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=REPLACE_WITH_PUBLISHABLE_OR_ANON_KEY
LIVEKIT_URL=wss://YOUR_LIVEKIT_HOST
LIVEKIT_API_KEY=REPLACE_WITH_LIVEKIT_API_KEY
LIVEKIT_API_SECRET=REPLACE_WITH_LIVEKIT_API_SECRET
```

Backend in `api/.env`:

```bash
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=REPLACE_WITH_SERVICE_ROLE_OR_SECRET_KEY
SUPABASE_JWT_SECRET=REPLACE_WITH_CURRENT_SUPABASE_JWT_SECRET
```

Notes:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe for the browser when RLS is enabled correctly.
- Vercel must define the same public variables exactly as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for middleware, login, and dashboard auth to work.
- `SUPABASE_SERVICE_ROLE_KEY` must stay server-only.
- `SUPABASE_JWT_SECRET` is required for symmetric JWT verification in the API.
- If you use asymmetric signing in Supabase, the API can verify via JWKS instead of the JWT secret.

## SQL Migration Order

Run these files in Supabase SQL Editor in order:

1. `infra/sql/001_auth_tenancy.sql`
2. `infra/sql/002_profile_trigger.sql`
3. `infra/sql/003_rls_helpers.sql`
4. `infra/sql/004_rls_policies.sql`
5. `infra/sql/005_seed_example.sql`

What they do:

- `001`: tables, indexes, updated-at triggers, active-membership constraint, onboarding session persistence
- `002`: profile creation trigger from `auth.users`
- `003`: RLS helper functions using `SECURITY DEFINER`
- `004`: rerunnable RLS policies with restricted membership role assignment
- `005`: optional example organization and membership seed

## Post-Migration Checks

After running the SQL:

1. Create a test user in Supabase Auth.
2. Confirm a matching row exists in `public.profiles`.
3. Insert or seed an `organization_members` row for that user.
4. Confirm only one membership per user can be `is_default = true`.
5. Confirm a `client_admin` cannot grant `operator` or `super_admin` membership roles.
6. Confirm non-members cannot read another org's rows through the REST API.

## Web Auth Flow

The web app uses:

- `app/login/page.tsx` for magic-link sign-in
- `app/auth/callback/route.ts` to exchange the auth code for a session
- `middleware.ts` to refresh sessions and protect `/dashboard` and `/admin`
- `app/dashboard/page.tsx` for authenticated org-scoped access
- `app/admin/page.tsx` for internal-only access

Expected behavior:

- anonymous user visiting `/dashboard` or `/admin` is redirected to `/login`
- signed-in user without org membership sees a no-access state on `/dashboard`
- signed-in non-internal user visiting `/admin` is redirected to `/dashboard`

## Automated Receptionist Flow

The onboarding receptionist now includes:

- browser STT via the Web Speech API
- browser TTS via `speechSynthesis`
- transcript-driven form autofill for the active phase
- authenticated onboarding session persistence with transcript history
- a LiveKit token route for later migration to full realtime voice rooms

Implemented files:

- `components/onboarding/onboarding-flow.tsx`
- `components/onboarding/lady-reception-avatar.tsx`
- `hooks/use-receptionist-voice.ts`
- `lib/onboarding/voice-intake.ts`
- `app/api/onboarding/session/route.ts`
- `app/api/livekit/token/route.ts`
- `lib/livekit/server.ts`

Current behavior:

- the receptionist can listen in supported browsers and extract spoken details into onboarding fields
- the receptionist speaks phase prompts and extraction acknowledgements in supported browsers
- the onboarding remains reviewable in the form UI rather than silently submitting unknown values
- authenticated users with an active org membership resume their saved onboarding draft across sessions
- `POST /api/livekit/token` issues a room join token for receptionist rooms prefixed with `receptionist-`

Current limitations:

- STT/TTS availability depends on browser support
- extraction is heuristic, not LLM-based
- LiveKit realtime room orchestration is not active yet; the token route is the integration boundary for that next step

## API Auth Flow

The API uses:

- `api/app/core/auth.py` to verify bearer tokens
- `api/app/core/permissions.py` to resolve profile role and org membership via Supabase
- `api/app/api/v1/routes/objectives.py` to enforce org access on workflow and review endpoints
- `api/app/services/workflow_runs.py` to persist `workflow_runs`
- `api/app/services/agent_runs.py` to persist phase-level `agent_runs`
- `api/app/services/review_decisions.py` to persist manual review decisions

Expected behavior:

- missing or invalid bearer token returns `401`
- valid user without org membership returns `403`
- internal roles bypass tenant membership checks
- client users are limited by org membership role
- objective execution persists to `workflow_runs` and appends related `agent_runs`
- review decisions are restricted to client-admin or internal roles

## Implemented API Endpoints

Protected endpoints currently implemented:

- `POST /api/v1/objectives/pitch`
- `POST /api/v1/objectives/optimize-portfolio`
- `POST /api/v1/objectives/swarm-campaign`
- `GET /api/v1/objectives/status/{packet_id}`
- `GET /api/v1/organizations/{org_id}/workflow-runs`
- `GET /api/v1/objectives/{workflow_run_id}/agent-runs`
- `GET /api/v1/objectives/{workflow_run_id}/review-decisions`
- `POST /api/v1/review-decisions`
- `POST /api/v1/org/context`
- `POST /api/v1/audit/seo-geo`

## Local Verification

Frontend:

```bash
npm run typecheck
```

Backend:

```bash
python -m compileall api/app
```

Targeted auth-file lint check:

```bash
npx biome check app/login/page.tsx app/auth/callback/route.ts app/auth/logout/route.ts app/dashboard/page.tsx app/admin/page.tsx components/dashboard-shell.tsx components/admin-shell.tsx lib/auth/get-active-membership.ts lib/auth/get-profile.ts lib/auth/get-session.ts lib/auth/roles.ts lib/supabase/client.ts lib/supabase/server.ts lib/supabase/env.ts middleware.ts --config-path biome.json
```

Bootstrap first org membership from terminal:

```powershell
.\scripts\create-first-org-member.ps1
```

Promote a user to internal admin from terminal:

```powershell
.\scripts\promote-super-admin.ps1
```

Full bootstrap for VaShawn Head:

```powershell
.\scripts\bootstrap-vashawn-super-admin.ps1
```

## Known Non-Blocking Repo State

Repo-wide `npm run lint:strict` still reports pre-existing issues outside the auth integration. That does not block this auth slice, but it does block a clean full-repo lint pass until those unrelated files are fixed.

## Recommended Next Step

After secrets are configured and migrations are applied, the next useful production step is:

- persist `workflow_runs`, `agent_runs`, and `review_decisions` from the FastAPI/Camelot path instead of keeping objective state only in memory
