'use client';

import { fetchTenantDetail, markInvoicePaid, markSecurityRefunded, vacateTenant } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { inrExact, prettyDate, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import styles from './tenant.module.css';

export default function TenantPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { building } = useBuilding();

  const q = useQuery({
    queryKey: keys.tenant(id),
    queryFn: () => fetchTenantDetail(id),
    enabled: Boolean(id),
  });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: keys.tenant(id) }),
      queryClient.invalidateQueries({ queryKey: keys.dashboard(building?.id ?? '') }),
      queryClient.invalidateQueries({ queryKey: keys.occupancy(building?.id ?? '') }),
    ]);
  };

  const vacate = useMutation({ mutationFn: () => vacateTenant(id), onSuccess: invalidate });
  const refund = useMutation({
    mutationFn: (depositId: string) => markSecurityRefunded(depositId),
    onSuccess: invalidate,
  });
  const pay = useMutation({
    mutationFn: ({ invoiceId, mode }: { invoiceId: string; mode: 'upi' | 'cash' }) =>
      markInvoicePaid(invoiceId, mode),
    onSuccess: invalidate,
  });

  if (q.isLoading) return <p className="bodyMuted">Loading tenant…</p>;
  if (q.error || !q.data) return <p style={{ color: 'var(--red)' }}>{rpcMessage(q.error, 'Tenant not found')}</p>;

  const { tenant, deposit, invoices, bedLabel } = q.data;

  const confirmVacate = () => {
    if (
      window.confirm(
        'Vacate this tenant? The bed will be freed. Future rent invoices will stop. Security deposit will move to Refund due.',
      )
    ) {
      vacate.mutate();
    }
  };

  return (
    <div className={styles.page}>
      <button type="button" onClick={() => router.back()} className={styles.back}>
        Back
      </button>
      <p className="kicker">{bedLabel}</p>
      <h1 className="display">{tenant.full_name}</h1>
      <p className="bodyMuted">{tenant.phone}</p>
      <p className="small">
        {tenant.status === 'active' ? 'Active' : 'Vacated'} · Joined {prettyDate(tenant.join_date)}
      </p>

      <div className={styles.detailRow}>
        <div className={styles.rentBox}>
          <p className="kicker">Monthly rent</p>
          <div className="amountLg">{inrExact(tenant.monthly_rent)}</div>
        </div>

        <div className={styles.secBox}>
          <div className={styles.secRow}>
            <h2 className="section">Security</h2>
            {deposit ? <span className={styles.chip}>{deposit.status.replace('_', ' ')}</span> : null}
          </div>
          <div className="amountLg">{inrExact(deposit?.amount ?? 0)}</div>
          {deposit?.status === 'refund_due' ? (
            <Button
              label={refund.isPending ? 'Saving…' : 'Mark refunded'}
              variant="secondary"
              onClick={() => refund.mutate(deposit.id)}
              disabled={refund.isPending}
              className={styles.mt}
            />
          ) : null}
        </div>
      </div>

      <h2 className="section" style={{ marginTop: 22 }}>
        Bills
      </h2>
      {invoices.length === 0 ? (
        <p className="bodyMuted">No rent invoices yet.</p>
      ) : (
        invoices.map((inv) => (
          <div key={inv.id} className={styles.inv}>
            <div>
              <div className={styles.invAmt}>{inrExact(inv.amount)}</div>
              <div className="small">{inv.billing_period.slice(0, 7)}</div>
            </div>
            {inv.status === 'pending' ? (
              <div className={styles.payRow}>
                <Button label="UPI" variant="success" onClick={() => pay.mutate({ invoiceId: inv.id, mode: 'upi' })} />
                <Button label="Cash" variant="secondary" onClick={() => pay.mutate({ invoiceId: inv.id, mode: 'cash' })} />
              </div>
            ) : (
              <span className={styles.paid}>{inv.payment_mode === 'upi' ? 'Paid · UPI' : 'Paid · Cash'}</span>
            )}
          </div>
        ))
      )}

      {tenant.status === 'active' ? (
        <Button label={vacate.isPending ? 'Vacating…' : 'Vacate tenant'} variant="danger" onClick={confirmVacate} className={styles.mt} />
      ) : null}
    </div>
  );
}
