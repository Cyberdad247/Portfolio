create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
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
security definer
set search_path = public
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
security definer
set search_path = public
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
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_org_id
      and om.user_id = auth.uid()
      and om.role = any(allowed_roles)
  );
$$;

create or replace function public.can_assign_org_role(target_org_id uuid, target_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_internal_operator()
    or (
      public.has_org_role(target_org_id, array['client_admin'])
      and target_role in ('client_admin', 'client_member')
    );
$$;
