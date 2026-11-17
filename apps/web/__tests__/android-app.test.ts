import {
  getEffectiveApkDownloadUrl,
  getPublicApkUrl,
  resolveApkDownloadUrl,
} from '@/lib/android-app';
import type { ApkRequest } from '@/api/apk-request';

const R2 = 'https://pub-example.r2.dev/runmypg.apk';

describe('android-app', () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env, NEXT_PUBLIC_ANDROID_APK_URL: R2 };
  });

  afterAll(() => {
    process.env = env;
  });

  it('getPublicApkUrl reads env', () => {
    expect(getPublicApkUrl()).toBe(R2);
  });

  it('resolveApkDownloadUrl uses canonical URL', () => {
    expect(resolveApkDownloadUrl()).toBe(R2);
  });

  it('getEffectiveApkDownloadUrl when approved uses canonical over stale row URL', () => {
    const row: ApkRequest = {
      id: '1',
      owner_id: 'u',
      full_name: 'A',
      email: 'a@b.co',
      phone: null,
      status: 'ready',
      download_url: 'https://old.example/apk.apk',
      requested_at: '',
      download_ready_at: null,
      downloaded_at: null,
    };
    expect(getEffectiveApkDownloadUrl(row)).toBe(R2);
  });

  it('getEffectiveApkDownloadUrl pending returns null', () => {
    const row: ApkRequest = {
      id: '1',
      owner_id: 'u',
      full_name: 'A',
      email: 'a@b.co',
      phone: null,
      status: 'pending',
      download_url: null,
      requested_at: '',
      download_ready_at: null,
      downloaded_at: null,
    };
    expect(getEffectiveApkDownloadUrl(row)).toBeNull();
  });
});
