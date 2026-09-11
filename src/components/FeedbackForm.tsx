'use client';

import {
  FEEDBACK_KINDS,
  submitUserFeedback,
  type FeedbackAppSource,
  type FeedbackKind,
} from '@/api/feedback';
import { Button } from '@/components/Button';
import { rpcMessage } from '@/lib/format';
import { toast } from '@/lib/toast';
import { useBuilding } from '@/providers/BuildingProvider';
import { useState } from 'react';
import styles from './feedback-form.module.css';

type Props = {
  appSource: FeedbackAppSource;
  onSent?: () => void;
};

export function FeedbackForm({ appSource, onSent }: Props) {
  const { building } = useBuilding();
  const [kind, setKind] = useState<FeedbackKind>('problem');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const selected = FEEDBACK_KINDS.find((k) => k.id === kind)!;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 5) {
      toast.error('Write a few words so we understand.');
      return;
    }
    setBusy(true);
    try {
      await submitUserFeedback({
        kind,
        message,
        buildingId: building?.id,
        appSource,
      });
      setSent(true);
      setMessage('');
      toast.success('Thanks — we read every note.');
      onSent?.();
    } catch (err) {
      toast.error(rpcMessage(err, 'Could not send. Try again or WhatsApp us.'));
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>Got it</h2>
        <p className={styles.lead}>
          Your feedback is in our inbox. We use it to fix bugs and plan improvements — no auto-reply, but we do read
          it.
        </p>
        <Button label="Send another" variant="secondary" onClick={() => setSent(false)} />
      </div>
    );
  }

  return (
    <form className={styles.card} onSubmit={onSubmit}>
      <h2 className={styles.title}>What is this about?</h2>
      <p className={styles.lead}>One tap, then a short note. Takes under a minute.</p>

      <div className={styles.chips} role="group" aria-label="Feedback type">
        {FEEDBACK_KINDS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={[styles.chip, kind === item.id ? styles.chipOn : ''].filter(Boolean).join(' ')}
            onClick={() => setKind(item.id)}
            aria-pressed={kind === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className={styles.chipHint}>{selected.hint}</p>

      <label className={styles.field}>
        <span>Your note</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
          rows={5}
          placeholder={
            kind === 'bug'
              ? 'What happened? Which screen?'
              : kind === 'feature'
                ? 'What would help your PG day-to-day?'
                : kind === 'ux'
                  ? 'What felt confusing or slow?'
                  : 'What were you trying to do?'
          }
          required
        />
      </label>

      {building ? <p className={styles.meta}>Linked to PG: {building.name}</p> : null}

      <Button type="submit" label={busy ? 'Sending…' : 'Send feedback'} disabled={busy} />
    </form>
  );
}
