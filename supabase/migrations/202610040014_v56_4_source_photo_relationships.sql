-- V56.4 source-photo relationship backfill.
-- The normalized presentation-export gallery rows were imported with provenance,
-- but their club relation was initially left null. Backfill it from the
-- source caption prefix while preserving the original source metadata.
with map(label,name) as (
  values
    ('Aakriti','Aakriti'),
    ('Arcadia','Arcadia'),
    ('Aura','Aura'),
    ('BDS','BDS'),
    ('CICR','CICR'),
    ('CypherX','CypherX'),
    ('Dronotics','Dronotics'),
    ('Eloquence','Eloquence'),
    ('NeuralNexus','Neural Nexus'),
    ('Panache','Panache'),
    ('Prismatic','Prismatic'),
    ('RPH','RPH'),
    ('Sports','JSA'),
    ('VamUnique','VamUnique'),
    ('Zencoders','Zencoders')
)
update public.jyc_gallery_items g
set club_id=c.id
from map m
join public.jyc_clubs c on lower(c.name)=lower(m.name)
where g.source_type='presentation-export'
  and split_part(g.caption,' · ',1)=m.label
  and g.club_id is null;
