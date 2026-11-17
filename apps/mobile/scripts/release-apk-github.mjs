/**
 * Create a GitHub Release and attach the APK (no Cloudflare card).
 *
 * Usage:
 *   node scripts/release-apk-github.mjs v1.0.1 "C:\path\to\app.apk"
 *
 * Requires: gh CLI logged in (gh auth login)
 */

import { existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { spawnSync } from 'node:child_process';

const tag = process.argv[2]?.trim();
const apkPath = resolve(process.argv[3] || '');
const title = process.env.RELEASE_TITLE?.trim() || `RunMyPG Android ${tag}`;

if (!tag || !/^v\d+\.\d+\.\d+/.test(tag)) {
  console.error('Usage: node scripts/release-apk-github.mjs v1.0.1 <path-to.apk>');
  process.exit(1);
}
if (!apkPath || !existsSync(apkPath)) {
  console.error('APK file not found:', apkPath);
  process.exit(1);
}

const name = basename(apkPath);
const run = spawnSync(
  'gh',
  ['release', 'create', tag, apkPath, '--title', title, '--notes', 'Production APK for RunMyPG owners.'],
  { stdio: 'inherit', shell: true },
);

if (run.status !== 0) {
  process.exit(run.status ?? 1);
}

console.log('\nNext: open the release on GitHub → copy the .apk asset URL.');
console.log('Set NEXT_PUBLIC_ANDROID_APK_URL and NEXT_PUBLIC_ANDROID_APK_VERSION on Vercel, then redeploy.');
