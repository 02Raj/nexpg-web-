'use client';

import { PageSkeleton } from '@/components/Loading';
import { sanitizeAuthNext } from '@/lib/auth-redirect';
import { getSupabase } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const supabase = getSupabase();
    const code = searchParams.get('code');
    const target = sanitizeAuthNext(searchParams.get('next'));

    const finishAuth = async () => {
      try {
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        } else {
          await supabase.auth.getSession();
        }
      } catch (err) {
        console.error('OAuth exchange error:', err);
      } finally {
        router.replace(target || '/dashboard');
      }
    };

    void finishAuth();
  }, [router, searchParams]);

  return (
    <div style={{ padding: 48, maxWidth: 360, margin: '80px auto', textAlign: 'center' }}>
      <PageSkeleton variant="compact" />
      <p style={{ marginTop: 16, fontSize: 14, color: 'var(--ink-muted, #666)' }}>
        Signing you in with Google…
      </p>
    </div>
  );
}
