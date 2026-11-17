-- APK download requests (pre-Play Store distribution)
-- Owners request from web /download; admin marks ready within 24h.
-- Safe to run even if 0001 was applied partially — ensures shared trigger helper exists.

create or replace function public.nexpg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.apk_download_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  status text not null default 'pending',
  download_url text,
  requested_at timestamptz not null default now(),
  download_ready_at timestamptz,
  downloaded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint apk_requests_status check (status in ('pending', 'ready', 'downloaded')),
  constraint apk_requests_name_len check (char_length(trim(full_name)) >= 2),
  constraint apk_requests_email_len check (char_length(trim(email)) >= 5)
);

create unique index if not exists apk_requests_one_active_per_owner
  on public.apk_download_requests (owner_id)
  where status in ('pending', 'ready');

create index if not exists apk_requests_status_idx
  on public.apk_download_requests (status, requested_at desc);

drop trigger if exists trg_apk_requests_updated on public.apk_download_requests;
create trigger trg_apk_requests_updated
before update on public.apk_download_requests
for each row execute function public.nexpg_set_updated_at();

alter table public.apk_download_requests enable row level security;

drop policy if exists apk_requests_owner_select on public.apk_download_requests;
drop policy if exists apk_requests_owner_insert on public.apk_download_requests;
create policy apk_requests_owner_select on public.apk_download_requests
  for select to authenticated using (owner_id = auth.uid());
create policy apk_requests_owner_insert on public.apk_download_requests
  for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists apk_requests_owner_update on public.apk_download_requests;
create policy apk_requests_owner_update on public.apk_download_requests
  for update to authenticated
  using (owner_id = auth.uid() and status = 'ready')
  with check (owner_id = auth.uid() and status = 'downloaded');

revoke all on public.apk_download_requests from anon, authenticated, public;
grant select, insert, update on public.apk_download_requests to authenticated;
grant update on public.apk_download_requests to service_role;
