-- Supabase Storage owns the storage schema. This migration repeats the least-privilege
-- intent for projects where the managed ACLs are directly revocable. On managed
-- projects the storage service may retain its own grants; RLS remains the authoritative
-- client write boundary. Browser uploads continue to use the media-upload Edge Function.
begin;

revoke all on table storage.buckets from public, anon, authenticated;
revoke all on table storage.objects from public, anon, authenticated;
grant select on table storage.objects to anon, authenticated;

commit;
