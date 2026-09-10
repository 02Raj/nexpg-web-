# APK flow — owner → admin → download (same page)

No Play Store yet. No automatic approval email in MVP — download appears on **`/download`** only.

## Owner

1. Sign up / log in on the web.
2. Open **Mobile app** or **`/download`**.
3. Tap **Request Android app — free** (one click).
4. Wait on the **same page** — status `pending`, page polls every ~25 seconds.
5. After admin approves → **Download Android app** button on **this page** (not a new request).
6. Install APK → log in with **same email + password** as web.

## Admin (platform)

1. Log in as email in `platform_admins` (see `supabase/platform-admin.sql`).
2. Upload release APK to Supabase Storage (public URL).
3. Open **`/platform/apk-requests`** → paste APK URL → **Approve** on each pending row.
4. Owner’s `/download` page updates automatically.

## SQL

Run **`supabase/platform-admin.sql`** once in Supabase SQL Editor.

## One line for owners (WhatsApp)

*Web par login → Mobile app → Request → jab approve ho, wahi page se Download → phone par install → same login.*
