-- Owner profiles for platform admin (soft deactivate — no hard delete)

create table if not exists public.owner_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  is_active boolean not null default true,
  deactivated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists owner_profiles_created_at_idx on public.owner_profiles (created_at desc);
create index if not exists owner_profiles_is_active_idx on public.owner_profiles (is_active);

-- Sync new sign-ups from Auth
create or replace function public.handle_new_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.owner_profiles (id, email, full_name, created_at)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.created_at, now())
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), owner_profiles.full_name),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_owner_profile on auth.users;
create trigger on_auth_user_created_owner_profile
  after insert on auth.users
  for each row
  execute function public.handle_new_owner();

-- Backfill existing auth users
insert into public.owner_profiles (id, email, full_name, created_at)
select
  u.id,
  coalesce(u.email, ''),
  coalesce(u.raw_user_meta_data ->> 'full_name', split_part(coalesce(u.email, ''), '@', 1)),
  coalesce(u.created_at, now())
from auth.users u
on conflict (id) do update
set email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), owner_profiles.full_name);

alter table public.owner_profiles enable row level security;

drop policy if exists owner_profiles_select on public.owner_profiles;
create policy owner_profiles_select on public.owner_profiles
  for select to authenticated
  using (id = auth.uid() or public.is_platform_admin());

drop policy if exists owner_profiles_admin_update on public.owner_profiles;
create policy owner_profiles_admin_update on public.owner_profiles
  for update to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

grant select, update on public.owner_profiles to authenticated;

-- Platform dashboard stats (admin only)
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

-- All PG owners with usage summary
create or replace function public.rpc_platform_list_owners()
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return (
    select coalesce(json_agg(row_to_json(x) order by x.created_at desc), '[]'::json)
    from (
      select
        op.id,
        op.email,
        op.full_name,
        op.is_active,
        op.created_at,
        op.deactivated_at,
        (select count(*)::int from pg_buildings b where b.owner_id = op.id) as building_count,
        (select count(*)::int from tenants t where t.owner_id = op.id and t.status = 'active') as active_tenant_count,
        (
          select a.status
          from apk_download_requests a
          where a.owner_id = op.id
          order by a.requested_at desc
          limit 1
        ) as latest_apk_status
      from owner_profiles op
    ) x
  );
end;
$$;

-- Soft deactivate / reactivate (never deletes auth user or PG data)
create or replace function public.rpc_platform_set_owner_active(p_owner_id uuid, p_active boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  update owner_profiles
  set
    is_active = p_active,
    deactivated_at = case when p_active then null else now() end,
    updated_at = now()
  where id = p_owner_id;

  if not found then
    raise exception 'Owner not found';
  end if;
end;
$$;

grant execute on function public.rpc_platform_dashboard() to authenticated;
grant execute on function public.rpc_platform_list_owners() to authenticated;
grant execute on function public.rpc_platform_set_owner_active(uuid, boolean) to authenticated;
