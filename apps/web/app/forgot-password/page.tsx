'use client';

import { Field } from '@/components/Field';
import { rpcMessage } from '@/lib/format';
import { toast } from '@/lib/toast';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../auth.module.css';

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await requestPasswordReset(email);
      toast.success('If an account exists, a reset link was sent to your email.');
      setSent(true);
    } catch (err) {
      toast.error(rpcMessage(err, 'Could not send reset email'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.formPanel} style={{ gridColumn: '1 / -1' }}>
        <div className={styles.formCard}>
          <p className={styles.kicker}>ACCOUNT</p>
          <h2 className={styles.formTitle}>Reset password</h2>
          {sent ? (
            <>
              <p className="bodyMuted" style={{ marginBottom: 24 }}>If an account exists for {email}, you will receive a reset link shortly.</p>
              <button type="button" className={styles.submitBtn} onClick={() => window.location.href = '/login'} style={{ width: '100%' }}>
                Back to sign in →
              </button>
            </>
          ) : (
            <form className={styles.form} onSubmit={onSubmit}>
              <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="owner@example.com" />
              <button type="submit" className={styles.submitBtn} disabled={busy || !email}>
                {busy ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}
          {!sent && (
            <p className={styles.formFooter}>
              <Link href="/login">
                Back to sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
