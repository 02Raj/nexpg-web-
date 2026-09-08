'use client';

import { fetchDashboard, generateInvoices, maybeGenerateInvoices } from '@/api/nexpg';
import { BedGrid } from '@/components/BedGrid';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { LoadingCenter, Skeleton } from '@/components/Loading';
import { NoBuilding } from '@/components/NoBuilding';
import { formatBuildingLocation } from '@/lib/locations';
import { inr, monthLabel, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertCircle, Banknote, BedDouble, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';
  const [flash, setFlash] = useState<string | null>(null);

  const dash = useQuery({
    queryKey: keys.dashboard(buildingId),
    queryFn: () => fetchDashboard(buildingId),
    enabled: Boolean(buildingId),
  });

  useEffect(() => {
    if (!buildingId) return;
    maybeGenerateInvoices(buildingId)
      .then((n) => {
        if (n > 0) queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
      })
      .catch(() => undefined);
  }, [buildingId]);

  const gen = useMutation({
    mutationFn: () => generateInvoices(buildingId),
    onSuccess: (n) => {
      setFlash(n === 0 ? 'Bills for this month are already generated.' : `${n} invoice${n === 1 ? '' : 's'} created.`);
      queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
    },
  });

  if (!building) return <NoBuilding />;

  if (dash.isLoading) {
    return (
      <div className={styles.page}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skeleton style={{ width: 150, height: 20 }} />
        </div>
        <div className="statGrid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="statCard">
              <Skeleton style={{ width: 100, height: 14, marginBottom: 8 }} />
              <Skeleton style={{ width: 60, height: 28 }} />
            </div>
          ))}
        </div>
        <LoadingCenter message="Loading dashboard…" />
      </div>
    );
  }

  if (dash.error) return <p className={styles.error}>{rpcMessage(dash.error)}</p>;

  const d = dash.data!;
  const totalBeds = d.occupied + d.empty;
  const occupancyPct = totalBeds > 0 ? Math.round((d.occupied / totalBeds) * 100) : 0;
  const locationLine = formatBuildingLocation(building);

  if (totalBeds === 0) {
    return (
      <div className={styles.page}>
        <p className="bodyMuted">{locationLine}</p>
        <EmptyState
          icon={<BedDouble size={28} />}
          title="Add rooms and beds"
          message="Your property is set up. Add rooms in Settings, then assign tenants from the Beds page."
          action={{ label: 'Go to Settings', onClick: () => router.push('/more') }}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <p className="bodyMuted">{locationLine} · {monthLabel(d.period)}</p>

      {/* Stat cards — auto-fit grid */}
      <div className="statGrid">
        <div className="statCard">
          <div className={styles.statHeader}>
            <p className="statCardLabel">Occupied beds</p>
            <Users className={styles.statIcon} size={18} color="var(--green)" />
          </div>
          <p className={`statCardValue ${styles.statGreen}`}>{d.occupied}</p>
        </div>
        <div className="statCard">
          <div className={styles.statHeader}>
            <p className="statCardLabel">Empty beds</p>
            <BedDouble className={styles.statIcon} size={18} color="var(--red)" />
          </div>
          <p className={`statCardValue ${styles.statRed}`}>{d.empty}</p>
        </div>
        <div className="statCard">
          <div className={styles.statHeader}>
            <p className="statCardLabel">Collected this month</p>
            <Banknote className={styles.statIcon} size={18} color="var(--ink)" />
          </div>
          <p className={`statCardValue ${styles.statInk}`}>{inr(d.collected)}</p>
        </div>
        <div className="statCard">
          <div className={styles.statHeader}>
            <p className="statCardLabel">Pending rent</p>
            <AlertCircle className={styles.statIcon} size={18} color="var(--ochre-deep)" />
          </div>
          <div className={styles.statFooter}>
            <p className={`statCardValue ${styles.statOchre}`}>{inr(d.pending)}</p>
            {d.pendingCount ? <p className="small">{d.pendingCount} invoice{d.pendingCount === 1 ? '' : 's'}</p> : null}
          </div>
        </div>
      </div>

      {/* Sidebar panels + bed map */}
      <div className={styles.contentGrid}>
        <div className={styles.sideCol}>
          <section className="panel">
            <h2 className="panelTitle">Actions</h2>
            <p className="panelMuted">Common tasks for {building.name}</p>
            <div className={styles.actions}>
              <Button label="Add tenant" onClick={() => router.push('/tenant/new')} />
              <Button
                label={gen.isPending ? 'Billing…' : 'Generate bills'}
                variant="secondary"
                disabled={gen.isPending}
                onClick={() => gen.mutate()}
              />
            </div>
            {gen.error ? <p className={styles.error}>{rpcMessage(gen.error)}</p> : null}
            {flash ? <p className="small">{flash}</p> : null}
            {d.refundDueCount > 0 ? (
              <p className={styles.alertOchre}>
                Security refund due: {inr(d.refundDueAmount)} ({d.refundDueCount})
              </p>
            ) : null}
          </section>

          <section className="panel">
            <h2 className="panelTitle">Pending rent</h2>
            <p className="panelMuted">{d.pendingCount} invoice{d.pendingCount === 1 ? '' : 's'} this month</p>
            {d.pendingInvoices.length === 0 ? (
              <p className={styles.pendingEmpty}>All rents collected — no pending invoices.</p>
            ) : (
              <div className={styles.pendingList}>
                {d.pendingInvoices.map((inv) => (
                  <div key={inv.id} className={styles.pendingItem}>
                    <span className={styles.pendingName}>{inv.tenantName}</span>
                    <span className={styles.pendingAmt}>{inr(inv.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={`panel ${styles.panelCompact}`}>
            <h2 className="panelTitle">Occupancy</h2>
            <p className="panelMuted">{d.occupied} of {totalBeds} beds · <span className={styles.occupancyPct}>{occupancyPct}%</span></p>
            <div className={styles.occupancyBarWrap}>
              <div className={styles.occupancyBarTrack}>
                <div className={styles.occupancyBarFill} style={{ width: `${occupancyPct}%` }} />
              </div>
              <div className={styles.occupancyBarLabels}>
                <span>{d.occupied} occupied</span>
                <span>{d.empty} empty</span>
              </div>
            </div>
          </section>
        </div>

        <section className={`panel ${styles.bedsPanel}`}>
          <h2 className="panelTitle">Bed occupancy</h2>
          <p className="panelMuted">Click a bed to open tenant or assign a new one</p>
          {d.occupancy.length === 0 ? (
            <p className="bodyMuted">Add rooms in Settings first.</p>
          ) : (
            <BedGrid
              beds={d.occupancy}
              showRoomStats
              onSelect={(bed) => {
                if (bed.tenant) router.push(`/tenant/${bed.tenant.id}`);
                else router.push(`/tenant/new?bedId=${bed.id}`);
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
}
