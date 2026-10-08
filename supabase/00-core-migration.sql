-- JYC website content + access migration
-- Run this in Supabase SQL Editor once.
-- Uses the safe browser publishable key; never put a service/secret key in the frontend.

create extension if not exists pgcrypto;

-- Keep this migration runnable on a fresh Supabase project. Older versions
-- assumed jyc_admins had already been created outside the migration set.
create table if not exists public.jyc_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'jyc_admin',
  display_name text,
  is_active boolean not null default true,
  club_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.jyc_admins enable row level security;
drop policy if exists "Users can read own JYC admin record" on public.jyc_admins;
create policy "Users can read own JYC admin record" on public.jyc_admins for select to authenticated using (user_id=auth.uid());
create index if not exists jyc_admins_role_idx on public.jyc_admins(role,is_active);
create index if not exists jyc_admins_club_idx on public.jyc_admins(club_id);

create table if not exists public.jyc_site_data (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.jyc_site_data enable row level security;
drop policy if exists "Public can read published site data" on public.jyc_site_data;
create policy "Public can read published site data"
on public.jyc_site_data for select to anon, authenticated
using (id = 'main');

drop policy if exists "JYC admins can manage site data" on public.jyc_site_data;
create policy "JYC admins can manage site data"
on public.jyc_site_data for all to authenticated
using (exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true))
with check (exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true));

insert into public.jyc_site_data(id,data) values('main',jsonb_build_object(
  'clubs','[]'::jsonb,
  'events','[]'::jsonb,
  'gallery','[]'::jsonb,
  'team','[]'::jsonb,
  'categories',jsonb_build_object('Technical','[]'::jsonb,'Non-Technical','[]'::jsonb),
  'announcement',jsonb_build_object('on',false,'text','','link',''),
  'mode','events','fest','null'::jsonb,
  'homepage',jsonb_build_object('heroTitle','JIIT YOUTH CLUB','heroSubtitle','READY TO SOAR','heroLead','A student-led ecosystem connecting campus communities, creativity, technology and experiences at JIIT Sector 128.','showClubs',true,'showEvents',true,'showGallery',true,'aboutTitle','The JYC story belongs here.','aboutText',''),
  'creator',jsonb_build_object('name','Kaustubh Dua','role','Website Creator','linkedin','https://www.linkedin.com/in/kaustubh-dua-2b5a76416','instagram','https://www.instagram.com/kaustubh.this.side/','github','https://github.com/kaustubhdua','email','kaustubhdua1991@gmail.com')
)) on conflict(id) do nothing;

create table if not exists public.jyc_activity_logs(
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.jyc_activity_logs enable row level security;
drop policy if exists "Admins can read activity logs" on public.jyc_activity_logs;
create policy "Admins can read activity logs" on public.jyc_activity_logs for select to authenticated
using(exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true));
drop policy if exists "Admins can create activity logs" on public.jyc_activity_logs;
create policy "Admins can create activity logs" on public.jyc_activity_logs for insert to authenticated
with check(actor_id=auth.uid() and exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true));

-- Optional club-level assignment for future club_admin accounts.
alter table public.jyc_admins add column if not exists club_id uuid;

insert into storage.buckets(id,name,public) values('jyc-media','jyc-media',true) on conflict(id) do nothing;
drop policy if exists "Public can view JYC media" on storage.objects;
create policy "Public can view JYC media" on storage.objects for select to anon,authenticated using(bucket_id='jyc-media');
drop policy if exists "JYC admins can upload JYC media" on storage.objects;
create policy "JYC admins can upload JYC media" on storage.objects for insert to authenticated
with check(bucket_id='jyc-media' and exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true));
drop policy if exists "JYC admins can update JYC media" on storage.objects;
create policy "JYC admins can update JYC media" on storage.objects for update to authenticated
using(bucket_id='jyc-media' and exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true))
with check(bucket_id='jyc-media' and exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true));
drop policy if exists "JYC admins can delete JYC media" on storage.objects;
create policy "JYC admins can delete JYC media" on storage.objects for delete to authenticated
using(bucket_id='jyc-media' and exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true));

select 'JYC migration complete.' as result;

-- =========================================================
-- Secure content writes for the JSON content store
-- Club Admins can only mutate their assigned club, its events,
-- and its gallery items. JYC/Super Admins can mutate everything.
-- =========================================================
alter table public.jyc_admins add column if not exists club_id text;

create or replace function public.jyc_save_site_data(
  p_data jsonb,
  p_action text default 'Updated site',
  p_entity_type text default 'site',
  p_entity_id text default 'main'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  a_role text;
  a_club text;
  old_data jsonb;
  next_data jsonb;
  own_clubs jsonb;
  own_events jsonb;
  own_gallery jsonb;
begin
  select role, club_id::text into a_role, a_club
  from public.jyc_admins
  where user_id = auth.uid() and is_active = true
  limit 1;

  if a_role is null then
    raise exception 'Not authorized';
  end if;

  select data into old_data from public.jyc_site_data where id = 'main' for update;
  old_data := coalesce(old_data, '{}'::jsonb);

  if a_role in ('super_admin','jyc_super_admin') then
    next_data := p_data;
  elsif a_role = 'jyc_admin' then
    -- JYC Editor: editorial access to clubs, events and gallery only.
    -- It cannot change fest mode, homepage, team, categories, admins or settings.
    next_data := old_data;
    if p_entity_type in ('club','clubs') then
      next_data := next_data || jsonb_build_object('clubs',coalesce(p_data->'clubs','[]'::jsonb));
    elsif p_entity_type in ('event','events') then
      next_data := next_data || jsonb_build_object('events',coalesce(p_data->'events','[]'::jsonb));
    elsif p_entity_type = 'gallery' then
      next_data := next_data || jsonb_build_object('gallery',coalesce(p_data->'gallery','[]'::jsonb));
    else
      raise exception 'JYC Editor does not have permission for this content area';
    end if;
  elsif a_role in ('clubs_admin','events_admin','gallery_admin','content_admin') then
    next_data := old_data;
    if a_role = 'clubs_admin' and p_entity_type in ('club','clubs','settings') then next_data := next_data || jsonb_build_object('clubs',coalesce(p_data->'clubs','[]'::jsonb),'categories',coalesce(p_data->'categories',old_data->'categories')); end if;
    if a_role = 'events_admin' and p_entity_type in ('event','events') then next_data := next_data || jsonb_build_object('events',coalesce(p_data->'events','[]'::jsonb),'fest',coalesce(p_data->'fest',old_data->'fest')); end if;
    if a_role = 'gallery_admin' and p_entity_type in ('gallery') then next_data := next_data || jsonb_build_object('gallery',coalesce(p_data->'gallery','[]'::jsonb)); end if;
    if a_role = 'content_admin' and p_entity_type in ('homepage','team','fest','settings') then next_data := next_data || jsonb_build_object('homepage',coalesce(p_data->'homepage',old_data->'homepage'),'team',coalesce(p_data->'team',old_data->'team'),'fest',coalesce(p_data->'fest',old_data->'fest'),'creator',coalesce(p_data->'creator',old_data->'creator')); end if;
  elsif a_role = 'club_admin' then
    if a_club is null then
      raise exception 'Club Admin has no assigned club';
    end if;

    own_clubs := coalesce((select jsonb_agg(v) from jsonb_array_elements(coalesce(p_data->'clubs','[]'::jsonb)) v where v->>'id'=a_club),'[]'::jsonb);
    own_events := coalesce((select jsonb_agg(v) from jsonb_array_elements(coalesce(p_data->'events','[]'::jsonb)) v where v->>'clubId'=a_club),'[]'::jsonb);
    own_gallery := coalesce((select jsonb_agg(v) from jsonb_array_elements(coalesce(p_data->'gallery','[]'::jsonb)) v where v->>'clubId'=a_club),'[]'::jsonb);

    next_data := old_data
      || jsonb_build_object('clubs',
        coalesce((select jsonb_agg(v) from jsonb_array_elements(coalesce(old_data->'clubs','[]'::jsonb)) v where v->>'id'<>a_club),'[]'::jsonb) || own_clubs)
      || jsonb_build_object('events',
        coalesce((select jsonb_agg(v) from jsonb_array_elements(coalesce(old_data->'events','[]'::jsonb)) v where coalesce(v->>'clubId','')<>a_club),'[]'::jsonb) || own_events)
      || jsonb_build_object('gallery',
        coalesce((select jsonb_agg(v) from jsonb_array_elements(coalesce(old_data->'gallery','[]'::jsonb)) v where coalesce(v->>'clubId','')<>a_club),'[]'::jsonb) || own_gallery);
  else
    raise exception 'Unsupported administrator role';
  end if;

  -- The creator credit is a protected website identity field. Never accept
  -- a browser-supplied value for it, even when an administrator calls the RPC directly.
  next_data := jsonb_set(next_data, '{creator}', jsonb_build_object(
    'name','Kaustubh Dua',
    'role','Website Creator',
    'linkedin','https://www.linkedin.com/in/kaustubh-dua-2b5a76416',
    'instagram','https://www.instagram.com/kaustubh.this.side/',
    'github','https://github.com/kaustubhdua',
    'email','kaustubhdua1991@gmail.com'
  ), true);

  insert into public.jyc_site_data(id,data,updated_at,updated_by)
  values('main',next_data,now(),auth.uid())
  on conflict(id) do update set data=excluded.data,updated_at=excluded.updated_at,updated_by=excluded.updated_by;

  insert into public.jyc_activity_logs(actor_id,action,entity_type,entity_id,metadata)
  values(auth.uid(),coalesce(p_action,'Updated site'),p_entity_type,p_entity_id,jsonb_build_object('role',a_role));

  return next_data;
end;
$$;

revoke all on function public.jyc_save_site_data(jsonb,text,text,text) from public;
grant execute on function public.jyc_save_site_data(jsonb,text,text,text) to authenticated;

-- Web Push subscriptions. The subscription JSON contains browser push endpoint
-- data and is only readable/writable by its owner; admins can manage delivery.
create table if not exists public.jyc_push_subscriptions(
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text unique not null,
  subscription jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.jyc_push_subscriptions enable row level security;
drop policy if exists "Users can register own push subscription" on public.jyc_push_subscriptions;
create policy "Users can register own push subscription" on public.jyc_push_subscriptions for insert to anon,authenticated with check(user_id is null or user_id=auth.uid());
drop policy if exists "Users can update own push subscription" on public.jyc_push_subscriptions;
create policy "Users can update own push subscription" on public.jyc_push_subscriptions for update to authenticated using(user_id=auth.uid() or user_id is null) with check(user_id=auth.uid() or user_id is null);
drop policy if exists "Users can delete own push subscription" on public.jyc_push_subscriptions;
create policy "Users can delete own push subscription" on public.jyc_push_subscriptions for delete to authenticated using(user_id=auth.uid() or user_id is null);
drop policy if exists "Admins can read push subscriptions" on public.jyc_push_subscriptions;
create policy "Admins can read push subscriptions" on public.jyc_push_subscriptions for select to authenticated using(exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true));

-- Anonymous devices may refresh an existing endpoint subscription.
drop policy if exists "Anonymous devices can refresh push subscription" on public.jyc_push_subscriptions;
create policy "Anonymous devices can refresh push subscription" on public.jyc_push_subscriptions for update to anon using(user_id is null) with check(user_id is null);

-- The content-store uses string IDs for clubs (friendly slugs), so administrator
-- assignments use text rather than uuid.
alter table public.jyc_admins alter column club_id type text using club_id::text;

-- Tighten media permissions: Club Admins can only write/delete files inside
-- clubs/<their-club-id>/; JYC admins can manage the full archive.
drop policy if exists "JYC admins can upload JYC media" on storage.objects;
create policy "JYC admins can upload JYC media" on storage.objects for insert to authenticated
with check(bucket_id='jyc-media' and exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true and (a.role<>'club_admin' or name like 'clubs/'||a.club_id||'/%')));
drop policy if exists "JYC admins can update JYC media" on storage.objects;
create policy "JYC admins can update JYC media" on storage.objects for update to authenticated
using(bucket_id='jyc-media' and exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true and (a.role<>'club_admin' or name like 'clubs/'||a.club_id||'/%')))
with check(bucket_id='jyc-media' and exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true and (a.role<>'club_admin' or name like 'clubs/'||a.club_id||'/%')));
drop policy if exists "JYC admins can delete JYC media" on storage.objects;
create policy "JYC admins can delete JYC media" on storage.objects for delete to authenticated
using(bucket_id='jyc-media' and exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true and (a.role<>'club_admin' or name like 'clubs/'||a.club_id||'/%')));
