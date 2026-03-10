create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text not null default 'starter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
    role in ('operator', 'client_admin', 'client_member')
  )
);

create unique index if not exists idx_org_members_default_per_user
  on public.organization_members (user_id)
  where is_default;

create table if not exists public.organization_settings (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  brand_name text,
  voice text,
  primary_offer text,
  target_channels jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create table if not exists public.review_decisions (
  id uuid primary key default gen_random_uuid(),
  workflow_run_id uuid not null references public.workflow_runs(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  reviewer_id uuid references public.profiles(id) on delete set null,
  decision text not null,
  notes text,
  created_at timestamptz not null default now(),
  constraint review_decisions_check check (
    decision in ('approved', 'rejected', 'changes_requested')
  )
);

create index if not exists idx_org_members_user on public.organization_members(user_id);
create index if not exists idx_org_members_org on public.organization_members(organization_id);
create index if not exists idx_workflow_runs_org on public.workflow_runs(organization_id);
create index if not exists idx_agent_runs_org on public.agent_runs(organization_id);
create index if not exists idx_review_decisions_org on public.review_decisions(organization_id);

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at
before update on public.organizations
for each row execute procedure public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists set_org_members_updated_at on public.organization_members;
create trigger set_org_members_updated_at
before update on public.organization_members
for each row execute procedure public.set_updated_at();

drop trigger if exists set_org_settings_updated_at on public.organization_settings;
create trigger set_org_settings_updated_at
before update on public.organization_settings
for each row execute procedure public.set_updated_at();

drop trigger if exists set_workflow_runs_updated_at on public.workflow_runs;
create trigger set_workflow_runs_updated_at
before update on public.workflow_runs
for each row execute procedure public.set_updated_at();
