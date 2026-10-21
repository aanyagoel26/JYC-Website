# JYC V56.1 — Source Archive Pass

Date: 2026-10-04

## Supplied source archive

The five user-supplied image archives were reconciled byte-for-byte before media decisions were made.

| Volume | Raw image files | Unique images |
|---|---:|---:|
| Part 1 | 213 | 213 |
| Part 2 | 232 | 232 |
| Part 3 | 94 | 94 |
| Part 4 | 267 | 263 |
| Part 5 | 66 | 10 |
| **Total** | **872** | **812** |

**60 exact duplicates** were identified and excluded from the unique-source count.

## Product treatment

- The Photo Story is intentionally uncapped: it walks the full source-photo pool exposed by the maintained JYC source registry rather than an arbitrary 8/16-image limit.
- The next image is preloaded so the editorial cross-fade remains smooth without eagerly downloading the entire queue.
- The thumbnail rail is a moving 11-item window over the full archive, keeping navigation usable even when the source pool is large.
- The source inventory is surfaced in the UI as a five-volume provenance ledger so the scale of the supplied archive is explicit.
- Raw archive originals are not blindly copied into the production bundle. This avoids turning the public JavaScript/static asset footprint into an unnecessarily large archive while preserving the source inventory and using the curated, provenance-backed media already committed to the site.

## Source/content grounding

The supplied all hubs PDF describes JYC as a student-governed organization, lists the five community families, documents major activities including Induction, Ebullience, Hackathon, Ethnic Day, Converge, Dron-O-War and Farewell, and includes current orientation/team material. Those source-backed labels remain the content authority for this pass.

Historical public JIIT reports also document JYC orientation and Ebullience photography, reinforcing the decision to use an editorial archive treatment rather than a generic stock-photo carousel. Public historical images were not scraped into the repository solely on the basis of public availability.