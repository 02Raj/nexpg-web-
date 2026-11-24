'use client';

import { Field } from '@/components/Field';
import { rpcMessage } from '@/lib/format';
import { toast } from '@/lib/toast';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sanitizeAuthNext } from '@/lib/auth-redirect';
import styles from '../auth.module.css';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { signIn, signInWithGoogle, session, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = sanitizeAuthNext(searchParams.get('next'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) router.replace(next);
  }, [loading, session, router, next]);

  const onGoogleSignIn = async () => {
    setBusy(true);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('auth_next', next);
      }
      const redirectUrl = `${window.location.origin}/auth/callback`;
      await signInWithGoogle(redirectUrl);
    } catch (err) {
      toast.error(rpcMessage(err, 'Could not start Google sign in'));
      setBusy(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email, password);
      router.replace(next);
    } catch (err) {
      toast.error(rpcMessage(err, 'Could not sign in'));
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
            <span className={styles.brandMark}>R</span>
            <span className={styles.brandName}>RunMyPG</span>
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
                <span className={styles.previewTitle}>RunMyPG</span>
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

          <button
            type="button"
            className={styles.googleBtn}
            onClick={onGoogleSignIn}
            disabled={busy}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className={styles.oauthDivider}>
            <span>or sign in with email</span>
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="owner@example.com" />
            <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            
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
              Don&apos;t have an account?{' '}
              <Link href={`/signup?next=${encodeURIComponent(next)}`}>
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
