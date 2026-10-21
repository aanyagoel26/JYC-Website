-- JYC PLATFORM V2 RELATIONAL FOUNDATION
-- Safe starting point for the scalable CMS.
-- The existing jyc_site_data JSON store can remain during migration.
-- Do NOT put service/secret keys in the frontend.

create extension if not exists pgcrypto;

create table if not exists public.jyc_clubs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  type text not null check (type in ('Technical','Non-Technical')),
  category text,
  subcategory text,
  logo_url text,
  banner_url text,
  short_description text not null,
  full_description text,
  status text not null default 'draft' check (status in ('draft','published','hidden','archived')),
  pinned boolean not null default false,
  featured boolean not null default false,
  recruitment_enabled boolean not null default false,
  auditions_enabled boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jyc_club_sections (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.jyc_clubs(id) on delete cascade,
  section_type text not null default 'text',
  title text not null,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jyc_club_members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.jyc_clubs(id) on delete cascade,
  name text not null,
  position text not null,
  photo_url text,
  bio text,
  instagram text,
  linkedin text,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table if not exists public.jyc_club_links (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.jyc_clubs(id) on delete cascade,
  label text not null,
  url text not null,
  sort_order integer not null default 0
);

create table if not exists public.jyc_events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references public.jyc_clubs(id) on delete set null,
  slug text unique not null,
  title text not null,
  event_type text,
  poster_url text,
  banner_url text,
  short_description text,
  full_description text,
  start_at timestamptz,
  end_at timestamptz,
  venue text,
  map_url text,
  registration_url text,
  registration_deadline timestamptz,
  eligibility text,
  fee text,
  status text not null default 'draft' check (status in ('draft','submitted','under_review','changes_requested','published','ongoing','past','archived')),
  featured boolean not null default false,
  pinned boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jyc_event_blocks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.jyc_events(id) on delete cascade,
  block_type text not null,
  title text,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_visible boolean not null default true
);

create table if not exists public.jyc_event_people (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.jyc_events(id) on delete cascade,
  person_type text not null check (person_type in ('speaker','guest','contact')),
  name text not null,
  designation text,
  organization text,
  photo_url text,
  bio text,
  email text,
  phone text,
  linkedin text,
  sort_order integer not null default 0
);

create table if not exists public.jyc_gallery_items (
  id uuid primary key default gen_random_uuid(),
  scope_type text not null check (scope_type in ('jyc','club','event','fest')),
  club_id uuid references public.jyc_clubs(id) on delete cascade,
  event_id uuid references public.jyc_events(id) on delete cascade,
  storage_path text,
  public_url text not null,
  caption text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.jyc_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  link text,
  priority integer not null default 0,
  pinned boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  is_visible boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.jyc_homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  title text,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.jyc_content_versions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  version_number integer not null,
  snapshot jsonb not null,
  changed_by uuid references auth.users(id) on delete set null,
  change_summary text,
  created_at timestamptz not null default now(),
  unique(entity_type, entity_id, version_number)
);

create table if not exists public.jyc_content_reviews (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  submitted_by uuid references auth.users(id) on delete set null,
  status text not null default 'submitted' check (status in ('submitted','under_review','changes_requested','approved','rejected')),
  reviewer_id uuid references auth.users(id) on delete set null,
  review_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.jyc_feature_flags (
  key text primary key,
  enabled boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists jyc_clubs_status_idx on public.jyc_clubs(status);
create index if not exists jyc_clubs_category_idx on public.jyc_clubs(type, category, subcategory);
create index if not exists jyc_events_dates_idx on public.jyc_events(start_at, end_at, status);
create index if not exists jyc_events_club_idx on public.jyc_events(club_id);
create index if not exists jyc_gallery_scope_idx on public.jyc_gallery_items(scope_type, club_id, event_id);
create index if not exists jyc_reviews_status_idx on public.jyc_content_reviews(status);

alter table public.jyc_clubs enable row level security;
alter table public.jyc_club_sections enable row level security;
alter table public.jyc_club_members enable row level security;
alter table public.jyc_club_links enable row level security;
alter table public.jyc_events enable row level security;
alter table public.jyc_event_blocks enable row level security;
alter table public.jyc_event_people enable row level security;
alter table public.jyc_gallery_items enable row level security;
alter table public.jyc_announcements enable row level security;
alter table public.jyc_homepage_sections enable row level security;
alter table public.jyc_content_versions enable row level security;
alter table public.jyc_content_reviews enable row level security;
alter table public.jyc_feature_flags enable row level security;

-- Public reads only published/visible content.
drop policy if exists "public read published clubs" on public.jyc_clubs;
create policy "public read published clubs" on public.jyc_clubs for select to anon, authenticated using (status='published');

drop policy if exists "public read published events" on public.jyc_events;
create policy "public read published events" on public.jyc_events for select to anon, authenticated using (status in ('published','ongoing','past'));

drop policy if exists "public read approved gallery" on public.jyc_gallery_items;
create policy "public read approved gallery" on public.jyc_gallery_items for select to anon, authenticated using (status='approved');

drop policy if exists "public read visible announcements" on public.jyc_announcements;
create policy "public read visible announcements" on public.jyc_announcements for select to anon, authenticated using (is_visible=true and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>=now()));

-- Admin/editor helpers rely on the existing jyc_admins table.
create or replace function public.jyc_v2_role()
returns text language sql stable security definer set search_path=public as $$
  select role from public.jyc_admins where user_id=auth.uid() and is_active=true limit 1;
$$;

create or replace function public.jyc_v2_club()
returns text language sql stable security definer set search_path=public as $$
  select club_id::text from public.jyc_admins where user_id=auth.uid() and is_active=true limit 1;
$$;

grant execute on function public.jyc_v2_role() to anon, authenticated;
grant execute on function public.jyc_v2_club() to authenticated;

-- Super Admin: full CRUD on the V2 CMS tables.
-- JYC Editor: operational content, but not administrator/security tables.
drop policy if exists "admins manage clubs" on public.jyc_clubs;
create policy "admins manage clubs" on public.jyc_clubs for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','clubs_admin')
  or (public.jyc_v2_role()='club_admin' and id::text=public.jyc_v2_club()))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','clubs_admin')
  or (public.jyc_v2_role()='club_admin' and id::text=public.jyc_v2_club()));

drop policy if exists "admins manage events" on public.jyc_events;
create policy "admins manage events" on public.jyc_events for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin')
  or (public.jyc_v2_role()='club_admin' and club_id::text=public.jyc_v2_club()))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin')
  or (public.jyc_v2_role()='club_admin' and club_id::text=public.jyc_v2_club()));

drop policy if exists "admins manage gallery" on public.jyc_gallery_items;
create policy "admins manage gallery" on public.jyc_gallery_items for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','gallery_admin')
  or (public.jyc_v2_role()='club_admin' and club_id::text=public.jyc_v2_club()))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','gallery_admin')
  or (public.jyc_v2_role()='club_admin' and club_id::text=public.jyc_v2_club()));

-- Child tables follow their parent scope.
drop policy if exists "admins manage club sections" on public.jyc_club_sections;
create policy "admins manage club sections" on public.jyc_club_sections for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','clubs_admin')
  or (public.jyc_v2_role()='club_admin' and club_id::text=public.jyc_v2_club()))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','clubs_admin')
  or (public.jyc_v2_role()='club_admin' and club_id::text=public.jyc_v2_club()));

drop policy if exists "admins manage club members" on public.jyc_club_members;
create policy "admins manage club members" on public.jyc_club_members for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','clubs_admin')
  or (public.jyc_v2_role()='club_admin' and club_id::text=public.jyc_v2_club()))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','clubs_admin')
  or (public.jyc_v2_role()='club_admin' and club_id::text=public.jyc_v2_club()));

drop policy if exists "admins manage club links" on public.jyc_club_links;
create policy "admins manage club links" on public.jyc_club_links for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','clubs_admin')
  or (public.jyc_v2_role()='club_admin' and club_id::text=public.jyc_v2_club()))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','clubs_admin')
  or (public.jyc_v2_role()='club_admin' and club_id::text=public.jyc_v2_club()));

-- Child event data.
drop policy if exists "admins manage event blocks" on public.jyc_event_blocks;
create policy "admins manage event blocks" on public.jyc_event_blocks for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin'))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin'));

drop policy if exists "admins manage event people" on public.jyc_event_people;
create policy "admins manage event people" on public.jyc_event_people for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin'))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin'));

drop policy if exists "admins manage announcements" on public.jyc_announcements;
create policy "admins manage announcements" on public.jyc_announcements for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','content_admin'))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','content_admin'));

drop policy if exists "admins manage homepage" on public.jyc_homepage_sections;
create policy "admins manage homepage" on public.jyc_homepage_sections for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','content_admin'))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','content_admin'));

drop policy if exists "admins manage versions" on public.jyc_content_versions;
create policy "admins manage versions" on public.jyc_content_versions for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin'))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin'));

drop policy if exists "admins manage reviews" on public.jyc_content_reviews;
create policy "admins manage reviews" on public.jyc_content_reviews for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin','clubs_admin','content_admin'))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin','jyc_admin','events_admin','clubs_admin','content_admin'));

drop policy if exists "super admins manage flags" on public.jyc_feature_flags;
create policy "super admins manage flags" on public.jyc_feature_flags for all to authenticated
using (public.jyc_v2_role() in ('super_admin','jyc_super_admin'))
with check (public.jyc_v2_role() in ('super_admin','jyc_super_admin'));
