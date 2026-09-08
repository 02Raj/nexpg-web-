'use client';

import { EmptyState } from '@/components/EmptyState';
import { Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function NoBuilding() {
  const router = useRouter();
  return (
    <EmptyState
      icon={<Building2 size={28} />}
      title="Add your first PG"
      message="Set up your property with state, city and rooms. Everything you add here syncs with the Android app."
      action={{ label: 'Add PG property', onClick: () => router.push('/setup/building') }}
    />
  );
}
