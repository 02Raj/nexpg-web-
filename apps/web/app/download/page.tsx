'use client';

import { fetchMyApkRequest, markApkDownloaded, submitApkRequest } from '@/api/apk-request';
import { Button } from '@/components/Button';
import { PageSkeleton } from '@/components/Loading';
import {
  ANDROID_INSTALL_STEPS,
  ANDROID_APP_POINTS,
  flowStep,
  getEffectiveApkDownloadUrl,
  getPublicApkUrl,
} from '@/lib/android-app';
import { rpcMessage } from '@/lib/format';
import { toast } from '@/lib/toast';
import { keys, queryClient } from '@/lib/query';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, Circle, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { getSlowNetworkPollMs } from '@/lib/network';
import { useMemo, useCallback, useEffect, useRef } from 'react';
import styles from './download.module.css';

const STEPS = [
  { id: 'account', label: 'Your account' },
  { id: 'request', label: 'Get access' },
  { id: 'download', label: 'Install app' },
  { id: 'signin', label: 'Same login' },
] as const;

export default function DownloadPage() {
  const { session, user, loading: authLoading } = useAuth();
  const meta = user?.user_metadata as { full_name?: string } | undefined;
  const publicApk = getPublicApkUrl();
  const hasPublicApk = Boolean(publicApk);

  const existing = useQuery({
    queryKey: keys.apkRequest,
    queryFn: fetchMyApkRequest,
    enabled: Boolean(session),
    refetchInterval: (query) =>
      query.state.data?.status === 'pending' ? getSlowNetworkPollMs(25_000) : false,
  });

  const req = existing.data;
  const downloadUrl = getEffectiveApkDownloadUrl(req);
  const prevStatus = useRef<string | undefined>(undefined);

  useEffect(() => {
    const status = req?.status;
    if (prevStatus.current === 'pending' && status === 'ready') {
      toast.success('Approved! Your Android app is ready — tap Download below.');
    }
    prevStatus.current = status;
  }, [req?.status]);

  const step = flowStep(Boolean(session), req, hasPublicApk);
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const displayName = meta?.full_name?.trim() || user?.email?.split('@')[0] || 'Owner';
  const displayEmail = user?.email ?? '';

  const submit = useMutation({
    mutationFn: () =>
      submitApkRequest({
        fullName: displayName,
        email: displayEmail,
      }),
    onSuccess: (row) => {
      if (row.status === 'pending') {
        toast.success('Request sent. Stay on this page — Download will appear here after approval.');
      } else if (row.status === 'ready') {
        toast.success('Your Android app is ready to download.');
      } else {
        toast.info('You already have access to the Android app.');
      }
      queryClient.invalidateQueries({ queryKey: keys.apkRequest });
    },
    onError: (err) => toast.error(rpcMessage(err, 'Could not submit request')),
  });

  const onDownload = useCallback(async () => {
    const url = downloadUrl;
    if (!url) {
      toast.error('Download link is not ready yet. Please wait or contact support.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success('Download started. Follow the steps below to install.');
    if (req?.id && req.status === 'ready') {
      try {
        await markApkDownloaded(req.id);
        queryClient.invalidateQueries({ queryKey: keys.apkRequest });
      } catch {
        /* non-blocking */
      }
    }
  }, [downloadUrl, req?.id, req?.status]);

  const primaryAction = useMemo(() => {
    if (!session) return null;
    if (downloadUrl) {
      return { label: 'Download Android app', onClick: onDownload };
    }
    if (req?.status === 'pending') {
      return null;
    }
    if (hasPublicApk) {
      return { label: 'Download Android app', onClick: onDownload };
    }
    return {
      label: submit.isPending ? 'Sending request…' : 'Request Android app — free',
      onClick: () => submit.mutate(),
      disabled: submit.isPending || !displayEmail.includes('@'),
    };
  }, [session, downloadUrl, req?.status, hasPublicApk, submit, displayEmail, onDownload]);

  const canDownload = Boolean(downloadUrl && session);
  const isPending = req?.status === 'pending' && !downloadUrl;

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <Link href={session ? '/dashboard' : '/'} className={styles.backLink}>
          {session ? '← Back to dashboard' : '← Back to home'}
        </Link>
      </header>

      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className="kicker">PG owner Android app</p>
          <h1 className="display">Android app for PG owners.</h1>
          <p className={styles.lead}>
            Use the web console for the full dashboard. Use the Android app at the property — occupancy, tenants, rent and bills.
          </p>
          <ul className={styles.syncList}>
            {ANDROID_APP_POINTS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <Smartphone size={22} aria-hidden />
            <h2 className="section">How to get the app</h2>
          </div>

          <ol className={styles.stepper} aria-label="Android app steps">
            {STEPS.map((s, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex;
              return (
                <li
                  key={s.id}
                  className={[styles.step, done ? styles.stepDone : '', active ? styles.stepActive : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className={styles.stepIcon} aria-hidden>
                    {done ? <Check size={14} strokeWidth={3} /> : <Circle size={10} />}
                  </span>
                  <span className={styles.stepLabel}>{s.label}</span>
                </li>
              );
            })}
          </ol>

          {authLoading || (session && existing.isLoading) ? (
            <PageSkeleton variant="download" />
          ) : !session ? (
            <div className={styles.actionBlock}>
              <p className={styles.actionLead}>Step 1 — use the same account you use on this website.</p>
              <div className={styles.actionRow}>
                <Link href="/login?next=/download">
                  <Button label="Sign in" />
                </Link>
                <Link href="/signup?next=/download">
                  <Button label="Create free account" variant="secondary" />
                </Link>
              </div>
            </div>
          ) : canDownload ? (
            <div className={styles.actionBlock}>
              <p className={styles.actionLead}>
                {req?.status === 'downloaded' ? (
                  <>
                    <strong>Installed before?</strong> Download again for <strong>{displayEmail}</strong>.
                  </>
                ) : (
                  <>
                    <strong>Approved</strong> — download the Android app for <strong>{displayEmail}</strong>.
                  </>
                )}
              </p>
              <Button label="Download Android app" onClick={onDownload} />
              <p className={styles.hint}>Same page — no new request needed after approval.</p>
            </div>
          ) : isPending ? (
            <div className={styles.actionBlock}>
              <p className={styles.actionLead}>
                We received your request for <strong>{displayEmail}</strong>.
              </p>
              <p className="bodyMuted">
                Download button will appear on <strong>this same page</strong> when we approve your request. Keep
                this tab open or come back to Mobile app later — no need to request again.
              </p>
              <p className={styles.hint}>Checking for updates every {Math.round(getSlowNetworkPollMs(25_000) / 1000)} seconds…</p>
            </div>
          ) : (
            <div className={styles.actionBlock}>
              <p className={styles.actionLead}>
                Signed in as <strong>{displayEmail}</strong>
                {hasPublicApk && !req ? ' — beta download is open.' : null}
              </p>
              {primaryAction ? (
                <Button
                  label={primaryAction.label}
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                />
              ) : null}
            </div>
          )}

          {(downloadUrl || step === 'download' || step === 'signin') && session ? (
            <div className={styles.installBox}>
              <p className={styles.installTitle}>After download — 4 quick steps</p>
              <ol className={styles.installList}>
                {ANDROID_INSTALL_STEPS.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            </div>
          ) : null}

          {session && downloadUrl ? (
            <button type="button" className={styles.linkBtn} onClick={onDownload}>
              Download again
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
