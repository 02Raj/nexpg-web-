'use client';

import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { rpcMessage } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../auth.module.css';

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(rpcMessage(err, 'Could not send reset email'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.simplePage}>
      <div className={`panel ${styles.simpleCard}`}>
        <p className="kicker">Account</p>
        <h1 className="display">Reset password</h1>
        {sent ? (
          <p className="bodyMuted">If an account exists for {email}, you will receive a reset link shortly.</p>
        ) : (
          <form className={styles.form} onSubmit={onSubmit}>
            <Field label="Email" value={email} onChange={setEmail} type="email" />
            {error ? <p className={styles.error}>{error}</p> : null}
            <Button type="submit" label={busy ? 'Sending…' : 'Send reset link'} disabled={busy || !email} />
          </form>
        )}
        <Link href="/login" className={styles.link} style={{ display: 'block', marginTop: 16, textAlign: 'center' }}>
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
