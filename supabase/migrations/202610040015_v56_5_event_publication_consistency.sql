-- V56.5 relational/public consistency repair
-- Converge 2026 is already published in the canonical JSON snapshot and has a verified
-- content-verification record. The bridge previously left it under_review because the
-- legacy JSON event did not carry a relational status field.
update public.jyc_events e
set status='published', updated_at=now()
where e.slug='converge-2026'
  and exists (
    select 1
    from public.jyc_content_verification v
    where v.entity_type='event'
      and v.entity_id='converge-2026'
      and v.status='verified'
  )
  and exists (
    select 1
    from public.jyc_site_data s
    cross join lateral jsonb_array_elements(coalesce(s.data->'events','[]'::jsonb)) item
    where s.id='main'
      and item->>'id'='converge-2026'
      and coalesce(item->>'published','false')='true'
  );
