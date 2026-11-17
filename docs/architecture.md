# NexPG monorepo architecture

## Ownership boundaries

apps/web` owns browser/server rendering, SEO, web authentication adapters, CSS, and Vercel configuration.

`apps/mobile` owns Expo Router, native storage, native UI, EAS configuration, and mobile release tooling.

`packages/shared` contains only platform-neutral code. It must not import Next.js, React Native, browser globals, native modules, or app environment variables.

`supabase` is the database source of truth. New schema changes must be added here once and consumed by both apps through shared database types.`

## Shared-code rule

Share contracts and behavior, not platform UI. A database feature should normally include its migration, shared types, web behavior, mobile behavior, and tests in one pull request.

## Deployments

- Vercel project root directory: `apps/web`
- EAS commands: run from `apps/mobile` or through root workspace scripts
- Install dependencies from the repository root and commit only the root `package-lock.json`

## Migration safety

The original mobile repository used overlapping numeric migration versions with the web repository. Do not rename or replay already-applied production migrations based only on filenames. Reconcile the remote Supabase migration table before replacing the historical chain. New migrations belong in root `supabase/migrations` and must use a unique timestamp version.
