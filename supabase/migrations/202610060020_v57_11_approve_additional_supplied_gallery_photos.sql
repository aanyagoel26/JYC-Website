-- V57.11 — approve additional supplied gallery photography already committed
-- to the repository but not yet represented in normalized Supabase media.
begin;

do $block$
declare verifier uuid;
begin
  select user_id into verifier from public.jyc_admins where is_active=true order by created_at limit 1;
  if verifier is null then raise exception 'No active JYC admin exists; cannot perform V57.11 safely'; end if;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',verifier::text,'role','authenticated')::text,true);
  execute 'set local role authenticated';
end $block$;

insert into public.jyc_gallery_items
  (scope_type,public_url,caption,status,sort_order,created_by,media_kind,alt_text,
   source_type,source_label,source_page,source_year,credit)
select 'jyc',x.url,x.caption,'approved',x.sort_order,
  (select user_id from public.jyc_admins where is_active=true order by created_at limit 1),
  'photo',x.alt_text,'source-archive','JYC supplied hub archive',null,2026,
  'JYC supplied source material'
from (values
  ('/assets/hub-photos/jyc-01.webp','JYC · campus event moment from supplied hub archive',1,'JYC campus event photograph from the supplied hub archive'),
  ('/assets/hub-photos/jyc-02.webp','JYC · student collaboration and event coverage',2,'JYC student collaboration photograph from the supplied hub archive'),
  ('/assets/hub-photos/jyc-03.webp','JYC · cultural programme moment',3,'JYC cultural programme photograph from the supplied hub archive'),
  ('/assets/hub-photos/jyc-04.webp','JYC · stage and performance moment',4,'JYC stage performance photograph from the supplied hub archive'),
  ('/assets/hub-photos/jyc-05.webp','JYC · student community moment',5,'JYC student community photograph from the supplied hub archive'),
  ('/assets/hub-photos/jyc-06.webp','Converge · annual fest moment from supplied JYC material',6,'Converge annual fest photograph from supplied JYC material'),
  ('/assets/hub-photos/jyc-07.webp','JYC · campus community gathering',7,'JYC campus community gathering photograph from the supplied hub archive'),
  ('/assets/hub-photos/jyc-08.webp','Converge · performance and stage atmosphere',8,'Converge performance photograph from supplied JYC material'),
  ('/assets/hub-photos/jyc-09.webp','JYC · live performance moment',9,'JYC live performance photograph from the supplied hub archive'),
  ('/assets/hub-photos/jyc-10.webp','Ebullience · fresher welcome experience',10,'Ebullience fresher welcome photograph from supplied JYC material'),
  ('/assets/hub-photos/jyc-11.webp','JYC · recognition and student participation',11,'JYC recognition and student participation photograph from the supplied hub archive'),
  ('/assets/hub-photos/jyc-12.webp','JYC · student community photograph',12,'JYC student community photograph from the supplied hub archive'),
  ('/assets/hub-photos/neural-01.webp','Neural Nexus · AI/ML society material',13,'Neural Nexus AI/ML society photograph from the supplied JYC hub material')
) as x(url,caption,sort_order,alt_text)
where not exists (select 1 from public.jyc_gallery_items g where g.public_url=x.url);

commit;
