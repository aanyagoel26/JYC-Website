-- V58.0.7: remove duplicate/stale verification rows after canonical identity cleanup.
delete from public.jyc_content_verification stale
where stale.entity_type='club'
  and stale.status='review'
  and stale.entity_id like 'club-%'
  and exists (
    select 1
    from public.jyc_content_verification current
    where current.entity_type='club'
      and current.status in ('verified','published','approved')
      and current.entity_id=substring(stale.entity_id from 6)
  );

delete from public.jyc_content_verification stale
where stale.entity_type='event'
  and stale.status='review'
  and stale.entity_id='agentic-ai-2026'
  and exists (
    select 1
    from public.jyc_content_verification current
    where current.entity_type='event'
      and current.status in ('verified','published','approved')
      and current.entity_id='jai-2026-jaypee-agentic-ai-hackathon'
  );