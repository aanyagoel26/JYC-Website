do $migration$
declare
  def text;
  old_fragment text := $$from public.jyc_gallery_items g where g.status='approved' and nullif(g.public_url,'') is not null$$;
  new_fragment text := $$from public.jyc_gallery_items g
        where g.status='approved'
          and g.media_kind='photo'
          and g.rights_status='cleared'
          and g.focal_x is not null
          and g.focal_y is not null
          and nullif(g.public_url,'') is not null$$;
begin
  select pg_get_functiondef(p.oid)
    into def
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname='jyc_read_site_data'
    and pg_get_function_identity_arguments(p.oid)='';
  if def is null then raise exception 'jyc_read_site_data() not found'; end if;
  if position(old_fragment in def)=0 then raise exception 'Expected gallery publication predicate not found; refusing to mutate read RPC'; end if;
  def := replace(def,old_fragment,new_fragment);
  execute def;
end
$migration$;
