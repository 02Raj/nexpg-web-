'use client';

import { approveApkRequest, fetchApkRequestsForAdmin, type ApkRequest } from '@/api/apk-request';
import { Button } from '@/components/Button';
import { LoadingCenter } from '@/components/Loading';
import { getPublicApkUrl } from '@/lib/android-app';
import { prettyDate, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { toast } from '@/lib/toast';
import { useToastOnError } from '@/hooks/useToastOnError';
import { getSlowNetworkPollMs } from '@/lib/network';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import layout from '../platform.module.css';

function StatusBadge({ status }: { status: ApkRequest['status'] }) {
  const cls =
    status === 'pending'
      ? layout.badgePending
      : status === 'ready'
        ? layout.badgeReady
        : layout.badgeDownloaded;
  return <span className={[layout.badge, cls].join(' ')}>{status.replace('_', ' ')}</span>;
}

export default function PlatformApkRequestsPage() {
  const defaultApkUrl = getPublicApkUrl();
  const [apkUrl, setApkUrl] = useState(defaultApkUrl);

  const list = useQuery({
    queryKey: keys.apkRequestsAdmin,
    queryFn: fetchApkRequestsForAdmin,
    refetchInterval: getSlowNetworkPollMs(45_000),
  });

  useToastOnError(list.error, 'Could not load requests');

  const approve = useMutation({
    mutationFn: ({ id, url }: { id: string; url: string }) => approveApkRequest(id, url),
    onSuccess: (row) => {
      toast.success(`Approved — ${row.email} can download from their Mobile app page.`);
      queryClient.invalidateQueries({ queryKey: keys.apkRequestsAdmin });
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not approve')),
  });

  const pending = (list.data ?? []).filter((r) => r.status === 'pending');
  const rest = (list.data ?? []).filter((r) => r.status !== 'pending');

  if (list.isLoading) return <LoadingCenter message="Loading requests…" />;

  return (
    <div className={layout.panel}>
      <p className={layout.hint}>
        When you approve, the owner sees <strong>Download Android app</strong> on{' '}
        <strong>/download</strong> (same screen where they requested). Set the APK link below once — it is used for
        every approval.
      </p>

      <label className="small" htmlFor="apk-url">
        APK download URL
      </label>
      <input
        id="apk-url"
        className={layout.urlField}
        style={{ width: '100%', marginTop: 6, marginBottom: 24 }}
        value={apkUrl}
        onChange={(e) => setApkUrl(e.target.value)}
        placeholder="https://.../runmypg.apk"
      />

      <h2 className="section">Pending ({pending.length})</h2>
      {pending.length === 0 ? (
        <p className={layout.empty}>No pending requests — owners will appear here after they tap Request on /download.</p>
      ) : (
        <div className={[layout.tableWrap, 'tableWrap'].join(' ')}>
          <table className="dataTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Requested</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((row) => (
                <tr key={row.id}>
                  <td>{row.full_name}</td>
                  <td>{row.email}</td>
                  <td className="small">{row.phone ?? '—'}</td>
                  <td className="small">{prettyDate(row.requested_at.slice(0, 10))}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                  <td>
                    <Button
                      label={approve.isPending ? 'Approving…' : 'Approve'}
                      variant="success"
                      disabled={approve.isPending || !apkUrl.trim()}
                      onClick={() => approve.mutate({ id: row.id, url: apkUrl.trim() })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rest.length > 0 ? (
        <>
          <h2 className="section" style={{ marginTop: 32 }}>
            Earlier requests
          </h2>
          <div className={[layout.tableWrap, 'tableWrap'].join(' ')}>
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Ready</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((row) => (
                  <tr key={row.id}>
                    <td>{row.full_name}</td>
                    <td>{row.email}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="small">
                      {row.download_ready_at ? prettyDate(row.download_ready_at.slice(0, 10)) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
