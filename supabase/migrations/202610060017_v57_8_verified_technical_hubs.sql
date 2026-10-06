-- V57.8: promote technical communities whose official/current web
-- presence was independently verified on 2026-10-06.
--
-- Sources:
-- CypherX: https://in.linkedin.com/company/cypherx-jiit
-- Dronotics: https://www.linkedin.com/company/dronotics-jiit-128
-- GDG JIIT-128: https://linktr.ee/gdg128 and current LinkedIn activity
-- ZENCODERS: https://www.linkedin.com/company/zencoders
--
-- Arcadia and Neural Nexus remain draft because no comparably strong official
-- community URL was found in this audit.

with admin_user as (
  select user_id
  from public.jyc_admins
  where is_active=true
  order by created_at
  limit 1
),
sources(slug,source_url,source_name,source_platform,confidence) as (
  values
    ('cypherx','https://in.linkedin.com/company/cypherx-jiit','CypherX_jiit','linkedin','official'),
    ('dronotics','https://www.linkedin.com/company/dronotics-jiit-128','Dronotics JIIT-128','linkedin','official'),
    ('gdg','https://linktr.ee/gdg128','GDG JIIT-128','linktree','strong'),
    ('zencoders','https://www.linkedin.com/company/zencoders','ZENCODERS','linkedin','strong')
)
insert into public.jyc_content_verification (
  entity_type,entity_id,campus_id,status,source_url,source_type,verified_by,verified_at,
  last_updated_at,notes,confidence,source_name,source_platform,source_captured_at,review_reason
)
select 'club',s.slug,'sector-128','verified',s.source_url,s.source_platform,a.user_id,now(),now(),
       'Independently verified current JIIT Sector 128 community presence during V57 audit.',
       s.confidence,s.source_name,s.source_platform,now(),null
from sources s cross join admin_user a
on conflict (entity_type,entity_id) do update set
  campus_id=excluded.campus_id,status=excluded.status,source_url=excluded.source_url,
  source_type=excluded.source_type,verified_by=excluded.verified_by,verified_at=excluded.verified_at,
  last_updated_at=excluded.last_updated_at,notes=excluded.notes,confidence=excluded.confidence,
  source_name=excluded.source_name,source_platform=excluded.source_platform,
  source_captured_at=excluded.source_captured_at,review_reason=null;

update public.jyc_clubs
set status='published',updated_at=now()
where slug in ('cypherx','dronotics','gdg','zencoders');
