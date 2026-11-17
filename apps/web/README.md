# RunMyPG Web

Next.js owner console, marketing site, and platform-admin console for NexPG. This app is the `@nexpg/web` workspace in the platform monorepo.

## Run locally

From the repository root:

```bash
npm install
npm run dev:web
```

The app runs at <http://localhost:3001> and loads `apps/web/.env.local`.

Required public configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

For production, set `NEXT_PUBLIC_SITE_URL=https://www.runmypg.in`. Configure the matching local and production callback URLs in Supabase Auth.

## Commands

```bash
npm run dev --workspace=@nexpg/web
npm run typecheck --workspace=@nexpg/web
npm run test --workspace=@nexpg/web
npm run build:web
```

## Architecture

- Platform-neutral database types, date/currency formatting, and locations come from `@nexpg/shared`.
- Web-only Supabase clients and authentication adapters stay in this workspace.
- Database migrations live at the repository root in `supabase/migrations`.
- Deploy with the Vercel project root set to `apps/web`.

See the root [architecture guide](../../docs/architecture.md) and the operational guides in [`docs`](./docs).
