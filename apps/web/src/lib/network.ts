/** Tune intervals for slow / save-data connections (India 2G–3G). */
export function getSlowNetworkPollMs(baseMs: number): number {
  if (typeof navigator === 'undefined') return baseMs;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  if (conn?.saveData) return Math.max(baseMs, 90_000);
  const type = conn?.effectiveType;
  if (type === 'slow-2g' || type === '2g') return Math.max(baseMs, 60_000);
  if (type === '3g') return Math.max(baseMs, 45_000);
  return baseMs;
}

export function isLikelySlowNetwork(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  if (conn?.saveData) return true;
  const type = conn?.effectiveType;
  return type === 'slow-2g' || type === '2g' || type === '3g';
}
