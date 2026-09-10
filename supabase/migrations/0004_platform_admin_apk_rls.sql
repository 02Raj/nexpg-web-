-- Idempotent — safe if platform-admin.sql was already run.

create table if not exists public.platform_admins (
  email text primary key
);

insert into public.platform_admins (email)
values ('divyanshr243@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.platform_admins pa
    where lower(pa.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_platform_admin() to authenticated;

alter table public.apk_download_requests enable row level security;

drop policy if exists apk_requests_owner_select on public.apk_download_requests;
drop policy if exists apk_requests_owner_insert on public.apk_download_requests;
drop policy if exists apk_requests_owner_update on public.apk_download_requests;
drop policy if exists apk_requests_select on public.apk_download_requests;
drop policy if exists apk_requests_insert on public.apk_download_requests;
drop policy if exists apk_requests_admin_update on public.apk_download_requests;
drop policy if exists "apk_requests_select" on public.apk_download_requests;
drop policy if exists "apk_requests_insert" on public.apk_download_requests;
drop policy if exists "apk_requests_admin_update" on public.apk_download_requests;
drop policy if exists "apk_requests_owner_update" on public.apk_download_requests;

create policy apk_requests_select on public.apk_download_requests
  for select to authenticated
  using (owner_id = auth.uid() or public.is_platform_admin());

create policy apk_requests_insert on public.apk_download_requests
  for insert to authenticated
  with check (owner_id = auth.uid());

create policy apk_requests_admin_update on public.apk_download_requests
  for update to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy apk_requests_owner_update on public.apk_download_requests
  for update to authenticated
  using (owner_id = auth.uid() and status in ('ready', 'downloaded'))
  with check (owner_id = auth.uid() and status = 'downloaded');

grant select, insert, update on public.apk_download_requests to authenticated;
