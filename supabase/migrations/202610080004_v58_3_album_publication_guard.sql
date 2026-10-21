-- V58.0.3: make album publication honor media approval and rights clearance.
create or replace function public.jyc_guard_media_album_publication()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  total_count integer;
  bad_count integer;
begin
  if new.is_published is distinct from true then
    return new;
  end if;

  select count(*) into total_count
  from public.jyc_gallery_items
  where album_id=new.id;

  if total_count=0 then
    raise exception 'Album cannot be published without at least one linked photograph';
  end if;

  select count(*) into bad_count
  from public.jyc_gallery_items
  where album_id=new.id
    and (status <> 'approved' or rights_status <> 'cleared');

  if bad_count>0 then
    raise exception 'Album cannot be published while linked photographs are unapproved or rights are not cleared';
  end if;

  if exists (
    select 1
    from public.jyc_gallery_items g
    join public.jyc_content_verification v
      on v.entity_type='gallery' and v.entity_id=g.id::text
    where g.album_id=new.id
      and coalesce(v.status,'') not in ('verified','published','approved')
  ) then
    raise exception 'Album cannot be published while linked provenance verification is unresolved';
  end if;

  return new;
end;
$$;

drop trigger if exists jyc_guard_media_album_publication on public.jyc_media_albums;
create trigger jyc_guard_media_album_publication
before insert or update of is_published on public.jyc_media_albums
for each row execute function public.jyc_guard_media_album_publication();

revoke all on function public.jyc_guard_media_album_publication() from public;
grant execute on function public.jyc_guard_media_album_publication() to authenticated;
