'use client';

import Link from 'next/link';
import { fetchTenantDirectory } from '@/api/nexpg';
import { EmptyState } from '@/components/EmptyState';
import { PageSkeleton } from '@/components/Loading';
import { NoBuilding } from '@/components/NoBuilding';
import { inrExact } from '@/lib/format';
import { keys } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useQuery } from '@tanstack/react-query';
import { Search, UserRoundPlus, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import styles from './tenants.module.css';

export default function TenantsPage() {
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'vacated'>('active');
  const tenants = useQuery({
    queryKey: keys.tenants(buildingId),
    queryFn: () => fetchTenantDirectory(buildingId),
    enabled: Boolean(buildingId),
  });

  const filtered = useMemo(() => (tenants.data ?? []).filter((tenant) => {
    const matchesStatus = status === 'all' || tenant.status === status;
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || `${tenant.full_name} ${tenant.phone} ${tenant.bedLabel}`.toLowerCase().includes(needle);
    return matchesStatus && matchesQuery;
  }), [query, status, tenants.data]);

  if (!building) return <NoBuilding />;
  if (tenants.isLoading) return <PageSkeleton variant="table" />;

  const all = tenants.data ?? [];
  const activeCount = all.filter((tenant) => tenant.status === 'active').length;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Resident directory</p>
          <h2>{activeCount} active tenant{activeCount === 1 ? '' : 's'}</h2>
          <p>Profiles, room assignments, rent and stay status in one searchable view.</p>
        </div>
        <Link href="/tenant/new" className={styles.primary}><UserRoundPlus size={17} /> Add tenant</Link>
      </div>

      <div className={styles.toolbar}>
        <label className={styles.search}><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, phone or room" /></label>
        <div className={styles.tabs}>
          {(['active', 'vacated', 'all'] as const).map((value) => <button type="button" key={value} className={status === value ? styles.tabActive : ''} onClick={() => setStatus(value)}>{value === 'all' ? 'All' : value === 'active' ? 'Active' : 'Moved out'}</button>)}
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState icon={<Users size={28} />} title="No tenants found" message="Try another filter or add your first tenant." /> : (
        <div className={styles.grid}>
          {filtered.map((tenant) => (
            <Link href={`/tenant/${tenant.id}`} className={styles.card} key={tenant.id}>
              <div className={styles.avatar}>{tenant.full_name.slice(0, 1).toUpperCase()}</div>
              <div className={styles.cardBody}>
                <div className={styles.cardTop}><h3>{tenant.full_name}</h3><span className={tenant.status === 'active' ? styles.active : styles.vacated}>{tenant.status === 'active' ? 'Active' : 'Moved out'}</span></div>
                <p>{tenant.bedLabel}</p>
                <div className={styles.meta}><span>{tenant.phone}</span><strong>{inrExact(tenant.monthly_rent)} / mo</strong></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
