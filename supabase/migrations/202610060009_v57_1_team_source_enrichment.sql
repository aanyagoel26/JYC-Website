-- V57.1 — enrich the source-backed JYC 2026–27 leadership records with the supplied
-- official JYC 128 Instagram campaign descriptions. This is deliberately limited to
-- existing team IDs and does not create or promote new people.
do $migration$
declare
  team jsonb;
  enriched jsonb;
begin
  select data->'team' into team from public.jyc_site_data where id='main';
  if team is null or jsonb_typeof(team) <> 'array' then
    return;
  end if;

  select coalesce(jsonb_agg(
    case t->>'id'
      when 'devansh-tripathi' then t || jsonb_build_object('bio','General Secretary of JYC 128. The supplied official JYC 128 leadership campaign describes his work across student societies, leadership, creativity, innovation, culture, literature, design and technology, with a focus on connecting people, ideas and opportunities.','sourceType','official-instagram-campaign','sourceLabel','Supplied JYC 128 official Instagram leadership campaign · June 2026')
      when 'amrit-kumar-jha' then t || jsonb_build_object('bio','Vice President of JYC 128. The supplied official leadership campaign describes a planner, coordinator and problem-solver focused on operations, decisions, collaboration, structure and execution.','sourceType','official-instagram-campaign','sourceLabel','Supplied JYC 128 official Instagram leadership campaign · June 2026')
      when 'daksh-sachdeva' then t || jsonb_build_object('bio','Finance Secretary / Treasurer of JYC 128. The supplied official leadership campaign describes responsibility for budgeting, planning, financial balance, resource clarity and accountability.','sourceType','official-instagram-campaign','sourceLabel','Supplied JYC 128 official Instagram leadership campaign · June 2026')
      when 'saksham-kotia' then t || jsonb_build_object('bio','Joint Secretary of JYC 128. The supplied official leadership campaign describes coordination, management support, execution behind the scenes, consistency and organized team operations.','sourceType','official-instagram-campaign','sourceLabel','Supplied JYC 128 official Instagram leadership campaign · June 2026')
      when 'aradhyaa-singh' then t || jsonb_build_object('bio','Executive Head of JYC 128. The supplied official leadership campaign describes a calm, focused and disciplined leader who coordinates teams and turns plans into execution.','sourceType','official-instagram-campaign','sourceLabel','Supplied JYC 128 official Instagram leadership campaign · June 2026')
      when 'divye-bajaj' then t || jsonb_build_object('bio','PR Head of JYC 128. The supplied official leadership campaign describes a people-first communicator focused on collaborations, outreach, representation and building stronger connections.','sourceType','official-instagram-campaign','sourceLabel','Supplied JYC 128 official Instagram leadership campaign · June 2026')
      when 'shriya-singh' then t || jsonb_build_object('bio','Digital Head of JYC 128. The supplied official leadership campaign describes responsibility for content, online presence, posts, reels, campaigns, digital storytelling and maintaining an active public identity.','sourceType','official-instagram-campaign','sourceLabel','Supplied JYC 128 official Instagram leadership campaign · June 2026')
      when 'revant-srivastava' then t || jsonb_build_object('bio','Management / Event Management Head of JYC 128. The supplied official leadership campaign describes event execution, team alignment, coordination and calm on-ground management from start to finish.','sourceType','official-instagram-campaign','sourceLabel','Supplied JYC 128 official Instagram leadership campaign · June 2026')
      when 'juhi-hatuka' then t || jsonb_build_object('bio','Hospitality Head of JYC 128. The supplied official leadership campaign describes a warm, people-first approach to guest, participant and team experience, hospitality arrangements and behind-the-scenes coordination.','sourceType','official-instagram-campaign','sourceLabel','Supplied JYC 128 official Instagram leadership campaign · June 2026')
      when 'asmi-srivastava' then t || jsonb_build_object('bio','Hospitality Head of JYC 128. The supplied official leadership campaign describes responsibility for guest experience, event coordination, reliability and making events feel welcoming, smooth and memorable.','sourceType','official-instagram-campaign','sourceLabel','Supplied JYC 128 official Instagram leadership campaign · June 2026')
      when 'vansh-mahajan' then t || jsonb_build_object('bio','Security Head of JYC 128. The supplied official leadership campaign describes on-ground safety, discipline, coordination, order under pressure and quick decision-making during events and activities.','sourceType','official-instagram-campaign','sourceLabel','Supplied JYC 128 official Instagram leadership campaign · June 2026')
      when 'pratik-kumar' then t || jsonb_build_object('bio','Security Head of JYC 128. The supplied official leadership campaign describes discipline, coordination, smooth event management, structure, accountability and dependable on-ground support.','sourceType','official-instagram-campaign','sourceLabel','Supplied JYC 128 official Instagram leadership campaign · June 2026')
      else t
    end order by coalesce(t->>'sortOrder','999'), t->>'name'
  ),'[]'::jsonb) into enriched
  from jsonb_array_elements(team) t;

  update public.jyc_site_data
  set data=jsonb_set(data,'{team}',enriched,true)
  where id='main';
end;
$migration$;
