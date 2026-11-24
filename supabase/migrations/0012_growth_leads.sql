-- Growth & Outreach Leads Table with RapidRouter AI Personalization

create table if not exists public.growth_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_name text,
  phone text not null,
  city text not null,
  area text,
  source text not null default 'google_maps',
  status text not null default 'new',
  ai_pitch text,
  notes text,
  last_contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_leads_status_idx on public.growth_leads (status);
create index if not exists growth_leads_city_idx on public.growth_leads (city);
create index if not exists growth_leads_created_at_idx on public.growth_leads (created_at desc);

alter table public.growth_leads enable row level security;

drop policy if exists growth_leads_admin_all on public.growth_leads;
create policy growth_leads_admin_all on public.growth_leads
  for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

grant all on public.growth_leads to authenticated;

-- Automatic Lead Conversion Trigger:
-- When a user registers or updates phone in owner_profiles, mark matching growth_leads as 'converted'
create or replace function public.trig_auto_convert_growth_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.phone is not null and length(regexp_replace(new.phone, '\D', '', 'g')) >= 10 then
    update public.growth_leads
    set 
      status = 'converted',
      updated_at = now(),
      notes = coalesce(notes || E'\n', '') || 'Auto-converted on signup: ' || coalesce(new.email, '')
    where right(regexp_replace(phone, '\D', '', 'g'), 10) = right(regexp_replace(new.phone, '\D', '', 'g'), 10)
      and status != 'converted';
  end if;
  return new;
end;
$$;

drop trigger if exists on_owner_profile_convert_lead on public.owner_profiles;
create trigger on_owner_profile_convert_lead
  after insert or update of phone on public.owner_profiles
  for each row execute function public.trig_auto_convert_growth_lead();

