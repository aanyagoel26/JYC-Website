begin;

-- The prior deadline (10 Oct) is stale. As of 11 Oct 2026, the official JYC-128
-- LinkedIn profile still advertises JAI 2026 registrations as open, and the
-- Unstop listing names 15 Oct 2026 as the registration deadline. Keep the event
-- in its existing editorial approval state; only correct the deadline shown to
-- users when an approved registration URL exists.
update public.jyc_events
set registration_deadline = '2026-10-15 23:59:00+05:30'
where slug = 'jai-2026-jaypee-agentic-ai-hackathon'
  and registration_url is not null
  and start_at >= '2026-10-30 00:00:00+05:30'::timestamptz
  and start_at < '2026-10-31 00:00:00+05:30'::timestamptz;

-- Refresh provenance without treating external evidence as authenticated JYC
-- approval. The record remains review-gated until an authorised verifier signs off.
update public.jyc_content_verification
set source_url = 'https://unstop.com/hackathons/jai-2026-hackathon-jaypee-agentic-ai-hackathon-2026-jaypee-institute-of-information-technology-jiit-noida-1763378/',
    source_type = 'official JAI site + JYC 128 LinkedIn + Unstop registration listing',
    source_name = 'JYC 128 + JAI official site + Unstop',
    source_platform = 'LinkedIn + official-event-site + Unstop',
    source_captured_at = '2026-10-11T05:00:00Z',
    confidence = 'strong',
    review_reason = 'Current JYC 128 LinkedIn and official JAI site confirm the event identity and 30–31 October dates; the Unstop listing gives a 15 October 2026 registration deadline. Authenticated JYC approval remains pending.',
    notes = 'Rechecked 11 Oct 2026: JAI 2026 is scheduled for 30–31 Oct 2026 at JIIT Sector 128. The JYC 128 LinkedIn profile advertises registrations as open and the Unstop listing gives a registration deadline of 15 Oct 2026, 23:59 IST. Keep publication review-gated until an authenticated JYC verifier approves.'
where entity_type = 'event'
  and entity_id = 'jai-2026-jaypee-agentic-ai-hackathon';

commit;
