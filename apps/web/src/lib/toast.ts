export type ToastVariant = 'success' | 'error' | 'info';

export type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

let seq = 0;
let items: ToastItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeToasts(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToastsSnapshot() {
  return items;
}

export function dismissToast(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

function push(message: string, variant: ToastVariant, durationMs: number) {
  const trimmed = message.trim();
  if (!trimmed) return;

  const item: ToastItem = { id: ++seq, message: trimmed, variant };
  items = [...items, item].slice(-4);
  emit();

  if (typeof window !== 'undefined') {
    window.setTimeout(() => dismissToast(item.id), durationMs);
  }
}

export const toast = {
  success: (message: string) => push(message, 'success', 4500),
  error: (message: string) => push(message, 'error', 6500),
  info: (message: string) => push(message, 'info', 5000),
};
