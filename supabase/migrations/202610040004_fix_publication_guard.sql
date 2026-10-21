create or replace function public.jyc_guard_json_publication()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  item jsonb;
  old_item jsonb;
  v_entity_id text;
begin
  for item in
    select value from jsonb_array_elements(coalesce(new.data->'clubs','[]'::jsonb))
    where coalesce(value->>'published','false')='true'
  loop
    v_entity_id := item->>'id';
    old_item := coalesce(
      (select value from jsonb_array_elements(coalesce(old.data->'clubs','[]'::jsonb)) value
       where value->>'id'=v_entity_id limit 1),'{}'::jsonb);
    if coalesce(old_item->>'published','false') <> 'true'
       and not exists (
         select 1 from public.jyc_content_verification v
         where v.entity_type='club' and v.entity_id=v_entity_id
           and v.campus_id is not null and v.status in ('verified','published')
           and (v.expires_at is null or v.expires_at>now()))
    then
      raise exception 'Club % cannot be published before verification', v_entity_id using errcode='check_violation';
    end if;
  end loop;

  for item in
    select value from jsonb_array_elements(coalesce(new.data->'events','[]'::jsonb))
    where coalesce(value->>'published','false')='true'
  loop
    v_entity_id := item->>'id';
    old_item := coalesce(
      (select value from jsonb_array_elements(coalesce(old.data->'events','[]'::jsonb)) value
       where value->>'id'=v_entity_id limit 1),'{}'::jsonb);
    if coalesce(old_item->>'published','false') <> 'true'
       and not exists (
         select 1 from public.jyc_content_verification v
         where v.entity_type='event' and v.entity_id=v_entity_id
           and v.campus_id is not null and v.status in ('verified','published')
           and (v.expires_at is null or v.expires_at>now()))
    then
      raise exception 'Event % cannot be published before verification', v_entity_id using errcode='check_violation';
    end if;
  end loop;
  return new;
end;
$$;

revoke execute on function public.jyc_guard_json_publication() from public,anon,authenticated;
grant execute on function public.jyc_guard_json_publication() to service_role;