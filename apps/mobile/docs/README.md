# NexPG documentation

Technical docs for the NexPG platform — **mobile (Expo)** + **web (Next.js)** + shared Supabase backend.

| Document | What it covers |
|----------|----------------|
| [Platform architecture](./platform-architecture.md) | Two apps, one backend, how data stays in sync |
| [Web app](./web-app.md) | Next.js project at `D:\@Projects\NexPG-Web` |
| [Design system](./design-system.md) | Shared theme — not AI-generated UI |
| [APK distribution](./apk-distribution.md) | 24-hour Android APK request flow |

## Quick facts

| | Mobile | Web |
|---|--------|-----|
| **Path** | `D:\@Projects\NexPG` | `D:\@Projects\NexPG-Web` |
| **Stack** | Expo SDK 54 | Next.js 15 |
| **Dev** | `npm start` → :3000 | `npm run dev` → :3001 |
| **Backend** | Supabase | Same Supabase project |

**Sync:** Same Postgres + RLS + RPCs. Same owner login. No duplicate database.
