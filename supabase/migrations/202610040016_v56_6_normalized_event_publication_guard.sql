-- V56.6 publication boundary for normalized events.
-- A normalized event may only be published when the stable event slug has
-- an authenticated verification record. This keeps relational publication
-- aligned with the source-verification model used by the canonical JSON layer.

create or replace function public.jyc_guard_normalized_event_publication()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
begin
  if new.status = 'published' then
    if not exists (
      select 1
      from public.jyc_content_verification v
      where v.entity_type = 'event'
        and v.entity_id = new.slug
        and v.status in ('verified','published')
        and v.campus_id is not null
        and (v.expires_at is null or v.expires_at > now())
        and v.source_url ~* '^https?://'
    ) then
      raise exception 'event % cannot be published without an active verified source record', new.slug
        using errcode='42501';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.jyc_guard_normalized_event_publication() from public;
grant execute on function public.jyc_guard_normalized_event_publication() to service_role;

drop trigger if exists trg_jyc_guard_normalized_event_publication on public.jyc_events;
create trigger trg_jyc_guard_normalized_event_publication
before insert or update of status,slug
on public.jyc_events
for each row execute function public.jyc_guard_normalized_event_publication();

comment on function public.jyc_guard_normalized_event_publication()
is 'Prevents normalized event publication unless the stable event slug has an active verified source record.';
