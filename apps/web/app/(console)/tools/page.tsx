'use client';

import { addTenant, fetchOccupancy, fetchTenantDirectory } from '@/api/nexpg';
import { NoBuilding } from '@/components/NoBuilding';
import { keys, queryClient } from '@/lib/query';
import { toast } from '@/lib/toast';
import { useBuilding } from '@/providers/BuildingProvider';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import styles from '../operations.module.css';

const download = (name: string, rows: (string | number)[][]) => {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
};

export default function ToolsPage() {
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';
  const [progress, setProgress] = useState('');
  const tenants = useQuery({ queryKey: keys.tenants(buildingId), queryFn: () => fetchTenantDirectory(buildingId), enabled: Boolean(buildingId) });
  const occupancy = useQuery({ queryKey: keys.occupancy(buildingId), queryFn: () => fetchOccupancy(buildingId), enabled: Boolean(buildingId) });
  if (!building) return <NoBuilding />;

  const template = () => download('runmypg-tenant-import-template.csv', [
    ['full_name', 'phone', 'room', 'bed', 'monthly_rent', 'security_amount', 'join_date'],
    ['Aarav Sharma', '9876543210', '101', 'A', 8500, 17000, new Date().toISOString().slice(0, 10)],
  ]);
  const exportTenants = () => download(`${building.name}-tenants.csv`, [
    ['full_name', 'phone', 'room_bed', 'status', 'monthly_rent', 'join_date'],
    ...(tenants.data ?? []).map((tenant) => [tenant.full_name, tenant.phone, tenant.bedLabel, tenant.status, tenant.monthly_rent, tenant.join_date]),
  ]);
  const importFile = async (file: File) => {
    try {
      const lines = (await file.text()).trim().split(/\r?\n/);
      const headers = lines.shift()?.split(',').map((value) => value.trim().replace(/^"|"$/g, '')) ?? [];
      let done = 0;
      for (const line of lines) {
        if (!line.trim()) continue;
        const values = line.split(',').map((value) => value.trim().replace(/^"|"$/g, ''));
        const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
        const bed = (occupancy.data ?? []).find((item) => item.status === 'empty' && item.room_name.toLowerCase() === row.room?.toLowerCase() && item.label.toLowerCase() === row.bed?.toLowerCase());
        if (!bed) throw new Error(`Empty bed not found: ${row.room} / ${row.bed}`);
        await addTenant({ bedId: bed.id, fullName: row.full_name, phone: row.phone, monthlyRent: Number(row.monthly_rent), securityAmount: Number(row.security_amount || 0), joinDate: row.join_date });
        done += 1;
        setProgress(`${done} tenant${done === 1 ? '' : 's'} imported…`);
      }
      setProgress(`${done} tenants imported successfully.`);
      queryClient.invalidateQueries({ queryKey: keys.tenants(buildingId) });
      queryClient.invalidateQueries({ queryKey: keys.occupancy(buildingId) });
      toast.success('Import complete.');
    } catch (error) {
      setProgress(error instanceof Error ? error.message : 'Import failed');
      toast.error('Import stopped. Check the CSV row.');
    }
  };

  return <div className={styles.page}>
    <section className={styles.hero}><div><p className={styles.kicker}>Migration tools</p><h2>Move out of Excel—without losing control.</h2><p>Import tenant records with live validation and export clean backups whenever you need them.</p></div></section>
    <section className={styles.panel}>
      <h3>Bulk tenant import & export</h3>
      <p className={styles.sub}>Download the template, fill one tenant per row, then upload it. Room and bed must already exist and be empty.</p>
      <div className={styles.actionRow}><button className={styles.secondary} onClick={template}>Download template</button><button className={styles.secondary} onClick={exportTenants}>Export tenants</button></div>
      <label className={styles.upload}><input type="file" accept=".csv,text/csv" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importFile(file); }} /><strong>Choose tenant CSV</strong><span>Validated against live rooms and empty beds</span></label>
      {progress ? <p className={`${styles.notice} ${progress.includes('successfully') ? styles.success : ''}`}>{progress}</p> : null}
    </section>
  </div>;
}
