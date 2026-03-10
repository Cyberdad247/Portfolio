alter table public.organizations enable row level security;
alter table public.organizations force row level security;
alter table public.profiles enable row level security;
alter table public.profiles force row level security;
alter table public.organization_members enable row level security;
alter table public.organization_members force row level security;
alter table public.organization_settings enable row level security;
alter table public.organization_settings force row level security;
alter table public.workflow_runs enable row level security;
alter table public.workflow_runs force row level security;
alter table public.agent_runs enable row level security;
alter table public.agent_runs force row level security;
alter table public.review_decisions enable row level security;
alter table public.review_decisions force row level security;

drop policy if exists "profiles_select_policy" on public.profiles;
create policy "profiles_select_policy"
on public.profiles
for select
using (
  id = auth.uid() or public.is_internal_operator()
);

drop policy if exists "profiles_update_policy" on public.profiles;
create policy "profiles_update_policy"
on public.profiles
for update
using (
  id = auth.uid() or public.is_internal_operator()
)
with check (
  id = auth.uid() or public.is_internal_operator()
);

drop policy if exists "organizations_select_policy" on public.organizations;
create policy "organizations_select_policy"
on public.organizations
for select
using (
  public.is_internal_operator() or public.is_org_member(id)
);

drop policy if exists "organization_members_select_policy" on public.organization_members;
create policy "organization_members_select_policy"
on public.organization_members
for select
using (
  public.is_internal_operator()
  or user_id = auth.uid()
  or public.is_org_member(organization_id)
);

drop policy if exists "organization_members_insert_policy" on public.organization_members;
create policy "organization_members_insert_policy"
on public.organization_members
for insert
with check (
  public.can_assign_org_role(organization_id, role)
);

drop policy if exists "organization_members_update_policy" on public.organization_members;
create policy "organization_members_update_policy"
on public.organization_members
for update
using (
  public.is_internal_operator()
  or public.has_org_role(organization_id, array['client_admin'])
)
with check (
  public.can_assign_org_role(organization_id, role)
);

drop policy if exists "organization_members_delete_policy" on public.organization_members;
create policy "organization_members_delete_policy"
on public.organization_members
for delete
using (
  public.is_internal_operator()
  or (
    public.has_org_role(organization_id, array['client_admin'])
    and role in ('client_admin', 'client_member')
  )
);

drop policy if exists "organization_settings_select_policy" on public.organization_settings;
create policy "organization_settings_select_policy"
on public.organization_settings
for select
using (
  public.is_internal_operator() or public.is_org_member(organization_id)
);

drop policy if exists "organization_settings_mutation_policy" on public.organization_settings;
create policy "organization_settings_mutation_policy"
on public.organization_settings
for all
using (
  public.is_internal_operator() or public.has_org_role(organization_id, array['client_admin'])
)
with check (
  public.is_internal_operator() or public.has_org_role(organization_id, array['client_admin'])
);

drop policy if exists "workflow_runs_select_policy" on public.workflow_runs;
create policy "workflow_runs_select_policy"
on public.workflow_runs
for select
using (
  public.is_internal_operator() or public.is_org_member(organization_id)
);

drop policy if exists "workflow_runs_insert_policy" on public.workflow_runs;
create policy "workflow_runs_insert_policy"
on public.workflow_runs
for insert
with check (
  public.is_internal_operator()
  or public.has_org_role(organization_id, array['client_admin', 'client_member'])
);

drop policy if exists "workflow_runs_update_policy" on public.workflow_runs;
create policy "workflow_runs_update_policy"
on public.workflow_runs
for update
using (
  public.is_internal_operator() or public.has_org_role(organization_id, array['client_admin'])
)
with check (
  public.is_internal_operator() or public.has_org_role(organization_id, array['client_admin'])
);

drop policy if exists "agent_runs_select_policy" on public.agent_runs;
create policy "agent_runs_select_policy"
on public.agent_runs
for select
using (
  public.is_internal_operator() or public.is_org_member(organization_id)
);

drop policy if exists "agent_runs_mutation_policy" on public.agent_runs;
create policy "agent_runs_mutation_policy"
on public.agent_runs
for all
using (
  public.is_internal_operator()
)
with check (
  public.is_internal_operator()
);

drop policy if exists "review_decisions_select_policy" on public.review_decisions;
create policy "review_decisions_select_policy"
on public.review_decisions
for select
using (
  public.is_internal_operator() or public.is_org_member(organization_id)
);

drop policy if exists "review_decisions_mutation_policy" on public.review_decisions;
create policy "review_decisions_mutation_policy"
on public.review_decisions
for all
using (
  public.is_internal_operator() or public.has_org_role(organization_id, array['client_admin'])
)
with check (
  public.is_internal_operator() or public.has_org_role(organization_id, array['client_admin'])
);
