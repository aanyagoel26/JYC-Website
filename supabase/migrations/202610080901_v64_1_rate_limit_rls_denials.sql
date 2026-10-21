-- V64.1: make internal rate-limit tables explicitly deny direct client access.
do $$
declare
  t text;
  p text;
begin
  foreach t in array array[
    'jyc_ai_rate_limits',
    'jyc_error_rate_limits',
    'jyc_public_submission_rate_limits',
    'jyc_registration_rate_limits'
  ] loop
    p := t || '_deny_client_access';
    execute format('drop policy if exists %I on public.%I', p, t);
    execute format('create policy %I on public.%I for all to anon, authenticated using (false) with check (false)', p, t);
  end loop;
end $$;
