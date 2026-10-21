-- V56.7 normalized publication verification guard
-- Keep the relational public model aligned with the same source-verification contract
-- used by the canonical JSON site snapshot.
begin;

-- Reconcile the current production drift first. These records remain available through
-- the source-material layer, but must not be presented as verified current records.
update public.jyc_clubs c
set status='draft', updated_at=now()
where c.status='published'
  and not exists (
    select 1
    from public.jyc_content_verification v
    where v.entity_type='club'
      and v.entity_id in (c.slug,'club-'||c.slug)
      and v.campus_id is not null
      and v.status in ('verified','published')
      and nullif(v.source_url,'') is not null
      and v.source_url ~* '^https://'
      and (v.expires_at is null or v.expires_at>now())
  );

update public.jyc_events e
set status='under_review', updated_at=now()
where e.status in ('published','ongoing','past')
  and not exists (
    select 1
    from public.jyc_content_verification v
    where v.entity_type='event'
      and v.entity_id in (e.slug,'event-'||e.slug)
      and v.campus_id is not null
      and v.status in ('verified','published')
      and nullif(v.source_url,'') is not null
      and v.source_url ~* '^https://'
      and (v.expires_at is null or v.expires_at>now())
  );

create or replace function public.jyc_guard_normalized_publication()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
begin
  if tg_table_name='clubs' and new.status='published' then
    if not exists (
      select 1
      from public.jyc_content_verification v
      where v.entity_type='club'
        and v.entity_id in (new.slug,'club-'||new.slug)
        and v.campus_id is not null
        and v.status in ('verified','published')
        and nullif(v.source_url,'') is not null
        and v.source_url ~* '^https://'
        and (v.expires_at is null or v.expires_at>now())
    ) then
      raise exception 'Club % cannot be published before verification',new.slug
        using errcode='check_violation';
    end if;
  elsif tg_table_name='events' and new.status in ('published','ongoing','past') then
    if not exists (
      select 1
      from public.jyc_content_verification v
      where v.entity_type='event'
        and v.entity_id in (new.slug,'event-'||new.slug)
        and v.campus_id is not null
        and v.status in ('verified','published')
        and nullif(v.source_url,'') is not null
        and v.source_url ~* '^https://'
        and (v.expires_at is null or v.expires_at>now())
    ) then
      raise exception 'Event % cannot be published before verification',new.slug
        using errcode='check_violation';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists jyc_guard_normalized_club_publication on public.jyc_clubs;
create trigger jyc_guard_normalized_club_publication
before insert or update of status,slug on public.jyc_clubs
for each row execute function public.jyc_guard_normalized_publication();

drop trigger if exists jyc_guard_normalized_event_publication on public.jyc_events;
create trigger jyc_guard_normalized_event_publication
before insert or update of status,slug on public.jyc_events
for each row execute function public.jyc_guard_normalized_publication();

revoke all on function public.jyc_guard_normalized_publication() from public,anon,authenticated;

commit;
