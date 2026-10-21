begin;

-- V56.1 public-surface hardening.
-- The public site no longer exposes native registration UI/RPCs; event registration
-- is editorial/external only. Keep the transactional function in the database for
-- historical compatibility, but remove client roles from its execute ACL.
revoke execute on function public.jyc_register_for_event(text,text,text,text,text,text,text) from public;
revoke execute on function public.jyc_register_for_event(text,text,text,text,text,text,text) from anon;
revoke execute on function public.jyc_register_for_event(text,text,text,text,text,text,text) from authenticated;

commit;
