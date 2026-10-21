-- JYC bootstrap: create the administrator table before any policy/function
-- references it. Safe to run on a fresh or existing project.
create extension if not exists pgcrypto;

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

-- Administrators are never publicly listable. The frontend only needs the
-- current user's own row; privileged management uses a server-side function.
drop policy if exists "Users can read own JYC admin record" on public.jyc_admins;
create policy "Users can read own JYC admin record"
on public.jyc_admins for select to authenticated
using (user_id = auth.uid());

create index if not exists jyc_admins_role_idx on public.jyc_admins(role, is_active);
create index if not exists jyc_admins_club_idx on public.jyc_admins(club_id);

select 'JYC admin bootstrap complete.' as result;
