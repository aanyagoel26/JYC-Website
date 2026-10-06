-- Remove historical event seeds that are not exclusively attributable to JIIT Sector 128.
-- The public JYC event feed is intentionally 128-only.

begin;

delete from public.jyc_content_verification
where entity_type='event'
  and entity_id in (
    'student-induction-program-2026',
    'jyc-performances-auditions-2026'
  );

delete from public.jyc_events
where slug in (
  'student-induction-program-2026',
  'jyc-performances-auditions-2026'
);

commit;
