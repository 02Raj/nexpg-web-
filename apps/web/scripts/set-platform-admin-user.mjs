/**
 * One-time: create or update platform admin login in Supabase Auth.
 * NEVER commit SUPABASE_SERVICE_ROLE_KEY or passwords to git.
 *
 * Usage (PowerShell):
 *   $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."   # Dashboard → Settings → API → service_role
 *   node scripts/set-platform-admin-user.mjs divyanshr243@gmail.com
 *
 * Optional password (default only for local dev):
 *   node scripts/set-platform-admin-user.mjs divyanshr243@gmail.com --password "YourStrongPassword"
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const path = resolve(__dirname, '../.env.local');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    const key = m[1];
    const val = m[2].trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const email = process.argv[2]?.trim().toLowerCase();
const passIdx = process.argv.indexOf('--password');
const password = passIdx >= 0 ? process.argv[passIdx + 1] : process.env.PLATFORM_ADMIN_PASSWORD;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!email || !email.includes('@')) {
  console.error('Usage: node scripts/set-platform-admin-user.mjs <email> [--password <pwd>]');
  process.exit(1);
}
if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  console.error('Add service_role key from Supabase Dashboard → Settings → API (do not commit).');
  process.exit(1);
}
if (!password || password.length < 6) {
  console.error('Set --password or PLATFORM_ADMIN_PASSWORD (min 6 chars).');
  process.exit(1);
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
};

async function findUser() {
  const res = await fetch(`${url}/auth/v1/admin/users?per_page=200`, { headers });
  if (!res.ok) throw new Error(`List users failed: ${res.status} ${await res.text()}`);
  const body = await res.json();
  const users = body.users ?? body;
  return (Array.isArray(users) ? users : []).find((u) => u.email?.toLowerCase() === email);
}

async function createUser() {
  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Platform Admin' },
    }),
  });
  if (!res.ok) throw new Error(`Create user failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function updatePassword(userId) {
  const res = await fetch(`${url}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ password, email_confirm: true }),
  });
  if (!res.ok) throw new Error(`Update password failed: ${res.status} ${await res.text()}`);
  return res.json();
}

try {
  const existing = await findUser();
  if (existing?.id) {
    await updatePassword(existing.id);
    console.log(`Updated password for ${email} (user id ${existing.id}).`);
  } else {
    const created = await createUser();
    console.log(`Created user ${email} (id ${created.id}).`);
  }
  console.log('Login at /login then open /platform/apk-requests');
  console.log('Ensure email is in platform_admins + NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS.');
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
}
