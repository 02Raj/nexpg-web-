'use client';

import { addInvoiceCharge, fetchInvoices, generateInvoices, markInvoicePaid } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { PageSkeleton } from '@/components/Loading';
import { NoBuilding } from '@/components/NoBuilding';
import { inrExact, monthLabel, rpcMessage, todayIST } from '@/lib/format';
import { toast } from '@/lib/toast';
import { useToastOnError } from '@/hooks/useToastOnError';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Receipt } from 'lucide-react';
import { rentReminderUrl } from '@nexpg/shared/reminder';
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

  useToastOnError(q.error, 'Could not load bills');

  const pay = useMutation({
    mutationFn: ({ id, mode }: { id: string; mode: 'upi' | 'bank' | 'cash' }) => markInvoicePaid(id, mode),
    onSuccess: () => {
      toast.success('Payment recorded.');
      queryClient.invalidateQueries({ queryKey: keys.invoices(buildingId, period) });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not record payment')),
  });

  const gen = useMutation({
    mutationFn: () => generateInvoices(buildingId),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: keys.invoices(buildingId, period) });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
      toast.success(
        count === 0
          ? 'All active tenants already have a bill for this month.'
          : `${count} new bill${count === 1 ? '' : 's'} generated.`,
      );
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not generate bills')),
  });

  const charge = useMutation({
    mutationFn: ({ id, label, amount }: { id: string; label: string; amount: number }) => addInvoiceCharge(id, label, amount),
    onSuccess: () => { toast.success('Charge added to invoice.'); queryClient.invalidateQueries({ queryKey: keys.invoices(buildingId, period) }); queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) }); },
    onError: (err) => toast.error(rpcMessage(err, 'Could not add charge')),
  });

  const [chargeModal, setChargeModal] = useState<{ id: string; tenantName: string } | null>(null);
  const [chargeType, setChargeType] = useState<'meter' | 'custom'>('meter');
  const [prevUnits, setPrevUnits] = useState('');
  const [currUnits, setCurrUnits] = useState('');
  const [ratePerUnit, setRatePerUnit] = useState('10');
  const [customLabel, setCustomLabel] = useState('Maintenance');
  const [customAmount, setCustomAmount] = useState('');

  const meterUnits = Math.max(0, (Number(currUnits) || 0) - (Number(prevUnits) || 0));
  const meterTotal = meterUnits * (Number(ratePerUnit) || 10);

  const handleAddCharge = () => {
    if (!chargeModal) return;
    if (chargeType === 'meter') {
      if (meterUnits <= 0) return toast.error('Current reading must be greater than previous reading.');
      const label = `Electricity (${meterUnits} units @ ₹${ratePerUnit || 10}/unit)`;
      charge.mutate({ id: chargeModal.id, label, amount: meterTotal });
    } else {
      const amt = Number(customAmount);
      if (!Number.isFinite(amt) || amt <= 0) return toast.error('Enter a valid charge amount.');
      charge.mutate({ id: chargeModal.id, label: customLabel.trim() || 'Extra charge', amount: amt });
    }
    setChargeModal(null);
    setPrevUnits('');
    setCurrUnits('');
    setCustomAmount('');
  };

  if (!building) return <NoBuilding />;
  if (q.isLoading) return <PageSkeleton variant="table" />;

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
                            <Button label="Bank" variant="secondary" onClick={() => pay.mutate({ id: inv.id, mode: 'bank' })} disabled={pay.isPending} />
                            <Button
                              label="⚡ + Electricity / Charge"
                              variant="ghost"
                              onClick={() => setChargeModal({ id: inv.id, tenantName: inv.tenant?.full_name ?? 'Tenant' })}
                              disabled={charge.isPending}
                            />
                            {inv.tenant?.phone && rentReminderUrl({ phone: inv.tenant.phone, tenantName: inv.tenant.full_name, amount: inv.amount, period, buildingName: building.name }) ? (
                              <a href={rentReminderUrl({ phone: inv.tenant.phone, tenantName: inv.tenant.full_name, amount: inv.amount, period, buildingName: building.name })!} target="_blank" rel="noopener noreferrer" aria-label={`Remind ${inv.tenant.full_name} on WhatsApp`}>WhatsApp reminder</a>
                            ) : null}
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
                        <td className={styles.paid}>{inv.payment_mode === 'upi' ? 'UPI' : inv.payment_mode === 'bank' ? 'Bank transfer' : 'Cash'}</td>
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

      {chargeModal ? (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: 'var(--white, #ffffff)', color: 'var(--ink, #111)', borderRadius: '16px', padding: '24px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Add Extra Charge</h3>
              <button type="button" onClick={() => setChargeModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#666' }}>For tenant: <strong>{chargeModal.tenantName}</strong></p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setChargeType('meter')}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: chargeType === 'meter' ? '2px solid #2563eb' : '1px solid #ddd', background: chargeType === 'meter' ? '#eff6ff' : '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                ⚡ Sub-meter (Electricity)
              </button>
              <button
                type="button"
                onClick={() => setChargeType('custom')}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: chargeType === 'custom' ? '2px solid #2563eb' : '1px solid #ddd', background: chargeType === 'custom' ? '#eff6ff' : '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                ➕ Custom Charge
              </button>
            </div>

            {chargeType === 'meter' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Previous reading</label>
                    <input
                      type="number"
                      placeholder="e.g. 120"
                      value={prevUnits}
                      onChange={(e) => setPrevUnits(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Current reading</label>
                    <input
                      type="number"
                      placeholder="e.g. 165"
                      value={currUnits}
                      onChange={(e) => setCurrUnits(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Rate per unit (₹)</label>
                  <input
                    type="number"
                    value={ratePerUnit}
                    onChange={(e) => setRatePerUnit(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '13px', color: '#166534' }}>
                  Units consumed: <strong>{meterUnits} units</strong>
                  <br />
                  Electricity amount: <strong>{inrExact(meterTotal)}</strong>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Charge description</label>
                  <input
                    type="text"
                    placeholder="e.g. Maintenance / Deep cleaning"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Amount in Rupees (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
              <Button label="Cancel" variant="secondary" onClick={() => setChargeModal(null)} />
              <Button label={charge.isPending ? 'Adding...' : 'Add to Bill'} variant="primary" onClick={handleAddCharge} disabled={charge.isPending} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
