-- JYC V17.1 SECURITY + OPERATIONS HARDENING
-- Apply after the current production bootstrap/repair migrations.
-- Safe to re-run.

begin;

create or replace function public.jyc_register_for_event(
  p_event_id text,
  p_name text,
  p_email text,
  p_enrollment_no text default null,
  p_phone text default null,
  p_year text default null,
  p_branch text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  ev jsonb;
  existing public.jyc_event_registrations%rowtype;
  v_user_id uuid := auth.uid();
  v_email text := lower(trim(coalesce(p_email,'')));
  v_name text := trim(coalesce(p_name,''));
  v_capacity integer;
  v_waitlist boolean;
  v_deadline timestamptz;
  v_status text := 'registered';
  v_count integer;
  v_id uuid;
begin
  if v_name = '' then raise exception 'Name is required'; end if;
  if v_email = '' or position('@' in v_email) < 2 then raise exception 'Enter a valid email address'; end if;

  perform pg_advisory_xact_lock(hashtextextended('jyc:event-registration:' || p_event_id, 0));

  select e into ev
  from public.jyc_site_data s,
       jsonb_array_elements(coalesce(s.data->'events','[]'::jsonb)) e
  where s.id='main'
    and e->>'id'=p_event_id
    and coalesce(e->>'published','false')='true'
    and coalesce(e->>'archived','false')<>'true'
    and coalesce(e->>'registrationMode','external')='native'
  limit 1;

  if ev is null then raise exception 'This event is not accepting JYC registrations'; end if;

  if coalesce(ev->>'registrationDeadline','') <> '' then
    begin v_deadline := (ev->>'registrationDeadline')::timestamptz; exception when others then v_deadline := null; end;
    if v_deadline is not null and v_deadline <= now() then raise exception 'Registrations are closed for this event'; end if;
  end if;

  select * into existing
  from public.jyc_event_registrations
  where event_id=p_event_id and lower(email)=v_email
  limit 1
  for update;

  if existing.id is not null and coalesce(existing.registration_status,'registered') <> 'cancelled' then
    raise exception 'This email is already registered for this event';
  end if;

  v_capacity := nullif(ev->>'capacity','')::integer;
  v_waitlist := coalesce((ev->>'waitlist')::boolean,false);

  if v_capacity is not null and v_capacity > 0 then
    select count(*) into v_count
    from public.jyc_event_registrations r
    where r.event_id=p_event_id
      and coalesce(r.registration_status,'registered') in ('registered','confirmed','attended');
    if v_count >= v_capacity then
      if v_waitlist then v_status := 'waitlisted';
      else raise exception 'This event has reached capacity'; end if;
    end if;
  end if;

  if existing.id is not null then
    update public.jyc_event_registrations
    set user_id=v_user_id, name=v_name, email=v_email,
        enrollment_no=nullif(trim(coalesce(p_enrollment_no,'')),''),
        phone=nullif(trim(coalesce(p_phone,'')),''),
        year=nullif(trim(coalesce(p_year,'')),''),
        branch=nullif(trim(coalesce(p_branch,'')),''),
        registration_status=v_status, updated_at=now()
    where id=existing.id
    returning id into v_id;
  else
    insert into public.jyc_event_registrations
      (event_id,name,email,enrollment_no,phone,year,branch,user_id,registration_status)
    values
      (p_event_id,v_name,v_email,
       nullif(trim(coalesce(p_enrollment_no,'')),''),
       nullif(trim(coalesce(p_phone,'')),''),
       nullif(trim(coalesce(p_year,'')),''),
       nullif(trim(coalesce(p_branch,'')),''),
       v_user_id,v_status)
    returning id into v_id;
  end if;

  return jsonb_build_object('id',v_id,'status',v_status);
end;
$$;

revoke all on function public.jyc_register_for_event(text,text,text,text,text,text,text) from public;
grant execute on function public.jyc_register_for_event(text,text,text,text,text,text,text) to anon, authenticated;

drop policy if exists "public register event" on public.jyc_event_registrations;
drop policy if exists "public register published native event" on public.jyc_event_registrations;

-- Push subscriptions are account-owned. The Edge Function uses service role
-- access to deliver notifications, so client-side anonymous rows are not needed.
drop policy if exists "push owner read" on public.jyc_push_subscriptions;
drop policy if exists "push owner update" on public.jyc_push_subscriptions;
drop policy if exists "push owner delete" on public.jyc_push_subscriptions;
drop policy if exists "push owner or anonymous" on public.jyc_push_subscriptions;
drop policy if exists "Users can register own push subscription" on public.jyc_push_subscriptions;
drop policy if exists "Users can update own push subscription" on public.jyc_push_subscriptions;
drop policy if exists "Users can delete own push subscription" on public.jyc_push_subscriptions;

create policy "signed in push insert"
on public.jyc_push_subscriptions for insert to authenticated
with check (user_id=auth.uid());
create policy "signed in push read"
on public.jyc_push_subscriptions for select to authenticated
using (user_id=auth.uid());
create policy "signed in push update"
on public.jyc_push_subscriptions for update to authenticated
using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "signed in push delete"
on public.jyc_push_subscriptions for delete to authenticated
using (user_id=auth.uid());

create index if not exists jyc_event_registrations_event_status_idx
  on public.jyc_event_registrations(event_id, registration_status, created_at desc);
create index if not exists jyc_event_registrations_email_lookup_idx
  on public.jyc_event_registrations(event_id, lower(email));

commit;
select 'JYC V17.1 security and operations hardening applied.' as result;
