'use client';

import { approveApkRequest, fetchApkRequestsForAdmin, type ApkRequest } from '@/api/apk-request';
import { Button } from '@/components/Button';
import { PageSkeleton } from '@/components/Loading';
import { getPublicApkUrl, getPublicApkVersionLabel } from '@/lib/android-app';
import { prettyDate, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { toast } from '@/lib/toast';
import { useToastOnError } from '@/hooks/useToastOnError';
import { getSlowNetworkPollMs } from '@/lib/network';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  const releaseUrl = getPublicApkUrl();
  const releaseVersion = getPublicApkVersionLabel();
  const releaseConfigured = Boolean(releaseUrl);

  const list = useQuery({
    queryKey: keys.apkRequestsAdmin,
    queryFn: fetchApkRequestsForAdmin,
    refetchInterval: getSlowNetworkPollMs(45_000),
  });

  useToastOnError(list.error, 'Could not load requests');

  const approve = useMutation({
    mutationFn: (id: string) => approveApkRequest(id),
    onSuccess: (row) => {
      toast.success(`Approved — ${row.email} can download from /download.`);
      queryClient.invalidateQueries({ queryKey: keys.apkRequestsAdmin });
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not approve')),
  });

  const approveAll = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) {
        await approveApkRequest(id);
      }
    },
    onSuccess: (_, ids) => {
      toast.success(`Approved ${ids.length} owner(s). They can download the same latest APK.`);
      queryClient.invalidateQueries({ queryKey: keys.apkRequestsAdmin });
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not approve all')),
  });

  const pending = (list.data ?? []).filter((r) => r.status === 'pending');
  const rest = (list.data ?? []).filter((r) => r.status !== 'pending');
  const busy = approve.isPending || approveAll.isPending;

  if (list.isLoading) return <PageSkeleton variant="table" />;

  return (
    <div className={layout.panel}>
      <div className={layout.releaseCard}>
        <h2 className={layout.releaseTitle}>Current Android release</h2>
        <p className={layout.hint} style={{ marginBottom: 12 }}>
          One APK for everyone. Owners only get access after you approve — they always download from this
          link. When you ship a new build, upload the file to the <strong>same</strong> Storage path (overwrite);
          no URL change on this page.
        </p>
        {releaseConfigured ? (
          <>
            {releaseVersion ? (
              <p className="small" style={{ margin: '0 0 8px' }}>
                Version label: <strong>{releaseVersion}</strong> (bump{' '}
                <code>NEXT_PUBLIC_ANDROID_APK_VERSION</code> on deploy when you release)
              </p>
            ) : null}
            <p className={layout.releaseUrl} title={releaseUrl}>
              {releaseUrl}
            </p>
          </>
        ) : (
          <p className={layout.releaseMissing}>
            Set <code>NEXT_PUBLIC_ANDROID_APK_URL</code> in production (Vercel) to your public Storage URL, e.g.{' '}
            <code>…/apk-releases/runmypg.apk</code>. Upload the APK there after each EAS build, then approve
            requests below.
          </p>
        )}
      </div>

      <div className={layout.pendingHeader}>
        <h2 className="section">Pending ({pending.length})</h2>
        {pending.length > 1 && releaseConfigured ? (
          <Button
            label={busy ? 'Approving…' : `Approve all (${pending.length})`}
            variant="success"
            disabled={busy}
            onClick={() => approveAll.mutate(pending.map((r) => r.id))}
          />
        ) : null}
      </div>

      {pending.length === 0 ? (
        <p className={layout.empty}>No pending requests — owners appear here after they tap Request on /download.</p>
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
                      label={busy ? 'Approving…' : 'Approve'}
                      variant="success"
                      disabled={busy || !releaseConfigured}
                      onClick={() => approve.mutate(row.id)}
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
