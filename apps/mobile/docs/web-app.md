# Web app (Next.js)

The NexPG **web app is a separate Next.js project**, not Expo web.

| | |
|---|---|
| **Path** | `D:\@Projects\NexPG-Web` |
| **Stack** | Next.js 15, App Router, React Query, Supabase SSR |
| **Mobile** | `D:\@Projects\NexPG` (Expo — unchanged) |

## Run locally

```bash
cd D:\@Projects\NexPG-Web
cp .env.example .env.local
npm install
npm run dev
```

Opens at **http://localhost:3001** (mobile Expo uses port 3000).

Use the **same Supabase URL and anon key** as mobile — only the env var prefix differs (`NEXT_PUBLIC_` vs `EXPO_PUBLIC_`).

## Production

```bash
npm run build
npm start
```

Or deploy to Vercel / any Node host with the three `NEXT_PUBLIC_*` variables set.

## Web-specific UI

- **Not AI-generated:** Reuses NexPG paper/ink/ochre tokens and Fraunces + Inter + IBM Plex Mono.
- **Console shell:** Top bar + bottom nav (same sections as mobile tabs: Home, Beds, Bills, More).
- **Max width ~720px** on large screens so the console feels intentional, not a stretched phone UI.

## Public routes

| Route | Auth | Purpose |
|-------|------|---------|
| `/login`, `/signup`, `/forgot-password` | No | Owner auth |
| `/download` | Optional | Android APK request |
| `/auth/callback`, `/auth/reset-password` | Session | Supabase email links |
| `/dashboard`, `/beds`, `/bills`, `/more` | Yes | Owner console |

## What we do **not** use for web

The mobile repo still contains `npm run web` (Expo static export) for quick previews, but **production web is NexPG-Web**. Do not deploy `NexPG/dist/` as the main web product.

Full web README: [`D:\@Projects\NexPG-Web\README.md`](../../NexPG-Web/README.md)
