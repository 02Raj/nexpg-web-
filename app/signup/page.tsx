'use client';

import { Field } from '@/components/Field';
import { rpcMessage } from '@/lib/format';
import { toast } from '@/lib/toast';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { sanitizeAuthNext } from '@/lib/auth-redirect';
import styles from '../auth.module.css';

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = sanitizeAuthNext(searchParams.get('next'));
  const loginHref = `/login?next=${encodeURIComponent(returnTo)}`;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signUp(email, password, fullName);
      toast.success('Account created — check your email to confirm.');
      setDone(true);
    } catch (err) {
      toast.error(rpcMessage(err, 'Could not create account'));
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className={styles.layout}>
        <div className={styles.formPanel} style={{ gridColumn: '1 / -1' }}>
          <div className={styles.formCard} style={{ textAlign: 'center' }}>
            <h1 className={styles.formTitle}>Check your email</h1>
            <p className="bodyMuted" style={{ marginBottom: 24 }}>
              Confirm your address, then sign in on web or mobile.
            </p>
            <button type="button" className={styles.submitBtn} onClick={() => router.push(loginHref)} style={{ width: '100%' }}>
              Go to sign in →
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <p className={styles.kicker}>OWNER CONSOLE</p>
            <h1 className={styles.headline}>Set up your PG<br />in a few minutes.</h1>
            <p className={styles.description}>
              Add your property, beds and rooms. Then let RunMyPG handle the daily details of running your business.
            </p>
            <ul className={styles.benefitList}>
              <li className={styles.benefitItem}>
                <span className={styles.benefitCheck}>✓</span>
                Know occupancy at a glance
              </li>
              <li className={styles.benefitItem}>
                <span className={styles.benefitCheck}>✓</span>
                Keep rent and bills organised
              </li>
              <li className={styles.benefitItem}>
                <span className={styles.benefitCheck}>✓</span>
                Manage multiple properties
              </li>
            </ul>
            
            {/* Real-looking Product Preview */}
            <div className={styles.previewWrap}>
              <div className={styles.previewHeader}>
                <span className={styles.previewTitle}>RunMyPG</span>
                <span className={styles.previewSubtitle}>Bed Status</span>
              </div>
              <div className={styles.previewBody}>
                <div className={styles.previewSection}>
                  <p className={styles.previewSectionHeader}>Room 101</p>
                  <div className={styles.previewRow}>
                    <span className={styles.previewRoomLabel}>3 Beds</span>
                    <div className={styles.previewDots}>
                      <span className={`${styles.previewDot} ${styles.previewDotFill}`} />
                      <span className={`${styles.previewDot} ${styles.previewDotFill}`} />
                      <span className={`${styles.previewDot} ${styles.previewDotFill}`} />
                    </div>
                  </div>
                </div>
                <div className={styles.previewSection}>
                  <p className={styles.previewSectionHeader}>Room 102</p>
                  <div className={styles.previewRow}>
                    <span className={styles.previewRoomLabel}>3 Beds</span>
                    <div className={styles.previewDots}>
                      <span className={`${styles.previewDot} ${styles.previewDotFill}`} />
                      <span className={`${styles.previewDot} ${styles.previewDotFill}`} />
                      <span className={`${styles.previewDot} ${styles.previewDotEmpty}`} />
                    </div>
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
          <p className={styles.kicker}>NEW OWNER</p>
          <h2 className={styles.formTitle}>Create account</h2>
          <form className={styles.form} onSubmit={onSubmit}>
            <Field label="Your name" value={fullName} onChange={setFullName} placeholder="Rahul Sharma" />
            <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="owner@example.com" />
            <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={busy || fullName.length < 2 || !email || password.length < 6}
            >
              {busy ? 'Creating account…' : 'Create account →'}
            </button>
            
            <p className={styles.formFooter}>
              Already have an account?{' '}
              <Link href={loginHref}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
