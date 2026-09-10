/** Safe internal path for post-login navigation. */
export function sanitizeAuthNext(next: string | null | undefined, fallback = '/dashboard') {
  if (!next) return fallback;
  if (!next.startsWith('/') || next.startsWith('//')) return fallback;
  if (next.startsWith('/auth/')) return fallback;
  return next;
}
