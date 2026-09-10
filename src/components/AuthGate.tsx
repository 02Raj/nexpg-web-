'use client';

import { env } from '@/lib/env';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!env.isConfigured) return;
    if (!session) router.replace('/login');
  }, [session, loading, router]);

  if (!env.isConfigured) {
    return (
      <div style={{ padding: '32px 20px', maxWidth: 520, margin: '0 auto' }}>
        <p className="kicker">Setup</p>
        <h1 className="display">Supabase not configured</h1>
        <p className="bodyMuted" style={{ marginTop: 12, lineHeight: 1.6 }}>
          Create <code>.env.local</code> with the same project as mobile:
        </p>
        <pre
          style={{
            marginTop: 16,
            padding: 16,
            background: 'var(--paper-deep)',
            borderRadius: 8,
            fontSize: 13,
            overflow: 'auto',
          }}
        >
          {`NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # anon public key (JWT)
NEXT_PUBLIC_SITE_URL=https://www.runmypg.in`}
        </pre>
        <p className="small" style={{ marginTop: 12 }}>
          Copy values from mobile <code>.env</code> — use <code>EXPO_PUBLIC_*</code> values with{' '}
          <code>NEXT_PUBLIC_</code> prefix. Restart <code>npm run dev</code> after saving.
        </p>
      </div>
    );
  }

  if (loading || !session) {
    return <div style={{ padding: 32 }} className="bodyMuted">Opening RunMyPG…</div>;
  }

  return <>{children}</>;
}
