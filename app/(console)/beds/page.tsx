'use client';

import { fetchOccupancy } from '@/api/nexpg';
import { BedGrid } from '@/components/BedGrid';
import { keys } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function BedsPage() {
  const router = useRouter();
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';
  const q = useQuery({
    queryKey: keys.occupancy(buildingId),
    queryFn: () => fetchOccupancy(buildingId),
    enabled: Boolean(buildingId),
  });

  if (!building) return null;
  if (q.isLoading) return <p className="bodyMuted">Loading beds…</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <p className="bodyMuted">
        Click an occupied bed to open the tenant profile. Click empty to add a tenant.
      </p>
      <BedGrid
        beds={q.data ?? []}
        onSelect={(bed) => {
          if (bed.tenant) router.push(`/tenant/${bed.tenant.id}`);
          else router.push(`/tenant/new?bedId=${bed.id}`);
        }}
      />
    </div>
  );
}
