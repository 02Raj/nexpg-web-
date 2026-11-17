# Supabase source of truth

`migrations` contains the canonical ordered schema for NexPG. The original web and mobile repositories both used small numeric versions, so confirm the production project's applied migration history before adopting CLI-based `db push` against an existing database.

Rules for new changes:

1. Create the migration once in this directory.
2. Use a UTC timestamp version such as `20261117123000_add_feature.sql` to avoid collisions.
3. Make destructive changes backward-compatible with both deployed clients.
4. Update `@nexpg/shared/database` in the same pull request.
5. Verify web and mobile before deployment.

`optional/apk_storage_bucket.sql` is intentionally outside the automatic chain because its 150 MiB limit may require a paid Supabase plan.
