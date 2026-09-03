'use client';

import { addTenant, fetchOccupancy } from '@/api/nexpg';
import { BedGrid } from '@/components/BedGrid';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Field } from '@/components/Field';
import { rpcMessage, todayIST } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LayoutGrid } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import styles from '../../form-page.module.css';

export default function NewTenantPage() {
  const router = useRouter();
  const params = useSearchParams();
  const bedParam = params.get('bedId');
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';

  const occ = useQuery({
    queryKey: keys.occupancy(buildingId),
    queryFn: () => fetchOccupancy(buildingId),
    enabled: Boolean(buildingId),
  });

  const [bedId, setBedId] = useState<string | null>(bedParam);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rent, setRent] = useState('');
  const [security, setSecurity] = useState('');
  const [join, setJoin] = useState(todayIST());

  const emptyBeds = useMemo(() => (occ.data ?? []).filter((b) => b.status === 'empty'), [occ.data]);

  useEffect(() => {
    if (emptyBeds.length === 1 && !bedId) setBedId(emptyBeds[0].id);
  }, [emptyBeds, bedId]);

  const mutate = useMutation({
    mutationFn: () =>
      addTenant({
        bedId: bedId!,
        fullName: name,
        phone,
        monthlyRent: Number(rent),
        securityAmount: Number(security),
        joinDate: join,
      }),
    onSuccess: async (id) => {
      await queryClient.invalidateQueries({ queryKey: keys.occupancy(buildingId) });
      await queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
      router.replace(`/tenant/${id}`);
    },
  });

  const canSubmit =
    Boolean(bedId) &&
    name.trim().length >= 2 &&
    phone.length === 10 &&
    Number(rent) > 0 &&
    Number(security) >= 0 &&
    !mutate.isPending;

  if (!building || occ.isLoading) return <p className="bodyMuted">Loading…</p>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" onClick={() => router.back()} className="small" style={{ color: 'var(--ochre-deep)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 12 }}>
          ← Back
        </button>
        <p className={styles.kicker}>Tenant</p>
        <h1 className={styles.title}>Add to a bed.</h1>
      </header>

      {emptyBeds.length === 0 ? (
        <EmptyState
          icon={<LayoutGrid size={28} />}
          title="No empty beds"
          message="All beds are occupied. Add more rooms in Settings to continue."
          action={{ label: 'Go to Settings', onClick: () => router.push('/more') }}
        />
      ) : (
        <div className={styles.card}>
          <div className={styles.form}>
            <BedGrid
              beds={occ.data ?? []}
              selectableEmpty
              selectedBedId={bedId}
              onSelect={(bed) => setBedId(bed.id)}
            />

            <div className={styles.grid2} style={{ marginTop: 12 }}>
              <Field label="Full name" value={name} onChange={setName} />
              <Field label="Phone" value={phone} onChange={setPhone} maxLength={10} />
            </div>
            
            <div className={styles.grid2}>
              <Field label="Monthly rent (₹)" value={rent} onChange={setRent} type="number" />
              <Field label="Security deposit (₹)" value={security} onChange={setSecurity} type="number" />
            </div>

            <div className={styles.grid2}>
              <Field label="Join date" value={join} onChange={setJoin} type="date" />
              <div>
                {/* Empty div to fill the grid slot, or we can leave it spanning 1 col */}
              </div>
            </div>

            {mutate.error ? <p style={{ color: 'var(--red)', fontSize: 14 }}>{rpcMessage(mutate.error)}</p> : null}
            
            <div style={{ marginTop: 8 }}>
              <Button label={mutate.isPending ? 'Saving…' : 'Add tenant'} disabled={!canSubmit} onClick={() => mutate.mutate()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
