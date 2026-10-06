-- V57 trust contract: explicit provenance confidence and 128-only public publication.
begin;

alter table public.jyc_content_verification
  add column if not exists confidence text,
  add column if not exists source_name text,
  add column if not exists source_platform text,
  add column if not exists source_captured_at timestamptz,
  add column if not exists review_reason text;
update public.jyc_content_verification set confidence=case when status in ('verified','published') then 'official' else 'review' end where confidence is null or confidence not in ('official','strong','corroborated','weak','review');
alter table public.jyc_content_verification alter column confidence set default 'review', alter column confidence set not null;
alter table public.jyc_content_verification drop constraint if exists jyc_content_verification_confidence_check;
alter table public.jyc_content_verification add constraint jyc_content_verification_confidence_check check (confidence in ('official','strong','corroborated','weak','review'));

comment on column public.jyc_content_verification.confidence is 'Editorial evidence strength; official is the strongest public-source confidence.';
comment on column public.jyc_content_verification.source_name is 'Human-readable source/account name.';
comment on column public.jyc_content_verification.source_platform is 'Source platform such as official-site, LinkedIn, Instagram, PDF, or event-site.';
comment on column public.jyc_content_verification.source_captured_at is 'When the cited source evidence was captured/reviewed.';
comment on column public.jyc_content_verification.review_reason is 'Reason a record remains review-gated or needs re-verification.';

create index if not exists jyc_content_verification_confidence_idx
  on public.jyc_content_verification(confidence,status,entity_type);

create or replace function public.jyc_guard_normalized_publication_v57()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
declare
  required_status text[];
begin
  if tg_table_name='clubs' and new.status='published' then
    required_status := array['verified','published'];
    if not exists (
      select 1 from public.jyc_content_verification v
      where v.entity_type='club'
        and v.entity_id in (new.slug,'club-'||new.slug)
        and v.campus_id='sector-128'
        and v.status = any(required_status)
        and v.confidence in ('official','strong','corroborated')
        and nullif(v.source_url,'') is not null
        and v.source_url ~* '^https://'
        and (v.expires_at is null or v.expires_at>now())
    ) then
      raise exception 'Club % cannot be public without an active verified Sector 128 source',new.slug
        using errcode='check_violation';
    end if;
  elsif tg_table_name='events' and new.status in ('published','ongoing','past') then
    required_status := array['verified','published'];
    if not exists (
      select 1 from public.jyc_content_verification v
      where v.entity_type='event'
        and v.entity_id in (new.slug,'event-'||new.slug)
        and v.campus_id='sector-128'
        and v.status = any(required_status)
        and v.confidence in ('official','strong','corroborated')
        and nullif(v.source_url,'') is not null
        and v.source_url ~* '^https://'
        and (v.expires_at is null or v.expires_at>now())
    ) then
      raise exception 'Event % cannot be public without an active verified Sector 128 source',new.slug
        using errcode='check_violation';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists jyc_guard_normalized_club_publication_v57 on public.jyc_clubs;
create trigger jyc_guard_normalized_club_publication_v57
before insert or update of status,slug on public.jyc_clubs
for each row execute function public.jyc_guard_normalized_publication_v57();

drop trigger if exists jyc_guard_normalized_event_publication_v57 on public.jyc_events;
create trigger jyc_guard_normalized_event_publication_v57
before insert or update of status,slug on public.jyc_events
for each row execute function public.jyc_guard_normalized_publication_v57();

revoke all on function public.jyc_guard_normalized_publication_v57() from public,anon,authenticated;
grant execute on function public.jyc_guard_normalized_publication_v57() to service_role;

commit;
