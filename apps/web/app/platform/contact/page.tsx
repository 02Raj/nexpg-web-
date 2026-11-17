'use client';

import {
  CONTACT_TOPICS,
  fetchContactInquiries,
  setContactInquiryStatus,
  type ContactInquiry,
  type ContactInquiryStatus,
} from '@/api/contact';
import { fetchContactReplyDraft } from '@/api/growth-agent';
import { Button } from '@/components/Button';
import { PageSkeleton } from '@/components/Loading';
import { prettyDateTime, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { toast } from '@/lib/toast';
import { useToastOnError } from '@/hooks/useToastOnError';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import layout from '../platform.module.css';

function topicLabel(id: string) {
  return CONTACT_TOPICS.find((t) => t.id === id)?.label ?? id;
}

function StatusBadge({ status }: { status: ContactInquiryStatus }) {
  const cls =
    status === 'new' ? layout.badgePending : status === 'read' ? layout.badgeReady : layout.badgeDownloaded;
  return <span className={[layout.badge, cls].join(' ')}>{status}</span>;
}

export default function PlatformContactPage() {
  const [filter, setFilter] = useState<'all' | ContactInquiryStatus>('new');
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const list = useQuery({
    queryKey: keys.contactInquiries,
    queryFn: fetchContactInquiries,
  });

  useToastOnError(list.error, 'Could not load messages — run SQL migration 0006 if the table is missing');

  const draftMutation = useMutation({
    mutationFn: (id: string) => fetchContactReplyDraft(id),
    onSuccess: (text) => {
      setDraft(text);
      toast.success('Draft ready — edit before you send.');
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not draft reply')),
  });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactInquiryStatus }) =>
      setContactInquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.contactInquiries });
      queryClient.invalidateQueries({ queryKey: keys.platformDashboard });
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not update')),
  });

  const rows = useMemo(() => {
    const all = list.data ?? [];
    if (filter === 'all') return all;
    return all.filter((r) => r.status === filter);
  }, [list.data, filter]);

  async function openRow(row: ContactInquiry) {
    setOpenId(row.id);
    setDraft('');
    if (row.status === 'new') {
      setStatus.mutate({ id: row.id, status: 'read' });
    }
  }

  if (list.isLoading) return <PageSkeleton variant="table" />;

  const open = rows.find((r) => r.id === openId) ?? list.data?.find((r) => r.id === openId);

  return (
    <div className={layout.panel}>
      <p className={layout.hint}>
        Messages from the public <strong>/contact</strong> form. Reply from your runmypg.in inbox or WhatsApp. Opening a
        new message marks it read.
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
        <p className={layout.empty}>No messages in this filter.</p>
      ) : (
        <div className={[layout.tableWrap, 'tableWrap'].join(' ')}>
          <table className="dataTable">
            <thead>
              <tr>
                <th>When</th>
                <th>Name</th>
                <th>Email</th>
                <th>Topic</th>
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
                  <td>{row.full_name}</td>
                  <td className="small">{row.email}</td>
                  <td className="small">{topicLabel(row.topic)}</td>
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
          <h2 className={layout.releaseTitle}>{open.full_name}</h2>
          <p className="small" style={{ margin: '0 0 8px' }}>
            {open.email}
            {open.phone ? ` · ${open.phone}` : ''} · {topicLabel(open.topic)}
          </p>
          <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 16px', lineHeight: 1.6 }}>{open.message}</p>
          <div className={layout.approveRow} style={{ marginBottom: 12 }}>
            <Button
              label={draftMutation.isPending ? 'Drafting…' : 'Draft reply (Sarvam)'}
              variant="secondary"
              disabled={draftMutation.isPending}
              onClick={() => draftMutation.mutate(open.id)}
            />
            <Button
              label="Reply by email"
              variant="primary"
              onClick={() => {
                const subject = encodeURIComponent('Re: Your message to RunMyPG');
                const body = encodeURIComponent(draft || '');
                window.location.href = `mailto:${open.email}?subject=${subject}${draft ? `&body=${body}` : ''}`;
              }}
            />
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
          {draft ? (
            <div>
              <p className="small" style={{ margin: '0 0 8px', fontWeight: 600 }}>AI draft (edit before send)</p>
              <textarea
                readOnly={false}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={10}
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  lineHeight: 1.55,
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                }}
              />
              <button
                type="button"
                className={layout.filterBtn}
                style={{ marginTop: 8 }}
                onClick={() => {
                  void navigator.clipboard.writeText(draft);
                  toast.success('Copied');
                }}
              >
                Copy draft
              </button>
            </div>
          ) : (
            <p className="small" style={{ margin: 0, color: 'var(--ink-muted)' }}>
              Uses Sarvam only when you click Draft — keeps credits low. Set SARVAM_API_KEY on Vercel.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
