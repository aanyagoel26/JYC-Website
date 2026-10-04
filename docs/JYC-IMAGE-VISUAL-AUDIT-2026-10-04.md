# JYC image visual audit — 2026-10-04

## Scope

The five supplied image archives were imported under `public/assets/source-archive/`. I reviewed the complete stored image set visually using contact sheets before changing the runtime media policy.

Repository inventory:

- 873 source image entries in the committed archive
- 813 unique binary SHA-256 sources
- 60 exact duplicate relationships
- Optimised WebP payload with the original source path retained in `catalog.json`

## What the visual audit found

The archive is intentionally mixed. It contains:

- real event/community photography
- portraits and leadership photographs
- sports/action photography
- performance and stage photography
- campus/event photography
- posters and presentation slides
- club logos and identity marks
- QR/social cards
- screenshots
- illustrations and 3D artwork
- paper/texture/background assets
- decorative frames, lines and other layout material

The implementation must therefore **not** equate “image file” with “photograph”.

## Runtime policy

The default photography stream is now conservative:

1. Presentation/design assets stay visual assets.
2. Known QR, logo and banner assets stay out of photography.
3. Visually audited slide-heavy club exports are excluded from the photography stream but remain available in the full archive.
4. Reviewed showcase photographs can enter photography when their actual content is photographic.
5. Sports, festival, campus-event and club photographs are used as contextual media rather than generic decoration.
6. The full source archive remains browsable through the visual-archive system.
7. Source provenance is preserved; no synthetic image is substituted for a missing real photograph.

## Interconnection

The same source media can now feed:

**archive → club → story → event/collection → gallery → related page**

A club's real photography is preferred for its visual identity. Event-specific source media is kept separate from unrelated event collections. Artwork/design remains available as a visual fallback without being labelled as photography.

## Known visual groups

The audit explicitly reviewed the source-heavy groups including Abhivyakti, Arcadia, Aura, BDS, CICR, Cine Film, CypherX, Dronotics, Eloquence, Innovation, JODC, JSA, Neural Nexus, Panache, Prismatic, RPH, VamUnique, Zencoders, Aakriti, campus-event media, presentation assets, design assets and sports.

The runtime policy is intentionally conservative where a source volume is dominated by slides or graphics.

## Regression guard

The media architecture QA now checks that:

- the undefined archive-photo runtime collection is absent;
- archive photo selection uses the content-aware policy;
- the full source archive remains represented;
- source media keeps provenance/alt metadata;
- event aliases resolve deterministically;
- gallery URLs are deduplicated.

This document is an audit record, not a claim that every source photograph represents a current JYC activity. Historical/source material remains subject to the site's publication and verification rules.
