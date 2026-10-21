-- V56.3 source-event depth.
-- Review-stage records only; publication remains gated by verification.
-- IDs are resolved by stable club slugs/names rather than hard-coded UUIDs.
with source_events as (
  select c.id club_id,v.*
  from (values
    ('innovation-club','ride-hack-2026','RIDE Hack''26','Innovation Hackathon','JIIT Innovation''s startup-expo hackathon connecting students with technology, AI and an innovation ecosystem.','Source-backed review record from official JIIT Innovation public event communication. Verify date, registration and prize/funding claims before publication.','2026-11-01 09:00:00+05:30'::timestamptz,'2026-11-01 18:00:00+05:30'::timestamptz,'JIIT Wish Town Campus · Sector 128, Noida'),
    ('dronotics','drono-o-war-2026','DRONO-O-WAR 1.0','National Drone Championship','A national drone competition at JIIT Sector 128 spanning FPV racing, payload delivery, autonomous missions, drone design and RC aircraft challenges.','Source-backed Dronotics record. Verify archival metadata before publication.','2026-05-02 09:00:00+05:30'::timestamptz,'2026-05-03 18:00:00+05:30'::timestamptz,'JIIT Sector 128, Noida'),
    ('innovation-club','codeai-2026','CodeAI Hackathon','AI Hackathon','An Innovation JIIT AI hackathon connecting cybersecurity, NLP and healthcare-oriented problem solving.','Source-backed Innovation JIIT record. Verify archival metadata before publication.','2026-04-25 09:00:00+05:30'::timestamptz,'2026-04-26 18:00:00+05:30'::timestamptz,'JIIT Noida'),
    ('cicr','techtonic-2-0','TechTonic 2.0','AI / ML + Robotics Workshop','A hands-on AI/ML and robotics workshop experience associated with CICR.','Source-backed CICR record; source currently lists the date as TBA.',null,null,'JIIT-128, Noida'),
    ('rph','code-clash-25-1','Code Clash 25.1','Competitive Programming','RPH coding competition experience with two contests and 850+ participants as documented in supplied RPH material.','Supplied RPH orientation record; date and registration details were not supplied.',null,null,'JIIT-128, Noida'),
    ('rph','code-clash-25-2','Code Clash 25.2','Competitive Programming','RPH coding competition experience documented with 500+ participants in supplied source material.','Supplied RPH orientation record; date and registration details were not supplied.',null,null,'JIIT-128, Noida')
  ) v(club_slug,slug,title,event_type,short_description,full_description,start_at,end_at,venue)
  join public.jyc_clubs c on c.slug=v.club_slug
)
insert into public.jyc_events(club_id,slug,title,event_type,short_description,full_description,start_at,end_at,venue,status,featured,pinned)
select club_id,slug,title,event_type,short_description,full_description,start_at,end_at,venue,'under_review',false,false
from source_events
on conflict (slug) do nothing;

insert into public.jyc_content_verification(entity_type,entity_id,status,source_url,source_type,notes)
select 'event',e.id::text,'review',v.source_url,v.source_type,v.notes
from (values
 ('ride-hack-2026','https://www.innovationjiit.in/','official-website','RIDE Hack source record; verify before publication.'),
 ('drono-o-war-2026','https://www.dronotics.in/','official-website','DRONO-O-WAR archive record; verify before publication.'),
 ('codeai-2026','https://www.innovationjiit.in/','official-website','CodeAI archive record; verify before publication.'),
 ('techtonic-2-0','https://www.cicr.in/','official-website','TechTonic 2.0 source record; date is TBA in source.'),
 ('code-clash-25-1','https://www.jiityouthclub128.in/','supplied-source','RPH orientation record; date not supplied.'),
 ('code-clash-25-2','https://www.jiityouthclub128.in/','supplied-source','RPH orientation record; date not supplied.')
) v(slug,source_url,source_type,notes)
join public.jyc_events e on e.slug=v.slug
on conflict (entity_type,entity_id) do update set status=excluded.status,source_url=excluded.source_url,source_type=excluded.source_type,notes=excluded.notes,last_updated_at=now();