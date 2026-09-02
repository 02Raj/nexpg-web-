import { getSupabase } from '@/lib/supabase/client';

export type ApkRequest = {
  id: string;
  owner_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: 'pending' | 'ready' | 'downloaded';
  download_url: string | null;
  requested_at: string;
  download_ready_at: string | null;
  downloaded_at: string | null;
};

export async function fetchMyApkRequest(): Promise<ApkRequest | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('apk_download_requests')
    .select('*')
    .order('requested_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as ApkRequest | null) ?? null;
}

export async function submitApkRequest(input: {
  fullName: string;
  email: string;
  phone?: string;
}) {
  const supabase = getSupabase();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const ownerId = userData.user?.id;
  if (!ownerId) throw new Error('Sign in to request the Android app.');

  const { data, error } = await supabase
    .from('apk_download_requests')
    .insert({
      owner_id: ownerId,
      full_name: input.fullName.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as ApkRequest;
}

export async function markApkDownloaded(requestId: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('apk_download_requests')
    .update({ status: 'downloaded', downloaded_at: new Date().toISOString() })
    .eq('id', requestId);
  if (error) throw error;
}
