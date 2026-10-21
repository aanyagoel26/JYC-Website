-- V57 source metadata enrichment for current JYC 128 event candidates.
begin;

update public.jyc_content_verification
set source_url='https://www.jiityouthclub128.in/',
    source_type='official-event-site',
    source_name='Jaypee Agentic AI International Summit 2026',
    source_platform='official-event-site',
    source_captured_at='2026-10-06T00:00:00Z',
    confidence='strong',
    review_reason='Current official JYC 128 event site confirms Sector 128, dates and programme; editorial verifier must still approve publication.',
    last_updated_at=now()
where entity_type='event'
  and entity_id in ('agentic-ai-2026','jai-2026');

update public.jyc_content_verification
set source_type=coalesce(source_type,'official-university-social'),
    source_name=coalesce(source_name,'JIIT official'),
    source_platform=coalesce(source_platform,'official-social'),
    source_captured_at=coalesce(source_captured_at,'2026-10-06T00:00:00Z'::timestamptz),
    confidence=case when status in ('verified','published') then 'official' else coalesce(confidence,'strong') end,
    last_updated_at=now()
where entity_type='event'
  and entity_id='converge-2026'
  and campus_id='sector-128';

commit;
