-- Active-owner lock, query indexes, contact/feedback rate limits.

create or replace function public.account_is_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select op.is_active from public.owner_profiles op where op.id = auth.uid()),
    true
  ) or public.is_platform_admin();
$$;

grant execute on function public.account_is_active() to authenticated;

do $$
declare
  t text;
begin
  foreach t in array array[
    'pg_buildings',
    'pg_rooms',
    'pg_beds',
    'tenants',
    'security_deposits',
    'monthly_invoices',
    'apk_download_requests'
  ]
  loop
    if to_regclass('public.' || t) is null then
      continue;
    end if;
    execute format('drop policy if exists restrict_inactive_owner on public.%I', t);
    execute format(
      'create policy restrict_inactive_owner on public.%I as restrictive for all to authenticated using (public.account_is_active()) with check (public.account_is_active())',
      t
    );
  end loop;
end
$$;

do $$
begin
  if to_regclass('public.tenants') is not null then
    execute 'create index if not exists tenants_building_status_idx on public.tenants (building_id, status)';
    execute 'create index if not exists tenants_owner_idx on public.tenants (owner_id)';
  end if;
  if to_regclass('public.monthly_invoices') is not null then
    execute 'create index if not exists monthly_invoices_building_period_idx on public.monthly_invoices (building_id, billing_period)';
  end if;
  if to_regclass('public.pg_beds') is not null then
    execute 'create index if not exists pg_beds_building_idx on public.pg_beds (building_id)';
  end if;
  if to_regclass('public.pg_rooms') is not null then
    execute 'create index if not exists pg_rooms_building_idx on public.pg_rooms (building_id)';
  end if;
  if to_regclass('public.pg_buildings') is not null then
    execute 'create index if not exists pg_buildings_owner_idx on public.pg_buildings (owner_id)';
  end if;
  if to_regclass('public.contact_inquiries') is not null then
    execute 'create index if not exists contact_inquiries_email_created_idx on public.contact_inquiries (lower(email), created_at desc)';
  end if;
  if to_regclass('public.user_feedback') is not null then
    execute 'create index if not exists user_feedback_owner_created_idx on public.user_feedback (owner_id, created_at desc)';
  end if;
end
$$;

create or replace function public.contact_inquiries_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    select count(*) from public.contact_inquiries
    where created_at > now() - interval '1 minute'
  ) >= 40 then
    raise exception 'Too many messages right now. Try again in a minute.';
  end if;

  if (
    select count(*) from public.contact_inquiries
    where lower(email) = lower(new.email)
      and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'Too many messages from this email. Try again later.';
  end if;

  return new;
end;
$$;

create or replace function public.user_feedback_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    select count(*) from public.user_feedback
    where owner_id = new.owner_id
      and created_at > now() - interval '1 hour'
  ) >= 8 then
    raise exception 'Too many feedback notes this hour. Try again later.';
  end if;
  return new;
end;
$$;

do $$
begin
  if to_regclass('public.contact_inquiries') is not null then
    drop trigger if exists contact_inquiries_rate_limit_trg on public.contact_inquiries;
    create trigger contact_inquiries_rate_limit_trg
      before insert on public.contact_inquiries
      for each row execute function public.contact_inquiries_rate_limit();
  end if;
  if to_regclass('public.user_feedback') is not null then
    drop trigger if exists user_feedback_rate_limit_trg on public.user_feedback;
    create trigger user_feedback_rate_limit_trg
      before insert on public.user_feedback
      for each row execute function public.user_feedback_rate_limit();
  end if;
end
$$;
