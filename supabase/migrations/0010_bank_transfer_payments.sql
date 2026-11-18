-- Add bank transfer as a first-class payment mode.
alter table public.monthly_invoices drop constraint if exists invoices_payment_mode;
alter table public.monthly_invoices add constraint invoices_payment_mode
  check (payment_mode is null or payment_mode in ('upi', 'bank', 'cash'));

create or replace function public.rpc_mark_invoice_paid(p_invoice_id uuid, p_payment_mode text)
returns void language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.nexpg_assert_owner();
  v_inv public.monthly_invoices%rowtype;
begin
  if p_payment_mode not in ('upi', 'bank', 'cash') then
    raise exception 'Payment mode must be UPI, bank transfer or cash';
  end if;
  select * into v_inv from public.monthly_invoices
    where id = p_invoice_id and owner_id = uid for update;
  if not found then raise exception 'Invoice not found'; end if;
  if v_inv.status = 'paid' then raise exception 'Invoice already marked paid'; end if;
  update public.monthly_invoices
    set status = 'paid', payment_mode = p_payment_mode, paid_at = now()
    where id = v_inv.id;
end;
$$;

grant execute on function public.rpc_mark_invoice_paid(uuid, text) to authenticated;
