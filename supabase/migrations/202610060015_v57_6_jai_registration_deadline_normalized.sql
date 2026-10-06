-- V57.6: mirror the independently verified JAI registration deadline into
-- the normalized event row consumed by the public read RPC.

update public.jyc_events
set registration_deadline='2026-10-10 23:59:00+05:30'
where slug='agentic-ai-2026'
  and registration_url is not null;
