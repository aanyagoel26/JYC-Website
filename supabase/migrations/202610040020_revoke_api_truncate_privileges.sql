-- API privilege hardening: RLS is necessary but table-level TRUNCATE grants are independent of row policies.
-- Browser roles never need TRUNCATE on application or Storage tables.
begin;
revoke truncate on all tables in schema public from anon, authenticated;
revoke truncate on all tables in schema storage from anon, authenticated;
alter default privileges for role postgres in schema public revoke truncate on tables from anon, authenticated;
alter default privileges for role postgres in schema storage revoke truncate on tables from anon, authenticated;
commit;
