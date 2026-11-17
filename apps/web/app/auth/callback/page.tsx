'use client';

import { PageSkeleton } from '@/components/Loading';
import { getSupabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(() => router.replace('/dashboard'));
  }, [router]);

  return (
    <div style={{ padding: 32, maxWidth: 320, margin: '0 auto' }}>
      <PageSkeleton variant="compact" />
    </div>
  );
}
