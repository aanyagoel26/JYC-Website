-- V57 social identity hardening.
-- The current production schema uses normalized JYC tables and does not contain the
-- retired aggregated_posts/content_sources tables from the older feed architecture.
-- Keep this migration intentionally idempotent/no-op so a fresh database does not
-- fail while the public identity policy remains enforced in src/jyc-socials.js
-- and the normalized verification layer.
begin;
do $$
begin
  if to_regclass('public.content_sources') is not null
     and to_regclass('public.aggregated_posts') is not null then
    execute $sql$
      update public.aggregated_posts p
      set published=false, verified=false, updated_at=now()
      where p.source_id in (
        select id from public.content_sources
        where hub_name='JYC'
          and url in ('https://www.instagram.com/jiityouthclub/','https://www.linkedin.com/company/jiityouthclub/')
      )
    $sql$;
    execute $sql$
      update public.content_sources
      set active=false, verified=false, updated_at=now()
      where hub_name='JYC'
        and url in ('https://www.instagram.com/jiityouthclub/','https://www.linkedin.com/company/jiityouthclub/')
    $sql$;
  end if;
end $$;
commit;
