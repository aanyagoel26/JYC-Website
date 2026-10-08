-- V63.1: harden human editorial and rights-review bookkeeping.
alter table public.jyc_gallery_items
  add column if not exists editorial_reviewed_at timestamptz;

create or replace function public.jyc_stamp_gallery_editorial_review()
returns trigger
language plpgsql
security invoker
set search_path=public
as $$
begin
  if new.editorial_status is distinct from old.editorial_status
     or new.editorial_score is distinct from old.editorial_score
     or new.focal_x is distinct from old.focal_x
     or new.focal_y is distinct from old.focal_y
     or new.album_id is distinct from old.album_id
  then
    new.editorial_reviewed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists jyc_stamp_gallery_editorial_review on public.jyc_gallery_items;
create trigger jyc_stamp_gallery_editorial_review
before update on public.jyc_gallery_items
for each row execute function public.jyc_stamp_gallery_editorial_review();

create or replace function public.jyc_guard_gallery_rights_review()
returns trigger
language plpgsql
security invoker
set search_path=public
as $$
begin
  if new.rights_status is distinct from old.rights_status
     or new.rights_holder is distinct from old.rights_holder
     or new.license_name is distinct from old.license_name
     or new.license_url is distinct from old.license_url
     or new.usage_notes is distinct from old.usage_notes
  then
    new.reviewed_at := now();
    new.reviewed_by := auth.uid();
  end if;

  if new.rights_status = 'cleared' then
    if auth.uid() is null then
      raise exception 'Rights clearance requires an authenticated reviewer';
    end if;
    if new.reviewed_at is null or new.reviewed_by is null then
      raise exception 'Rights clearance requires review metadata';
    end if;
    if coalesce(nullif(trim(new.rights_holder),''),nullif(trim(new.license_name),''),nullif(trim(new.license_url),''),nullif(trim(new.usage_notes),'')) is null then
      raise exception 'Rights clearance requires evidence, rights-holder, license, or usage notes';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists jyc_guard_gallery_rights_review on public.jyc_gallery_items;
create trigger jyc_guard_gallery_rights_review
before update on public.jyc_gallery_items
for each row execute function public.jyc_guard_gallery_rights_review();

revoke all on function public.jyc_stamp_gallery_editorial_review() from public;
revoke all on function public.jyc_guard_gallery_rights_review() from public;
grant execute on function public.jyc_stamp_gallery_editorial_review() to authenticated;
grant execute on function public.jyc_guard_gallery_rights_review() to authenticated;
