insert into public.organizations (id, name, slug, plan)
values (
  '11111111-1111-1111-1111-111111111111',
  'Invisioned Marketing Demo Client',
  'invisioned-demo-client',
  'growth'
)
on conflict (id) do nothing;

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
on conflict (organization_id) do nothing;

-- Replace the user_id with a real auth.users UUID before executing.
insert into public.organization_members (
  organization_id,
  user_id,
  role,
  is_default
)
values (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'client_admin',
  true
)
on conflict (organization_id, user_id) do nothing;
