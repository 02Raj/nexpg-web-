# Production launch checklist (web + manual APK)

**Full checklist (SEO, GSC, email, admin, APK):** see **[LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md)**.

## Quick reference

## 1. Supabase

- [ ] Run migrations `0001`–`0003` (NexPG repo) + `0002` APK + **`0004_platform_admin_apk_rls`** + **`0005_platform_owner_profiles`** + **`0006_contact_inquiries`**
- [ ] Auth: Site URL = your production domain (e.g. `https://www.runmypg.in`)
- [ ] Redirect URLs include `https://www.runmypg.in/**` and `http://localhost:3001/**` for dev
- [ ] Create platform admin user in Authentication (email in `platform_admins`)

## 2. Vercel (NexPG-Web)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # anon JWT, not sb_publishable_
NEXT_PUBLIC_SITE_URL=https://www.runmypg.in
NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS=admin@yourdomain.com
NEXT_PUBLIC_ANDROID_APK_URL=https://.../runmypg.apk   # optional default for approvals
```

## 3. APK file

- [ ] Build release APK (EAS or local)
- [ ] Upload to Supabase Storage `apk-releases` (public read)
- [ ] Paste URL in admin **`/platform/apk-requests`** when approving

## 4. Smoke test

| Step | Who | URL |
|------|-----|-----|
| Sign up / login | Owner | `/signup`, `/login` |
| Add PG | Owner | `/setup/building` |
| Request app | Owner | `/download` → Request |
| Approve | Admin | `/platform/apk-requests` → Approve |
| Download | Owner | `/download` → Download (same page) |
| Mobile login | Owner | APK with same credentials |

## 5. What owners see

- **Pending:** “We received your request… page updates automatically.”
- **Approved:** “Download Android app” on the **same** `/download` screen (no email required for MVP, but you can email manually).
