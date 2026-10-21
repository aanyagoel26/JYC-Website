-- V56 normalized content bridge
-- Keeps the canonical JSON site snapshot and relational public model connected.
-- Seeded/applied on 2026-10-04 against production project ogbanmjokjlxfuktkicj.
--
-- The 17 published clubs / 2 review events come from jyc_site_data.main.
-- Six additional source-only hubs are intentionally draft until publication review.

insert into public.jyc_clubs
  (slug,name,type,category,short_description,full_description,status,pinned,featured,recruitment_enabled,auditions_enabled)
select
  lower(regexp_replace(regexp_replace(c->>'name','[^a-zA-Z0-9]+','-','g'), '(^-|-$)', '', 'g')),
  c->>'name',
  case when lower(coalesce(c->>'type',''))='technical' then 'Technical' else 'Non-Technical' end,
  c->>'category',
  coalesce(c->>'description',c->>'about','JYC community'),
  c->>'about',
  case when coalesce(c->>'published','false')='true' and coalesce(c->>'status','')='published' then 'published' else 'draft' end,
  coalesce((c->>'pinned')::boolean,false),
  coalesce((c->>'featured')::boolean,false),
  coalesce((c->'recruitment'->>'on')::boolean,false),
  false
from jsonb_array_elements((select data->'clubs' from public.jyc_site_data where id='main')) c
on conflict (slug) do update set
  name=excluded.name,type=excluded.type,category=excluded.category,
  short_description=excluded.short_description,full_description=excluded.full_description,
  status=excluded.status,pinned=excluded.pinned,featured=excluded.featured,
  recruitment_enabled=excluded.recruitment_enabled,auditions_enabled=excluded.auditions_enabled,
  updated_at=now();

insert into public.jyc_events
  (club_id,slug,title,event_type,poster_url,short_description,full_description,start_at,end_at,venue,registration_url,eligibility,status,featured,pinned)
select
  (select id from public.jyc_clubs where lower(name)=lower(coalesce(e->>'club','')) limit 1),
  lower(regexp_replace(regexp_replace(e->>'title','[^a-zA-Z0-9]+','-','g'), '(^-|-$)', '', 'g')),
  e->>'title',e->>'eventType',e->>'poster',e->>'description',e->>'description',
  case when e->>'date'<>'' then ((e->>'date')||' '||coalesce(nullif(e->>'start',''),'00:00')||':00+05:30')::timestamptz end,
  case when e->>'dateEnd'<>'' then ((e->>'dateEnd')||' '||coalesce(nullif(e->>'end',''),'23:59')||':00+05:30')::timestamptz end,
  e->>'venue',e->>'registrationUrl',e->>'eligibility',
  case when coalesce(e->>'published','false')='true' and coalesce(e->>'status','')='published' then 'published' else 'under_review' end,
  coalesce((e->>'featured')::boolean,false),coalesce((e->>'pinned')::boolean,false)
from jsonb_array_elements((select data->'events' from public.jyc_site_data where id='main')) e
on conflict (slug) do update set
  club_id=excluded.club_id,event_type=excluded.event_type,poster_url=excluded.poster_url,
  short_description=excluded.short_description,full_description=excluded.full_description,
  start_at=excluded.start_at,end_at=excluded.end_at,venue=excluded.venue,
  registration_url=excluded.registration_url,eligibility=excluded.eligibility,
  status=excluded.status,featured=excluded.featured,pinned=excluded.pinned,updated_at=now();

insert into public.jyc_clubs
  (slug,name,type,category,short_description,full_description,status,pinned,featured,recruitment_enabled,auditions_enabled)
values
('arcadia','Arcadia','Technical','Esports / Gaming','A gaming and esports community for competition, collaboration and campus play.','Source-material profile: Arcadia is presented around esports action, teamwork, community and gaming experiences, including Flappy Bird and Aim Labs activities in the AR/VR Lab.','draft',false,false,false,false),
('cypherx','CypherX','Technical','Cybersecurity','The student-led cybersecurity society of JIIT-128.','Source-material profile: CypherX focuses on cybersecurity awareness and practical learning through workshops, Capture the Flag challenges, projects and mentorship.','draft',false,false,false,false),
('dronotics','Dronotics','Technical','Drones / Aerial Robotics','An official drone and aerial robotics club.','Source-material profile: Dronotics is a hands-on drone and aerial robotics community built around projects, workshops, flight simulation and competitions; Dron-O-War is a signature competition.','draft',false,false,false,false),
('gdg','GDG','Technical','Developer Community','A developer-focused technical community listed in the JYC ecosystem.','Source-material profile: GDG is listed in the JYC technical-society material as a developer community; current chapter activity should be updated from approved records.','draft',false,false,false,false),
('neural-nexus','Neural Nexus','Technical','AI / ML','The official Artificial Intelligence & Machine Learning society of JIIT.','Source-material profile: Neural Nexus focuses on AI/ML fundamentals, programming, tools, real-world projects, hackathons, coding competitions, AI challenges, workshops and mentor networking.','draft',false,false,false,false),
('zencoders','Zencoders','Technical','Programming / Development','A coding community focused on programming excellence and collaborative learning.','Source-material profile: ZenCoders centres coding excellence, practical learning, open-source participation, tutorials, coding bootcamps, study groups, hackathons and coding challenges.','draft',false,false,false,false)
on conflict (slug) do update set
  category=excluded.category,short_description=excluded.short_description,
  full_description=excluded.full_description,status='draft',updated_at=now();
