# APK hosting — Cloudflare R2 (best free)

Use this instead of Supabase Storage on the **Free** plan (50 MB upload cap). Your APK is ~77 MB — R2 handles it. **Same URL every release** — overwrite `runmypg.apk`.

## One-time setup (~15 min)

### 1. Cloudflare account

Sign up at [cloudflare.com](https://dash.cloudflare.com/sign-up) (free).

### 2. Create R2 bucket

1. Dashboard → **R2 Object Storage** → **Create bucket**
2. Name: `runmypg-releases` (or match `R2_BUCKET_NAME` in `.env`)

### 3. Public URL

**Option A — Custom domain (recommended for runmypg.in, fixes many 401s on r2.dev)**

1. Bucket → **Settings** → **Custom Domains** → **Connect Domain**
2. Pick e.g. `apk.runmypg.in` (zone must be on the **same** Cloudflare account as R2)
3. After Active: `R2_PUBLIC_BASE_URL=https://apk.runmypg.in` and  
   `NEXT_PUBLIC_ANDROID_APK_URL=https://apk.runmypg.in/runmypg.apk`

**Option B — Public Development URL (dev / testing)**

1. **Settings** → **Public Development URL** → **Enable** → type `allow`
2. Copy `https://pub-xxxxxxxx.r2.dev` → `R2_PUBLIC_BASE_URL`
3. If browser shows **401** but upload works: toggle **Disable** (`disallow`) → wait 1 min → **Enable** again, or use **Option A**.

**401 vs 404:** 401 = bucket not public. 404 = wrong file path (object missing).

### 4. API token (upload from your PC)

1. R2 → **Manage R2 API Tokens** → **Create API token**
2. Permissions: **Object Read & Write** on bucket `runmypg-releases`
3. Copy **Access Key ID**, **Secret Access Key**, and **Account ID**

### 5. Mobile repo `.env` (gitignored)

```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=runmypg-releases
R2_PUBLIC_BASE_URL=https://pub-xxxxxxxx.r2.dev
APK_OBJECT_KEY=runmypg.apk
```

### 6. Web app env (Vercel + local)

```env
NEXT_PUBLIC_ANDROID_APK_URL=https://pub-xxxxxxxx.r2.dev/runmypg.apk
NEXT_PUBLIC_ANDROID_APK_VERSION=1.0.0
```

Redeploy **runmypg.in** once. Admin `/platform/apk-requests` shows this URL; **Approve** only — no paste per user.

---

## Every new EAS build

```powershell
cd D:\@Projects\NexPG
npm run build:android:production
# Download .apk from Expo when finished
npm run apk:upload:r2 -- "C:\Users\divya\Downloads\your.apk"
```

Optional: bump `NEXT_PUBLIC_ANDROID_APK_VERSION` on Vercel when you want owners to see a new label.

**No re-approve** for owners already approved — they download the same URL (new file on R2).

---

## Verify

Open `NEXT_PUBLIC_ANDROID_APK_URL` in a browser — APK should download.

---

## Supabase upload script

`npm run apk:upload` (Supabase) still works on **Pro** with `0005_apk_storage_bucket.sql`. For **free** stack, use **`apk:upload:r2`** only.
