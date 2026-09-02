'use client';

import { fetchMyApkRequest, markApkDownloaded, submitApkRequest } from '@/api/apk-request';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import styles from './download.module.css';

const POINTS = [
  'Same login as web — your PG data stays in sync',
  'Beds, rent, bills, security, and vacate on the go',
  'Built for owners in Delhi NCR, Noida, Gurgaon, Bangalore, Pune',
];

export default function DownloadPage() {
  const { session, user } = useAuth();
  const meta = user?.user_metadata as { full_name?: string } | undefined;
  const [name, setName] = useState(meta?.full_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');

  const existing = useQuery({
    queryKey: keys.apkRequest,
    queryFn: fetchMyApkRequest,
    enabled: Boolean(session),
  });

  const submit = useMutation({
    mutationFn: () => submitApkRequest({ fullName: name, email, phone }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.apkRequest }),
  });

  const req = existing.data;

  const onDownload = async () => {
    if (!req?.download_url) return;
    window.open(req.download_url, '_blank');
    await markApkDownloaded(req.id);
    queryClient.invalidateQueries({ queryKey: keys.apkRequest });
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.leftCol}>
          <div>
            <p className="kicker" style={{ marginBottom: 12 }}>Android app</p>
            <h1 className="display" style={{ marginBottom: 16 }}>Manage your PG from your pocket.</h1>
            <p className="bodyMuted" style={{ fontSize: 16, maxWidth: 500, lineHeight: 1.6 }}>
              NexPG is your desktop web console for serious PG operations.
              Use the Android companion app for on-site daily operations.
            </p>
          </div>
          
          <ul className={styles.card} style={{ marginTop: 24 }}>
            {POINTS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          
          <Link href="/dashboard" className={styles.continue}>
            ← Continue to web console
          </Link>
        </div>

        <div>
          {!session ? (
            <div className={styles.box}>
              <h2 className="section">Sign in to request</h2>
              <p className="bodyMuted">We link the APK to your owner account so web and mobile share the same backend.</p>
              <Link href="/login">
                <Button label="Sign in" />
              </Link>
            </div>
          ) : req?.status === 'ready' && req.download_url ? (
            <div className={styles.box}>
              <h2 className="section">Your download is ready</h2>
              <p className="bodyMuted">Install on Android, then sign in with the same email.</p>
              <Button label="Download APK" onClick={onDownload} />
            </div>
          ) : req?.status === 'pending' ? (
            <div className={styles.box}>
              <h2 className="section">Request received</h2>
              <p className="bodyMuted">Download link will be emailed to {req.email} within 24 hours.</p>
            </div>
          ) : (
            <div className={styles.box}>
              <h2 className="section">Request Android APK</h2>
              <Field label="Your name" value={name} onChange={setName} />
              <Field label="Email" value={email} onChange={setEmail} type="email" />
              <Field label="Phone (optional)" value={phone} onChange={setPhone} maxLength={10} />
              {submit.error ? <p className={styles.error}>{rpcMessage(submit.error)}</p> : null}
              <div style={{ marginTop: 8 }}>
                <Button
                  label={submit.isPending ? 'Submitting…' : 'Request APK'}
                  onClick={() => submit.mutate()}
                  disabled={submit.isPending || name.length < 2 || !email.includes('@')}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
