-- V57.9: align the live public team role with the supplied 2026–27
-- orientation material. The supplied Apex Body labels Daksh Sachdeva
-- specifically as "Finance Secretary".

update public.jyc_site_data
set data = jsonb_set(
  data,
  '{team}',
  (
    select jsonb_agg(
      case
        when member->>'name'='Daksh Sachdeva'
        then member || jsonb_build_object('role','Finance Secretary')
        else member
      end
      order by ord
    )
    from jsonb_array_elements(coalesce(data->'team','[]'::jsonb)) with ordinality as x(member,ord)
  ),
  true
)
where id='main'
  and data->'team' @> '[{"name":"Daksh Sachdeva"}]'::jsonb;
