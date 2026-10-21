-- JYC Platform V3: analytics, push, reminders, notification preferences and media albums.
-- Run after the existing schema + relational-v2.sql. Safe to re-run.
create table if not exists public.jyc_push_subscriptions (
  id uuid primary key default gen_random_uuid(), endpoint text unique not null,
  subscription jsonb not null, user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.jyc_page_views (
  id bigint generated always as identity primary key, path text not null,
  referrer text, user_id uuid references auth.users(id) on delete set null,
  session_key text, created_at timestamptz not null default now()
);
create table if not exists public.jyc_error_reports (
  id bigint generated always as identity primary key, message text not null,
  stack text, path text, user_agent text, metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.jyc_event_reminders (
  id uuid primary key default gen_random_uuid(), event_id text not null,
  user_id uuid references auth.users(id) on delete cascade,
  reminder_at timestamptz not null, delivered_at timestamptz,
  created_at timestamptz not null default now(), unique(event_id,user_id,reminder_at)
);
create table if not exists public.jyc_notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  events boolean not null default true, recruitment boolean not null default true,
  announcements boolean not null default true, fests boolean not null default true,
  updated_at timestamptz not null default now()
);
create table if not exists public.jyc_media_albums (
  id uuid primary key default gen_random_uuid(), name text not null,
  slug text unique not null, description text, scope_type text not null default 'jyc',
  club_id uuid, event_id text, fest_id text, cover_url text,
  is_published boolean not null default false, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists jyc_page_views_path_idx on public.jyc_page_views(path,created_at desc);
create index if not exists jyc_page_views_created_idx on public.jyc_page_views(created_at desc);
create index if not exists jyc_push_user_idx on public.jyc_push_subscriptions(user_id);
alter table public.jyc_push_subscriptions enable row level security;
alter table public.jyc_page_views enable row level security;
alter table public.jyc_error_reports enable row level security;
alter table public.jyc_event_reminders enable row level security;
alter table public.jyc_notification_preferences enable row level security;
alter table public.jyc_media_albums enable row level security;

drop policy if exists "push owner or anonymous" on public.jyc_push_subscriptions;
create policy "push owner or anonymous" on public.jyc_push_subscriptions for insert to anon,authenticated with check (user_id is null or user_id=auth.uid());
drop policy if exists "push owner read" on public.jyc_push_subscriptions;
create policy "push owner read" on public.jyc_push_subscriptions for select to authenticated using (user_id=auth.uid() or user_id is null);
drop policy if exists "push owner update" on public.jyc_push_subscriptions;
create policy "push owner update" on public.jyc_push_subscriptions for update to authenticated using (user_id=auth.uid() or user_id is null) with check (user_id=auth.uid() or user_id is null);
drop policy if exists "push owner delete" on public.jyc_push_subscriptions;
create policy "push owner delete" on public.jyc_push_subscriptions for delete to authenticated using (user_id=auth.uid() or user_id is null);

drop policy if exists "public insert page views" on public.jyc_page_views;
create policy "public insert page views" on public.jyc_page_views for insert to anon,authenticated with check (user_id is null or user_id=auth.uid());
drop policy if exists "admins read page views" on public.jyc_page_views;
create policy "admins read page views" on public.jyc_page_views for select to authenticated using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin'));

drop policy if exists "public submit errors" on public.jyc_error_reports;
create policy "public submit errors" on public.jyc_error_reports for insert to anon,authenticated with check (true);
drop policy if exists "admins read errors" on public.jyc_error_reports;
create policy "admins read errors" on public.jyc_error_reports for select to authenticated using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin'));

drop policy if exists "reminders owner" on public.jyc_event_reminders;
create policy "reminders owner" on public.jyc_event_reminders for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
drop policy if exists "preferences owner" on public.jyc_notification_preferences;
create policy "preferences owner" on public.jyc_notification_preferences for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

drop policy if exists "public read albums" on public.jyc_media_albums;
create policy "public read albums" on public.jyc_media_albums for select to anon,authenticated using (is_published=true);
drop policy if exists "admins manage albums" on public.jyc_media_albums;
create policy "admins manage albums" on public.jyc_media_albums for all to authenticated using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','gallery_admin')) with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','gallery_admin'));

create table if not exists public.jyc_event_registrations (
  id uuid primary key default gen_random_uuid(), event_id text not null,
  name text not null, email text not null, enrollment_no text, phone text,
  year text, branch text, responses jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), unique(event_id,email)
);
alter table public.jyc_event_registrations enable row level security;
drop policy if exists "public register event" on public.jyc_event_registrations;
create policy "public register event" on public.jyc_event_registrations for insert to anon,authenticated with check (true);
drop policy if exists "admins read registrations" on public.jyc_event_registrations;
create policy "admins read registrations" on public.jyc_event_registrations for select to authenticated using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin','club_admin'));
