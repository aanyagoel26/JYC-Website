begin;
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname='public'
      and roles::text = '{public}'
      and (
        coalesce(qual,'') ilike '%is_jyc_admin%'
        or coalesce(qual,'') ilike '%is_super_admin%'
        or coalesce(qual,'') ilike '%is_club_admin%'
        or coalesce(with_check,'') ilike '%is_jyc_admin%'
        or coalesce(with_check,'') ilike '%is_super_admin%'
        or coalesce(with_check,'') ilike '%is_club_admin%'
      )
  loop
    execute format('alter policy %I on %I.%I to authenticated', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

revoke all on function public.handle_new_user() from public;
revoke all on function public.update_updated_at() from public;
revoke all on function public.jyc_assign_registration_status() from public;
revoke all on function public.jyc_protect_registration_update() from public;
revoke all on function public.jyc_touch_registration() from public;
revoke all on function public.jyc_v2_role() from public;
revoke all on function public.jyc_v2_club() from public;
revoke all on function public.jyc_save_site_data(text,jsonb,text,text) from public;
revoke all on function public.jyc_save_site_data(jsonb,text,text,text) from public;

grant execute on function public.jyc_v2_role() to authenticated;
grant execute on function public.jyc_v2_club() to authenticated;
grant execute on function public.jyc_save_site_data(text,jsonb,text,text) to authenticated;
grant execute on function public.jyc_save_site_data(jsonb,text,text,text) to authenticated;

alter function public.handle_new_user() set search_path = public;
alter function public.update_updated_at() set search_path = public;
alter function public.jyc_assign_registration_status() set search_path = public;
alter function public.jyc_protect_registration_update() set search_path = public;
alter function public.jyc_touch_registration() set search_path = public;
alter function public.jyc_v2_role() set search_path = public;
alter function public.jyc_v2_club() set search_path = public;
commit;