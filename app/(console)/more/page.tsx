'use client';

import {
  addRoomWithBeds,
  fetchRefundDue,
  markSecurityRefunded,
  updateBillingDate,
} from '@/api/nexpg';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { NoBuilding } from '@/components/NoBuilding';
import { formatBuildingLocation } from '@/lib/locations';
import { inr, rpcMessage } from '@/lib/format';
import { toast } from '@/lib/toast';
import { useToastOnError } from '@/hooks/useToastOnError';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import { CONTACT, MAILTO, WHATSAPP_URL } from '@/content/contact';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './more.module.css';

export default function MorePage() {
  const router = useRouter();
  const { building } = useBuilding();
  const [billing, setBilling] = useState(String(building?.billing_date ?? 5));
  const [roomName, setRoomName] = useState('');
  const [beds, setBeds] = useState('2');

  useEffect(() => {
    if (building) setBilling(String(building.billing_date));
  }, [building?.id, building?.billing_date]);

  const refunds = useQuery({
    queryKey: ['refunds', building?.id],
    queryFn: () => fetchRefundDue(building!.id),
    enabled: Boolean(building?.id),
  });

  const saveBilling = useMutation({
    mutationFn: () => updateBillingDate(building!.id, Number(billing)),
    onSuccess: () => {
      toast.success('Billing date saved. Bills auto-create on this day (IST).');
      queryClient.invalidateQueries({ queryKey: keys.buildings });
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not save billing date')),
  });

  const addRoom = useMutation({
    mutationFn: () => addRoomWithBeds(building!.id, roomName, Number(beds)),
    onSuccess: () => {
      setRoomName('');
      toast.success('Room added.');
      queryClient.invalidateQueries({ queryKey: keys.occupancy(building!.id) });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(building!.id) });
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not add room')),
  });

  const refund = useMutation({
    mutationFn: (id: string) => markSecurityRefunded(id),
    onSuccess: () => {
      toast.success('Security deposit marked as refunded.');
      queryClient.invalidateQueries({ queryKey: ['refunds', building?.id] });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(building!.id) });
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not update refund')),
  });

  useToastOnError(refunds.error, 'Could not load refunds');

  if (!building) return <NoBuilding />;

  return (
    <div className={styles.page}>
      <section className={styles.topRow}>
        <div className={styles.propertyHero}>
          <div className={styles.propertyIcon}>
            <Building2 size={22} />
          </div>
          <div className={styles.propertyInfo}>
            <h2 className={styles.propertyName}>{building.name}</h2>
            <p className={styles.propertyMeta}>{formatBuildingLocation(building)}</p>
          </div>
          <div className={styles.propertyAside}>
            <p className={styles.propertyAsideLabel}>Billing day</p>
            <p className={styles.propertyAsideValue}>{building.billing_date}</p>
          </div>
        </div>
      </section>

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
          <p className={styles.inlineOk}>All clear — no security refunds pending.</p>
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

      <section className="panel">
        <h2 className="panelTitle">Help & contact</h2>
        <p className="panelMuted">WhatsApp or email — we reply on the official RunMyPG addresses.</p>
        <p className={styles.msg}>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            WhatsApp {CONTACT.phoneDisplay}
          </a>
        </p>
        <p className={styles.msg}>
          <a href={MAILTO.support}>{CONTACT.emails.support}</a>
          {' · '}
          <a href={MAILTO.contact}>{CONTACT.emails.contact}</a>
        </p>
      </section>

      <div className={styles.foot}>
        <Button label="Add another PG" variant="secondary" onClick={() => router.push('/setup/building')} />
      </div>
    </div>
  );
}
