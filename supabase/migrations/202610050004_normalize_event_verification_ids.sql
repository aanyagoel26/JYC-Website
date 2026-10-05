-- Normalize legacy event verification references to the stable event slug.
-- This keeps the public planned-event read bridge compatible with older UUID-based rows.
update public.jyc_content_verification cv
set entity_id=e.slug,
    notes=coalesce(cv.notes,'')||' Normalized to event slug for public planned-event read bridge.'
from public.jyc_events e
where cv.entity_type='event'
  and cv.entity_id=e.id::text
  and e.slug in (
    'jai-2026-jaypee-agentic-ai-hackathon',
    'techtonic-2-0',
    'code-clash-25-1'
  )
  and cv.status='review'
  and not exists (
    select 1
    from public.jyc_content_verification other
    where other.entity_type='event'
      and other.entity_id=e.slug
  );