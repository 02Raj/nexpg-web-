'use client';

import { getSupabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(() => router.replace('/dashboard'));
  }, [router]);

  return <p className="bodyMuted" style={{ padding: 32 }}>Confirming sign-in…</p>;
}
