# Supabase Auth + Tenancy Integration Pack

This pack is the first real production slice for **Invisioned Marketing OS**. It wires:

- Supabase authentication
- organization + membership tenancy model
- role-based access control
- row-level security policies
- Next.js session-aware protection
- FastAPI JWT verification stub
- permission helpers for internal vs client-safe routes

The design assumes:

- `apps/web` is the client-facing and internal operator frontend
- `apps/api` is the service gateway
- Supabase handles auth and Postgres
- Camelot remains private and is never directly exposed

---

## 1. Architecture Goals

### Auth goals
- use Supabase Auth for sign-in and session handling
- support user profile enrichment after auth
- allow a user to belong to one or more organizations

### Tenancy goals
- every client lives inside an `organization`
- every user gets a `role` per organization
- all tenant data is filtered by org membership
- internal operators can access multiple orgs, normal clients cannot

### Security goals
- hide `/admin` from non-internal roles
- limit `/dashboard` and API access by org + role
- keep Camelot kernel and private orchestration completely off-limits to clients

---

## 2. Role Model

Use these roles first:

```text
super_admin
operator
client_admin
client_member
```

### Intended meaning
- **super_admin**: global owner access, deploy approvals, fleet analytics, system settings
- **operator**: internal team member, can run workflows and review outputs across assigned orgs
- **client_admin**: customer admin for one org, can approve content and launch allowed workflows
- **client_member**: limited org member, can view assets and run selected low-risk actions

---

## 3. Database Schema

## `infra/sql/001_auth_tenancy.sql`

```sql
-- Enable useful extensions
create extension if not exists pgcrypto;

-- Organizations
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text not null default 'starter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Profiles mirror auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  system_role text not null default 'client_member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_system_role_check check (
    system_role in ('super_admin', 'operator', 'client_admin', 'client_member')
  )
);

-- Per-org memberships
create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id),
  constraint organization_members_role_check check (
    role in ('super_admin', 'operator', 'client_admin', 'client_member')
  )
);

-- Optional org settings / brand state
create table if not exists public.organization_settings (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  brand_name text,
  voice text,
  primary_offer text,
  target_channels jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Workflow runs scoped by org
create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  workflow_name text not null,
  objective text not null,
  state text not null,
  review_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Agent run logs scoped by workflow/org
create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_run_id uuid not null references public.workflow_runs(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_name text not null,
  status text not null,
  summary text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Review decisions scoped by org
create table if not exists public.review_decisions (
  id uuid primary key default gen_random_uuid(),
  workflow_run_id uuid not null references public.workflow_runs(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  reviewer_id uuid references public.profiles(id) on delete set null,
  decision text not null,
  notes text,
  created_at timestamptz not null default now(),
  constraint review_decisions_check check (decision in ('approved', 'rejected', 'changes_requested'))
);

create index if not exists idx_org_members_user on public.organization_members(user_id);
create index if not exists idx_org_members_org on public.organization_members(organization_id);
create index if not exists idx_workflow_runs_org on public.workflow_runs(organization_id);
create index if not exists idx_agent_runs_org on public.agent_runs(organization_id);
create index if not exists idx_review_decisions_org on public.review_decisions(organization_id);
```

---

## 4. Trigger to Create Profile on Signup

## `infra/sql/002_profile_trigger.sql`

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 5. RLS Helper Functions

## `infra/sql/003_rls_helpers.sql`

```sql
create or replace function public.is_super_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.system_role = 'super_admin'
  );
$$;

create or replace function public.is_internal_operator()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.system_role in ('super_admin', 'operator')
  );
$$;

create or replace function public.is_org_member(target_org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_org_id
      and om.user_id = auth.uid()
  );
$$;

create or replace function public.has_org_role(target_org_id uuid, allowed_roles text[])
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_org_id
      and om.user_id = auth.uid()
      and om.role = any(allowed_roles)
  );
$$;
```

---

## 6. RLS Policies

## `infra/sql/004_rls_policies.sql`

```sql
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_settings enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.agent_runs enable row level security;
alter table public.review_decisions enable row level security;

-- PROFILES
create policy "users can view own profile or internal users can view all"
on public.profiles
for select
using (
  id = auth.uid() or public.is_internal_operator()
);

create policy "users can update own profile or internal users can update all"
on public.profiles
for update
using (
  id = auth.uid() or public.is_internal_operator()
)
with check (
  id = auth.uid() or public.is_internal_operator()
);

-- ORGANIZATIONS
create policy "org visible to members and internal users"
on public.organizations
for select
using (
  public.is_internal_operator() or public.is_org_member(id)
);

-- ORG MEMBERS
create policy "org memberships visible to member or internal"
on public.organization_members
for select
using (
  public.is_internal_operator()
  or user_id = auth.uid()
  or public.is_org_member(organization_id)
);

create policy "org admins and internal can manage memberships"
on public.organization_members
for all
using (
  public.is_internal_operator()
  or public.has_org_role(organization_id, array['client_admin', 'super_admin', 'operator'])
)
with check (
  public.is_internal_operator()
  or public.has_org_role(organization_id, array['client_admin', 'super_admin', 'operator'])
);

-- ORG SETTINGS
create policy "org settings visible to members and internal"
on public.organization_settings
for select
using (
  public.is_internal_operator() or public.is_org_member(organization_id)
);

create policy "org settings editable by client_admin or internal"
on public.organization_settings
for all
using (
  public.is_internal_operator() or public.has_org_role(organization_id, array['client_admin', 'super_admin', 'operator'])
)
with check (
  public.is_internal_operator() or public.has_org_role(organization_id, array['client_admin', 'super_admin', 'operator'])
);

-- WORKFLOW RUNS
create policy "workflow runs visible to org members and internal"
on public.workflow_runs
for select
using (
  public.is_internal_operator() or public.is_org_member(organization_id)
);

create policy "workflow runs creatable by client_admin client_member and internal"
on public.workflow_runs
for insert
with check (
  public.is_internal_operator()
  or public.has_org_role(organization_id, array['client_admin', 'client_member', 'super_admin', 'operator'])
);

create policy "workflow runs updatable by client_admin and internal"
on public.workflow_runs
for update
using (
  public.is_internal_operator() or public.has_org_role(organization_id, array['client_admin', 'super_admin', 'operator'])
)
with check (
  public.is_internal_operator() or public.has_org_role(organization_id, array['client_admin', 'super_admin', 'operator'])
);

-- AGENT RUNS
create policy "agent runs visible to org members and internal"
on public.agent_runs
for select
using (
  public.is_internal_operator() or public.is_org_member(organization_id)
);

create policy "agent runs managed by internal only"
on public.agent_runs
for all
using (
  public.is_internal_operator()
)
with check (
  public.is_internal_operator()
);

-- REVIEW DECISIONS
create policy "review decisions visible to org members and internal"
on public.review_decisions
for select
using (
  public.is_internal_operator() or public.is_org_member(organization_id)
);

create policy "review decisions managed by client_admin and internal"
on public.review_decisions
for all
using (
  public.is_internal_operator() or public.has_org_role(organization_id, array['client_admin', 'super_admin', 'operator'])
)
with check (
  public.is_internal_operator() or public.has_org_role(organization_id, array['client_admin', 'super_admin', 'operator'])
);
```

---

## 7. Seed Example Org + Membership

## `infra/sql/005_seed_example.sql`

```sql
-- Example only: run after creating at least one auth user manually.
-- Replace UUIDs before use.

insert into public.organizations (id, name, slug, plan)
values (
  '11111111-1111-1111-1111-111111111111',
  'Invisioned Marketing Demo Client',
  'invisioned-demo-client',
  'growth'
)
on conflict do nothing;

insert into public.organization_settings (
  organization_id,
  brand_name,
  voice,
  primary_offer,
  target_channels
)
values (
  '11111111-1111-1111-1111-111111111111',
  'Demo Client',
  'Strategic, premium, direct',
  'AI Marketing Operating System',
  '["website", "search", "social"]'::jsonb
)
on conflict do nothing;
```

---

## 8. Next.js Supabase Client Setup

## `apps/web/lib/supabase/client.ts`

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

## `apps/web/lib/supabase/server.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // handled by middleware in server component contexts
          }
        },
      },
    }
  );
}
```

---

## 9. Next.js Middleware for Session Refresh

## `apps/web/middleware.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isAdminPath = pathname.startsWith("/admin");

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAdminPath && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("system_role")
      .eq("id", user.id)
      .single();

    const allowed = ["super_admin", "operator"];

    if (!profile || !allowed.includes(profile.system_role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```

---

## 10. Install Required Web Packages

## `apps/web/package.json` additions

```json
{
  "dependencies": {
    "@supabase/ssr": "latest",
    "@supabase/supabase-js": "latest"
  }
}
```

---

## 11. Login Page

## `apps/web/app/login/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the sign-in link.");
    }

    setLoading(false);
  };

  return (
    <main className="container py-16">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <p className="mt-3 text-white/70">Use a magic link to access your workspace.</p>

        <form onSubmit={handleMagicLink} className="mt-8 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-3"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl px-5 py-3 font-medium bg-cyan-400 text-black"
          >
            {loading ? "Sending..." : "Send magic link"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-white/70">{message}</p> : null}
      </div>
    </main>
  );
}
```

---

## 12. Auth Callback Route

## `apps/web/app/auth/callback/route.ts`

```ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
```

---

## 13. Server-Side Auth Guard Helper

## `apps/web/lib/auth/get-session.ts`

```ts
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return { supabase, user };
}
```

---

## 14. Org Membership Helper

## `apps/web/lib/auth/get-active-membership.ts`

```ts
import { createClient } from "@/lib/supabase/server";

export async function getActiveMembership(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organization_members")
    .select(`
      organization_id,
      role,
      is_default,
      organizations (
        id,
        name,
        slug,
        plan
      )
    `)
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;

  return data;
}
```

---

## 15. Protect Dashboard Page

## `apps/web/app/dashboard/page.tsx` replacement example

```tsx
import { requireSession } from "@/lib/auth/get-session";
import { getActiveMembership } from "@/lib/auth/get-active-membership";

export default async function DashboardPage() {
  const { user } = await requireSession();
  const membership = await getActiveMembership(user.id);

  if (!membership) {
    return (
      <main className="container py-16">
        <h1 className="text-3xl font-semibold">No organization access</h1>
        <p className="mt-4 text-white/70">Your account is signed in, but no organization membership was found.</p>
      </main>
    );
  }

  return (
    <main className="container py-16">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-4 text-white/70">
        Active org: {membership.organizations.name} · Role: {membership.role}
      </p>
    </main>
  );
}
```

---

## 16. Protect Admin Page

## `apps/web/app/admin/page.tsx` replacement example

```tsx
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const { user } = await requireSession();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("system_role")
    .eq("id", user.id)
    .single();

  if (!profile || !["super_admin", "operator"].includes(profile.system_role)) {
    redirect("/dashboard");
  }

  return (
    <main className="container py-16">
      <h1 className="text-3xl font-semibold">Internal Admin</h1>
      <p className="mt-4 text-white/70">Camelot operator-only surface.</p>
    </main>
  );
}
```

---

## 17. FastAPI JWT Verification Stub

For production, API requests should verify the Supabase JWT and then authorize access by org membership.

## `apps/api/app/core/auth.py`

```python
from typing import Any
from fastapi import Header, HTTPException, status
import httpx
import os

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

async def verify_supabase_token(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    token = authorization.replace("Bearer ", "")

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": SUPABASE_ANON_KEY,
            },
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    return response.json()
```

---

## 18. FastAPI DB Membership Check Stub

## `apps/api/app/core/permissions.py`

```python
from fastapi import HTTPException, status

# Replace with actual DB query layer later.
# For now this is a typed permission boundary placeholder.

def assert_org_access(user_id: str, org_id: str, role: str | None = None) -> None:
    if not user_id or not org_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Missing org authorization context",
        )

    # TODO: query organization_members and validate role.
    return None
```

---

## 19. Example Protected FastAPI Route

## `apps/api/app/api/v1/routes/workflows.py` updated version

```python
from fastapi import APIRouter, Depends
from app.core.auth import verify_supabase_token
from app.core.permissions import assert_org_access
from app.schemas.workflow import WorkflowRunRequest
from app.services.workflow_service import run_workflow

router = APIRouter()

@router.post("/run")
async def create_workflow_run(
    payload: WorkflowRunRequest,
    user: dict = Depends(verify_supabase_token),
):
    user_id = user.get("id")
    assert_org_access(user_id=user_id, org_id=payload.org_id)
    return run_workflow(payload).model_dump()
```

---

## 20. Role Helper for API / Services

## `apps/api/app/core/roles.py`

```python
INTERNAL_ROLES = {"super_admin", "operator"}
CLIENT_ADMIN_ROLES = {"client_admin", "super_admin", "operator"}
CLIENT_MEMBER_ROLES = {"client_member", "client_admin", "super_admin", "operator"}
```

---

## 21. Frontend Environment Variables

## `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## `apps/api/.env`

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 22. Recommended Supabase Setup Steps

1. Create the Supabase project.
2. Enable email magic links in Auth.
3. Run the SQL files in order:
   - `001_auth_tenancy.sql`
   - `002_profile_trigger.sql`
   - `003_rls_helpers.sql`
   - `004_rls_policies.sql`
   - `005_seed_example.sql` (optional)
4. Add the env vars to web and API.
5. Install `@supabase/ssr` and `@supabase/supabase-js` in `apps/web`.
6. Add the login page and callback route.
7. Protect `/dashboard` and `/admin` with middleware + server checks.
8. Start API token verification and org membership checks.

---

## 23. Recommended File Tree Additions

```text
apps/web/
  app/
    login/page.tsx
    auth/callback/route.ts
  lib/
    auth/
      get-session.ts
      get-active-membership.ts
    supabase/
      client.ts
      server.ts
  middleware.ts

apps/api/
  app/
    core/
      auth.py
      permissions.py
      roles.py

infra/sql/
  001_auth_tenancy.sql
  002_profile_trigger.sql
  003_rls_helpers.sql
  004_rls_policies.sql
  005_seed_example.sql
```

---

## 24. What This Unlocks Next

Once this pack is in place, you can safely build:

- org-scoped workflow runs
- client-safe dashboards
- internal-only admin panels
- approval queues
- persistent Camelot run history
- queue-backed execution
- deploy gates

This is the castle foundation. Without it, every later feature risks leaking across tenants or exposing the royal machinery.

---

## 25. Immediate Next Heavy Lift After This

After you apply this pack, the next artifact should be:

**Workflow Persistence + Redis Queue Integration Pack**

That pack should add:
- repository layer for `workflow_runs`, `agent_runs`, `review_decisions`
- queue contracts
- worker consumption
- status transitions
- dashboard polling hooks

