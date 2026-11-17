# EAS production APK (Option A)

Use this when owners request the app on **web `/download`** — you ship a **signed release APK** (not Expo Go), with **production Supabase** baked in at build time.

## Why production build?

| Dev (Expo Go) | Production APK |
|---------------|----------------|
| Your laptop + dev keys | Same backend as **runmypg.in** |
| Not what owners install | What you upload to Storage + approve in `/platform/apk-requests` |

## One-time setup

1. **Expo account** — https://expo.dev/signup (free tier works for occasional builds).

2. **Link project** (from repo root):

   ```powershell
   cd D:\@Projects\NexPG
   npm install
   npm run eas:login
   npm run eas:init
   ```

   `eas init` adds `expo.extra.eas.projectId` in `app.json` — commit that.

3. **Production env on EAS** (do not put anon key in `eas.json`):

   ```powershell
   npx eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://YOUR_PROJECT.supabase.co" --environment production --visibility plaintext
   npx eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..." --environment production --visibility secret
   ```

   Use the **same** URL + **anon** key as NexPG-Web production.

4. **App version** — bump `expo.version` in `app.json` when you want a visible release number. `versionCode` auto-increments via `eas.json` → `production.autoIncrement`.

## Build APK

```powershell
cd D:\@Projects\NexPG
npm run build:android:production
```

- Wait on https://expo.dev → your project → **Builds**.
- Download the `.apk` when finished.

## Ship to owners (one APK, many approvals)

1. **One-time (Vercel):** `NEXT_PUBLIC_ANDROID_APK_URL` = public Storage URL for `apk-releases/runmypg.apk`.  
   Optional: `NEXT_PUBLIC_ANDROID_APK_VERSION=1.0.1` when you redeploy web after a release.
2. Download APK from Expo → upload to **R2** (free, recommended):

   ```powershell
   npm run apk:upload:r2 -- "C:\path\to\downloaded.apk"
   ```

   Setup: [apk-hosting-r2.md](./apk-hosting-r2.md). Supabase upload only on **Pro**.

3. Admin: [runmypg.in/platform/apk-requests](https://www.runmypg.in/platform/apk-requests) → **Approve** (or **Approve all**).
4. Owner stays on `/download` → **Download Android app** (always latest file at that URL).

Already-approved owners automatically get the new APK on next download — no re-approve per build.

## Profiles

| Profile | When |
|---------|------|
| `production` | **Owners** — default command above |
| `preview` | Internal test APK (`npm run build:android:preview`) |
| `development` | Dev client only — not for `/download` |

## Troubleshooting

- **Not logged in:** `npm run eas:login`
- **Missing projectId:** `npm run eas:init`
- **`Generating a new Keystore is not supported in --non-interactive mode`:** First Android build must be **interactive**. Run `npm run build:android:production` (no `:ci`), answer **Yes** when EAS offers to generate a new Android keystore. Later builds can use `npm run build:android:production:ci`.
- **No EAS production env vars:** App won’t reach Supabase until you run the `eas env:create` commands in One-time setup §3.
- **App can’t sign in:** rebuild after fixing EAS `production` env vars (wrong key = old APK won’t fix itself)
