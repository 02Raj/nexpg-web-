'use client';

import { dismissToast, getToastsSnapshot, subscribeToasts, type ToastItem } from '@/lib/toast';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import styles from './toast.module.css';

function ToastIcon({ variant }: { variant: ToastItem['variant'] }) {
  const size = 20;
  if (variant === 'success') return <CheckCircle2 size={size} className={styles.icon} aria-hidden />;
  if (variant === 'error') return <AlertCircle size={size} className={styles.icon} aria-hidden />;
  return <Info size={size} className={styles.icon} aria-hidden />;
}

function ToastRow({ item }: { item: ToastItem }) {
  return (
    <div
      className={[styles.toast, styles[item.variant]].join(' ')}
      role={item.variant === 'error' ? 'alert' : 'status'}
      aria-live={item.variant === 'error' ? 'assertive' : 'polite'}
    >
      <ToastIcon variant={item.variant} />
      <p className={styles.message}>{item.message}</p>
      <button type="button" className={styles.dismiss} onClick={() => dismissToast(item.id)} aria-label="Dismiss">
        <X size={18} />
      </button>
    </div>
  );
}

export function ToastViewport() {
  const toasts = useSyncExternalStore(subscribeToasts, getToastsSnapshot, getToastsSnapshot);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.viewport} aria-label="Notifications">
      {toasts.map((item) => (
        <ToastRow key={item.id} item={item} />
      ))}
    </div>
  );
}
