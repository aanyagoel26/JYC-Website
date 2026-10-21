# JYC V56 — Photo Pool Expansion

Date: 2026-10-04

## What changed

- Photo Story now consumes the full source-photo pool across the maintained hub registry, interleaved round-robin by community before deduplication.
- Photo Story has no artificial frame-count ceiling; every unique published gallery/source photo can enter the rotating queue.
- Photo Chapters now consume the full photo set for every hub and every family chapter.
- The Photo Story thumbnail rail is horizontally scrollable so a larger pool does not squeeze the layout.
- The progress indicator pauses while the story is hovered.
- The autoplay control remains keyboard-focusable and reduced-motion behavior remains intact.

## Media availability check

The uploaded JYC-Website-V20.3.0-SIGNATURE-ADMIN-FINAL(1).zip contains only four image files, all branding/phoenix assets. It does not contain the five master photo archives previously referenced by the project.

The current repository already contains the curated 171-image public asset set. The implementation therefore expands the transition feature over the existing source-backed pool rather than inventing or substituting unrelated images.

## Master archive extraction

When all-extracted-images-part1.zip through all-extracted-images-part5.zip are available, run:

node scripts/inventory-image-archives.mjs <part1.zip> <part2.zip> <part3.zip> <part4.zip> <part5.zip>

Use the resulting duplicate/basename report to add only genuinely new source images, then map them through jyc-source-media.js so every image has provenance and alt text.

## Design rule

Do not make every card auto-rotate. Automatic motion is reserved for the editorial Photo Story; the rest of the archive remains user-controlled. This keeps the senior-requested JYC visual language quiet, professional and readable.

## Research-backed direction

Official JIIT publications describe JYC-led cultural, technical and sports activity across events such as Ebullience and Converge, with photographic documentation in institutional reports and newsletters. The site should therefore behave like an editorial archive rather than a tiny hero carousel: source-backed photographs should enter the sequence according to provenance and relevance, while the interface controls how much is visible at once.
