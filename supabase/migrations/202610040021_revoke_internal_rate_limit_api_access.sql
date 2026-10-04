-- Internal rate-limit tables are implementation details of SECURITY DEFINER guards.
-- Browser roles do not need Data API access to these tables.
revoke all on table public.jyc_ai_rate_limits, public.jyc_error_rate_limits, public.jyc_public_submission_rate_limits, public.jyc_registration_rate_limits from anon, authenticated;
