-- Storage Data API grant hardening.
-- The JYC browser never writes storage metadata directly: uploads/deletes/updates
-- go through the authenticated media-upload Edge Function. Keep public reads
-- available for the public jyc-media bucket, but remove direct metadata mutation
-- privileges from Data API roles.
begin;

revoke all on table storage.buckets from anon, authenticated;
revoke all on table storage.objects from anon, authenticated;
grant select on table storage.objects to anon, authenticated;

commit;
