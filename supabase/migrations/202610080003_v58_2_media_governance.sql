-- V58.0.2: institutional media governance and archive relationships.
-- Adds photographer/rights metadata, explicit album ownership on photographs,
-- and seeds draft album records without bypassing publication verification.

create table if not exists public.jyc_photographers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role text,
  profile_url text,
  social_url text,
  bio text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.jyc_photographers enable row level security;
drop policy if exists "public read published photographers" on public.jyc_photographers;
create policy "public read published photographers"
on public.jyc_photographers for select to anon, authenticated
using (is_published=true);
drop policy if exists "admins manage photographers" on public.jyc_photographers;
create policy "admins manage photographers"
on public.jyc_photographers for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','gallery_admin'))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','gallery_admin'));

alter table public.jyc_gallery_items
  add column if not exists album_id uuid references public.jyc_media_albums(id) on delete set null,
  add column if not exists photographer_id uuid references public.jyc_photographers(id) on delete set null,
  add column if not exists rights_holder text,
  add column if not exists rights_status text not null default 'review',
  add column if not exists license_name text,
  add column if not exists license_url text,
  add column if not exists usage_notes text,
  add column if not exists acquired_at timestamptz,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null;

alter table public.jyc_gallery_items
  drop constraint if exists jyc_gallery_items_rights_status_check;
alter table public.jyc_gallery_items
  add constraint jyc_gallery_items_rights_status_check
  check (rights_status in ('unknown','review','cleared','restricted','expired'));

create index if not exists jyc_gallery_album_idx on public.jyc_gallery_items(album_id,status);
create index if not exists jyc_gallery_photographer_idx on public.jyc_gallery_items(photographer_id);
create index if not exists jyc_gallery_rights_idx on public.jyc_gallery_items(rights_status,status);

-- Keep the institutional fallback explicit without pretending a named photographer exists.
insert into public.jyc_photographers(slug,name,role,bio,is_published)
values (
  'jyc-archive',
  'JYC Archive',
  'Archive credit',
  'Fallback attribution for supplied JYC archive material where an individual creator is not identified in the source record.',
  false
)
on conflict (slug) do nothing;

-- Every current published club gets a draft album shell. It becomes public only
-- after an editor supplies the final cover/story and publishes it.
insert into public.jyc_media_albums(name,slug,description,scope_type,club_id,cover_url,is_published)
select c.name || ' · Visual Archive',
       'club-' || c.slug,
       'Editorial archive for ' || c.name || '. Source photography remains governed by the JYC media verification and rights workflow.',
       'club',
       c.id,
       (select g.public_url from public.jyc_gallery_items g
        where g.club_id=c.id and g.status='approved' and nullif(g.public_url,'') is not null
        order by g.sort_order nulls last,g.created_at limit 1),
       false
from public.jyc_clubs c
where c.status='published'
on conflict (slug) do nothing;

-- Every published event gets a draft album shell. Existing approved event
-- photographs are associated where the relationship is already authoritative.
insert into public.jyc_media_albums(name,slug,description,scope_type,event_id,club_id,cover_url,is_published)
select e.title || ' · Visual Archive',
       'event-' || e.slug,
       'Photographic record of ' || e.title || '. Publication remains subject to JYC editorial, provenance and rights review.',
       'event',
       e.id::text,
       e.club_id,
       (select g.public_url from public.jyc_gallery_items g
        where g.event_id=e.id and g.status='approved' and nullif(g.public_url,'') is not null
        order by g.sort_order nulls last,g.created_at limit 1),
       false
from public.jyc_events e
where e.status='published'
on conflict (slug) do nothing;

-- Associate already-approved gallery records with their deterministic draft
-- album when the database already provides an explicit club/event relationship.
update public.jyc_gallery_items g
set album_id=a.id
from public.jyc_media_albums a
where g.album_id is null
  and a.is_published=false
  and (
    (g.event_id is not null and a.event_id= g.event_id::text)
    or
    (g.event_id is null and g.club_id is not null and a.club_id=g.club_id and a.scope_type='club')
  )
  and g.status='approved';

-- Unknown individual credits get the safe institutional wording requested by
-- the archive policy; existing explicit credits are never overwritten.
update public.jyc_gallery_items
set credit='Courtesy of JYC Archive',
    photographer_id=(select id from public.jyc_photographers where slug='jyc-archive'),
    rights_holder=coalesce(nullif(rights_holder,''),'JYC Archive'),
    rights_status=case when rights_status='unknown' then 'review' else rights_status end,
    reviewed_at=coalesce(reviewed_at,now())
where status='approved'
  and nullif(trim(coalesce(credit,'')),'') is null;

comment on column public.jyc_gallery_items.rights_status is
  'Editorial rights state. review is the safe default; only an authorized reviewer should mark a record cleared.';
comment on column public.jyc_gallery_items.album_id is
  'Explicit institutional album relationship; source-derived association remains a fallback when null.';


-- Verified public community links found during the current JIIT-128 source pass.
insert into public.jyc_club_links(club_id,label,url,sort_order)
select c.id,x.label,x.url,
       coalesce((select max(l.sort_order)+1 from public.jyc_club_links l where l.club_id=c.id),0)
from (values
  ('cinekala','LinkedIn','https://in.linkedin.com/company/cinekala'),
  ('cypherx','LinkedIn','https://www.linkedin.com/company/cypherx-jiit/'),
  ('zencoders','LinkedIn','https://www.linkedin.com/company/zencoders/'),
  ('neural-nexus','LinkedIn','https://www.linkedin.com/company/neural-nexus-jiit-noida/'),
  ('vamunique','Instagram','https://www.instagram.com/vamunique/')
) as x(slug,label,url)
join public.jyc_clubs c on c.slug=x.slug
where not exists(select 1 from public.jyc_club_links l where l.club_id=c.id and l.url=x.url);
