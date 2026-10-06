-- V57 public event read scope. This file mirrors the production function definition applied to Supabase.
CREATE OR REPLACE FUNCTION public.jyc_read_site_data()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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

  if is_admin then
    return raw;
  end if;

  raw := jsonb_set(raw,'{clubs}',coalesce((
    select jsonb_agg(item order by lower(coalesce(item->>'name','')))
    from (
      select distinct on (coalesce(c.slug, lower(trim(c.name))))
        jsonb_build_object(
          'id',c.id::text,'slug',c.slug,'name',c.name,'type',c.type,
          'category',c.category,'subcategory',c.subcategory,
          'logo',coalesce(c.logo_url,''),'banner',coalesce(c.banner_url,''),
          'shortDescription',coalesce(c.short_description,''),
          'description',coalesce(c.full_description,c.short_description,''),
          'about',coalesce(c.full_description,c.short_description,''),
          'status',c.status,'published',true,
          'pinned',coalesce(c.pinned,false),'featured',coalesce(c.featured,false),
          'recruitment',jsonb_build_object(
            'on',coalesce(c.recruitment_enabled,false),
            'link','','title','Recruitment Open','deadline',''
          ),
          'auditions',coalesce(c.auditions_enabled,false)
        ) as item
      from public.jyc_clubs c
      where c.status='published'
      order by coalesce(c.slug, lower(trim(c.name))), c.updated_at desc nulls last
    ) clubs
  ),'[]'::jsonb),true);

  raw := jsonb_set(raw,'{events}',coalesce((
    select jsonb_agg(item order by sort_key)
    from (
      select distinct on (event_key) event_key,item,sort_key
      from (
        select coalesce(v->>'id',v->>'title') event_key,
          v item,
          coalesce(v->>'date','9999-99-99')||' '||coalesce(v->>'start','99:99') sort_key
        from jsonb_array_elements(coalesce(raw->'events','[]'::jsonb)) v
        where coalesce(v->>'published','false')='true'
          and coalesce(v->>'archived','false') <> 'true'
        union all
        select e.slug,
          jsonb_build_object(
            'id',e.id::text,'slug',e.slug,'title',e.title,
            'club',coalesce(c.name,'JYC'),'clubId',e.club_id,
            'eventType',e.event_type,
            'poster',coalesce(e.poster_url,e.banner_url,''),
            'banner',e.banner_url,
            'description',coalesce(e.full_description,e.short_description,''),
            'date',to_char(e.start_at at time zone 'Asia/Kolkata','YYYY-MM-DD'),
            'dateEnd',case when e.end_at is not null then to_char(e.end_at at time zone 'Asia/Kolkata','YYYY-MM-DD') else null end,
            'start',case when e.start_at is not null then to_char(e.start_at at time zone 'Asia/Kolkata','HH24:MI') else null end,
            'end',case when e.end_at is not null then to_char(e.end_at at time zone 'Asia/Kolkata','HH24:MI') else null end,
            'venue',e.venue,'map_url',e.map_url,
            'registrationUrl',e.registration_url,
            'registrationDeadline',e.registration_deadline,
            'eligibility',e.eligibility,'fee',e.fee,
            'published',true,'archived',false,'status',e.status,
            'featured',e.featured,'pinned',e.pinned,
            'publicStatus',case when e.status='under_review' then 'planned' else e.status end,
            'sourceType',case when e.status='under_review' then v.source_type else 'normalized-jyc-events' end,
            'sourceLabel',case when e.status='under_review' then 'Planned · source under review' else 'JYC normalized event record' end,
            'sourceUrl',case when e.status='under_review' then v.source_url else null end
          ),
          coalesce(e.start_at::text,'9999-12-31T23:59:59Z')
        from public.jyc_events e
        left join public.jyc_clubs c on c.id=e.club_id
        left join lateral (
          select cv.source_type,cv.source_url
          from public.jyc_content_verification cv
          where cv.entity_type='event'
            and cv.entity_id=e.slug
            and cv.status in ('review','verified','published')
            and nullif(cv.source_url,'') is not null
            and cv.source_url like 'https://%'
          order by case cv.status when 'verified' then 1 when 'published' then 2 else 3 end,
                   cv.created_at desc
          limit 1
        ) v on true
        where e.status in ('published','ongoing','past')
           or (e.status='under_review' and v.source_url is not null)
      ) candidates
      order by event_key,sort_key
    ) dedup
  ),'[]'::jsonb),true);

  -- Defense in depth: the public RPC itself, not only the browser, is scoped to JIIT 128.
  -- Historical/JIIT-wide records without a 128 venue are not exposed through this public feed.
  raw := jsonb_set(raw,'{events}',coalesce((
    select jsonb_agg(v order by coalesce(v->>'date','9999-99-99'),coalesce(v->>'start','99:99'))
    from jsonb_array_elements(coalesce(raw->'events','[]'::jsonb)) v
    where (
      lower(coalesce(v->>'venue','')) like '%128%'
      or lower(coalesce(v->>'venue','')) like '%wish town%'
      or lower(coalesce(v->>'venue','')) like '%jiit-128%'
    )
    and lower(coalesce(v->>'venue','')) not like '%sector 62%'
    and lower(coalesce(v->>'venue','')) not like '%sector-62%'
  ),'[]'::jsonb),true);

  raw := jsonb_set(raw,'{gallery}',coalesce((
    select jsonb_agg(item order by created_sort)
    from (
      select distinct on (url) url,item,created_sort
      from (
        select v->>'url' url,v item,coalesce(v->>'created_at','9999-12-31T23:59:59Z') created_sort
        from jsonb_array_elements(coalesce(raw->'gallery','[]'::jsonb)) v
        where coalesce(v->>'published','true') <> 'false'
          and nullif(v->>'url','') is not null
        union all
        select g.public_url,
          jsonb_build_object(
            'id',g.id::text,'url',g.public_url,'caption',g.caption,
            'association',coalesce(nullif(g.source_label,''),'JYC Archive'),
            'year',g.source_year,'mediaKind',g.media_kind,'media_kind',g.media_kind,
            'alt',coalesce(g.alt_text,g.caption,'JYC visual archive'),
            'sourceType',g.source_type,'sourceLabel',g.source_label,'sourcePage',g.source_page,
            'sourceUrl',g.source_url,'credit',g.credit,'focalX',g.focal_x,'focalY',g.focal_y,
            'published',true
          ),
          coalesce(g.created_at::text,'9999-12-31T23:59:59Z')
        from public.jyc_gallery_items g
        where g.status='approved' and nullif(g.public_url,'') is not null
      ) candidates
      order by url,created_sort
    ) dedup
  ),'[]'::jsonb),true);

  raw := jsonb_set(raw,'{team}',coalesce((
    select jsonb_agg(v order by case
      when coalesce(v->>'sortOrder','') ~ '^[0-9]+$' then (v->>'sortOrder')::int
      else 9999 end)
    from jsonb_array_elements(coalesce(raw->'team','[]'::jsonb)) v
    where coalesce(v->>'published','true')='true'
  ),'[]'::jsonb),true);

  return raw - 'creator';
end;
$function$
