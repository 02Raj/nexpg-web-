'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useBuilding } from '@/providers/BuildingProvider';
import { isPlatformAdminEmail } from '@/lib/platform-admin';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Send new owners to PG setup before using the console. */
export function OnboardingRedirect() {
  const { buildings, loading } = useBuilding();
  const { user } = useAuth();
  const pathname = usePathname() ?? '/';
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (isPlatformAdminEmail(user?.email)) return;
    if (buildings.length > 0) return;
    if (pathname.startsWith('/setup')) return;
    if (pathname.startsWith('/platform')) return;
    router.replace('/setup/building');
  }, [buildings.length, loading, pathname, router, user?.email]);

  return null;
}
