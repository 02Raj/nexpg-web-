-- Logged-in owner feedback (bugs, UX, features) → platform admin inbox.

create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  owner_email text,
  building_id uuid references public.pg_buildings (id) on delete set null,
  kind text not null,
  message text not null,
  app_source text not null default 'unknown',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint user_feedback_kind_check
    check (kind in ('bug', 'feature', 'problem', 'ux')),
  constraint user_feedback_status_check
    check (status in ('new', 'read', 'archived')),
  constraint user_feedback_app_source_check
    check (app_source in ('web', 'android', 'ios', 'unknown')),
  constraint user_feedback_message_len check (char_length(trim(message)) between 5 and 2000)
);

create index if not exists user_feedback_created_at_idx
  on public.user_feedback (created_at desc);
create index if not exists user_feedback_status_idx
  on public.user_feedback (status);
create index if not exists user_feedback_kind_idx
  on public.user_feedback (kind);

create or replace function public.user_feedback_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.owner_id is distinct from auth.uid() then
    raise exception 'Not allowed';
  end if;

  select op.email into new.owner_email
  from public.owner_profiles op
  where op.id = new.owner_id;

  if new.owner_email is null then
    select u.email into new.owner_email from auth.users u where u.id = new.owner_id;
  end if;

  if new.building_id is not null and not exists (
    select 1 from public.pg_buildings b
    where b.id = new.building_id and b.owner_id = new.owner_id
  ) then
    raise exception 'Invalid building';
  end if;

  return new;
end;
$$;

drop trigger if exists user_feedback_before_insert_trg on public.user_feedback;
create trigger user_feedback_before_insert_trg
  before insert on public.user_feedback
  for each row execute function public.user_feedback_before_insert();

alter table public.user_feedback enable row level security;

drop policy if exists user_feedback_insert_owner on public.user_feedback;
create policy user_feedback_insert_owner on public.user_feedback
  for insert to authenticated
  with check (owner_id = auth.uid() and status = 'new');

drop policy if exists user_feedback_admin_select on public.user_feedback;
create policy user_feedback_admin_select on public.user_feedback
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists user_feedback_admin_update on public.user_feedback;
create policy user_feedback_admin_update on public.user_feedback
  for update to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

grant insert on public.user_feedback to authenticated;
grant select, update on public.user_feedback to authenticated;

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
    'feedback_new', (select count(*) from user_feedback where status = 'new'),
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
