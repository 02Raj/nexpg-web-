# APK distribution (pre–Play Store)

Owners get the Android app **from the web** — no Play Store yet.

## Owner flow (production)

1. Sign in on **RunMyPG / NexPG web** → open **`/download`** (sidebar: **Mobile app**).
2. Tap **Request Android app**.
3. Status **pending** — page auto-refreshes (~25s) until admin approves.
4. After approval → **same `/download` page** shows **Download Android app**.
5. Install APK → sign in with **same email/password** as web.

## Platform admin flow

1. Run SQL migrations: `0002_apk_requests.sql` + **`0004_platform_admin_apk_rls.sql`**.
2. Add your email to `platform_admins` (migration seeds one row — change if needed).
3. Web env: `NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS=your@email.com`
4. **Once:** create public bucket `apk-releases`, set Vercel `NEXT_PUBLIC_ANDROID_APK_URL` to  
   `https://<project>.supabase.co/storage/v1/object/public/apk-releases/runmypg.apk`
5. After each EAS build: `node scripts/upload-latest-apk.mjs path/to.apk` (same path = overwrite, no URL change).
6. Sign in as admin → **`/platform/apk-requests`** → **Approve** (no URL typing — uses env link).
7. Owner’s `/download` updates automatically — they tap **Download**.

## Database

| Table | Purpose |
|-------|---------|
| `apk_download_requests` | One row per owner request |
| `platform_admins` | Emails allowed to approve |

| `status` | Meaning |
|----------|---------|
| `pending` | Waiting for admin |
| `ready` | Approved — `download_url` set |
| `downloaded` | Owner tapped download (can download again) |

## APK file hosting

| Plan | Approach |
|------|----------|
| Free + **fixed URL** (card on Cloudflare OK) | **[R2](./apk-hosting-r2.md)** — `npm run apk:upload:r2` |
| Free + **no payment method** | **[GitHub Releases](./apk-hosting-github.md)** — `npm run apk:release:github` |
| Supabase Pro | `0005_apk_storage_bucket.sql` + `npm run apk:upload` |

Supabase **Free** = **50 MB** upload cap → **413** for ~77 MB APK. Use **R2** instead.

## Security

- RLS: owners see only their row; admins see all and can update to `ready`.
- Never commit APK files to git.
- HTTPS only for `download_url`.

## Build the APK (EAS)

Production signed APK + env setup: **[eas-production-apk.md](./eas-production-apk.md)**.

Quick command after one-time `eas login` + `eas init` + EAS env vars:

```powershell
cd D:\@Projects\NexPG
npm run build:android:production
```

## Play Store (later)

Replace manual flow with Play Store link on `/download` for new users.
