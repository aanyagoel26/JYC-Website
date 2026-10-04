begin;

select plan(22);

select ok(not has_table_privilege('anon','public.jyc_site_data','INSERT'),'anon cannot insert into jyc_site_data');
select ok(not has_table_privilege('authenticated','public.jyc_site_data','INSERT'),'authenticated cannot insert into jyc_site_data');
select ok(not has_table_privilege('authenticated','public.jyc_site_data','UPDATE'),'authenticated cannot update jyc_site_data directly');
select ok(not has_table_privilege('authenticated','public.jyc_site_data','DELETE'),'authenticated cannot delete jyc_site_data directly');
select ok(has_function_privilege('authenticated','public.jyc_save_site_data(jsonb,text,text,text)','EXECUTE'),'authenticated can execute the authorization-aware site-data write RPC');
select ok(not has_function_privilege('anon','public.jyc_save_site_data(jsonb,text,text,text)','EXECUTE'),'anon cannot execute the site-data write RPC');
select ok(has_function_privilege('anon','public.jyc_read_site_data()','EXECUTE'),'anon can execute the intentional public read RPC');
select ok(not has_function_privilege('anon','public.jyc_allow_ai_request(uuid,integer)','EXECUTE'),'anon cannot execute the internal AI rate-limit RPC');
select ok(not has_function_privilege('anon','public.jyc_allow_public_submission(text,integer,integer)','EXECUTE'),'anon cannot execute the internal submission rate-limit RPC');
select ok((select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prosecdef and coalesce(array_to_string(p.proconfig,','),'') <> 'search_path=""')=0,'all public SECURITY DEFINER functions pin an empty search_path');
select ok(not has_table_privilege('anon','public.jyc_event_registrations','INSERT'),'anon cannot insert registrations directly');
select ok(not has_table_privilege('authenticated','public.jyc_event_registrations','INSERT'),'authenticated cannot insert registrations directly');
select ok(has_table_privilege('authenticated','public.jyc_event_registrations','UPDATE'),'authenticated retains the status-update privilege required by My JYC');
select ok(not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and cmd in ('INSERT','UPDATE','DELETE') and (roles='{anon}' or roles='{authenticated}' or roles='{public}')),'Storage has no client mutation policies');
select ok((select relrowsecurity from pg_class where oid='storage.objects'::regclass),'Storage objects keep RLS enabled');
select ok(not has_table_privilege('anon','storage.objects','INSERT'),'anon cannot upload directly to Storage');
select ok(not has_table_privilege('authenticated','storage.objects','INSERT'),'authenticated cannot upload directly to Storage');
select ok((select relrowsecurity from pg_class where oid='public.jyc_campuses'::regclass),'campus registry has RLS enabled');
select ok((select relrowsecurity from pg_class where oid='public.jyc_content_verification'::regclass),'content verification has RLS enabled');
select ok(not has_table_privilege('anon','public.jyc_admins','TRUNCATE'),'anon cannot truncate JYC admin records');
select ok(not has_table_privilege('authenticated','public.jyc_site_data','TRUNCATE'),'authenticated cannot truncate site data');

select * from finish();
rollback;
