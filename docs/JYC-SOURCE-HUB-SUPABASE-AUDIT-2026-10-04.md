# JYC Source Media + Hub + Supabase Audit — 2026-10-04

## Source media inventory

Uploaded hub/media archives were re-audited before adding anything to the public gallery.

- Part 1: 213 files
- Part 2: 232 files
- Part 3: 94 files
- Part 4: 267 files
- Part 5: 67 files
- Total: 873 files
- Exact SHA-256 duplicate relationships: 60
- Unique file hashes: 813
- Part 5 contains named hub material for 16 communities: Arcadia, Aura, BDS, CICR, CypherX, Dronotics, Eloquence, Innovation, JODC, JSA, Neural Nexus, Panache, Prismatic, RPH, VamUnique and Zencoders.

The source archives contain mixed media roles: photographs, presentation graphics, logos, banners, layouts and illustrations. They must not be treated as one undifferentiated public photo gallery.

## Hub source model

The supplied hub presentation explicitly groups communities into five families:

- Cultural
- Technical
- Creative
- Literary
- Sports

It also describes JYC as a student-governed organisation that provides a platform for student talent and organises inter/intra-institutional activities. Its organisational chart places JYC hubs/societies, faculty in-charge/student coordinators, student volunteers and festival committees inside the wider JYC structure.

The website now keeps a 23-entry source registry:

1. 17 communities verified against the JIIT Admission Brochure 2026 production content.
2. 6 additional source-backed communities retained as source material until their live club records are published: Arcadia, CypherX, Dronotics, GDG, Neural Nexus and Zencoders.

Source-only entries are deliberately not silently promoted to current live club records.

## Hub detail rules

Each hub can have:

- source-grounded family and focus
- source-grounded description/story
- supplied visual archive
- live database events/recruitment/team when published
- explicit distinction between verified-current and source-material content

Current people, recruitment, event schedules and social links should only appear when present in the live published records.

## Supabase production snapshot

Project: `jyc-website`
Project ref: `ogbanmjokjlxfuktkicj`
Region: `ap-south-1`
Status at audit: ACTIVE_HEALTHY

Current JSON site-data source contains:

- 17 published clubs
- 2 published events
- 6 gallery records
- no team records in the JSON source
- 19 content-verification rows: 17 clubs + 2 events

The relational v2 tables exist and are protected by RLS, but the active public application currently reads the JSON site-data RPC. This is intentional for compatibility; the two models should not be populated independently without a planned migration.

## Security posture

Applied production migrations include publication verification, campus verification, media write boundaries, public-submission protection, function ACL hardening, verification identity audit and foreign-key indexes.

Current Supabase advisor findings include:

- leaked-password protection disabled — dashboard/auth configuration still required
- four intentionally private rate-limit tables have RLS with no direct policies
- SECURITY DEFINER RPC warnings for intentional public-read/registration functions and authenticated policy helpers

SECURITY DEFINER helpers should keep a fixed search path and minimal execution grants. Internal role helpers are intentionally callable by authenticated users because RLS policies use them.

## Next media ingestion rule

Do not bulk-publish the 873 uploaded files.

Before a media item becomes a live gallery item, assign:

`photo | artwork | logo | banner | layout | illustration`

and record:

- source archive
- source page/slide when known
- hub/event association
- year
- alt text
- publication state
- storage path
- verification status

This keeps the visual archive useful without turning presentation exports into fake event photography.
