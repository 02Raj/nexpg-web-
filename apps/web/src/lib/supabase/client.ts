import { env } from '@/lib/env';
import type { Database } from '@/types/database';
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = env.supabaseUrl || 'https://placeholder.supabase.co';
  const key = env.supabaseAnonKey || 'placeholder-anon-key';
  return createBrowserClient<Database>(url, key);
}

let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!env.isConfigured) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
}
