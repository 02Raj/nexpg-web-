'use client';

import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { rpcMessage } from '@/lib/format';
import { toast } from '@/lib/toast';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../../auth.module.css';

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updatePassword(password);
      toast.success('Password updated.');
      router.replace('/dashboard');
    } catch (err) {
      toast.error(rpcMessage(err, 'Could not update password'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className="display">New password</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <Field label="Password" value={password} onChange={setPassword} type="password" />
        <Button type="submit" label={busy ? 'Saving…' : 'Update password'} disabled={busy || password.length < 6} />
      </form>
    </div>
  );
}
