'use client';

import { PlatformShell } from '@/components/PlatformShell';
import { PageSkeleton } from '@/components/Loading';
import { useAuth } from '@/providers/AuthProvider';
import { isPlatformAdminEmail } from '@/lib/platform-admin';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

function pageTitle(pathname: string) {
  if (pathname.startsWith('/platform/owners')) return 'PG owners';
  if (pathname.startsWith('/platform/contact')) return 'Contact inbox';
  if (pathname.startsWith('/platform/apk-requests')) return 'Android APK requests';
  return 'Dashboard';
}

export function PlatformLayoutClient({ children }: { children: ReactNode }) {
  const { session, user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? '/platform/dashboard';
  const allowed = isPlatformAdminEmail(user?.email);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace('/login?next=/platform/dashboard');
      return;
    }
    if (!allowed) router.replace('/dashboard');
  }, [loading, session, allowed, router]);

  if (loading || !session || !allowed) {
    return (
      <div style={{ padding: 32 }}>
        <PageSkeleton variant="default" />
      </div>
    );
  }

  return <PlatformShell title={pageTitle(pathname)}>{children}</PlatformShell>;
}
