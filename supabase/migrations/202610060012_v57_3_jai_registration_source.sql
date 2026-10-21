-- V57.3 — mark the JAI 2026 registration link as an independently sourced,
-- official registration action. The event itself remains PLANNED until its editorial
-- publication status is confirmed, but users may still follow the verified registration.
do $migration$
declare
  events jsonb;
  updated jsonb;
begin
  select data->'events' into events from public.jyc_site_data where id='main';
  if events is null or jsonb_typeof(events) <> 'array' then return; end if;

  select coalesce(jsonb_agg(
    case when e->>'id'='agentic-ai-2026' or e->>'title' like 'JAI 2026%'
      then e || jsonb_build_object(
        'registrationVerified',true,
        'registrationSource','official JAI 2026 registration listing'
      )
      else e
    end
  ),'[]'::jsonb) into updated
  from jsonb_array_elements(events) e;

  update public.jyc_site_data
  set data=jsonb_set(data,'{events}',updated,true), updated_at=now()
  where id='main';
end;
$migration$;
