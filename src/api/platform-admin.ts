import { getSupabase } from '@/lib/supabase/client';

export type OwnerProfile = {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  deactivated_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PlatformOwnerRow = {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
  deactivated_at: string | null;
  building_count: number;
  active_tenant_count: number;
  latest_apk_status: string | null;
};

export type PlatformDashboard = {
  total_owners: number;
  active_owners: number;
  inactive_owners: number;
  new_owners_7d: number;
  new_owners_30d: number;
  total_buildings: number;
  active_pg_tenants: number;
  apk_pending: number;
  contact_new: number;
  feedback_new: number;
  signups_by_day: { day: string; count: number }[];
};

export async function fetchMyOwnerProfile(): Promise<OwnerProfile | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('owner_profiles').select('*').maybeSingle();
  if (error) throw error;
  return (data as OwnerProfile | null) ?? null;
}

export async function fetchPlatformDashboard(): Promise<PlatformDashboard> {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('rpc_platform_dashboard');
  if (error) throw error;
  return data as PlatformDashboard;
}

export async function fetchPlatformOwners(): Promise<PlatformOwnerRow[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('rpc_platform_list_owners');
  if (error) throw error;
  return (data as PlatformOwnerRow[]) ?? [];
}

export async function setOwnerActive(ownerId: string, isActive: boolean) {
  const supabase = getSupabase();
  const { error } = await supabase.rpc('rpc_platform_set_owner_active', {
    p_owner_id: ownerId,
    p_active: isActive,
  });
  if (error) throw error;
}
