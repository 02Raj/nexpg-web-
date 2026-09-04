'use client';

import { fetchOccupancy } from '@/api/nexpg';
import { BedGrid } from '@/components/BedGrid';
import { EmptyState } from '@/components/EmptyState';
import { LoadingCenter } from '@/components/Loading';
import { keys } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useQuery } from '@tanstack/react-query';
import { BedDouble } from 'lucide-react';
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
  if (q.isLoading) return <LoadingCenter message="Loading beds…" />;

  const beds = q.data ?? [];

  if (beds.length === 0) {
    return (
      <div className="panel">
        <EmptyState
          icon={<BedDouble size={28} />}
          title="No rooms yet"
          message="Add rooms and beds in Settings to see the occupancy map."
          action={{ label: 'Go to Settings', onClick: () => router.push('/more') }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p className="bodyMuted">
        Click an occupied bed to open the tenant profile. Click empty to add a tenant.
      </p>
      <BedGrid
        beds={beds}
        onSelect={(bed) => {
          if (bed.tenant) router.push(`/tenant/${bed.tenant.id}`);
          else router.push(`/tenant/new?bedId=${bed.id}`);
        }}
      />
    </div>
  );
}
