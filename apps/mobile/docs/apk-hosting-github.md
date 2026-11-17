# APK hosting — GitHub Releases (100% free, no card)

Use this if you **do not** want to add a payment method to Cloudflare R2.

- **Cost:** ₹0, no billing profile  
- **Size:** 77 MB APK is fine  
- **Trade-off:** Each release gets a **new download URL** (tag `v1.0.0`, `v1.0.1`, …). Update `NEXT_PUBLIC_ANDROID_APK_URL` on Vercel when you ship.

## One-time

1. Mobile repo on GitHub (private OK — release assets are downloadable if you use public repo or grant access; for **public** release APK many teams use a **public** repo or only upload APK to public releases).
2. Install [GitHub CLI](https://cli.github.com/): `winget install GitHub.cli`
3. `gh auth login`

## Every release

```powershell
cd D:\@Projects\NexPG
gh release create v1.0.1 "C:\path\to\app.apk" --title "RunMyPG Android 1.0.1" --notes "Production APK"
```

Copy the **asset download URL** from the release page (ends with `.apk`).

## Web env

Vercel + `NexPG-Web/.env.local`:

```env
NEXT_PUBLIC_ANDROID_APK_URL=https://github.com/YOUR_USER/nexpg-mobile/releases/download/v1.0.1/runmypg.apk
NEXT_PUBLIC_ANDROID_APK_VERSION=1.0.1
```

Redeploy runmypg.in. Admin **Approve** flow unchanged.

Or use the script:

```powershell
npm run apk:release:github -- v1.0.1 "C:\path\to\app.apk"
```

## vs R2

| | R2 | GitHub Releases |
|--|-----|-----------------|
| Payment method | Required on account | Not required |
| URL each release | Same (overwrite) | New URL per tag |
| Best for | Fixed link, card OK | No card at all |
