-- Public contact form → platform admin inbox.

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  topic text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint contact_inquiries_topic_check
    check (topic in ('sales', 'support', 'product', 'other')),
  constraint contact_inquiries_status_check
    check (status in ('new', 'read', 'archived')),
  constraint contact_inquiries_name_len check (char_length(trim(full_name)) between 2 and 80),
  constraint contact_inquiries_email_len check (char_length(trim(email)) between 5 and 120),
  constraint contact_inquiries_message_len check (char_length(trim(message)) between 10 and 2000)
);

create index if not exists contact_inquiries_created_at_idx
  on public.contact_inquiries (created_at desc);
create index if not exists contact_inquiries_status_idx
  on public.contact_inquiries (status);

alter table public.contact_inquiries enable row level security;

drop policy if exists contact_inquiries_insert_public on public.contact_inquiries;
create policy contact_inquiries_insert_public on public.contact_inquiries
  for insert to anon, authenticated
  with check (status = 'new');

drop policy if exists contact_inquiries_admin_select on public.contact_inquiries;
create policy contact_inquiries_admin_select on public.contact_inquiries
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists contact_inquiries_admin_update on public.contact_inquiries;
create policy contact_inquiries_admin_update on public.contact_inquiries
  for update to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

grant insert on public.contact_inquiries to anon, authenticated;
grant select, update on public.contact_inquiries to authenticated;

create or replace function public.rpc_platform_dashboard()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select json_build_object(
    'total_owners', (select count(*) from owner_profiles),
    'active_owners', (select count(*) from owner_profiles where is_active),
    'inactive_owners', (select count(*) from owner_profiles where not is_active),
    'new_owners_7d', (
      select count(*) from owner_profiles where created_at >= now() - interval '7 days'
    ),
    'new_owners_30d', (
      select count(*) from owner_profiles where created_at >= now() - interval '30 days'
    ),
    'total_buildings', (select count(*) from pg_buildings),
    'active_pg_tenants', (select count(*) from tenants where status = 'active'),
    'apk_pending', (select count(*) from apk_download_requests where status = 'pending'),
    'contact_new', (select count(*) from contact_inquiries where status = 'new'),
    'signups_by_day', (
      select coalesce(json_agg(row_to_json(d) order by d.day), '[]'::json)
      from (
        select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
               count(*)::int as count
        from owner_profiles
        where created_at >= (current_date - interval '13 days')
        group by 1
      ) d
    )
  ) into result;

  return result;
end;
$$;
