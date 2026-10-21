-- JYC V15 functional pass
-- Safe to re-run on an existing JYC Supabase project.
-- Adds/repairs account-linked registration fields and reminder policies.

create extension if not exists pgcrypto;

alter table if exists public.jyc_event_registrations
  add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table if exists public.jyc_event_registrations
  add column if not exists registration_status text not null default 'registered';
alter table if exists public.jyc_event_registrations
  add column if not exists updated_at timestamptz not null default now();
create index if not exists jyc_event_registrations_user_idx
  on public.jyc_event_registrations(user_id,created_at desc);

alter table if exists public.jyc_event_registrations enable row level security;
drop policy if exists "jyc v15 users read own registrations" on public.jyc_event_registrations;
drop policy if exists "jyc v15 users update own registrations" on public.jyc_event_registrations;
drop policy if exists "jyc v15 users delete own registrations" on public.jyc_event_registrations;
create policy "jyc v15 users read own registrations"
on public.jyc_event_registrations for select to authenticated
using (user_id=auth.uid());
create policy "jyc v15 users update own registrations"
on public.jyc_event_registrations for update to authenticated
using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "jyc v15 users delete own registrations"
on public.jyc_event_registrations for delete to authenticated
using (user_id=auth.uid());

alter table if exists public.jyc_event_reminders enable row level security;
drop policy if exists "jyc v15 reminder owner" on public.jyc_event_reminders;
create policy "jyc v15 reminder owner"
on public.jyc_event_reminders for all to authenticated
using (user_id=auth.uid()) with check (user_id=auth.uid());

create or replace function public.jyc_touch_registration()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists jyc_touch_registration on public.jyc_event_registrations;
create trigger jyc_touch_registration
before update on public.jyc_event_registrations
for each row execute function public.jyc_touch_registration();

select 'JYC V15 functional pass applied.' as result;
