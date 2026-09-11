# RunMyPG — poori launch checklist

Domain: **https://www.runmypg.in**  
Use this list top-to-bottom. Har section ke boxes tick karo jab kaam ho jaye.

---

## A. Domain & hosting (Vercel)

- [ ] **Vercel project** connected to Git repo
- [ ] Domains added: `www.runmypg.in` (Production), `runmypg.in` → redirect to `www`
- [ ] SSL **Valid** (green lock on browser)
- [ ] **`app.runmypg.in` use mat karo** jab tak Vercel pe add + valid SSL na ho — sab **`www`** pe chalao
- [ ] Production env vars set (see section C) → **Redeploy** after changes
- [ ] Smoke: homepage, `/login`, `/signup`, `/download` open without 500

---

## B. Supabase (backend)

- [ ] Migrations run in SQL Editor (order matters):
  - [ ] NexPG mobile repo migrations `0001`–`0003` (if not already)
  - [ ] `0002` APK table (if separate)
  - [ ] **`0004_platform_admin_apk_rls.sql`**
  - [ ] **`0005_platform_owner_profiles.sql`**
  - [ ] **`0006_contact_inquiries.sql`** (public `/contact` form)
  - [ ] **`0007_user_feedback.sql`** (owner feedback web + app)
- [ ] **Authentication → URL configuration**
  - [ ] **Site URL:** `https://www.runmypg.in`
  - [ ] **Redirect URLs:** `https://www.runmypg.in/**`, `http://localhost:3001/**`
- [ ] **Authentication → Email templates** (optional but recommended)
  - [ ] Confirm signup / reset password — sender name **RunMyPG**, links point to `www.runmypg.in`
- [ ] **Authentication → Providers:** Email on; disable unused providers
- [ ] RLS: owner data scoped; platform admin APK + owner list works (test approve once)

---

## C. Vercel environment variables (Production)

Copy from `.env.production.example`:

| Variable | Example / note |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **anon JWT** (Dashboard → API) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.runmypg.in` |
| `NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS` | `divyanshr243@gmail.com` (comma for multiple) |
| `NEXT_PUBLIC_ANDROID_APK_URL` | Public APK URL (R2 / Storage) |
| `NEXT_PUBLIC_ANDROID_APK_VERSION` | e.g. `1.0.0` — bump each release |

- [ ] **Never** put `SUPABASE_SERVICE_ROLE_KEY` in Vercel public env — only local script / CI secret
- [ ] After env change → **Redeploy**

---

## D. Platform admin account

- [ ] Email in table **`platform_admins`** (SQL migration adds `divyanshr243@gmail.com`)
- [ ] Same email in **`NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS`**
- [ ] Auth user created (Dashboard or `node scripts/set-platform-admin-user.mjs`)
- [ ] **Auto confirm user** ON for admin
- [ ] Login → **`/platform/dashboard`** opens (not redirected to owner setup only)
- [ ] **`/platform/owners`** — list dikhe
- [ ] **`/platform/apk-requests`** — approve test karo

---

## E. Android APK (manual, no Play Store yet)

- [ ] Release APK build (EAS / local)
- [ ] Upload to **fixed public URL** (`NEXT_PUBLIC_ANDROID_APK_URL`)
- [ ] New build = **same URL overwrite** + bump `NEXT_PUBLIC_ANDROID_APK_VERSION`
- [ ] Owner flow: `/download` → Request → admin Approve → **same page** Download
- [ ] Mobile: same email/password as web → data sync

Details: [APK-FLOW.md](./APK-FLOW.md)

---

## F. Email — kya lena / kya setup karna hai

### F1. Auth emails (Supabase — free tier)

Supabase bhejta hai: **signup confirm**, **password reset**.

- [ ] Supabase → **Project Settings → Authentication → SMTP** (optional)
  - Default Supabase mail OK for beta; production ke liye **custom SMTP** better (deliverability)
- [ ] **Custom SMTP options** (pick one later):
  - [ ] [Resend](https://resend.com) + domain verify
  - [ ] [Amazon SES](https://aws.amazon.com/ses/)
  - [ ] GoDaddy / Google Workspace SMTP
- [ ] **From address:** e.g. `hello@runmypg.in` or `noreply@runmypg.in` (domain verify zaroori)
- [ ] Test: signup + forgot password → mail inbox mein aaye (spam check)

### F2. Business / support email (tumhare liye)

- [ ] **Support inbox** banao: e.g. `support@runmypg.in` ya `hello@runmypg.in`
- [ ] GoDaddy / Google Workspace → **MX records** domain pe
- [ ] Marketing site footer / FAQ mein yahi email daalo
- [ ] APK approve ke baad manual mail (optional MVP) — auto mail abhi app mein nahi

### F3. Jo abhi mat karo (baad mein)

- Marketing newsletter tool (Mailchimp, etc.) — jab user base bade
- Transactional for APK “approved” — baad mein Supabase Edge / Resend

---

## G. SEO setup (website)

### G1. On-page (already partly in code)

- [ ] `metadata` title/description **`www.runmypg.in`** pe sahi dikhe (view source)
- [ ] **Favicon** tab mein **R** dikhe
- [ ] **`/manifest.json`** — PWA name RunMyPG
- [ ] Marketing page: clear H1 “Run your PG”, cities, FAQ (content = SEO)

### G2. Technical SEO (karo / verify)

- [ ] **`robots.txt`** — allow public pages, block `/platform`, `/dashboard` if needed (add `app/robots.ts` in Next.js)
- [ ] **`sitemap.xml`** — include `/`, `/login`, `/signup`, `/download` (add `app/sitemap.ts`)
- [ ] **Canonical:** `metadataBase` = `https://www.runmypg.in` (layout mein set)
- [ ] **HTTPS only** — no mixed content
- [ ] Page speed: Vercel + skeleton loading; test mobile on slow 4G

### G3. Google Search Console (GSC) — step by step

1. [ ] Open [Google Search Console](https://search.google.com/search-console)
2. [ ] **Add property** → **URL prefix:** `https://www.runmypg.in`
3. [ ] **Verify ownership** (ek choose karo):
   - [ ] **HTML tag** in site `<head>` (Next.js `metadata.verification.google`), **or**
   - [ ] **DNS TXT** record GoDaddy pe (recommended, domain-wide)
4. [ ] Submit **sitemap:** `https://www.runmypg.in/sitemap.xml`
5. [ ] **URL inspection** → homepage → **Request indexing** (naya domain)
6. [ ] 1–2 week baad: **Performance** → queries “PG management”, “PG software India” etc.

### G4. Optional (baad mein)

- [ ] Google Business Profile — agar local office dikhani ho
- [ ] Bing Webmaster Tools — copy from GSC
- [ ] Structured data (`SoftwareApplication` / `Organization` JSON-LD) — FAQ rich results

---

## H. Analytics & monitoring

- [ ] **Vercel Analytics** (free) ON — traffic dekhne ke liye
- [ ] **Google Analytics 4** (optional): property banao → tag Vercel / layout
- [ ] Supabase Dashboard — API errors, auth signups count
- [ ] Error tracking (optional): Sentry later

---

## I. Security & trust

- [ ] Admin password **strong** (production mein `123456` mat rakho)
- [ ] `.env.local` / service role **git mein commit mat karo**
- [ ] Supabase **RLS** ON on all public tables
- [ ] **Privacy policy** page (simple) — footer link; PG owner data ka short note
- [ ] **Terms** (beta) — optional for MVP

---

## J. Owner app smoke test (final)

| # | Step | Pass? |
|---|------|-------|
| 1 | Sign up new owner | [ ] |
| 2 | Add PG + rooms | [ ] |
| 3 | Add tenant + bill | [ ] |
| 4 | Request APK on `/download` | [ ] |
| 5 | Admin approve | [ ] |
| 6 | Download + install APK | [ ] |
| 7 | Login mobile — same data | [ ] |
| 8 | Admin deactivate owner (soft) — login block | [ ] |
| 9 | Reactivate — login works | [ ] |
| 10 | Owner feedback: web `/feedback` or app **More → Send feedback** | [ ] |
| 11 | Admin **Platform → Owner feedback** inbox | [ ] |

---

## K. Launch day

- [ ] Git push → Vercel deploy green
- [ ] `www.runmypg.in` incognito test
- [ ] GSC sitemap submitted
- [ ] Support email live footer mein
- [ ] WhatsApp message template owners ke liye (APK flow one-liner — see APK-FLOW.md)

---

## Quick links

| Item | URL |
|------|-----|
| Site | https://www.runmypg.in |
| Admin dashboard | https://www.runmypg.in/platform/dashboard |
| APK approvals | https://www.runmypg.in/platform/apk-requests |
| Supabase | https://supabase.com/dashboard |
| Vercel | https://vercel.com/dashboard |
| Search Console | https://search.google.com/search-console |

---

**Related docs:** [PRODUCTION-LAUNCH.md](./PRODUCTION-LAUNCH.md) · [APK-FLOW.md](./APK-FLOW.md) · [mobile-performance.md](./mobile-performance.md)
