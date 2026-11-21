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
  const buildingName = building?.name ?? 'our PG';
  const [progress, setProgress] = useState('');
  const tenants = useQuery({ queryKey: keys.tenants(buildingId), queryFn: () => fetchTenantDirectory(buildingId), enabled: Boolean(buildingId) });
  const occupancy = useQuery({ queryKey: keys.occupancy(buildingId), queryFn: () => fetchOccupancy(buildingId), enabled: Boolean(buildingId) });

  const activeTenants = (tenants.data ?? []).filter((t) => t.status === 'active');
  const activePhones = activeTenants
    .map((t) => t.phone?.replace(/\D/g, ''))
    .filter(Boolean)
    .map((p) => (p.length === 10 ? `+91${p}` : `+${p}`));

  const [noticeText, setNoticeText] = useState(
    `Notice for residents of ${buildingName}: Water supply will be temporarily unavailable today from 2:00 PM to 5:00 PM due to overhead tank maintenance. Kindly store water accordingly.`
  );
  const [copied, setCopied] = useState(false);

  if (!building) return <NoBuilding />;

  const copyPhones = () => {
    if (activePhones.length === 0) return toast.error('No active tenants with phone numbers.');
    void navigator.clipboard.writeText(activePhones.join(', '));
    setCopied(true);
    toast.success(`Copied ${activePhones.length} phone numbers to clipboard!`);
    setTimeout(() => setCopied(false), 3000);
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(noticeText)}`;
    window.open(url, '_blank');
  };

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
    <section className={styles.hero}><div><p className={styles.kicker}>Operations & Migration tools</p><h2>Manage your PG operations without chaos.</h2><p>Send instant announcements to all occupants and manage bulk tenant records.</p></div></section>
    
    <section className={styles.panel}>
      <h3>📢 Broadcast notice to tenants</h3>
      <p className={styles.sub}>{activeTenants.length} active occupant{activeTenants.length === 1 ? '' : 's'} in {buildingName}. Pick a quick template or compose your notice.</p>
      
      <div className={styles.filters}>
        <button type="button" onClick={() => setNoticeText(`Notice for residents of ${buildingName}: Water supply will be temporarily unavailable today from 2:00 PM to 5:00 PM due to overhead tank maintenance. Kindly store water accordingly.`)}>💧 Water Supply</button>
        <button type="button" onClick={() => setNoticeText(`Notice for residents of ${buildingName}: Electrical maintenance and generator servicing scheduled today. Power may be intermittent for 1-2 hours.`)}>⚡ Power / Generator</button>
        <button type="button" onClick={() => setNoticeText(`Notice for residents of ${buildingName}: Wi-Fi fiber router is undergoing routine maintenance. Speeds may vary for the next 30 minutes.`)}>📶 Wi-Fi Maintenance</button>
        <button type="button" onClick={() => setNoticeText(`Notice for residents of ${buildingName}: A friendly reminder that main gate closes at 10:30 PM. Please inform the caretaker in advance for late returns.`)}>🚪 Gate Timings</button>
        <button type="button" onClick={() => setNoticeText(`Notice for residents of ${buildingName}: Monthly rent is due. Please clear your dues using UPI or cash with the caretaker today. Thank you.`)}>💵 Rent Reminder</button>
      </div>

      <div className={styles.field} style={{ marginTop: '12px' }}>
        <span>Notice message</span>
        <textarea rows={4} value={noticeText} onChange={(e) => setNoticeText(e.target.value)} />
      </div>

      <div className={styles.actionRow} style={{ marginTop: '14px' }}>
        <button type="button" className={styles.secondary} onClick={copyPhones}>
          {copied ? '✓ Copied numbers!' : `📋 Copy all ${activePhones.length} phone numbers`}
        </button>
        <button type="button" className={styles.primary} style={{ padding: '0 18px' }} onClick={openWhatsApp}>
          Open in WhatsApp
        </button>
      </div>
    </section>

    <section className={styles.panel}>
      <h3>Bulk tenant import & export</h3>
      <p className={styles.sub}>Download the template, fill one tenant per row, then upload it. Room and bed must already exist and be empty.</p>
      <div className={styles.actionRow}><button className={styles.secondary} onClick={template}>Download template</button><button className={styles.secondary} onClick={exportTenants}>Export tenants</button></div>
      <label className={styles.upload}><input type="file" accept=".csv,text/csv" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importFile(file); }} /><strong>Choose tenant CSV</strong><span>Validated against live rooms and empty beds</span></label>
      {progress ? <p className={`${styles.notice} ${progress.includes('successfully') ? styles.success : ''}`}>{progress}</p> : null}
    </section>
  </div>;
}
