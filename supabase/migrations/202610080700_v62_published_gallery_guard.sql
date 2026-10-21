-- V62: prevent published albums from being degraded by later gallery edits.
create or replace function public.jyc_guard_published_gallery_item()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  if new.album_id is null then
    return new;
  end if;

  if exists (
    select 1 from public.jyc_media_albums a
    where a.id=new.album_id and a.is_published=true
  ) then
    if new.status <> 'approved' or new.rights_status <> 'cleared'
       or new.focal_x is null or new.focal_y is null then
      raise exception 'A photograph linked to a published album must be approved, rights-cleared, and have a reviewed focal point';
    end if;

    if not exists (
      select 1
      from public.jyc_content_verification v
      where v.entity_type='gallery'
        and v.entity_id=new.id::text
        and v.status in ('verified','published','approved')
    ) then
      raise exception 'A photograph linked to a published album must have resolved provenance verification';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists jyc_guard_published_gallery_item on public.jyc_gallery_items;
create trigger jyc_guard_published_gallery_item
before insert or update of album_id,status,rights_status,focal_x,focal_y
on public.jyc_gallery_items
for each row execute function public.jyc_guard_published_gallery_item();

revoke all on function public.jyc_guard_published_gallery_item() from public;
grant execute on function public.jyc_guard_published_gallery_item() to authenticated;
