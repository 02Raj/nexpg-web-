/**
 * Upload production APK to Cloudflare R2 (S3-compatible). Free tier, 77MB+ OK.
 * Overwrites the same object key → public URL never changes.
 *
 * One-time setup: docs/apk-hosting-r2.md
 *
 * Usage:
 *   node scripts/upload-latest-apk-r2.mjs "C:\path\to\app.apk"
 *
 * Env (.env, never commit secrets):
 *   R2_ACCOUNT_ID=
 *   R2_ACCESS_KEY_ID=
 *   R2_SECRET_ACCESS_KEY=
 *   R2_BUCKET_NAME=runmypg-releases
 *   R2_PUBLIC_BASE_URL=https://pub-xxxx.r2.dev
 *   APK_OBJECT_KEY=runmypg.apk
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

const accountId = process.env.R2_ACCOUNT_ID?.trim();
const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
const bucket = process.env.R2_BUCKET_NAME?.trim() || 'runmypg-releases';
const publicBase = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '');
const objectKey = process.env.APK_OBJECT_KEY?.trim() || 'runmypg.apk';
const localPath = resolve(process.argv[2] || '');

function need(name) {
  console.error(`Missing ${name} in .env — see docs/apk-hosting-r2.md`);
  process.exit(1);
}

if (!accountId) need('R2_ACCOUNT_ID');
if (!accessKeyId) need('R2_ACCESS_KEY_ID');
if (!secretAccessKey) need('R2_SECRET_ACCESS_KEY');
if (!publicBase) need('R2_PUBLIC_BASE_URL');
if (!localPath || !existsSync(localPath)) {
  console.error('Usage: node scripts/upload-latest-apk-r2.mjs <path-to.apk>');
  process.exit(1);
}

const body = readFileSync(localPath);
const sizeMb = (statSync(localPath).size / (1024 * 1024)).toFixed(2);

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

await client.send(
  new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    Body: body,
    ContentType: 'application/vnd.android.package-archive',
    CacheControl: 'public, max-age=300',
  }),
);

const publicUrl = `${publicBase}/${objectKey}`;
console.log(`Uploaded ${basename(localPath)} (${sizeMb} MB) → ${bucket}/${objectKey}`);
console.log('Set on RunMyPG web (once):');
console.log(`NEXT_PUBLIC_ANDROID_APK_URL=${publicUrl}`);
