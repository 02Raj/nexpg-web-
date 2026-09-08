'use client';

import { useBuilding } from '@/providers/BuildingProvider';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Send new owners to PG setup before using the console. */
export function OnboardingRedirect() {
  const { buildings, loading } = useBuilding();
  const pathname = usePathname() ?? '/';
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (buildings.length > 0) return;
    if (pathname.startsWith('/setup')) return;
    router.replace('/setup/building');
  }, [buildings.length, loading, pathname, router]);

  return null;
}
