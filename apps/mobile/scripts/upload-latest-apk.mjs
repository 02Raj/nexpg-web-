/**
 * Upload (overwrite) the canonical production APK in Supabase Storage.
 * URL stays the same — matches NEXT_PUBLIC_ANDROID_APK_URL on RunMyPG web.
 *
 * Usage:
 *   $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."
 *   node scripts/upload-latest-apk.mjs "C:\path\to\app-release.apk"
 *
 * Optional env (defaults shown):
 *   APK_STORAGE_BUCKET=apk-releases
 *   APK_STORAGE_OBJECT=runmypg.apk
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

const supabaseUrl = (
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''
).replace(/\/$/, '');
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.APK_STORAGE_BUCKET || 'apk-releases';
const objectPath = process.env.APK_STORAGE_OBJECT || 'runmypg.apk';
const localPath = resolve(process.argv[2] || '');

if (!supabaseUrl || !serviceKey) {
  console.error('Set EXPO_PUBLIC_SUPABASE_URL (or NEXT_PUBLIC_) and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}
if (!localPath || !existsSync(localPath)) {
  console.error('Usage: node scripts/upload-latest-apk.mjs <path-to.apk>');
  process.exit(1);
}

const file = readFileSync(localPath);
const sizeMb = (statSync(localPath).size / (1024 * 1024)).toFixed(2);
const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`;

const res = await fetch(uploadUrl, {
  method: 'POST',
  headers: {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/vnd.android.package-archive',
    'x-upsert': 'true',
  },
  body: file,
});

if (!res.ok) {
  const body = await res.text();
  console.error(`Upload failed (${res.status}):`, body);
  if (res.status === 413) {
    console.error(
      `\nAPK is ${sizeMb} MB. Supabase Free plan caps uploads at 50 MB; your release APK is larger.\n` +
        'Fix: upgrade project to Pro (higher per-file limit), then run supabase/migrations/0005_apk_storage_bucket.sql.\n' +
        'Or host the APK elsewhere (e.g. Cloudflare R2) and set NEXT_PUBLIC_ANDROID_APK_URL on the web app.',
    );
  }
  process.exit(1);
}

const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
console.log(`Uploaded ${basename(localPath)} (${sizeMb} MB) → ${bucket}/${objectPath}`);
console.log('Public URL (set once in Vercel as NEXT_PUBLIC_ANDROID_APK_URL):');
console.log(publicUrl);
