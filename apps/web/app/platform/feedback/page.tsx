'use client';

import {
  feedbackKindLabel,
  fetchUserFeedback,
  setUserFeedbackStatus,
  type FeedbackStatus,
  type UserFeedback,
} from '@/api/feedback';
import { Button } from '@/components/Button';
import { PageSkeleton } from '@/components/Loading';
import { prettyDateTime, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { toast } from '@/lib/toast';
import { useToastOnError } from '@/hooks/useToastOnError';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import layout from '../platform.module.css';

function StatusBadge({ status }: { status: FeedbackStatus }) {
  const cls =
    status === 'new' ? layout.badgePending : status === 'read' ? layout.badgeReady : layout.badgeDownloaded;
  return <span className={[layout.badge, cls].join(' ')}>{status}</span>;
}

export default function PlatformFeedbackPage() {
  const [filter, setFilter] = useState<'all' | FeedbackStatus>('new');
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useQuery({
    queryKey: keys.userFeedback,
    queryFn: fetchUserFeedback,
  });

  useToastOnError(list.error, 'Could not load feedback — run SQL migration 0007 if the table is missing');

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: FeedbackStatus }) => setUserFeedbackStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.userFeedback });
      queryClient.invalidateQueries({ queryKey: keys.platformDashboard });
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not update')),
  });

  const rows = useMemo(() => {
    const all = list.data ?? [];
    if (filter === 'all') return all;
    return all.filter((r) => r.status === filter);
  }, [list.data, filter]);

  async function openRow(row: UserFeedback) {
    setOpenId(row.id);
    if (row.status === 'new') {
      setStatus.mutate({ id: row.id, status: 'read' });
    }
  }

  if (list.isLoading) return <PageSkeleton variant="table" />;

  const open = rows.find((r) => r.id === openId) ?? list.data?.find((r) => r.id === openId);

  return (
    <div className={layout.panel}>
      <p className={layout.hint}>
        Notes from owners in the <strong>web console</strong> and <strong>Android app</strong>. Use this to fix bugs and
        prioritize features.
      </p>

      <div className={layout.filterRow}>
        {(
          [
            ['new', 'New'],
            ['read', 'Read'],
            ['archived', 'Archived'],
            ['all', 'All'],
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

      {rows.length === 0 ? (
        <p className={layout.empty}>No feedback in this filter.</p>
      ) : (
        <div className={[layout.tableWrap, 'tableWrap'].join(' ')}>
          <table className="dataTable">
            <thead>
              <tr>
                <th>When</th>
                <th>Owner</th>
                <th>Type</th>
                <th>App</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => openRow(row)}
                  style={{ cursor: 'pointer', background: openId === row.id ? 'var(--paper-deep)' : undefined }}
                >
                  <td className="small">{prettyDateTime(row.created_at)}</td>
                  <td className="small">{row.owner_email ?? row.owner_id.slice(0, 8)}</td>
                  <td>{feedbackKindLabel(row.kind)}</td>
                  <td className="small">{row.app_source}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open ? (
        <div className={layout.releaseCard} style={{ marginTop: 20 }}>
          <h2 className={layout.releaseTitle}>{feedbackKindLabel(open.kind)}</h2>
          <p className="small" style={{ margin: '0 0 8px' }}>
            {open.owner_email ?? open.owner_id} · {open.app_source}
            {open.building_id ? ` · building ${open.building_id.slice(0, 8)}…` : ''}
          </p>
          <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 16px', lineHeight: 1.6 }}>{open.message}</p>
          <div className={layout.approveRow}>
            {open.owner_email ? (
              <Button
                label="Email owner"
                variant="primary"
                onClick={() => {
                  window.location.href = `mailto:${open.owner_email}`;
                }}
              />
            ) : null}
            {open.status !== 'archived' ? (
              <Button
                label="Archive"
                variant="secondary"
                disabled={setStatus.isPending}
                onClick={() => setStatus.mutate({ id: open.id, status: 'archived' })}
              />
            ) : (
              <Button
                label="Move to read"
                variant="secondary"
                disabled={setStatus.isPending}
                onClick={() => setStatus.mutate({ id: open.id, status: 'read' })}
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
