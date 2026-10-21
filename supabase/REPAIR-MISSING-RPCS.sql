-- JYC runtime repair for an existing Supabase project.
-- Use this when the browser reports 404 for public.jyc_read_site_data.
-- Prerequisite: the JYC base tables/migrations already exist.

create or replace function public.jyc_read_site_data()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  raw jsonb;
  is_admin boolean;
begin
  select data into raw from public.jyc_site_data where id='main';
  raw := coalesce(raw,'{}'::jsonb);
  select exists(select 1 from public.jyc_admins where user_id=auth.uid() and is_active=true) into is_admin;
  if is_admin then return raw; end if;
  raw := jsonb_set(raw,'{clubs}',coalesce((select jsonb_agg(v order by lower(coalesce(v->>'name',''))) from jsonb_array_elements(coalesce(raw->'clubs','[]'::jsonb)) v where coalesce(v->>'published','false')='true' and coalesce(v->>'status','published') <> 'archived'),'[]'::jsonb),true);
  raw := jsonb_set(raw,'{events}',coalesce((select jsonb_agg(v order by coalesce(v->>'date','9999-99-99'),coalesce(v->>'start','99:99')) from jsonb_array_elements(coalesce(raw->'events','[]'::jsonb)) v where coalesce(v->>'published','false')='true' and coalesce(v->>'archived','false') <> 'true'),'[]'::jsonb),true);
  raw := jsonb_set(raw,'{gallery}',coalesce((select jsonb_agg(v order by coalesce(v->>'created_at','9999-99-99')) from jsonb_array_elements(coalesce(raw->'gallery','[]'::jsonb)) v where coalesce(v->>'published','true') <> 'false'),'[]'::jsonb),true);
  raw := jsonb_set(raw,'{team}',coalesce((select jsonb_agg(v order by case when coalesce(v->>'sortOrder','') ~ '^[0-9]+$' then (v->>'sortOrder')::int else 9999 end) from jsonb_array_elements(coalesce(raw->'team','[]'::jsonb)) v where coalesce(v->>'published','true')='true'),'[]'::jsonb),true);
  return raw - 'creator';
end;
$$;

revoke all on function public.jyc_read_site_data() from public;
grant execute on function public.jyc_read_site_data() to anon, authenticated;

select 'jyc_read_site_data repaired. Refresh the JYC website.' as result;
