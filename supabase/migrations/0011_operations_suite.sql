-- Operations suite: support tickets, short stays and invoice extras.
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
  building_id uuid not null references public.pg_buildings(id) on delete cascade, tenant_id uuid references public.tenants(id) on delete set null,
  title text not null check (char_length(title) between 3 and 120), description text not null default '',
  category text not null default 'maintenance' check (category in ('maintenance','billing','other')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  status text not null default 'open' check (status in ('open','in_progress','resolved','closed')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.guest_stays (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
  building_id uuid not null references public.pg_buildings(id) on delete cascade, bed_id uuid not null references public.pg_beds(id) on delete restrict,
  guest_name text not null, phone text not null, check_in date not null, check_out date not null,
  nightly_rate numeric(12,2) not null check (nightly_rate > 0),
  status text not null default 'booked' check (status in ('booked','checked_in','checked_out','cancelled')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (check_out > check_in)
);
create table if not exists public.invoice_charges (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
  building_id uuid not null references public.pg_buildings(id) on delete cascade, invoice_id uuid not null references public.monthly_invoices(id) on delete cascade,
  label text not null, amount numeric(12,2) not null check (amount > 0), created_at timestamptz not null default now()
);

alter table public.support_tickets enable row level security; alter table public.guest_stays enable row level security;
alter table public.invoice_charges enable row level security;
create policy tickets_owner_all on public.support_tickets for all to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy guests_owner_all on public.guest_stays for all to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy charges_owner_select on public.invoice_charges for select to authenticated using (owner_id=auth.uid());
grant select,insert,update on public.support_tickets,public.guest_stays to authenticated;
grant select on public.invoice_charges to authenticated;

create or replace function public.rpc_add_invoice_charge(p_invoice_id uuid,p_label text,p_amount numeric)
returns void language plpgsql security definer set search_path=public as $$
declare uid uuid:=public.nexpg_assert_owner(); inv public.monthly_invoices%rowtype;
begin
  if p_amount<=0 then raise exception 'Charge must be greater than zero'; end if;
  select * into inv from public.monthly_invoices where id=p_invoice_id and owner_id=uid for update;
  if not found then raise exception 'Invoice not found'; end if;
  if inv.status='paid' then raise exception 'Paid invoice cannot be changed'; end if;
  insert into public.invoice_charges(owner_id,building_id,invoice_id,label,amount) values(uid,inv.building_id,inv.id,trim(p_label),p_amount);
  update public.monthly_invoices set amount=amount+p_amount where id=inv.id;
end; $$;
grant execute on function public.rpc_add_invoice_charge(uuid,text,numeric) to authenticated;
