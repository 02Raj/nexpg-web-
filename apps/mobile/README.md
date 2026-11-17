# RunMyPG Mobile

Expo / React Native owner app for NexPG. This app is the `@nexpg/mobile` workspace in the platform monorepo.

The MVP covers tenant move-in, bed occupancy, monthly rent invoices, payment status, security deposits, and vacancy flows against the same Supabase backend used by the web app.

## Run locally

From the repository root:

```bash
npm install
npm run dev:mobile
```

The Metro server runs on port 3000 and loads `apps/mobile/.env`.

Required public configuration:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Commands

```bash
npm run android
npm run ios
npm run typecheck --workspace=@nexpg/mobile
npm run test --workspace=@nexpg/mobile
npm run build:android:preview --workspace=@nexpg/mobile
```

## Architecture

- Expo Router owns navigation and screens in `app`.
- Mobile-only storage, deep links, and Supabase adapters stay in this workspace.
- Platform-neutral database types, date/currency formatting, and locations come from `@nexpg/shared`.
- Database migrations live at the repository root in `supabase/migrations`.
- Run EAS from this directory or through the root workspace commands so the entire monorepo is available to the builder.

See the root [architecture guide](../../docs/architecture.md) and the mobile guides in [`docs`](./docs).
