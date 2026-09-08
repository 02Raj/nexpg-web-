'use client';

import { fetchInvoices, generateInvoices, markInvoicePaid } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { LoadingCenter } from '@/components/Loading';
import { NoBuilding } from '@/components/NoBuilding';
import { inrExact, monthLabel, rpcMessage, todayIST } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Receipt } from 'lucide-react';
import { useState } from 'react';
import styles from './bills.module.css';

export default function BillsPage() {
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';
  const period = `${todayIST().slice(0, 8)}01`;
  const [flash, setFlash] = useState<string | null>(null);

  const q = useQuery({
    queryKey: keys.invoices(buildingId, period),
    queryFn: () => fetchInvoices(buildingId, period),
    enabled: Boolean(buildingId),
  });

  const pay = useMutation({
    mutationFn: ({ id, mode }: { id: string; mode: 'upi' | 'cash' }) => markInvoicePaid(id, mode),
    onSuccess: () => {
      setFlash('Payment recorded.');
      queryClient.invalidateQueries({ queryKey: keys.invoices(buildingId, period) });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
    },
  });

  const gen = useMutation({
    mutationFn: () => generateInvoices(buildingId),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: keys.invoices(buildingId, period) });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
      setFlash(
        count === 0
          ? 'All active tenants already have a bill for this month.'
          : `${count} new bill${count === 1 ? '' : 's'} generated.`,
      );
    },
  });

  if (!building) return <NoBuilding />;
  if (q.isLoading) return <LoadingCenter message="Loading bills…" />;

  const rows = q.data ?? [];
  const pending = rows.filter((r) => r.status === 'pending');
  const paid = rows.filter((r) => r.status === 'paid');
  const pendingTotal = pending.reduce((sum, r) => sum + r.amount, 0);
  const collectedTotal = paid.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className={styles.page}>
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Pending</p>
          <p className={styles.summaryValue}>{inrExact(pendingTotal)}</p>
          <p className={styles.summaryHint}>{pending.length} invoice{pending.length === 1 ? '' : 's'}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Collected</p>
          <p className={`${styles.summaryValue} ${styles.summaryGreen}`}>{inrExact(collectedTotal)}</p>
          <p className={styles.summaryHint}>{paid.length} paid</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Period</p>
          <p className={styles.summaryValueSm}>{monthLabel(period)}</p>
          <p className={styles.summaryHint}>Rent only — not deposits</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <p className="bodyMuted">Mark payments as UPI or cash when tenants pay.</p>
        <Button
          label={gen.isPending ? 'Working…' : 'Generate bills'}
          variant="secondary"
          onClick={() => gen.mutate()}
          disabled={gen.isPending}
        />
      </div>

      {flash ? <p className={styles.flash}>{flash}</p> : null}
      {gen.error ? <p className={styles.error}>{rpcMessage(gen.error)}</p> : null}

      {rows.length === 0 ? (
        <EmptyState
          icon={<Receipt size={28} />}
          title="No bills yet"
          message="Generate monthly rent invoices for all active tenants. Security deposit is tracked separately."
          action={{
            label: gen.isPending ? 'Working…' : 'Generate bills',
            onClick: () => gen.mutate(),
          }}
        />
      ) : (
        <div className={styles.body}>
          {pending.length === 0 && paid.length > 0 ? (
            <p className={styles.allClear}>All rents collected for {monthLabel(period)}.</p>
          ) : null}

          {pending.length > 0 ? (
            <section className={`panel ${styles.section}`}>
              <h2 className="panelTitle">Pending ({pending.length})</h2>
              <div className="tableWrap">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th>Tenant</th>
                      <th>Phone</th>
                      <th>Amount</th>
                      <th>Notes</th>
                      <th className={styles.payCol}>Mark paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map((inv) => (
                      <tr key={inv.id}>
                        <td className={styles.name}>{inv.tenant?.full_name ?? 'Tenant'}</td>
                        <td className="small">{inv.tenant?.phone ?? '—'}</td>
                        <td className={styles.amt}>{inrExact(inv.amount)}</td>
                        <td>{inv.is_prorated ? <span className={styles.tag}>Pro-rated</span> : '—'}</td>
                        <td>
                          <div className={styles.payRow}>
                            <Button
                              label="UPI"
                              variant="success"
                              onClick={() => pay.mutate({ id: inv.id, mode: 'upi' })}
                              disabled={pay.isPending}
                            />
                            <Button
                              label="Cash"
                              variant="secondary"
                              onClick={() => pay.mutate({ id: inv.id, mode: 'cash' })}
                              disabled={pay.isPending}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {paid.length > 0 ? (
            <section className={`panel ${styles.section}`}>
              <h2 className="panelTitle">Paid ({paid.length})</h2>
              <div className="tableWrap">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th>Tenant</th>
                      <th>Amount</th>
                      <th>Mode</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paid.map((inv) => (
                      <tr key={inv.id}>
                        <td className={styles.name}>{inv.tenant?.full_name ?? 'Tenant'}</td>
                        <td className={styles.amt}>{inrExact(inv.amount)}</td>
                        <td className={styles.paid}>{inv.payment_mode === 'upi' ? 'UPI' : 'Cash'}</td>
                        <td>{inv.is_prorated ? <span className={styles.tag}>Pro-rated</span> : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>
      )}
      {pay.error ? <p className={styles.error}>{rpcMessage(pay.error)}</p> : null}
    </div>
  );
}
