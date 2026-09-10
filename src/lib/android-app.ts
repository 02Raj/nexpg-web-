import type { ApkRequest } from '@/api/apk-request';

/** Optional public beta APK — skips manual approval when set in Vercel env. */
export function getPublicApkUrl() {
  const url = process.env.NEXT_PUBLIC_ANDROID_APK_URL?.trim() ?? '';
  if (!url || url.includes('YOUR_')) return '';
  return url;
}

export function getEffectiveApkDownloadUrl(request: ApkRequest | null | undefined) {
  if (request?.download_url && (request.status === 'ready' || request.status === 'downloaded')) {
    return request.download_url;
  }
  return getPublicApkUrl() || null;
}

export type AndroidFlowStep = 'account' | 'request' | 'download' | 'signin';

export function flowStep(
  session: boolean,
  request: ApkRequest | null | undefined,
  hasPublicApk: boolean,
): AndroidFlowStep {
  if (!session) return 'account';
  const url = getEffectiveApkDownloadUrl(request);
  if (url) return 'download';
  if (request?.status === 'pending') return 'request';
  if (hasPublicApk) return 'download';
  return 'request';
}

export const ANDROID_INSTALL_STEPS = [
  'Download the APK file on your Android phone.',
  'Open the file → Allow “Install unknown apps” if Android asks.',
  'Install RunMyPG, then open the app.',
  'Sign in with the same email and password as this website.',
] as const;

export const ANDROID_SYNC_LINES = [
  'One account on web and phone',
  'Beds, rent and bills stay in sync',
  'Change on laptop → shows on phone instantly',
] as const;
