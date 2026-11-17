/**
 * Test Sarvam contact reply draft locally (uses .env.local SARVAM_API_KEY).
 *
 *   node scripts/sarvam-draft-reply.mjs --name "Rahul" --email "o@example.com" --topic sales --message "20 bed PG in Noida"
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

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : '';
}

loadEnvLocal();

const key = process.env.SARVAM_API_KEY?.trim();
if (!key) {
  console.error('Missing SARVAM_API_KEY in .env.local');
  process.exit(1);
}

const fullName = arg('name') || 'PG owner';
const email = arg('email') || 'owner@example.com';
const topic = arg('topic') || 'sales';
const message = arg('message') || 'I want PG management software.';

const system = `You draft short helpful replies for RunMyPG (PG owner software, India, free in beta, web + Android). Be accurate. Output only reply body. Signup: https://www.runmypg.in/signup`;

const user = `Draft reply.\nFrom: ${fullName} <${email}>\nTopic: ${topic}\n\n${message}`;

const res = await fetch('https://api.sarvam.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'api-subscription-key': key,
  },
  body: JSON.stringify({
    model: 'sarvam-105b-conversations',
    temperature: 0.3,
    max_tokens: 600,
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
  }),
});

const json = await res.json();
if (!res.ok) {
  console.error(json);
  process.exit(1);
}

console.log('\n--- Draft reply ---\n');
console.log(json.choices?.[0]?.message?.content ?? json);
