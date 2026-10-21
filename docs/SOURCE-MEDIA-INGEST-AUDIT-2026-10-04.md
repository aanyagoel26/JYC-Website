# JYC Source Media Ingest Audit — 2026-10-04

## Supplied archive inventory

Five uploaded image ZIPs were inspected as source material for the JYC photo system.

| Archive | Image files | PNG | JPG | JPEG |
|---|---:|---:|---:|---:|
| all-extracted-images-part1.zip | 213 | 125 | 1 | 87 |
| all-extracted-images-part2.zip | 232 | 126 | 3 | 103 |
| all-extracted-images-part3.zip | 94 | 67 | 16 | 11 |
| all-extracted-images-part4.zip | 267 | 152 | 28 | 87 |
| all-extracted-images-part5.zip | 66 | 44 | 8 | 14 |
| **Total** | **872** | **514** | **56** | **302** |

## Duplicate audit

- 872 image files were inspected.
- 59 exact SHA-256 duplicate groups were found.
- 119 files participate in those duplicate groups.
- Many duplicates are the same source visual appearing once as an extracted PPTX image and again under a meaningful hub filename. Example: extracted-pptx/image105.png and hubs/dronotics/showcase-4.png are byte-identical.
- Therefore the archive should be deduplicated by content hash, not by filename.

## Part 5 named hub archive

The fifth archive contains 66 named hub assets rather than anonymous PPTX exports. It includes showcase material for:

Arcadia, Aura, BDS, CICR, CypherX, Dronotics, Eloquence, Innovation, JSA, Neural Nexus, Panache, Prismatic, RPH, VamUnique and Zencoders, plus JODC branding.

Important classification rule: these files are not automatically all photography. The inspection found a mixture of genuine event/community photographs, club showcase graphics, logos, banners, editorial layouts, abstract design backgrounds and illustrations.

They must therefore be stored with a media role such as photo, artwork, logo, banner, or layout, rather than forcing every image into the photo gallery.

## Production ingestion rule

For every asset that enters the live gallery:

1. Preserve original filename and source archive.
2. Compute a content hash.
3. Assign association, clubId and/or eventId where supported.
4. Assign year only when supported by source context.
5. Add human-readable caption and alt text.
6. Record provenance/source page.
7. Classify media role.
8. Generate optimized WebP/AVIF derivatives where appropriate.
9. Keep logos, graphics and decorative backgrounds out of the main photography stream.
10. Never publish an image solely because it exists in an extracted ZIP.

## Current website consequence

The existing source-media architecture already merges supplied JYC gallery material and enriches hub profiles. This audit adds the missing archive-level provenance and deduplication contract so the large uploaded archive can be ingested safely without turning the Gallery into an unclassified image dump.

## Next media pass

The remaining work is not "find more images". It is curation:
- map the 872 assets to events/hubs/years,
- choose the strongest hero/story images,
- remove exact duplicates,
- separate artwork from photography,
- populate Supabase gallery/media rows,
- verify every public URL and crop,
- then run real mobile/gallery QA.
