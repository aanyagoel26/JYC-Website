-- V58.0.6: give institutional albums an explicit narrative and hero field.
alter table public.jyc_media_albums
  add column if not exists narrative text,
  add column if not exists hero_url text;

update public.jyc_media_albums
set narrative=coalesce(nullif(narrative,''),description),
    hero_url=coalesce(nullif(hero_url,''),cover_url)
where is_published=false;

create index if not exists jyc_media_albums_scope_idx on public.jyc_media_albums(scope_type,club_id,event_id,is_published);