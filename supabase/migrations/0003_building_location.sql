-- Property location: state + address (all-India PG support)
-- city remains free text; popular IT-hub cities are UI presets only.

alter table public.pg_buildings
  add column if not exists state text,
  add column if not exists address text;

comment on column public.pg_buildings.state is 'Indian state or UT name';
comment on column public.pg_buildings.address is 'Optional street / sector / landmark';
