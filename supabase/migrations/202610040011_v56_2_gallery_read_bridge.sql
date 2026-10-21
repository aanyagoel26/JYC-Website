-- V56.2 — connect approved normalized gallery media to the public JSON read path.
-- Pending/review media remains invisible; only status='published' records are appended.
create or replace function public.jyc_read_site_data()
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  raw jsonb;
  is_admin boolean;
begin
  select data into raw from public.jyc_site_data where id='main';
  raw := coalesce(raw,'{}'::jsonb);

  select exists(
    select 1 from public.jyc_admins
    where user_id=auth.uid() and is_active=true
  ) into is_admin;

  if is_admin then return raw; end if;

  raw := jsonb_set(raw,'{clubs}',coalesce((
    select jsonb_agg(v order by lower(coalesce(v->>'name','')))
    from jsonb_array_elements(coalesce(raw->'clubs','[]'::jsonb)) v
    where coalesce(v->>'published','false')='true'
      and coalesce(v->>'status','published') <> 'archived'
  ),'[]'::jsonb),true);

  raw := jsonb_set(raw,'{events}',coalesce((
    select jsonb_agg(v order by coalesce(v->>'date','9999-99-99'),coalesce(v->>'start','99:99'))
    from jsonb_array_elements(coalesce(raw->'events','[]'::jsonb)) v
    where coalesce(v->>'published','false')='true'
      and coalesce(v->>'archived','false') <> 'true'
  ),'[]'::jsonb),true);

  raw := jsonb_set(raw,'{gallery}',coalesce((
    select jsonb_agg(item order by created_sort)
    from (
      select distinct on (url) url,item,created_sort
      from (
        select v->>'url' as url,v as item,coalesce(v->>'created_at','9999-12-31T23:59:59Z') as created_sort
        from jsonb_array_elements(coalesce(raw->'gallery','[]'::jsonb)) v
        where coalesce(v->>'published','true') <> 'false' and nullif(v->>'url','') is not null
        union all
        select g.public_url,
          jsonb_build_object(
            'id',g.id::text,'url',g.public_url,'caption',g.caption,
            'association',coalesce(nullif(g.source_label,''),'JYC Archive'),
            'year',g.source_year,'mediaKind',g.media_kind,'media_kind',g.media_kind,
            'alt',coalesce(g.alt_text,g.caption,'JYC visual archive'),
            'sourceType',g.source_type,'sourceLabel',g.source_label,
            'sourcePage',g.source_page,'sourceUrl',g.source_url,'credit',g.credit,
            'focalX',g.focal_x,'focalY',g.focal_y,'published',true
          ),
          coalesce(g.created_at::text,'9999-12-31T23:59:59Z')
        from public.jyc_gallery_items g
        where g.status='published' and nullif(g.public_url,'') is not null
      ) candidates
      order by url,created_sort
    ) dedup
  ),'[]'::jsonb),true);

  raw := jsonb_set(raw,'{team}',coalesce((
    select jsonb_agg(v order by case when coalesce(v->>'sortOrder','') ~ '^[0-9]+$' then (v->>'sortOrder')::int else 9999 end)
    from jsonb_array_elements(coalesce(raw->'team','[]'::jsonb)) v
    where coalesce(v->>'published','true')='true'
  ),'[]'::jsonb),true);

  return raw - 'creator';
end;
$function$;

revoke execute on function public.jyc_read_site_data() from public;
grant execute on function public.jyc_read_site_data() to anon,authenticated;
