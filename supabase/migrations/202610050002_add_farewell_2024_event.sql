-- Add a source-backed historical JYC event to the public event archive.
insert into public.jyc_events
(slug,title,event_type,short_description,full_description,start_at,end_at,venue,status,featured,pinned)
select
  'farewell-2024',
  'Farewell 2024',
  'Farewell · Campus Celebration',
  'JIIT’s 2024 farewell for graduating batches, with cultural performances and JYC recognition.',
  'The official JIIT newsletter records Farewell 2024 on 4 May 2024 at the JIIT Auditorium. More than 700 graduating and junior-year students attended, with cultural performances and recognition for contributions to hub activities and JYC.',
  '2024-05-04T03:30:00+00',
  '2024-05-04T12:30:00+00',
  'JIIT Auditorium',
  'past',
  false,
  false
where not exists (select 1 from public.jyc_events where slug='farewell-2024');

insert into public.jyc_content_verification
(entity_type,entity_id,campus_id,status,source_url,source_type,notes)
select
  'event',
  'farewell-2024',
  'sector-128',
  'review',
  'https://www.jiit.ac.in/sites/default/files/Anunaad%20Vol%209-Issue2.pdf',
  'official-institute-newsletter',
  'Official JIIT newsletter records Farewell 2024 at JIIT Auditorium on 4 May 2024.'
where not exists (
  select 1 from public.jyc_content_verification
  where entity_type='event' and entity_id='farewell-2024'
);