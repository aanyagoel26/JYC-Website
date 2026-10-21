# JYC source archive audit — 2026-10-04

## Supplied source set

The current JYC source package contains five extracted-image ZIP archives plus the 2026–27 “All Hubs” orientation PDF.

### Image archives
- Part 1: 213 image files
- Part 2: 232 image files
- Part 3: 94 image files
- Part 4: 267 image files
- Part 5: 66 image files
- Total: 872 image files
- Exact byte-duplicate reduction across the five archives: 60 duplicates
- Unique source images by SHA-256: 812

The archives contain a mixture of photographs, presentation artwork, banners, screenshots and decorative assets. The website should therefore use the photographic material as an editorial archive rather than blindly shipping every extracted presentation graphic.

## Orientation PDF

The supplied PDF is 290 pages and contains the current JYC 2026–27 orientation/hub material.

It explicitly presents the JYC ecosystem across Cultural, Technical, Creative, Literary and Sports families and names the major programme rhythm as Induction, Ebullience, Hackathon, Ethnic Day, Converge, Dron-O-War and Farewell.

The PDF also contains extensive hub-specific material for Aakriti, Aura, Panache, Zencoders, RPH, Dronotics, CypherX, VamUnique, Arcadia, Neural Nexus, Eloquence, Prismatic, BDS and other communities.

## Product decision

The public site does not impose an arbitrary 8/16-photo cap on the Photo Story source pool.

1. All unique source-media records returned by the maintained hub source index are eligible for the story.
2. Duplicate URLs are removed.
3. The next photograph is preloaded for smoother transitions.
4. The thumbnail rail is virtualized around the active frame so hundreds of photographs do not create hundreds of eager DOM/image loads.
5. A range scrubber exposes the entire sequence, so the archive is not silently truncated.
6. Reduced-motion users retain a static presentation.

This keeps the editorial transition-photograph direction while remaining performant on mobile.

## Provenance

The attached source package is the basis for this audit. The repository’s existing curated public/assets library remains the production media layer. New source imagery should continue to carry descriptive alt text and provenance metadata rather than being added as anonymous stock imagery.

## Current production boundary

Vercel/deployment configuration is intentionally left untouched in this pass, per the project workflow.