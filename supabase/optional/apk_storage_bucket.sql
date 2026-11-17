-- Public bucket for canonical runmypg.apk (see docs/apk-distribution.md)
-- APK is often 60–90 MB — needs file_size_limit above default 50 MB (Pro plan or higher global limit).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'apk-releases',
  'apk-releases',
  true,
  157286400, -- 150 MiB
  array['application/vnd.android.package-archive', 'application/octet-stream']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read for APK objects (service role / dashboard upload still uses API key)
drop policy if exists apk_releases_public_read on storage.objects;
create policy apk_releases_public_read on storage.objects
  for select to public
  using (bucket_id = 'apk-releases');
