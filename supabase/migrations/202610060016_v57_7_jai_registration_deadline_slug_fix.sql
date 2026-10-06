-- V57.7: apply the verified JAI deadline to the canonical normalized slug.

update public.jyc_events
set registration_deadline='2026-10-10 23:59:00+05:30'
where slug='jai-2026-jaypee-agentic-ai-hackathon'
  and registration_url is not null;
