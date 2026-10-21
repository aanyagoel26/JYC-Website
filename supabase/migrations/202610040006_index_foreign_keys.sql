do $$
declare r record; idx_name text; cols text;
begin
  for r in
    select con.oid con_oid,n.nspname schema_name,c.relname table_name,con.conkey
    from pg_constraint con
    join pg_class c on c.oid=con.conrelid
    join pg_namespace n on n.oid=c.relnamespace
    where con.contype='f' and n.nspname='public'
  loop
    if not exists (
      select 1 from pg_index ix
      where ix.indrelid=r.table_name::regclass
        and ix.indisvalid
        and ix.indnkeyatts >= cardinality(r.conkey)
        and (ix.indkey[0:cardinality(r.conkey)-1])::int[] = r.conkey::int[]
    ) then
      select string_agg(format('%I',a.attname),',') into cols
      from unnest(r.conkey) with ordinality k(attnum,ord)
      join pg_attribute a on a.attrelid=r.table_name::regclass and a.attnum=k.attnum;
      idx_name := left('idx_'||r.table_name||'_'||replace(cols,'"','')||'_fk',60);
      execute format('create index if not exists %I on %I.%I (%s)',idx_name,r.schema_name,r.table_name,cols);
    end if;
  end loop;
end $$;