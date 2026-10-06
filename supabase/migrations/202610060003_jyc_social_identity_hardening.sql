-- V56.17.0 · remove legacy JYC social identities from public aggregation
-- The former JIIT Youth Club company/Instagram identities are not safe evidence for JYC 128.
update public.aggregated_posts p
set published=false, verified=false, updated_at=now()
where p.source_id in (
  select id from public.content_sources
  where hub_name='JYC'
    and url in ('https://www.instagram.com/jiityouthclub/','https://www.linkedin.com/company/jiityouthclub/')
);

update public.content_sources
set active=false, verified=false, updated_at=now()
where hub_name='JYC'
  and url in ('https://www.instagram.com/jiityouthclub/','https://www.linkedin.com/company/jiityouthclub/');

insert into public.content_sources (hub_name, platform, label, url, handle, source_type, verified, active, verified_by, verified_at)
values
 ('JYC','Official links','JIIT Youth Club 128 · Link hub','https://linktr.ee/jiityouthclub','', 'website', true, true, 'https://in.linkedin.com/in/jyc128', '2026-10-06'),
 ('JYC','LinkedIn','JIIT Youth Club 128 · LinkedIn','https://in.linkedin.com/in/jyc128','', 'social', true, true, 'https://in.linkedin.com/in/jyc128', '2026-10-06')
on conflict (hub_name, platform, url) do update set active=excluded.active, verified=excluded.verified, verified_by=excluded.verified_by, verified_at=excluded.verified_at, updated_at=now();

-- Campus evidence is conflicting for GDG JIIT-128 and insufficient for RPH; keep these public feeds off until a 128-specific source is verified.
update public.aggregated_posts p
set published=false, verified=false, updated_at=now()
where p.source_id in (
  select id from public.content_sources
  where hub_name in ('GDG','RPH')
    and active=true
);
update public.content_sources
set active=false, verified=false, updated_at=now()
where hub_name in ('GDG','RPH');
