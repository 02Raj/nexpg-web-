'use client';

import { fetchPlatformOwners, setOwnerActive, type PlatformOwnerRow } from '@/api/platform-admin';
import { Button } from '@/components/Button';
import { LoadingCenter } from '@/components/Loading';
import { prettyDate, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { toast } from '@/lib/toast';
import { useToastOnError } from '@/hooks/useToastOnError';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import layout from '../platform.module.css';

function StatusPill({ active }: { active: boolean }) {
  return (
    <span className={[layout.badge, active ? layout.badgeReady : layout.badgeInactive].join(' ')}>
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

export default function PlatformOwnersPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'new'>('all');

  const list = useQuery({
    queryKey: keys.platformOwners,
    queryFn: fetchPlatformOwners,
  });

  useToastOnError(list.error, 'Could not load owners');

  const toggle = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => setOwnerActive(id, active),
    onSuccess: (_, { active }) => {
      toast.success(active ? 'Owner reactivated.' : 'Owner set inactive (soft — data kept).');
      queryClient.invalidateQueries({ queryKey: keys.platformOwners });
      queryClient.invalidateQueries({ queryKey: keys.platformDashboard });
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not update owner')),
  });

  const rows = useMemo(() => {
    const all = list.data ?? [];
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    if (filter === 'active') return all.filter((r) => r.is_active);
    if (filter === 'inactive') return all.filter((r) => !r.is_active);
    if (filter === 'new') return all.filter((r) => new Date(r.created_at).getTime() >= weekAgo);
    return all;
  }, [list.data, filter]);

  if (list.isLoading) return <LoadingCenter message="Loading PG owners…" />;

  return (
    <div className={layout.panel}>
      <p className={layout.hint}>
        All RunMyPG owner accounts. <strong>Deactivate</strong> is soft only — login is blocked but PG data stays in
        the database. No hard delete.
      </p>

      <div className={layout.filterRow}>
        {(
          [
            ['all', 'All'],
            ['active', 'Active'],
            ['inactive', 'Inactive'],
            ['new', 'New (7d)'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={[layout.filterBtn, filter === key ? layout.filterBtnActive : ''].filter(Boolean).join(' ')}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={[layout.tableWrap, 'tableWrap'].join(' ')}>
        <table className="dataTable">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Joined</th>
              <th>Properties</th>
              <th>Tenants</th>
              <th>APK</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className={layout.empty}>
                  No owners match this filter.
                </td>
              </tr>
            ) : (
              rows.map((row: PlatformOwnerRow) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.full_name || '—'}</strong>
                    <br />
                    <span className="small">{row.email}</span>
                  </td>
                  <td className="small">{prettyDate(row.created_at.slice(0, 10))}</td>
                  <td>{row.building_count}</td>
                  <td>{row.active_tenant_count}</td>
                  <td className="small">{row.latest_apk_status ?? '—'}</td>
                  <td>
                    <StatusPill active={row.is_active} />
                  </td>
                  <td>
                    {row.is_active ? (
                      <Button
                        label={toggle.isPending ? '…' : 'Deactivate'}
                        variant="ghost"
                        disabled={toggle.isPending}
                        onClick={() => toggle.mutate({ id: row.id, active: false })}
                      />
                    ) : (
                      <Button
                        label={toggle.isPending ? '…' : 'Reactivate'}
                        variant="success"
                        disabled={toggle.isPending}
                        onClick={() => toggle.mutate({ id: row.id, active: true })}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
