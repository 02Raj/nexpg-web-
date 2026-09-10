'use client';

import { fetchMyOwnerProfile } from '@/api/platform-admin';
import { env } from '@/lib/env';
import { isPlatformAdminEmail } from '@/lib/platform-admin';
import { keys } from '@/lib/query';
import { useAuth } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading, user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const returnPath = query ? `${pathname}?${query}` : pathname;
  const skipProfileCheck = isPlatformAdminEmail(user?.email);

  const profile = useQuery({
    queryKey: keys.ownerProfile,
    queryFn: fetchMyOwnerProfile,
    enabled: Boolean(session && user && !skipProfileCheck),
    retry: false,
  });

  useEffect(() => {
    if (loading) return;
    if (!env.isConfigured) return;
    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(returnPath)}`);
    }
  }, [session, loading, router, returnPath]);

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

  if (!skipProfileCheck && profile.data && profile.data.is_active === false) {
    return (
      <div style={{ padding: '48px 24px', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <p className="kicker">Account inactive</p>
        <h1 className="display" style={{ fontSize: '1.75rem' }}>
          Access paused
        </h1>
        <p className="bodyMuted" style={{ marginTop: 12, lineHeight: 1.6 }}>
          Your RunMyPG owner account was deactivated by platform admin. Your PG data is safe — contact support to
          reactivate.
        </p>
        <button
          type="button"
          className="btnPrimary"
          style={{ marginTop: 24, padding: '12px 20px', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }

  if (!skipProfileCheck && profile.isLoading) {
    return <div style={{ padding: 32 }} className="bodyMuted">Checking account…</div>;
  }

  return <>{children}</>;
}
