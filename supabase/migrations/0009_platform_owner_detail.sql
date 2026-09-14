-- Platform admin: owner phone + property details for contact / CRM.

alter table public.owner_profiles
  add column if not exists phone text;

create or replace function public.handle_new_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.owner_profiles (id, email, full_name, phone, created_at)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), ''),
    coalesce(new.created_at, now())
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), owner_profiles.full_name),
    phone = coalesce(nullif(excluded.phone, ''), owner_profiles.phone),
    updated_at = now();
  return new;
end;
$$;

create or replace function public.rpc_platform_list_owners()
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return (
    select coalesce(json_agg(row_to_json(x) order by x.created_at desc), '[]'::json)
    from (
      select
        op.id,
        op.email,
        op.full_name,
        op.phone,
        op.is_active,
        op.created_at,
        op.deactivated_at,
        (select count(*)::int from pg_buildings b where b.owner_id = op.id) as building_count,
        (select count(*)::int from tenants t where t.owner_id = op.id and t.status = 'active') as active_tenant_count,
        (
          select a.status
          from apk_download_requests a
          where a.owner_id = op.id
          order by a.requested_at desc
          limit 1
        ) as latest_apk_status,
        (
          select coalesce(json_agg(row_to_json(b) order by b.created_at), '[]'::json)
          from (
            select
              pb.id,
              pb.name,
              pb.city,
              pb.state,
              pb.address,
              pb.created_at
            from pg_buildings pb
            where pb.owner_id = op.id
          ) b
        ) as properties
      from owner_profiles op
    ) x
  );
end;
$$;
