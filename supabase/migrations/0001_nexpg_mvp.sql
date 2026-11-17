-- NexPG MVP schema
-- 6 tables, owner-only RLS, money mutations via SECURITY DEFINER RPCs.
-- Run this in the Supabase SQL editor as a single script.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.pg_buildings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  city text not null,
  billing_date smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pg_buildings_name_len check (char_length(trim(name)) between 2 and 80),
  constraint pg_buildings_billing_date check (billing_date between 1 and 28)
);

create table if not exists public.pg_rooms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  building_id uuid not null references public.pg_buildings (id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint pg_rooms_name_len check (char_length(trim(name)) between 1 and 40)
);

create table if not exists public.pg_beds (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  building_id uuid not null references public.pg_buildings (id) on delete cascade,
  room_id uuid not null references public.pg_rooms (id) on delete cascade,
  label text not null,
  status text not null default 'empty',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pg_beds_status check (status in ('empty', 'occupied')),
  constraint pg_beds_label_len check (char_length(trim(label)) between 1 and 20)
);

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  building_id uuid not null references public.pg_buildings (id) on delete restrict,
  bed_id uuid not null references public.pg_beds (id) on delete restrict,
  full_name text not null,
  phone text not null,
  monthly_rent numeric(12, 2) not null,
  join_date date not null,
  status text not null default 'active',
  vacated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenants_name_len check (char_length(trim(full_name)) between 2 and 80),
  constraint tenants_phone check (phone ~ '^[6-9][0-9]{9}$'),
  constraint tenants_rent_positive check (monthly_rent > 0),
  constraint tenants_status check (status in ('active', 'vacated')),
  constraint tenants_vacated_consistency check (
    (status = 'active' and vacated_at is null)
    or (status = 'vacated' and vacated_at is not null)
  )
);

create table if not exists public.security_deposits (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  building_id uuid not null references public.pg_buildings (id) on delete restrict,
  tenant_id uuid not null unique references public.tenants (id) on delete restrict,
  amount numeric(12, 2) not null,
  status text not null default 'held',
  refunded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint security_amount_nonneg check (amount >= 0),
  constraint security_status check (status in ('held', 'refund_due', 'refunded')),
  constraint security_refunded_consistency check (
    (status = 'refunded' and refunded_at is not null)
    or (status <> 'refunded' and refunded_at is null)
  )
);

create table if not exists public.monthly_invoices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  building_id uuid not null references public.pg_buildings (id) on delete restrict,
  tenant_id uuid not null references public.tenants (id) on delete restrict,
  billing_period date not null,
  amount numeric(12, 2) not null,
  is_prorated boolean not null default false,
  status text not null default 'pending',
  payment_mode text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoices_period_month_start check (billing_period = date_trunc('month', billing_period)::date),
  constraint invoices_amount_positive check (amount > 0),
  constraint invoices_status check (status in ('pending', 'paid')),
  constraint invoices_payment_mode check (payment_mode is null or payment_mode in ('upi', 'cash')),
  constraint invoices_paid_consistency check (
    (status = 'pending' and payment_mode is null and paid_at is null)
    or (status = 'paid' and payment_mode is not null and paid_at is not null)
  ),
  constraint invoices_unique_period unique (tenant_id, billing_period)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists pg_buildings_owner_idx on public.pg_buildings (owner_id);
create index if not exists pg_rooms_building_idx on public.pg_rooms (building_id, sort_order);
create index if not exists pg_beds_building_idx on public.pg_beds (building_id, room_id);
create index if not exists pg_beds_owner_status_idx on public.pg_beds (owner_id, status);
create unique index if not exists tenants_one_active_per_bed
  on public.tenants (bed_id) where status = 'active';
create index if not exists tenants_building_status_idx on public.tenants (building_id, status);
create index if not exists security_building_status_idx on public.security_deposits (building_id, status);
create index if not exists invoices_building_period_status_idx
  on public.monthly_invoices (building_id, billing_period, status);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------

create or replace function public.nexpg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_pg_buildings_updated on public.pg_buildings;
create trigger trg_pg_buildings_updated
before update on public.pg_buildings
for each row execute function public.nexpg_set_updated_at();

drop trigger if exists trg_pg_beds_updated on public.pg_beds;
create trigger trg_pg_beds_updated
before update on public.pg_beds
for each row execute function public.nexpg_set_updated_at();

drop trigger if exists trg_tenants_updated on public.tenants;
create trigger trg_tenants_updated
before update on public.tenants
for each row execute function public.nexpg_set_updated_at();

drop trigger if exists trg_security_updated on public.security_deposits;
create trigger trg_security_updated
before update on public.security_deposits
for each row execute function public.nexpg_set_updated_at();

drop trigger if exists trg_invoices_updated on public.monthly_invoices;
create trigger trg_invoices_updated
before update on public.monthly_invoices
for each row execute function public.nexpg_set_updated_at();

-- Force owner_id from the session on client inserts (cannot spoof another owner).
create or replace function public.nexpg_stamp_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  new.owner_id := auth.uid();
  return new;
end;
$$;

drop trigger if exists trg_buildings_owner on public.pg_buildings;
create trigger trg_buildings_owner
before insert on public.pg_buildings
for each row execute function public.nexpg_stamp_owner();

drop trigger if exists trg_rooms_owner on public.pg_rooms;
create trigger trg_rooms_owner
before insert on public.pg_rooms
for each row execute function public.nexpg_stamp_owner();

drop trigger if exists trg_beds_owner on public.pg_beds;
create trigger trg_beds_owner
before insert on public.pg_beds
for each row execute function public.nexpg_stamp_owner();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.pg_buildings enable row level security;
alter table public.pg_rooms enable row level security;
alter table public.pg_beds enable row level security;
alter table public.tenants enable row level security;
alter table public.security_deposits enable row level security;
alter table public.monthly_invoices enable row level security;

drop policy if exists buildings_owner_select on public.pg_buildings;
drop policy if exists buildings_owner_insert on public.pg_buildings;
drop policy if exists buildings_owner_update on public.pg_buildings;
create policy buildings_owner_select on public.pg_buildings
  for select to authenticated using (owner_id = auth.uid());
create policy buildings_owner_insert on public.pg_buildings
  for insert to authenticated with check (owner_id = auth.uid());
create policy buildings_owner_update on public.pg_buildings
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists rooms_owner_select on public.pg_rooms;
drop policy if exists rooms_owner_insert on public.pg_rooms;
drop policy if exists rooms_owner_update on public.pg_rooms;
create policy rooms_owner_select on public.pg_rooms
  for select to authenticated using (owner_id = auth.uid());
create policy rooms_owner_insert on public.pg_rooms
  for insert to authenticated with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.pg_buildings b
      where b.id = building_id and b.owner_id = auth.uid()
    )
  );
create policy rooms_owner_update on public.pg_rooms
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists beds_owner_select on public.pg_beds;
drop policy if exists beds_owner_insert on public.pg_beds;
create policy beds_owner_select on public.pg_beds
  for select to authenticated using (owner_id = auth.uid());
create policy beds_owner_insert on public.pg_beds
  for insert to authenticated with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.pg_rooms r
      where r.id = room_id and r.owner_id = auth.uid() and r.building_id = building_id
    )
  );

-- Money tables: read via RLS, write only through RPCs (table grants below).
drop policy if exists tenants_owner_select on public.tenants;
drop policy if exists security_owner_select on public.security_deposits;
drop policy if exists invoices_owner_select on public.monthly_invoices;
create policy tenants_owner_select on public.tenants
  for select to authenticated using (owner_id = auth.uid());
create policy security_owner_select on public.security_deposits
  for select to authenticated using (owner_id = auth.uid());
create policy invoices_owner_select on public.monthly_invoices
  for select to authenticated using (owner_id = auth.uid());

revoke all on public.pg_buildings, public.pg_rooms, public.pg_beds,
  public.tenants, public.security_deposits, public.monthly_invoices
  from anon, authenticated, public;

grant select, insert, update on public.pg_buildings to authenticated;
grant select, insert, update on public.pg_rooms to authenticated;
grant select, insert on public.pg_beds to authenticated;
grant select on public.tenants to authenticated;
grant select on public.security_deposits to authenticated;
grant select on public.monthly_invoices to authenticated;

-- Beds.status is not updatable by the client (no UPDATE grant).

-- ---------------------------------------------------------------------------
-- Helpers / RPCs
-- ---------------------------------------------------------------------------

create or replace function public.nexpg_assert_owner()
returns uuid
language plpgsql
stable
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;
  return uid;
end;
$$;

create or replace function public.nexpg_invoice_amount(
  p_monthly_rent numeric,
  p_join_date date,
  p_period_start date
)
returns table (amount numeric, is_prorated boolean)
language plpgsql
immutable
as $$
declare
  days_in_month integer;
  remaining integer;
begin
  days_in_month := extract(day from (date_trunc('month', p_period_start) + interval '1 month - 1 day'))::integer;

  if p_join_date > (p_period_start + (days_in_month - 1)) then
    amount := 0;
    is_prorated := false;
    return next;
    return;
  end if;

  if p_join_date > p_period_start then
    remaining := days_in_month - extract(day from p_join_date)::integer + 1;
    amount := round(p_monthly_rent * remaining / days_in_month, 2);
    is_prorated := remaining < days_in_month;
  else
    amount := p_monthly_rent;
    is_prorated := false;
  end if;

  return next;
end;
$$;

create or replace function public.rpc_add_room_with_beds(
  p_building_id uuid,
  p_name text,
  p_bed_count integer
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := public.nexpg_assert_owner();
  v_room_id uuid;
  i integer;
  labels text[] := array['A','B','C','D','E','F','G','H'];
  next_sort integer;
begin
  if p_bed_count < 1 or p_bed_count > 8 then
    raise exception 'Beds per room must be 1–8';
  end if;

  perform 1 from public.pg_buildings
    where id = p_building_id and owner_id = uid;
  if not found then
    raise exception 'Building not found';
  end if;

  select coalesce(max(sort_order), 0) + 1 into next_sort
  from public.pg_rooms
  where building_id = p_building_id;

  insert into public.pg_rooms (owner_id, building_id, name, sort_order)
  values (uid, p_building_id, trim(p_name), next_sort)
  returning id into v_room_id;

  for i in 1..p_bed_count loop
    insert into public.pg_beds (owner_id, building_id, room_id, label, status)
    values (uid, p_building_id, v_room_id, labels[i], 'empty');
  end loop;

  return v_room_id;
end;
$$;

create or replace function public.rpc_add_tenant(
  p_bed_id uuid,
  p_full_name text,
  p_phone text,
  p_monthly_rent numeric,
  p_security_amount numeric,
  p_join_date date
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := public.nexpg_assert_owner();
  v_bed public.pg_beds%rowtype;
  v_tenant_id uuid;
  v_name text := trim(p_full_name);
  v_phone text := regexp_replace(p_phone, '\D', '', 'g');
begin
  if char_length(v_name) < 2 then
    raise exception 'Name required';
  end if;
  if v_phone !~ '^[6-9][0-9]{9}$' then
    raise exception 'Enter a valid 10-digit Indian mobile';
  end if;
  if p_monthly_rent <= 0 then
    raise exception 'Rent must be greater than 0';
  end if;
  if p_security_amount < 0 then
    raise exception 'Security amount cannot be negative';
  end if;
  if p_join_date > (now() at time zone 'Asia/Kolkata')::date then
    raise exception 'Join date cannot be in the future';
  end if;

  select * into v_bed
  from public.pg_beds
  where id = p_bed_id and owner_id = uid
  for update;

  if not found then
    raise exception 'Bed not found';
  end if;
  if v_bed.status <> 'empty' then
    raise exception 'This bed is already occupied';
  end if;

  insert into public.tenants (
    owner_id, building_id, bed_id, full_name, phone, monthly_rent, join_date, status
  ) values (
    uid, v_bed.building_id, v_bed.id, v_name, v_phone, p_monthly_rent, p_join_date, 'active'
  ) returning id into v_tenant_id;

  insert into public.security_deposits (
    owner_id, building_id, tenant_id, amount, status
  ) values (
    uid, v_bed.building_id, v_tenant_id, p_security_amount, 'held'
  );

  update public.pg_beds
  set status = 'occupied'
  where id = v_bed.id;

  return v_tenant_id;
end;
$$;

create or replace function public.rpc_vacate_tenant(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := public.nexpg_assert_owner();
  v_tenant public.tenants%rowtype;
begin
  select * into v_tenant
  from public.tenants
  where id = p_tenant_id and owner_id = uid
  for update;

  if not found then
    raise exception 'Tenant not found';
  end if;
  if v_tenant.status <> 'active' then
    raise exception 'Tenant already vacated';
  end if;

  update public.tenants
  set status = 'vacated', vacated_at = now()
  where id = v_tenant.id;

  update public.pg_beds
  set status = 'empty'
  where id = v_tenant.bed_id and owner_id = uid;

  update public.security_deposits
  set status = 'refund_due'
  where tenant_id = v_tenant.id
    and owner_id = uid
    and status = 'held';
end;
$$;

create or replace function public.rpc_mark_invoice_paid(
  p_invoice_id uuid,
  p_payment_mode text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := public.nexpg_assert_owner();
  v_inv public.monthly_invoices%rowtype;
begin
  if p_payment_mode not in ('upi', 'cash') then
    raise exception 'Payment mode must be upi or cash';
  end if;

  select * into v_inv
  from public.monthly_invoices
  where id = p_invoice_id and owner_id = uid
  for update;

  if not found then
    raise exception 'Invoice not found';
  end if;
  if v_inv.status = 'paid' then
    raise exception 'Invoice already marked paid';
  end if;

  update public.monthly_invoices
  set status = 'paid',
      payment_mode = p_payment_mode,
      paid_at = now()
  where id = v_inv.id;
end;
$$;

create or replace function public.rpc_mark_security_refunded(p_deposit_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := public.nexpg_assert_owner();
  v_dep public.security_deposits%rowtype;
begin
  select * into v_dep
  from public.security_deposits
  where id = p_deposit_id and owner_id = uid
  for update;

  if not found then
    raise exception 'Security deposit not found';
  end if;
  if v_dep.status <> 'refund_due' then
    raise exception 'Only refund-due deposits can be marked refunded';
  end if;

  update public.security_deposits
  set status = 'refunded', refunded_at = now()
  where id = v_dep.id;
end;
$$;

create or replace function public.rpc_generate_invoices(p_building_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := public.nexpg_assert_owner();
  v_today date := (now() at time zone 'Asia/Kolkata')::date;
  v_period date := date_trunc('month', v_today)::date;
  v_created integer := 0;
  r record;
  v_amt numeric;
  v_prorated boolean;
begin
  perform 1 from public.pg_buildings
  where id = p_building_id and owner_id = uid;
  if not found then
    raise exception 'Building not found';
  end if;

  for r in
    select t.id, t.monthly_rent, t.join_date
    from public.tenants t
    where t.building_id = p_building_id
      and t.owner_id = uid
      and t.status = 'active'
      and t.join_date <= (v_period + interval '1 month' - interval '1 day')::date
  loop
    select amount, is_prorated
      into v_amt, v_prorated
    from public.nexpg_invoice_amount(r.monthly_rent, r.join_date, v_period);

    if v_amt is null or v_amt <= 0 then
      continue;
    end if;

    insert into public.monthly_invoices (
      owner_id, building_id, tenant_id, billing_period, amount, is_prorated, status
    ) values (
      uid, p_building_id, r.id, v_period, v_amt, v_prorated, 'pending'
    )
    on conflict (tenant_id, billing_period) do nothing;

    if found then
      v_created := v_created + 1;
    end if;
  end loop;

  return v_created;
end;
$$;

-- Auto-bill when the owner opens the app on/after billing_date (IST).
create or replace function public.rpc_maybe_generate_invoices(p_building_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := public.nexpg_assert_owner();
  v_billing smallint;
  v_today date := (now() at time zone 'Asia/Kolkata')::date;
begin
  select billing_date into v_billing
  from public.pg_buildings
  where id = p_building_id and owner_id = uid;

  if v_billing is null then
    raise exception 'Building not found';
  end if;

  if extract(day from v_today)::integer < v_billing then
    return 0;
  end if;

  return public.rpc_generate_invoices(p_building_id);
end;
$$;

grant execute on function public.rpc_add_room_with_beds(uuid, text, integer) to authenticated;
grant execute on function public.rpc_add_tenant(uuid, text, text, numeric, numeric, date) to authenticated;
grant execute on function public.rpc_vacate_tenant(uuid) to authenticated;
grant execute on function public.rpc_mark_invoice_paid(uuid, text) to authenticated;
grant execute on function public.rpc_mark_security_refunded(uuid) to authenticated;
grant execute on function public.rpc_generate_invoices(uuid) to authenticated;
grant execute on function public.rpc_maybe_generate_invoices(uuid) to authenticated;

revoke execute on function public.nexpg_stamp_owner() from public, anon, authenticated;
revoke execute on function public.nexpg_assert_owner() from public, anon, authenticated;
revoke execute on function public.nexpg_invoice_amount(numeric, date, date) from public, anon, authenticated;
