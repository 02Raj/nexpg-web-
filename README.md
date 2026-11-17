# NexPG Platform

NexPG is maintained as one monorepo so database contracts, domain rules, web, and mobile can change atomically.

## Workspaces

- `apps/web` — Next.js web and platform console
- `apps/mobile` — Expo / React Native mobile app
- `packages/shared` — platform-neutral TypeScript used by both apps
- `supabase` — canonical database assets and migration history

## Setup

```bash
npm install
```

Keep secrets app-local in `apps/web/.env.local` and `apps/mobile/.env`.

## Commands

```bash
npm run dev:web
npm run dev:mobile
npm run typecheck
npm test
npm run verify
```

Run app-specific scripts from the root with npm's workspace flag, for example:

```bash
npm run build:android:preview --workspace=@nexpg/mobile
npm run logos:export --workspace=@nexpg/web
```

See [`docs/architecture.md`](docs/architecture.md) for ownership boundaries and deployment configuration.
