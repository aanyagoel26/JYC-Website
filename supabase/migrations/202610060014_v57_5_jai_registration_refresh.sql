-- V57.5: refresh the source-backed JAI 2026 registration metadata.
-- Current official JAI/Unstop listings show registration closing 10 Oct 2026
-- and the official summit site at jiityouthclub128.in.

update public.jyc_site_data
set data = jsonb_set(
  data,
  '{events}',
  (
    select jsonb_agg(
      case
        when ev->>'id'='agentic-ai-2026' then
          ev
          || jsonb_build_object(
            'officialUrl','https://www.jiityouthclub128.in/',
            'registrationSource','official JAI 2026 registration listing',
            'registrationVerified',true,
            'registrationDeadline','2026-10-10T23:59:00+05:30'
          )
        else ev
      end
      order by ord
    )
    from jsonb_array_elements(coalesce(data->'events','[]'::jsonb)) with ordinality as x(ev,ord)
  ),
  true
)
where id='main'
  and data->'events' @> '[{"id":"agentic-ai-2026"}]'::jsonb;
