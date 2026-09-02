import { getSupabase } from '@/lib/supabase/client';
import { todayIST } from '@/lib/format';
import type {
  Bed,
  Building,
  MonthlyInvoice,
  OccupancyCell,
  Room,
  SecurityDeposit,
  Tenant,
} from '@/types/database';

export async function fetchBuildings() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('pg_buildings')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as Building[];
}

export async function createBuilding(input: { name: string; city: string; billing_date: number }) {
  const supabase = getSupabase();
  const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
  if (sessionError) throw sessionError;
  const ownerId = sessionData.user?.id;
  if (!ownerId) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('pg_buildings')
    .insert({
      owner_id: ownerId,
      name: input.name.trim(),
      city: input.city.trim(),
      billing_date: input.billing_date,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as Building;
}

export async function updateBillingDate(buildingId: string, billingDate: number) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('pg_buildings')
    .update({ billing_date: billingDate })
    .eq('id', buildingId);
  if (error) throw error;
}

export async function addRoomWithBeds(buildingId: string, name: string, bedCount: number) {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('rpc_add_room_with_beds', {
    p_building_id: buildingId,
    p_name: name.trim(),
    p_bed_count: bedCount,
  });
  if (error) throw error;
  return data as string;
}

export async function fetchOccupancy(buildingId: string): Promise<OccupancyCell[]> {
  const supabase = getSupabase();
  const [{ data: rooms, error: roomErr }, { data: beds, error: bedErr }, { data: tenants, error: tenErr }] =
    await Promise.all([
      supabase.from('pg_rooms').select('*').eq('building_id', buildingId).order('sort_order'),
      supabase.from('pg_beds').select('*').eq('building_id', buildingId),
      supabase
        .from('tenants')
        .select('id, full_name, monthly_rent, bed_id')
        .eq('building_id', buildingId)
        .eq('status', 'active'),
    ]);
  if (roomErr) throw roomErr;
  if (bedErr) throw bedErr;
  if (tenErr) throw tenErr;

  const roomMap = new Map((rooms as Room[]).map((r) => [r.id, r]));
  const tenantByBed = new Map(
    (tenants as Pick<Tenant, 'id' | 'full_name' | 'monthly_rent' | 'bed_id'>[]).map((t) => [t.bed_id, t]),
  );

  return (beds as Bed[])
    .map((bed) => {
      const room = roomMap.get(bed.room_id);
      const tenant = tenantByBed.get(bed.id);
      return {
        ...bed,
        room_name: room?.name ?? 'Room',
        tenant: tenant
          ? { id: tenant.id, full_name: tenant.full_name, monthly_rent: tenant.monthly_rent }
          : null,
      };
    })
    .sort((a, b) => {
      const ra = roomMap.get(a.room_id)?.sort_order ?? 0;
      const rb = roomMap.get(b.room_id)?.sort_order ?? 0;
      if (ra !== rb) return ra - rb;
      return a.label.localeCompare(b.label);
    });
}

export async function fetchDashboard(buildingId: string) {
  const supabase = getSupabase();
  const period = todayIST().slice(0, 8) + '01';
  const [occupancy, invoicesRes, depositsRes] = await Promise.all([
    fetchOccupancy(buildingId),
    supabase
      .from('monthly_invoices')
      .select('*')
      .eq('building_id', buildingId)
      .eq('billing_period', period),
    supabase.from('security_deposits').select('*').eq('building_id', buildingId),
  ]);

  if (invoicesRes.error) throw invoicesRes.error;
  if (depositsRes.error) throw depositsRes.error;

  const invoices = invoicesRes.data as MonthlyInvoice[];
  const deposits = depositsRes.data as SecurityDeposit[];

  const occupied = occupancy.filter((b) => b.status === 'occupied').length;
  const empty = occupancy.filter((b) => b.status === 'empty').length;
  const collected = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const pendingList = invoices.filter((i) => i.status === 'pending');
  const pending = pendingList.reduce((sum, i) => sum + Number(i.amount), 0);
  const refundDue = deposits.filter((d) => d.status === 'refund_due');
  const refundDueAmount = refundDue.reduce((sum, d) => sum + Number(d.amount), 0);

  return {
    occupancy,
    occupied,
    empty,
    collected,
    pending,
    pendingCount: pendingList.length,
    refundDueAmount,
    refundDueCount: refundDue.length,
    period,
  };
}

export async function addTenant(input: {
  bedId: string;
  fullName: string;
  phone: string;
  monthlyRent: number;
  securityAmount: number;
  joinDate: string;
}) {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('rpc_add_tenant', {
    p_bed_id: input.bedId,
    p_full_name: input.fullName,
    p_phone: input.phone,
    p_monthly_rent: input.monthlyRent,
    p_security_amount: input.securityAmount,
    p_join_date: input.joinDate,
  });
  if (error) throw error;
  return data as string;
}

export async function fetchTenantDetail(tenantId: string) {
  const supabase = getSupabase();
  const [{ data: tenant, error: tErr }, { data: deposit, error: dErr }, { data: invoices, error: iErr }] =
    await Promise.all([
      supabase.from('tenants').select('*').eq('id', tenantId).single(),
      supabase.from('security_deposits').select('*').eq('tenant_id', tenantId).maybeSingle(),
      supabase
        .from('monthly_invoices')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('billing_period', { ascending: false }),
    ]);
  if (tErr) throw tErr;
  if (dErr) throw dErr;
  if (iErr) throw iErr;

  const t = tenant as Tenant;
  const { data: bed } = await supabase.from('pg_beds').select('*').eq('id', t.bed_id).single();
  const bedRow = bed as Bed | null;
  let roomName = 'Room';
  if (bedRow) {
    const { data: roomRow } = await supabase
      .from('pg_rooms')
      .select('name')
      .eq('id', bedRow.room_id)
      .single();
    roomName = (roomRow as Pick<Room, 'name'> | null)?.name ?? 'Room';
  }

  return {
    tenant: t,
    deposit: (deposit as SecurityDeposit | null) ?? null,
    invoices: (invoices as MonthlyInvoice[]) ?? [],
    bedLabel: bedRow ? `${roomName} · Bed ${bedRow.label}` : roomName,
  };
}

export async function vacateTenant(tenantId: string) {
  const supabase = getSupabase();
  const { error } = await supabase.rpc('rpc_vacate_tenant', { p_tenant_id: tenantId });
  if (error) throw error;
}

export async function markInvoicePaid(invoiceId: string, mode: 'upi' | 'cash') {
  const supabase = getSupabase();
  const { error } = await supabase.rpc('rpc_mark_invoice_paid', {
    p_invoice_id: invoiceId,
    p_payment_mode: mode,
  });
  if (error) throw error;
}

export async function markSecurityRefunded(depositId: string) {
  const supabase = getSupabase();
  const { error } = await supabase.rpc('rpc_mark_security_refunded', { p_deposit_id: depositId });
  if (error) throw error;
}

export async function generateInvoices(buildingId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('rpc_generate_invoices', { p_building_id: buildingId });
  if (error) throw error;
  return Number(data ?? 0);
}

export async function maybeGenerateInvoices(buildingId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('rpc_maybe_generate_invoices', {
    p_building_id: buildingId,
  });
  if (error) throw error;
  return Number(data ?? 0);
}

export async function fetchInvoices(buildingId: string, period: string) {
  const supabase = getSupabase();
  const [{ data: invoices, error }, { data: tenants, error: tErr }] = await Promise.all([
    supabase
      .from('monthly_invoices')
      .select('*')
      .eq('building_id', buildingId)
      .eq('billing_period', period)
      .order('created_at', { ascending: false }),
    supabase.from('tenants').select('id, full_name, phone, bed_id').eq('building_id', buildingId),
  ]);
  if (error) throw error;
  if (tErr) throw tErr;
  const map = new Map((tenants as Pick<Tenant, 'id' | 'full_name' | 'phone' | 'bed_id'>[]).map((t) => [t.id, t]));
  return ((invoices as MonthlyInvoice[]) ?? []).map((inv) => ({
    ...inv,
    tenant: map.get(inv.tenant_id) ?? null,
  }));
}

export async function fetchRefundDue(buildingId: string) {
  const supabase = getSupabase();
  const { data: deposits, error } = await supabase
    .from('security_deposits')
    .select('*')
    .eq('building_id', buildingId)
    .eq('status', 'refund_due');
  if (error) throw error;
  const ids = (deposits as SecurityDeposit[]).map((d) => d.tenant_id);
  if (ids.length === 0) return [] as Array<SecurityDeposit & { tenant_name: string }>;
  const { data: tenants, error: tErr } = await supabase.from('tenants').select('id, full_name').in('id', ids);
  if (tErr) throw tErr;
  const map = new Map((tenants as Pick<Tenant, 'id' | 'full_name'>[]).map((t) => [t.id, t.full_name]));
  return (deposits as SecurityDeposit[]).map((d) => ({
    ...d,
    tenant_name: map.get(d.tenant_id) ?? 'Tenant',
  }));
}
