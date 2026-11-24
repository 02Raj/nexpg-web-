-- Add logo_url column to pg_buildings for ImageKit PG branding

alter table public.pg_buildings
  add column if not exists logo_url text;
