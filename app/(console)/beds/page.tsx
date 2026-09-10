'use client';

import { fetchOccupancy } from '@/api/nexpg';
import { BedGrid } from '@/components/BedGrid';
import { EmptyState } from '@/components/EmptyState';
import { LoadingCenter } from '@/components/Loading';
import { NoBuilding } from '@/components/NoBuilding';
import { keys } from '@/lib/query';
import { useToastOnError } from '@/hooks/useToastOnError';
import { useBuilding } from '@/providers/BuildingProvider';
import { useQuery } from '@tanstack/react-query';
import { BedDouble } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './beds.module.css';

export default function BedsPage() {
  const router = useRouter();
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';
  const q = useQuery({
    queryKey: keys.occupancy(buildingId),
    queryFn: () => fetchOccupancy(buildingId),
    enabled: Boolean(buildingId),
  });

  useToastOnError(q.error, 'Could not load beds');

  if (!building) return <NoBuilding />;
  if (q.isLoading) return <LoadingCenter message="Loading beds…" />;

  const beds = q.data ?? [];

  if (beds.length === 0) {
    return (
      <EmptyState
        icon={<BedDouble size={28} />}
        title="No rooms yet"
        message="Add rooms and beds in Settings to see the occupancy map."
        action={{ label: 'Go to Settings', onClick: () => router.push('/more') }}
      />
    );
  }

  const occupied = beds.filter((b) => b.status === 'occupied').length;
  const empty = beds.filter((b) => b.status === 'empty').length;
  const rooms = new Set(beds.map((b) => b.room_name)).size;

  return (
    <div className={styles.page}>
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Rooms</p>
          <p className={styles.summaryValue}>{rooms}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Occupied</p>
          <p className={`${styles.summaryValue} ${styles.summaryValueGreen}`}>{occupied}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Empty</p>
          <p className={`${styles.summaryValue} ${styles.summaryValueRed}`}>{empty}</p>
        </div>
      </div>

      <section className={`panel ${styles.mapPanel}`}>
        <div className={styles.mapHeader}>
          <p className="panelMuted" style={{ margin: 0 }}>
            Occupied — open tenant · Empty — add tenant
          </p>
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendOccupied}`} />
              Occupied
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendEmpty}`} />
              Empty
            </span>
          </div>
        </div>
        <BedGrid
          beds={beds}
          showRoomStats
          onSelect={(bed) => {
            if (bed.tenant) router.push(`/tenant/${bed.tenant.id}`);
            else router.push(`/tenant/new?bedId=${bed.id}`);
          }}
        />
      </section>
    </div>
  );
}
