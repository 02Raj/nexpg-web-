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

export async function createBuilding(input: {
  name: string;
  city: string;
  state: string;
  address?: string;
  billing_date: number;
}) {
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
      state: input.state.trim(),
      address: input.address?.trim() || null,
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
      supabase.from('pg_rooms').select('id, name, sort_order, building_id').eq('building_id', buildingId).order('sort_order'),
      supabase.from('pg_beds').select('id, room_id, label, status, building_id').eq('building_id', buildingId),
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
  const [occupancy, invoicesRes, depositsRes, tenantsRes] = await Promise.all([
    fetchOccupancy(buildingId),
    supabase
      .from('monthly_invoices')
      .select('id, tenant_id, amount, status, billing_period')
      .eq('building_id', buildingId)
      .eq('billing_period', period),
    supabase
      .from('security_deposits')
      .select('id, tenant_id, amount, status')
      .eq('building_id', buildingId),
    supabase.from('tenants').select('id, full_name').eq('building_id', buildingId),
  ]);

  if (invoicesRes.error) throw invoicesRes.error;
  if (depositsRes.error) throw depositsRes.error;

  const invoices = invoicesRes.data as MonthlyInvoice[];
  const deposits = depositsRes.data as SecurityDeposit[];
  const tenantMap = new Map((tenantsRes.data ?? []).map((t: { id: string; full_name: string }) => [t.id, t.full_name]));

  const occupied = occupancy.filter((b) => b.status === 'occupied').length;
  const empty = occupancy.filter((b) => b.status === 'empty').length;
  const collected = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const pendingList = invoices.filter((i) => i.status === 'pending');
  const pending = pendingList.reduce((sum, i) => sum + Number(i.amount), 0);
  const refundDue = deposits.filter((d) => d.status === 'refund_due');
  const refundDueAmount = refundDue.reduce((sum, d) => sum + Number(d.amount), 0);

  const pendingInvoices = pendingList.map((inv) => ({
    id: inv.id,
    tenantName: tenantMap.get(inv.tenant_id) ?? 'Tenant',
    amount: Number(inv.amount),
  }));

  return {
    occupancy,
    occupied,
    empty,
    collected,
    pending,
    pendingCount: pendingList.length,
    pendingInvoices,
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
  const { data: bed, error: bErr } = await supabase
    .from('pg_beds')
    .select('id, label, room_id')
    .eq('id', t.bed_id)
    .single();
  if (bErr) throw bErr;
  const bedRow = bed as Bed | null;
  let roomName = 'Room';
  if (bedRow) {
    const { data: roomRow } = await supabase.from('pg_rooms').select('name').eq('id', bedRow.room_id).single();
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

export async function markInvoicePaid(invoiceId: string, mode: 'upi' | 'bank' | 'cash') {
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

export async function fetchTenantDirectory(buildingId: string) {
  const supabase = getSupabase();
  const [{ data: tenants, error }, { data: beds, error: bedErr }, { data: rooms, error: roomErr }] = await Promise.all([
    supabase.from('tenants').select('*').eq('building_id', buildingId).order('created_at', { ascending: false }),
    supabase.from('pg_beds').select('id, label, room_id').eq('building_id', buildingId),
    supabase.from('pg_rooms').select('id, name').eq('building_id', buildingId),
  ]);
  if (error) throw error;
  if (bedErr) throw bedErr;
  if (roomErr) throw roomErr;

  const roomMap = new Map((rooms ?? []).map((room) => [room.id, room.name]));
  const bedMap = new Map((beds ?? []).map((bed) => [bed.id, `${roomMap.get(bed.room_id) ?? 'Room'} · Bed ${bed.label}`]));
  return ((tenants as Tenant[]) ?? []).map((tenant) => ({
    ...tenant,
    bedLabel: bedMap.get(tenant.bed_id) ?? 'Unassigned',
  }));
}

export async function fetchReports(buildingId: string) {
  const supabase = getSupabase();
  const [{ data: invoices, error }, { data: tenants, error: tenantErr }, occupancy] = await Promise.all([
    supabase.from('monthly_invoices').select('*').eq('building_id', buildingId).order('billing_period', { ascending: true }),
    supabase.from('tenants').select('id, full_name, phone, monthly_rent, status, join_date, vacated_at').eq('building_id', buildingId),
    fetchOccupancy(buildingId),
  ]);
  if (error) throw error;
  if (tenantErr) throw tenantErr;

  const rows = (invoices as MonthlyInvoice[]) ?? [];
  const monthMap = new Map<string, { billed: number; collected: number; pending: number }>();
  for (const invoice of rows) {
    const period = invoice.billing_period.slice(0, 7);
    const month = monthMap.get(period) ?? { billed: 0, collected: 0, pending: 0 };
    month.billed += Number(invoice.amount);
    if (invoice.status === 'paid') month.collected += Number(invoice.amount);
    else month.pending += Number(invoice.amount);
    monthMap.set(period, month);
  }

  const months = Array.from(monthMap.entries())
    .map(([period, totals]) => ({ period, ...totals }))
    .slice(-6);
  const collected = rows.filter((row) => row.status === 'paid').reduce((sum, row) => sum + Number(row.amount), 0);
  const pending = rows.filter((row) => row.status === 'pending').reduce((sum, row) => sum + Number(row.amount), 0);
  const totalBeds = occupancy.length;
  const occupiedBeds = occupancy.filter((bed) => bed.status === 'occupied').length;

  return {
    months,
    invoices: rows,
    tenants: (tenants ?? []) as Pick<Tenant, 'id' | 'full_name' | 'phone' | 'monthly_rent' | 'status' | 'join_date' | 'vacated_at'>[],
    occupancy,
    collected,
    pending,
    billed: collected + pending,
    activeTenants: (tenants ?? []).filter((tenant) => tenant.status === 'active').length,
    totalBeds,
    occupiedBeds,
    occupancyRate: totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
  };
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
