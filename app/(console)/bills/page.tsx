'use client';

import { fetchInvoices, generateInvoices, markInvoicePaid } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { inrExact, monthLabel, rpcMessage, todayIST } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import styles from './bills.module.css';

export default function BillsPage() {
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';
  const period = `${todayIST().slice(0, 8)}01`;

  const q = useQuery({
    queryKey: keys.invoices(buildingId, period),
    queryFn: () => fetchInvoices(buildingId, period),
    enabled: Boolean(buildingId),
  });

  const pay = useMutation({
    mutationFn: ({ id, mode }: { id: string; mode: 'upi' | 'cash' }) => markInvoicePaid(id, mode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.invoices(buildingId, period) });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
    },
  });

  const gen = useMutation({
    mutationFn: () => generateInvoices(buildingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.invoices(buildingId, period) });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
    },
  });

  if (!building) return null;
  if (q.isLoading) return <p className="bodyMuted">Loading bills…</p>;

  const rows = q.data ?? [];
  const pending = rows.filter((r) => r.status === 'pending');
  const paid = rows.filter((r) => r.status === 'paid');

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <p className="bodyMuted">{monthLabel(period)} · Security deposit is never listed here.</p>
        <Button
          label={gen.isPending ? 'Working…' : 'Generate bills'}
          variant="secondary"
          onClick={() => gen.mutate()}
          disabled={gen.isPending}
        />
      </div>

      {rows.length === 0 ? (
        <div className={`panel ${styles.empty}`}>
          <p className="bodyMuted">No bills for this month yet.</p>
          {gen.error ? <p className={styles.error}>{rpcMessage(gen.error)}</p> : null}
        </div>
      ) : (
        <>
          {pending.length > 0 ? (
            <section>
              <h2 className="section" style={{ marginBottom: 12 }}>Pending ({pending.length})</h2>
              <div className="tableWrap">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th>Tenant</th>
                      <th>Phone</th>
                      <th>Amount</th>
                      <th>Notes</th>
                      <th style={{ width: 220 }}>Mark paid</th>
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
            <section>
              <h2 className="section" style={{ marginBottom: 12 }}>Paid ({paid.length})</h2>
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
        </>
      )}
      {pay.error ? <p className={styles.error}>{rpcMessage(pay.error)}</p> : null}
    </div>
  );
}
