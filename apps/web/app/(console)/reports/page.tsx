'use client';

import { fetchReports } from '@/api/nexpg';
import { PageSkeleton } from '@/components/Loading';
import { NoBuilding } from '@/components/NoBuilding';
import { inr, inrExact } from '@/lib/format';
import { keys } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, BedDouble, Download, IndianRupee, Users } from 'lucide-react';
import styles from './reports.module.css';

const monthName = (period: string) => new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(new Date(`${period}-01T00:00:00`));

export default function ReportsPage() {
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';
  const report = useQuery({ queryKey: keys.reports(buildingId), queryFn: () => fetchReports(buildingId), enabled: Boolean(buildingId) });
  if (!building) return <NoBuilding />;
  if (report.isLoading) return <PageSkeleton variant="dashboard" />;
  const data = report.data!;
  const max = Math.max(1, ...data.months.map((month) => month.billed));

  const exportCsv = (kind: 'summary' | 'tenants' | 'outstanding') => {
    let rows: (string | number)[][];
    if (kind === 'tenants') rows = [['Name', 'Phone', 'Status', 'Monthly rent', 'Join date'], ...data.tenants.map((tenant) => [tenant.full_name, tenant.phone, tenant.status, tenant.monthly_rent, tenant.join_date])];
    else if (kind === 'outstanding') rows = [['Period', 'Tenant ID', 'Amount', 'Status'], ...data.invoices.filter((invoice) => invoice.status === 'pending').map((invoice) => [invoice.billing_period, invoice.tenant_id, invoice.amount, invoice.status])];
    else rows = [['Period', 'Billed', 'Collected', 'Pending'], ...data.months.map((month) => [month.period, month.billed, month.collected, month.pending])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${building.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${kind}.csv`; anchor.click(); URL.revokeObjectURL(url);
  };

  return <div className={styles.page}>
    <section className={styles.reportHero}>
      <div><p className={styles.kicker}>Live business pulse</p><h2>Know what is earning,<br/><em>and what needs attention.</em></h2><p>Reports are calculated from the same tenant, bed and invoice records your team uses every day.</p></div>
      <button type="button" onClick={() => exportCsv('summary')}><Download size={17}/> Export summary</button>
    </section>

    <div className={styles.metrics}>
      <Metric icon={<IndianRupee size={18}/>} label="Total billed" value={inr(data.billed)} note={`${inr(data.pending)} outstanding`} />
      <Metric icon={<ArrowUpRight size={18}/>} label="Collected" value={inr(data.collected)} note={`${data.billed ? Math.round(data.collected / data.billed * 100) : 0}% collection rate`} tone="green" />
      <Metric icon={<BedDouble size={18}/>} label="Occupancy" value={`${data.occupancyRate}%`} note={`${data.occupiedBeds} of ${data.totalBeds} beds`} />
      <Metric icon={<Users size={18}/>} label="Active tenants" value={String(data.activeTenants)} note={`${data.tenants.length} all-time profiles`} />
    </div>

    <div className={styles.contentGrid}>
      <section className={styles.chartCard}><div className={styles.cardHead}><div><p>Revenue trend</p><h3>Collections by month</h3></div><span>Last 6 periods</span></div>
        {data.months.length ? <div className={styles.chart}>{data.months.map((month) => <div className={styles.column} key={month.period}><div className={styles.value}>{inr(month.collected)}</div><div className={styles.barTrack}><div className={styles.pendingBar} style={{height:`${Math.max(4, month.billed / max * 100)}%`}}/><div className={styles.paidBar} style={{height:`${Math.max(2, month.collected / max * 100)}%`}}/></div><span>{monthName(month.period)}</span></div>)}</div> : <div className={styles.noData}>Generate invoices to start seeing revenue trends.</div>}
        <div className={styles.legend}><span><i className={styles.legendPaid}/>Collected</span><span><i className={styles.legendBilled}/>Total billed</span></div>
      </section>
      <section className={styles.exportCard}><p className={styles.kicker}>Exports</p><h3>Ready for review</h3><p>Download clean CSV files for Excel, accountants and monthly audits.</p><ExportRow title="Monthly summary" meta={`${data.months.length} periods`} onClick={() => exportCsv('summary')}/><ExportRow title="Tenant directory" meta={`${data.tenants.length} profiles`} onClick={() => exportCsv('tenants')}/><ExportRow title="Outstanding payments" meta={inrExact(data.pending)} onClick={() => exportCsv('outstanding')}/></section>
    </div>
  </div>;
}

function Metric({icon,label,value,note,tone}:{icon:React.ReactNode;label:string;value:string;note:string;tone?:'green'}){return <div className={styles.metric}><div className={styles.metricIcon}>{icon}</div><p>{label}</p><strong className={tone === 'green' ? styles.green : ''}>{value}</strong><span>{note}</span></div>}
function ExportRow({title,meta,onClick}:{title:string;meta:string;onClick:()=>void}){return <button type="button" className={styles.exportRow} onClick={onClick}><span><strong>{title}</strong><small>{meta}</small></span><Download size={17}/></button>}
