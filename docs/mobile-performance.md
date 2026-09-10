# Mobile app — speed on slow networks (Expo / React Native)

Use the same ideas as the web app so PG owners on 2G/3G get a smooth experience.

## Data fetching (React Query)

Match web defaults in `NexPG` mobile:

- `staleTime`: 2 minutes — avoid refetch on every screen focus
- `refetchOnWindowFocus`: false
- `retry`: 1 (not 3)
- `networkMode`: `'offlineFirst'` — show cached data while reconnecting
- `placeholderData`: keepPreviousData — no blank flash when switching tabs

## Supabase

- Select only columns you render (same trimmed selects as `NexPG-Web/src/api/nexpg.ts`).
- Batch related reads with `Promise.all` where possible.
- Avoid polling; refetch on pull-to-refresh or after mutations.

## UI

- Skeleton / last-known data instead of full-screen spinners on every navigation.
- Toast for errors — not blocking inline forms.
- Keep one primary action per screen (MVP).

## Images & fonts

- Use system fonts or one bundled font; avoid loading from Google at runtime on slow networks.

Web reference: `src/lib/query.ts`, `src/lib/network.ts`.
