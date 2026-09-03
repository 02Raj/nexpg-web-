'use client';

import {
  addRoomWithBeds,
  fetchRefundDue,
  markSecurityRefunded,
  updateBillingDate,
} from '@/api/nexpg';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Field } from '@/components/Field';
import { inr, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './more.module.css';

export default function MorePage() {
  const router = useRouter();
  const { building } = useBuilding();
  const [billing, setBilling] = useState(String(building?.billing_date ?? 5));
  const [roomName, setRoomName] = useState('');
  const [beds, setBeds] = useState('2');
  const [msg, setMsg] = useState<string | null>(null);

  const refunds = useQuery({
    queryKey: ['refunds', building?.id],
    queryFn: () => fetchRefundDue(building!.id),
    enabled: Boolean(building?.id),
  });

  const saveBilling = useMutation({
    mutationFn: () => updateBillingDate(building!.id, Number(billing)),
    onSuccess: () => {
      setMsg('Billing date saved. Bills auto-create on this day (IST).');
      queryClient.invalidateQueries({ queryKey: keys.buildings });
    },
  });

  const addRoom = useMutation({
    mutationFn: () => addRoomWithBeds(building!.id, roomName, Number(beds)),
    onSuccess: () => {
      setRoomName('');
      setMsg('Room added.');
      queryClient.invalidateQueries({ queryKey: keys.occupancy(building!.id) });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(building!.id) });
    },
  });

  const refund = useMutation({
    mutationFn: (id: string) => markSecurityRefunded(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds', building?.id] });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(building!.id) });
    },
  });

  if (!building) return null;

  return (
    <div className={styles.page}>
      <div className="settingsGrid">
        <section className="panel">
          <h2 className="panelTitle">Billing date</h2>
          <p className="panelMuted">Rent invoices are generated on this day each month (IST).</p>
          <Field label="Day of month (1–28)" value={billing} onChange={setBilling} type="number" />
          <Button
            label="Save billing date"
            variant="ghost"
            onClick={() => saveBilling.mutate()}
            disabled={saveBilling.isPending}
            className={styles.mt}
          />
        </section>

        <section className="panel">
          <h2 className="panelTitle">Add a room</h2>
          <p className="panelMuted">Create rooms and beds for this property.</p>
          <div className={styles.fields}>
            <Field label="Room name" value={roomName} onChange={setRoomName} placeholder="101" />
            <Field label="Beds in this room" value={beds} onChange={setBeds} type="number" hint="1 to 8" />
            <Button
              label={addRoom.isPending ? 'Adding…' : 'Add room'}
              onClick={() => addRoom.mutate()}
              disabled={!roomName || addRoom.isPending}
            />
          </div>
        </section>
      </div>

      <section className="panel">
        <h2 className="panelTitle">Security refund due</h2>
        <p className="panelMuted">After vacate — never mixed with rent invoices.</p>
        {(refunds.data ?? []).length === 0 ? (
          <EmptyState
            icon={<CheckCircle size={28} />}
            title="All clear"
            message="No security refunds pending at the moment."
          />
        ) : (
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Amount</th>
                  <th style={{ width: 140 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(refunds.data ?? []).map((d) => (
                  <tr key={d.id}>
                    <td className={styles.rName}>{d.tenant_name}</td>
                    <td className={styles.rAmt}>{inr(d.amount)}</td>
                    <td>
                      <button type="button" onClick={() => refund.mutate(d.id)} className={styles.refundBtn}>
                        Mark refunded
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className={styles.foot}>
        <Button label="Add another PG" variant="secondary" onClick={() => router.push('/setup/building')} />
      </div>

      {(saveBilling.error || addRoom.error || refund.error || msg) && (
        <p className={styles.msg}>
          {saveBilling.error || addRoom.error || refund.error
            ? rpcMessage(saveBilling.error || addRoom.error || refund.error)
            : msg}
        </p>
      )}
    </div>
  );
}
