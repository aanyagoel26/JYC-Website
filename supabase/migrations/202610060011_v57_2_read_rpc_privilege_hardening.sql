-- V57.2 — reduce public RPC privilege surface.
-- The public website only needs anonymous execution of the read RPC. Signed-in users
-- receive the same public feed and do not need an authenticated grant.
revoke execute on function public.jyc_read_site_data() from authenticated;
