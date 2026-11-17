# Platform architecture — mobile & web in sync

## Two clients, one backend

NexPG uses **two separate codebases** that talk to the **same Supabase project**:

```
                    ┌─────────────────────┐
                    │   Supabase Cloud    │
                    │  Auth · Postgres    │
                    │  RLS · RPCs         │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
     ┌────────────────┐              ┌────────────────┐
     │  Mobile app    │              │  Web app       │
     │  Expo RN       │              │  Next.js       │
     │  D:\@Projects\ │              │  D:\@Projects\ │
     │  NexPG         │              │  NexPG-Web     │
     │  port 3000     │              │  port 3001     │
     └────────────────┘              └────────────────┘
```

There is **no sync engine**. When an owner adds a tenant on mobile, the web dashboard shows it after refresh — and vice versa — because both read and write the same database.

## Repositories

| App | Path | Stack |
|-----|------|-------|
| Mobile | `D:\@Projects\NexPG` | Expo SDK 54 + React Native |
| Web | `D:\@Projects\NexPG-Web` | Next.js 15 + React |

## What must stay aligned

When you change the backend or business rules, update **both** clients:

| Layer | Mobile path | Web path |
|-------|-------------|----------|
| Database migrations | `NexPG/supabase/migrations/` | (same files — run once in Supabase) |
| API / RPC calls | `NexPG/src/api/nexpg.ts` | `NexPG-Web/src/api/nexpg.ts` |
| Types | `NexPG/src/types/database.ts` | `NexPG-Web/src/types/database.ts` |
| Theme colors | `NexPG/src/theme/tokens.ts` | `NexPG-Web/src/theme/tokens.ts` + `globals.css` |

> **Future improvement:** extract `packages/shared` in a monorepo so types and API are imported once. For MVP, duplicate and keep in sync manually.

## How sync works

1. **Writes** use the same RPCs (`rpc_add_tenant`, `rpc_vacate_tenant`, etc.).
2. **Reads** use Supabase queries with RLS (`owner_id = auth.uid()`).
3. **Auth** — same email/password on both apps; sessions are per-device (SecureStore on mobile, cookies on web).
4. **React Query** invalidates caches after mutations on whichever device made the change.

## Environment variables

**Mobile** (`.env` in NexPG):

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

**Web** (`.env.local` in NexPG-Web):

```env
NEXT_PUBLIC_SUPABASE_URL=...        # same URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # same anon key
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

## Auth redirect URLs (Supabase dashboard)

```
http://localhost:3000/**
http://localhost:3001/**
https://your-mobile-domain.com/**
https://your-web-domain.com/**
```

## Design system

Both apps use the same hand-crafted palette (not AI-generated UI):

- Paper `#F7F5F1`, Ink `#16302B`, Ochre `#C97A2B`
- Fonts: Fraunces (display), Inter (body), IBM Plex Mono (numbers)

See [design-system.md](./design-system.md).

## APK distribution (mobile-first)

Web is the owner console on laptop. Daily on-site work is **mobile-first**. Owners request the Android APK from `/download` on the **web app**; download unlocks within 24 hours. See [apk-distribution.md](./apk-distribution.md).
