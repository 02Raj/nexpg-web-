'use client';

import { fetchDashboard, generateInvoices, maybeGenerateInvoices } from '@/api/nexpg';
import { BedGrid } from '@/components/BedGrid';
import { Button } from '@/components/Button';
import { inr, monthLabel, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
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

  if (!building) {
    return (
      <div className={`panel ${styles.empty}`}>
        <p className="bodyMuted">No PG yet. Add your first property to get started.</p>
        <Button label="Add PG" onClick={() => router.push('/setup/building')} />
      </div>
    );
  }

  if (dash.isLoading) return <p className="bodyMuted">Loading dashboard…</p>;
  if (dash.error) return <p className={styles.error}>{rpcMessage(dash.error)}</p>;

  const d = dash.data!;

  return (
    <div className={styles.page}>
      <p className="bodyMuted">{monthLabel(d.period)} · Billing overview</p>

      <div className="statGrid">
        <div className="statCard">
          <p className="statCardLabel">Occupied beds</p>
          <p className={`statCardValue ${styles.statGreen}`}>{d.occupied}</p>
        </div>
        <div className="statCard">
          <p className="statCardLabel">Empty beds</p>
          <p className={`statCardValue ${styles.statRed}`}>{d.empty}</p>
        </div>
        <div className="statCard">
          <p className="statCardLabel">Collected this month</p>
          <p className={`statCardValue ${styles.statInk}`}>{inr(d.collected)}</p>
        </div>
        <div className="statCard">
          <p className="statCardLabel">Pending rent</p>
          <p className={`statCardValue ${styles.statOchre}`}>{inr(d.pending)}</p>
          {d.pendingCount ? <p className="small">{d.pendingCount} invoice{d.pendingCount === 1 ? '' : 's'}</p> : null}
        </div>
      </div>

      <div className={styles.split}>
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
          <div className={styles.alertList}>
            {d.refundDueCount > 0 ? (
              <p className={styles.alertOchre}>
                Security refund due: {inr(d.refundDueAmount)} ({d.refundDueCount})
              </p>
            ) : null}
          </div>
        </section>

        <section className="panel">
          <h2 className="panelTitle">Quick occupancy</h2>
          <p className="panelMuted">Click a bed to open tenant or assign</p>
          {d.occupancy.length === 0 ? (
            <p className="bodyMuted">Add rooms in Settings first.</p>
          ) : (
            <BedGrid
              beds={d.occupancy}
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
