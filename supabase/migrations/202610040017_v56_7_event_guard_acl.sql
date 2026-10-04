-- V56.7 tighten publication guard RPC ACL.
revoke execute on function public.jyc_guard_normalized_event_publication() from public, anon, authenticated;
grant execute on function public.jyc_guard_normalized_event_publication() to service_role;