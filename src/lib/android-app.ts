import type { ApkRequest } from '@/api/apk-request';

/**
 * Canonical production APK (Supabase Storage public object).
 * Same URL forever — upload a new file to that path when you ship a build.
 * Set once in Vercel: NEXT_PUBLIC_ANDROID_APK_URL
 */
export function getPublicApkUrl() {
  const url = process.env.NEXT_PUBLIC_ANDROID_APK_URL?.trim() ?? '';
  if (!url || url.includes('YOUR_')) return '';
  return url;
}

export function getPublicApkVersionLabel() {
  const v = process.env.NEXT_PUBLIC_ANDROID_APK_VERSION?.trim() ?? '';
  if (!v || v.includes('YOUR_')) return '';
  return v;
}

/** Used on approve — never type a URL per owner. */
export function resolveApkDownloadUrl(override?: string) {
  const url = override?.trim() || getPublicApkUrl();
  if (!url) {
    throw new Error(
      'Production APK is not configured. Set NEXT_PUBLIC_ANDROID_APK_URL on the website (fixed Storage URL), upload the latest .apk to that path, then approve.',
    );
  }
  return url;
}

export function getEffectiveApkDownloadUrl(request: ApkRequest | null | undefined) {
  const approved = request?.status === 'ready' || request?.status === 'downloaded';
  if (approved) {
    return getPublicApkUrl() || request?.download_url || null;
  }
  const publicUrl = getPublicApkUrl();
  if (publicUrl && !request) return publicUrl;
  return null;
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
