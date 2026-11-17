export function inr(value: number | string | null | undefined) {
  const number = typeof value === 'string' ? Number(value) : (value ?? 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(number);
}

export function inrExact(value: number | string | null | undefined) {
  const number = typeof value === 'string' ? Number(value) : (value ?? 0);
  const fraction = Number.isInteger(number) ? 0 : 2;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: fraction,
    maximumFractionDigits: 2,
  }).format(number);
}

export function todayIST(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function monthLabel(period: string) {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(`${period}T00:00:00+05:30`));
}

export function prettyDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(`${iso}T00:00:00+05:30`));
}

export function prettyDateTime(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso));
}

export function rpcMessage(error: unknown, fallback = 'Something went wrong') {
  if (error && typeof error === 'object' && 'message' in error) {
    const raw = String((error as { message: string }).message);
    const cleaned = raw.replace(/^.*ERROR:\s*/i, '').split('\n')[0];
    return cleaned || fallback;
  }
  return fallback;
}
