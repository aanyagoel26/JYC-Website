-- Deeper SECURITY DEFINER hardening.
-- Supabase recommends pinning search_path to an empty string for SECURITY DEFINER functions
-- so callers cannot influence unqualified object resolution.

alter function public.handle_new_user() set search_path = '';
alter function public.jyc_allow_ai_request(uuid, integer) set search_path = '';
alter function public.jyc_ingest_error_report(text, text, text, text, text, jsonb) set search_path = '';
alter function public.jyc_prune_public_submission_limits() set search_path = '';

create or replace function public.jyc_allow_public_submission(
  p_fingerprint text,
  p_limit integer default 5,
  p_window_seconds integer default 3600
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  now_ts timestamptz := pg_catalog.now();
  row_data public.jyc_public_submission_rate_limits;
begin
  if pg_catalog.random() < 0.02 then
    delete from public.jyc_public_submission_rate_limits
    where updated_at < pg_catalog.now() - pg_catalog.interval '2 days';
  end if;

  if coalesce(pg_catalog.trim(p_fingerprint), '') = '' then
    return false;
  end if;

  p_limit := greatest(1, least(coalesce(p_limit, 5), 50));
  p_window_seconds := greatest(60, least(coalesce(p_window_seconds, 3600), 86400));

  insert into public.jyc_public_submission_rate_limits(
    fingerprint, window_started_at, request_count, updated_at
  )
  values(pg_catalog.trim(p_fingerprint), now_ts, 1, now_ts)
  on conflict(fingerprint) do update
    set request_count = case
      when now_ts - public.jyc_public_submission_rate_limits.window_started_at >= pg_catalog.make_interval(secs => p_window_seconds)
        then 1
      else public.jyc_public_submission_rate_limits.request_count + 1
    end,
    window_started_at = case
      when now_ts - public.jyc_public_submission_rate_limits.window_started_at >= pg_catalog.make_interval(secs => p_window_seconds)
        then now_ts
      else public.jyc_public_submission_rate_limits.window_started_at
    end,
    updated_at = now_ts
  returning * into row_data;

  return row_data.request_count <= p_limit;
end;
$$;
