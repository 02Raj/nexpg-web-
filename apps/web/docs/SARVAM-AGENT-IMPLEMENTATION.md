# Sarvam growth agent — affordable implementation plan (early phase)

**Goal:** Help you reply to leads and save time **without** paid SDR tools, autopilot spam, or burning credits.

**Cost model:** Sarvam runs **only when you click** “Draft reply” in platform admin (~₹ fractions per click). No 24/7 bot.

---

## Phase 0 — Done in repo (start here)

| Item | What |
|------|------|
| `SARVAM_API_KEY` | Server-only env (Vercel + `.env.local`) |
| `POST /api/platform/contact-draft` | Platform admin only → Sarvam draft |
| `/platform/contact` UI | **Draft reply (Sarvam)** button + copy + mailto |
| `scripts/sarvam-draft-reply.mjs` | CLI test without opening admin |
| `src/lib/growth-agent-kb.ts` | Product truth from FAQs (no fake features) |

### Setup (10 minutes)

1. Sarvam dashboard → copy API key (`sk_...`).
2. Local `.env.local`:
   ```env
   SARVAM_API_KEY=sk_your_key_here
   ```
3. Vercel → Project → Environment Variables → `SARVAM_API_KEY` (Production).
4. Redeploy.
5. Log in as platform admin → `/platform/contact` → open a message → **Draft reply (Sarvam)**.

### CLI test

```powershell
node scripts/sarvam-draft-reply.mjs --name "Rahul" --email "owner@example.com" --topic sales --message "Noida mein 20 bed PG hai, software chahiye"
```

---

## Phase 1 — This week (free / low cost)

- [ ] Reply within 24h to every `/contact` row (draft + edit + send from `support@`).
- [ ] Pin WhatsApp auto-reply manually (no Sarvam voice yet): link `https://www.runmypg.in/signup` + `/help`.
- [ ] Weekly: 1 blog or city FAQ from real questions (you write; Sarvam optional for outline only).

**Do not:** cold WhatsApp lists, auto-send from Sarvam without reading.

---

## Phase 2 — When signups are steady (optional)

- [ ] n8n (self-host free tier): webhook on new `contact_inquiries` → email/Slack **alert only** (no auto Sarvam).
- [ ] Second button: “Outline blog from this question” (admin-only API, same Sarvam key).
- [ ] Spreadsheet: 5 GEO test queries/month (“PG software Noida”) — fix site if AI lies.

---

## Phase 3 — Revenue later

- [ ] WhatsApp Business API + approved templates.
- [ ] Sarvam voice (STT/TTS) only if owners call a number.
- [ ] Paid outbound tool only if inbound + SEO are not enough.

---

## Security

- `SARVAM_API_KEY` never in client, never `NEXT_PUBLIC_`.
- Draft API checks `NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS` + logged-in user.
- Agent KB has no tenant database access.

---

## Related

- [PLATFORM-ADMIN-GUIDE.md](./PLATFORM-ADMIN-GUIDE.md) — platform admin + contact inbox + agent use (simple)  
- [AI-AGENTS-USER-ACQUISITION.md](./AI-AGENTS-USER-ACQUISITION.md) — strategy & compliance  
- [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md) — migrations `0006` contact form
