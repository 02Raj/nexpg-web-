'use client';

import { fetchTenantDetail, markInvoicePaid, markSecurityRefunded, vacateTenant } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { LoadingCenter } from '@/components/Loading';
import { inrExact, prettyDate, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, CheckCircle2, Clock, Phone, ShieldCheck, Wallet } from 'lucide-react';
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

  if (q.isLoading) return <LoadingCenter message="Loading tenant profile…" />;
  if (q.error || !q.data) return <p style={{ color: 'var(--red)', padding: 40 }}>{rpcMessage(q.error, 'Tenant not found')}</p>;

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
      <div className={styles.appBar}>
        <button type="button" onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <span className={styles.bedLabel}>{bedLabel}</span>
          {tenant.status === 'active' ? (
            <span className={styles.statusActive}>Active</span>
          ) : (
            <span className={styles.statusVacated}>Vacated</span>
          )}
        </div>
        <h1 className={styles.tenantName}>{tenant.full_name}</h1>
        <div className={styles.headerMeta}>
          <span className={styles.metaItem}>
            <Phone size={14} /> {tenant.phone}
          </span>
          <span className={styles.metaItem}>
            <Calendar size={14} /> Joined {prettyDate(tenant.join_date)}
          </span>
        </div>
      </div>

      <div className={styles.financialGrid}>
        <div className={styles.finCard}>
          <div className={styles.finHeader}>
            <Wallet size={16} className={styles.finIcon} />
            <span className="kicker">Monthly rent</span>
          </div>
          <div className={styles.finAmount}>{inrExact(tenant.monthly_rent)}</div>
        </div>

        <div className={styles.finCard}>
          <div className={styles.finHeader}>
            <ShieldCheck size={16} className={styles.finIcon} />
            <span className="kicker">Security</span>
            {deposit ? <span className={styles.secStatus} data-status={deposit.status}>{deposit.status.replace('_', ' ')}</span> : null}
          </div>
          <div className={styles.finAmount}>{inrExact(deposit?.amount ?? 0)}</div>
          {deposit?.status === 'refund_due' ? (
            <Button
              label={refund.isPending ? 'Saving…' : 'Mark refunded'}
              variant="secondary"
              onClick={() => refund.mutate(deposit.id)}
              disabled={refund.isPending}
              className={styles.mtFull}
            />
          ) : null}
        </div>
      </div>

      <div className={styles.billsSection}>
        <h2 className="section">Bills</h2>
        {invoices.length === 0 ? (
          <p className="bodyMuted">No rent invoices yet.</p>
        ) : (
          <div className={styles.invoiceList}>
            {invoices.map((inv) => (
              <div key={inv.id} className={styles.invoiceCard}>
                <div className={styles.invInfo}>
                  <div className={styles.invAmount}>{inrExact(inv.amount)}</div>
                  <div className={styles.invPeriod}>{inv.billing_period}</div>
                </div>
                
                <div className={styles.invAction}>
                  {inv.status === 'pending' ? (
                    <div className={styles.invPending}>
                      <Clock size={14} className={styles.iconPending} />
                      <div className={styles.payButtons}>
                        <Button label="UPI" variant="success" onClick={() => pay.mutate({ invoiceId: inv.id, mode: 'upi' })} />
                        <Button label="Cash" variant="secondary" onClick={() => pay.mutate({ invoiceId: inv.id, mode: 'cash' })} />
                      </div>
                    </div>
                  ) : (
                    <div className={styles.invPaid}>
                      <CheckCircle2 size={16} className={styles.iconPaid} />
                      <span>Paid · {inv.payment_mode?.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {tenant.status === 'active' ? (
        <div className={styles.dangerZone}>
          <Button label={vacate.isPending ? 'Vacating…' : 'Vacate tenant'} variant="danger" onClick={confirmVacate} className={styles.fullWidth} />
        </div>
      ) : null}
    </div>
  );
}
