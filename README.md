# RunMyPG Web

**Next.js owner console** for [RunMyPG](https://www.runmypg.in/) — separate from the mobile app, same Supabase backend and design tokens.

| | Mobile | Web |
|---|--------|-----|
| **Path** | `D:\@Projects\NexPG` | `D:\@Projects\NexPG-Web` |
| **Stack** | Expo / React Native | Next.js 15 (App Router) |
| **Port** | 3000 | 3001 |
| **Backend** | Supabase (shared) | Supabase (shared) |

## Production domain

Everything runs on **[www.runmypg.in](https://www.runmypg.in/)** (marketing, login, signup, owner console). Apex `runmypg.in` redirects to `www`.

Do **not** use `app.runmypg.in` unless you add that hostname in Vercel with a valid SSL certificate. The app redirects `app.runmypg.in` → `www.runmypg.in`.

## Quick start

```bash
cd D:\@Projects\NexPG-Web
cp .env.example .env.local
# Same EXPO_PUBLIC_* values as mobile — use NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Environment

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

For production, set `NEXT_PUBLIC_SITE_URL=https://www.runmypg.in`.

Add `http://localhost:3001/**` and `https://www.runmypg.in/**` to Supabase **Authentication → URL configuration** (Site URL + Redirect URLs).

## Sync with mobile

No custom sync service. Both apps call the same Postgres tables and RPCs. Sign in with the same email on web and mobile — data is identical because RLS scopes everything to `auth.uid()`.

Shared logic lives in parallel folders (keep in sync when schema changes):

| Concern | Mobile | Web |
|---------|--------|-----|
| API | `NexPG/src/api/nexpg.ts` | `NexPG-Web/src/api/nexpg.ts` |
| Types | `NexPG/src/types/database.ts` | `NexPG-Web/src/types/database.ts` |
| Theme colors | `NexPG/src/theme/tokens.ts` | `NexPG-Web/src/theme/tokens.ts` + `app/globals.css` |

## Routes

- `/login`, `/signup`, `/forgot-password` — auth
- `/dashboard`, `/beds`, `/bills`, `/more` — owner console
- `/tenant/new`, `/tenant/[id]` — tenant flows
- `/download` — Android APK request (24h approval)
- `/setup/building`, `/setup/rooms` — first PG setup

## Deploy

```bash
npm run build
npm start
```

Deploy to Vercel: set env vars, build command `npm run build`, framework Next.js.
