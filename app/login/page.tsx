'use client';

import { Field } from '@/components/Field';
import { rpcMessage } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../auth.module.css';

export default function LoginPage() {
  const { signIn, session, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) router.replace('/dashboard');
  }, [loading, session, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(email, password);
      router.replace('/dashboard');
    } catch (err) {
      setError(rpcMessage(err, 'Could not sign in'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.layout}>
      {/* ── LEFT: Brand Panel ── */}
      <div className={styles.brandPanel}>
        <div>
          <Link href="/" className={styles.brandHeader}>
            <span className={styles.brandMark}>N</span>
            <span className={styles.brandName}>NexPG</span>
          </Link>
          <div className={styles.brandContent}>
            <p className={styles.kicker}>WELCOME BACK</p>
            <h1 className={styles.headline}>Your PG,<br />all in one place.</h1>
            <p className={styles.description}>
              Manage beds, rent, tenants and daily operations from one simple owner console.
            </p>
            
            {/* Real-looking Product Preview */}
            <div className={styles.previewWrap}>
              <div className={styles.previewHeader}>
                <span className={styles.previewTitle}>NexPG</span>
                <span className={styles.previewSubtitle}>Overview · Today</span>
              </div>
              <div className={styles.previewBody}>
                <div className={styles.previewSection}>
                  <p className={styles.previewSectionHeader}>Occupancy</p>
                  <div className={styles.previewMetric}>
                    <span className={styles.previewMetricLabel}>Total Beds</span>
                    <span className={styles.previewMetricValue}>42 / 48</span>
                  </div>
                  <div className={styles.previewBar}>
                    <div className={styles.previewBarFill} style={{ width: '88%' }} />
                  </div>
                </div>
                
                <div className={styles.previewSection}>
                  <p className={styles.previewSectionHeader}>Financials</p>
                  <div className={styles.previewMetric}>
                    <span className={styles.previewMetricLabel}>Rent Pending</span>
                    <span className={`${styles.previewMetricValue} ${styles.highlight}`}>₹12,400</span>
                  </div>
                </div>
              </div>
            </div>
            {/* End Preview */}
            
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <p className={styles.kicker}>SIGN IN</p>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <form className={styles.form} onSubmit={onSubmit}>
            <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="owner@example.com" />
            <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            
            {error ? <p className={styles.error}>{error}</p> : null}
            
            <div className={styles.formRow} style={{ marginTop: 2, marginBottom: 8 }}>
              <Link href="/forgot-password" className={styles.link}>
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={busy || !email || !password}
            >
              {busy ? 'Signing in…' : 'Log in →'}
            </button>
            
            <p className={styles.formFooter}>
              Don't have an account?{' '}
              <Link href="/signup">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
