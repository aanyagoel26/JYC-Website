-- JYC Platform V5: production-read hardening + account-linked registrations.
-- Run after 00-core-migration.sql, relational-v2.sql, platform-v3.sql,
-- platform-v4-fix.sql and final-role-hardening.sql.
-- This migration keeps the existing JSON CMS but stops anonymous clients
-- from reading unpublished/admin-only content from jyc_site_data.

create or replace function public.jyc_read_site_data()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  raw jsonb;
  is_admin boolean;
begin
  select data into raw from public.jyc_site_data where id='main';
  raw := coalesce(raw,'{}'::jsonb);
  select exists(
    select 1 from public.jyc_admins
    where user_id=auth.uid() and is_active=true
  ) into is_admin;

  if is_admin then
    return raw;
  end if;

  raw := jsonb_set(raw,'{clubs}',coalesce((
    select jsonb_agg(v order by lower(coalesce(v->>'name','')))
    from jsonb_array_elements(coalesce(raw->'clubs','[]'::jsonb)) v
    where coalesce(v->>'published','false')='true'
      and coalesce(v->>'status','published') <> 'archived'
  ),'[]'::jsonb),true);

  raw := jsonb_set(raw,'{events}',coalesce((
    select jsonb_agg(v order by coalesce(v->>'date','9999-99-99'),coalesce(v->>'start','99:99'))
    from jsonb_array_elements(coalesce(raw->'events','[]'::jsonb)) v
    where coalesce(v->>'published','false')='true'
      and coalesce(v->>'archived','false') <> 'true'
  ),'[]'::jsonb),true);

  -- Existing gallery records pre-date a published flag, so only an explicit
  -- published=false hides an image from the public experience.
  raw := jsonb_set(raw,'{gallery}',coalesce((
    select jsonb_agg(v order by coalesce(v->>'created_at','9999-99-99'))
    from jsonb_array_elements(coalesce(raw->'gallery','[]'::jsonb)) v
    where coalesce(v->>'published','true') <> 'false'
  ),'[]'::jsonb),true);

  raw := jsonb_set(raw,'{team}',coalesce((
    select jsonb_agg(v order by case when coalesce(v->>'sortOrder','') ~ '^[0-9]+$' then (v->>'sortOrder')::int else 9999 end)
    from jsonb_array_elements(coalesce(raw->'team','[]'::jsonb)) v
    where coalesce(v->>'published','true')='true'
  ),'[]'::jsonb),true);

  -- Never expose the creator's protected admin-only identity object through a
  -- public content read. The public footer uses the same static credit in the
  -- frontend and the protected value is retained for administrator backups.
  raw := raw - 'creator';
  return raw;
end;
$$;

revoke all on function public.jyc_read_site_data() from public;
grant execute on function public.jyc_read_site_data() to anon, authenticated;

-- jyc_site_data is now readable directly only by active administrators.
drop policy if exists "Public can read published site data" on public.jyc_site_data;
drop policy if exists "Public can read site data" on public.jyc_site_data;
drop policy if exists "Admins can read site data" on public.jyc_site_data;
create policy "Admins can read site data" on public.jyc_site_data
for select to authenticated
using (exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true));

-- Account-linked registrations.
alter table public.jyc_event_registrations
  add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.jyc_event_registrations
  add column if not exists registration_status text not null default 'registered';
alter table public.jyc_event_registrations
  add column if not exists updated_at timestamptz not null default now();
create index if not exists jyc_event_registrations_user_idx
  on public.jyc_event_registrations(user_id,created_at desc);

-- Remove the old permissive policies before replacing them.
drop policy if exists "public register event" on public.jyc_event_registrations;
drop policy if exists "admins read registrations" on public.jyc_event_registrations;
drop policy if exists "users read own registrations" on public.jyc_event_registrations;
drop policy if exists "users update own registrations" on public.jyc_event_registrations;
drop policy if exists "users delete own registrations" on public.jyc_event_registrations;

create policy "public register published native event" on public.jyc_event_registrations
for insert to anon, authenticated
with check (
  (user_id is null or user_id=auth.uid())
  and exists(
    select 1
    from public.jyc_site_data s,
         jsonb_array_elements(coalesce(s.data->'events','[]'::jsonb)) ev
    where s.id='main'
      and ev->>'id'=event_id
      and coalesce(ev->>'published','false')='true'
      and coalesce(ev->>'archived','false') <> 'true'
      and coalesce(ev->>'registrationMode','external')='native'
  )
);

create policy "users read own registrations" on public.jyc_event_registrations
for select to authenticated
using (user_id=auth.uid());

create policy "users update own registrations" on public.jyc_event_registrations
for update to authenticated
using (user_id=auth.uid())
with check (user_id=auth.uid());

create policy "users delete own registrations" on public.jyc_event_registrations
for delete to authenticated
using (user_id=auth.uid());

create policy "admins read registrations" on public.jyc_event_registrations
for select to authenticated
using (
  public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin')
  or (
    public.jyc_v2_role()='club_admin'
    and exists(
      select 1
      from public.jyc_admins a,
           public.jyc_site_data s,
           jsonb_array_elements(coalesce(s.data->'events','[]'::jsonb)) ev
      where a.user_id=auth.uid()
        and a.is_active=true
        and ev->>'id'=event_id
        and ev->>'clubId'=a.club_id::text
    )
  )
);

-- Keep registration status updates under the same role boundary.
create policy "admins update registrations" on public.jyc_event_registrations
for update to authenticated
using (
  public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin')
  or (
    public.jyc_v2_role()='club_admin'
    and exists(
      select 1 from public.jyc_admins a, public.jyc_site_data s,
        jsonb_array_elements(coalesce(s.data->'events','[]'::jsonb)) ev
      where a.user_id=auth.uid() and a.is_active=true
        and ev->>'id'=event_id and ev->>'clubId'=a.club_id::text
    )
  )
)
with check (
  public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin')
  or (
    public.jyc_v2_role()='club_admin'
    and exists(
      select 1 from public.jyc_admins a, public.jyc_site_data s,
        jsonb_array_elements(coalesce(s.data->'events','[]'::jsonb)) ev
      where a.user_id=auth.uid() and a.is_active=true
        and ev->>'id'=event_id and ev->>'clubId'=a.club_id::text
    )
  )
);


-- Registration integrity: non-admin users may only cancel their own registration.
create or replace function public.jyc_protect_registration_update()
returns trigger
language plpgsql
security invoker
set search_path=public
as $$
begin
  if auth.uid() = old.user_id and not (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin')) then
    if new.event_id <> old.event_id
       or coalesce(new.user_id::text,'') <> coalesce(old.user_id::text,'')
       or new.name <> old.name
       or lower(new.email) <> lower(old.email)
       or coalesce(new.enrollment_no,'') <> coalesce(old.enrollment_no,'')
       or coalesce(new.phone,'') <> coalesce(old.phone,'')
       or coalesce(new.year,'') <> coalesce(old.year,'')
       or coalesce(new.branch,'') <> coalesce(old.branch,'')
       or coalesce(new.responses,'{}'::jsonb) <> coalesce(old.responses,'{}'::jsonb)
       or new.registration_status <> 'cancelled' then
      raise exception 'You may only cancel your own registration';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists jyc_protect_registration_update on public.jyc_event_registrations;
create trigger jyc_protect_registration_update
before update on public.jyc_event_registrations
for each row execute function public.jyc_protect_registration_update();

-- Native-event capacity/waitlist handling. The trigger derives the initial status server-side.
create or replace function public.jyc_assign_registration_status()
returns trigger
language plpgsql
security invoker
set search_path=public
as $$
declare
  ev jsonb;
  cap integer;
  use_waitlist boolean;
  current_count integer;
begin
  if coalesce(new.registration_status,'') = 'cancelled' then return new; end if;
  select x into ev
  from public.jyc_site_data s,
       jsonb_array_elements(coalesce(s.data->'events','[]'::jsonb)) x
  where s.id='main' and x->>'id'=new.event_id
    and coalesce(x->>'registrationMode','external')='native'
  limit 1;
  if ev is null then return new; end if;
  cap:=nullif(ev->>'capacity','')::integer;
  use_waitlist:=coalesce((ev->>'waitlist')::boolean,false);
  if cap is null or cap <= 0 then new.registration_status:='registered'; return new; end if;
  select count(*) into current_count
  from public.jyc_event_registrations r
  where r.event_id=new.event_id and r.registration_status in ('registered','confirmed');
  if current_count >= cap then
    if use_waitlist then new.registration_status:='waitlisted';
    else raise exception 'This event has reached capacity'; end if;
  else
    new.registration_status:='registered';
  end if;
  return new;
end;
$$;
drop trigger if exists jyc_assign_registration_status on public.jyc_event_registrations;
create trigger jyc_assign_registration_status
before insert on public.jyc_event_registrations
for each row execute function public.jyc_assign_registration_status();

-- Keep timestamps fresh when an account changes its registration status.
create or replace function public.jyc_touch_registration()
returns trigger
language plpgsql
set search_path=public
as $$
begin
  new.updated_at=now();
  return new;
end;
$$;
drop trigger if exists jyc_touch_registration on public.jyc_event_registrations;
create trigger jyc_touch_registration
before update on public.jyc_event_registrations
for each row execute function public.jyc_touch_registration();

select 'JYC V5 production hardening complete.' as result;
