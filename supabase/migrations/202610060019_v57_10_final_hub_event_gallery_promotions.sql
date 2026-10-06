-- V57.10 — final source-backed hub, event and gallery promotions.
begin;

do $block$
declare verifier uuid;
begin
  select user_id into verifier from public.jyc_admins where is_active=true order by created_at limit 1;
  if verifier is null then raise exception 'No active JYC admin exists; cannot perform V57.10 safely'; end if;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',verifier::text,'role','authenticated')::text,true);
  execute 'set local role authenticated';
end $block$;

insert into public.jyc_content_verification (
  entity_type,entity_id,campus_id,status,source_url,source_type,verified_by,verified_at,
  last_updated_at,notes,confidence,source_name,source_platform,source_captured_at,review_reason
)
select 'club',s.slug,'sector-128','verified',s.source_url,s.source_type,
  (select user_id from public.jyc_admins where is_active=true order by created_at limit 1),
  now(),now(),s.notes,s.confidence,s.source_name,s.source_platform,now(),null
from (values
  ('arcadia','https://www.instagram.com/arcadia_jiit/','official-source-material-social','Arcadia · JIIT Esports','instagram','strong','Supplied 2026–27 All Hubs material identifies Arcadia as the JIIT esports/gaming club and explicitly publishes @arcadia_jiit; the deck documents tournaments, gaming challenges and AR/VR Lab activity.'),
  ('neural-nexus','https://www.linkedin.com/company/neural-nexus-jiit-noida/','current-club-linkedin','Neural Nexus AI/ML Club','linkedin','official','Supplied 2026–27 All Hubs material identifies Neural Nexus as the official AI/ML society of JIIT; current public LinkedIn activity identifies Neural Nexus AI/ML Club at JIIT and documents its first workshop.')
) as s(slug,source_url,source_type,source_name,source_platform,confidence,notes)
on conflict (entity_type,entity_id) do update set
  campus_id=excluded.campus_id,status=excluded.status,source_url=excluded.source_url,
  source_type=excluded.source_type,verified_by=excluded.verified_by,verified_at=excluded.verified_at,
  last_updated_at=excluded.last_updated_at,notes=excluded.notes,confidence=excluded.confidence,
  source_name=excluded.source_name,source_platform=excluded.source_platform,
  source_captured_at=excluded.source_captured_at,review_reason=null;

update public.jyc_clubs set status='published',updated_at=now() where slug in ('arcadia','neural-nexus');

insert into public.jyc_content_verification (
  entity_type,entity_id,campus_id,status,source_url,source_type,verified_by,verified_at,
  last_updated_at,notes,confidence,source_name,source_platform,source_captured_at,review_reason
)
select 'event',s.slug,'sector-128','verified',s.source_url,s.source_type,
  (select user_id from public.jyc_admins where is_active=true order by created_at limit 1),
  now(),now(),s.notes,s.confidence,s.source_name,s.source_platform,now(),null
from (values
  ('innovate-3-0-2026','https://www.linkedin.com/posts/jiitofficial_innovate3-hacktobuild-innovationclub-activity-7424395513288003584-wpTw','official-university-social','JIIT official · INNOVATE 3.0','linkedin','official','JIIT official communication confirms INNOVATE 3.0 was organized by Innovation Club and JYC at JIIT Wish Town Campus, Sector 128, Noida; online rounds ran 12–17 Jan 2026 and the final was on campus on 17 Jan.'),
  ('bitbox-6-0-2026','https://www.gdg-jiit.com/bitbox','official-event-site','GDG JIIT-128 · BITBOX 6.0','official-site','official','Official GDG JIIT-128 event material confirms BITBOX 6.0; current GDG/JIIT communications identify the event as JIIT Sector 128 and date the main event to 18 Apr 2026.'),
  ('drono-o-war-2026','https://www.dronotics.in/','official-event-site','Dron-O-WAR official event site + Dronotics JIIT-128','official-site','official','Official Dron-O-WAR site confirms 2–3 May 2026 at JIIT Sector 128, Noida.'),
  ('sih-college-internals-26','https://www.innovationjiit.in/','official-JIIT-innovation-site','INNOVATION JIIT · SIH College Internals 2026','official-site','strong','Current INNOVATION JIIT site explicitly labels the internal Smart India Hackathon round as JIIT 128 and gives 24–25 Aug 2026.'),
  ('ride-hack-2026','https://www.innovationjiit.in/','official-JIIT-innovation-site','INNOVATION JIIT · RIDE Hack 26','official-site','official','Current INNOVATION JIIT communication gives the RIDE Hack 26 final as 1 Nov 2026 at JIIT Sector 128, Noida.'),
  ('jai-2026-jaypee-agentic-ai-hackathon','https://www.jiityouthclub128.in/','official-JYC-128-event-site','JYC 128 · JAI 2026','official-site','official','Current JAI 2026 official site confirms 30–31 Oct 2026 at JIIT Sector 128, Wish Town, Noida and publishes the official hackathon route.')
) as s(slug,source_url,source_type,source_name,source_platform,confidence,notes)
on conflict (entity_type,entity_id) do update set
  campus_id=excluded.campus_id,status=excluded.status,source_url=excluded.source_url,
  source_type=excluded.source_type,verified_by=excluded.verified_by,verified_at=excluded.verified_at,
  last_updated_at=excluded.last_updated_at,notes=excluded.notes,confidence=excluded.confidence,
  source_name=excluded.source_name,source_platform=excluded.source_platform,
  source_captured_at=excluded.source_captured_at,review_reason=null;

update public.jyc_events set status='published',updated_at=now(),
  venue=case slug
    when 'innovate-3-0-2026' then 'JIIT Wish Town Campus · Sector 128, Noida'
    when 'bitbox-6-0-2026' then 'JIIT Wish Town Campus · Sector 128, Noida'
    when 'drono-o-war-2026' then 'JIIT Sector 128, Noida'
    when 'sih-college-internals-26' then 'JIIT Wish Town Campus · Sector 128, Noida'
    when 'ride-hack-2026' then 'JIIT Wish Town Campus · Sector 128, Noida'
    when 'jai-2026-jaypee-agentic-ai-hackathon' then 'JIIT Wish Town Campus · Sector 128, Noida'
    else venue end
where slug in ('innovate-3-0-2026','bitbox-6-0-2026','drono-o-war-2026','sih-college-internals-26','ride-hack-2026','jai-2026-jaypee-agentic-ai-hackathon');

update public.jyc_content_verification
set status='verified',campus_id='sector-128',source_url='https://www.dronotics.in/',
  source_type='official-event-site + official JIIT-128 hub source',
  source_name='Dron-O-WAR official event site + Dronotics JIIT-128',
  source_platform='official-site + LinkedIn',confidence='official',
  verified_by=(select user_id from public.jyc_admins where is_active=true order by created_at limit 1),
  verified_at=now(),source_captured_at=now(),last_updated_at=now(),
  notes='Image-level provenance approved after matching the official DRON-O-WAR 1.0 event site and JIIT-128 Dronotics source.',
  review_reason=null
where entity_type='gallery' and entity_id in ('g-dronowar-1','g-dronowar-2');

update public.jyc_content_verification
set status='verified',campus_id='sector-128',source_url='https://www.jiityouthclub128.in/',
  source_type='official-JYC-128-event-site',source_name='JYC 128 · JAI 2026',
  source_platform='official-site',confidence='official',
  verified_by=(select user_id from public.jyc_admins where is_active=true order by created_at limit 1),
  verified_at=now(),source_captured_at=now(),last_updated_at=now(),
  notes='Image-level provenance approved against the current JAI 2026 official site; retain the supplied official visual rather than legacy JYC assets.',
  review_reason=null
where entity_type='gallery' and entity_id='g-jai-summit';

commit;
