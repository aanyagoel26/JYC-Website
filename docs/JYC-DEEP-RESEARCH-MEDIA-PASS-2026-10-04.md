# JYC Deep Research & Media Utilisation Pass — 2026-10-04

## 1. What the supplied files actually contain

The supplied JYC hub presentation is much more than a club-name list. It contains:

- JYC purpose and organisational structure
- five presentation families: Cultural, Technical, Creative, Literary and Sports
- hub-specific descriptions and activity areas
- programme/event references
- hub leadership/coordination examples
- social/QR references
- extensive visual material
- historical/event imagery and presentation graphics

The presentation states that JYC is student-governed, provides a platform for student talent, organises inter/intra-institutional activities, connects students and clubs, develops leadership, promotes talent/creativity, supports industry/alumni interaction, and builds teamwork/responsibility. These claims are source-derived and should remain separate from live operational data.

## 2. Media archive

Five supplied image archives contain 873 extracted image files.

The archive is mixed-media rather than a pure photography dump:

- photographs
- group/event photographs
- posters
- logos
- presentation graphics
- illustrations
- abstract backgrounds
- banners/layouts

Part 5 is especially useful because filenames are hub-scoped. It contains explicit directories for Arcadia, Aura, BDS, CICR, CypherX, Dronotics, Eloquence, Innovation, JODC, JSA, Neural Nexus, Panache, Prismatic, RPH, VamUnique and Zencoders.

Innovation has six clearly photographic DSC images. Dronotics has event-specific visual material. Several other hub directories contain presentation graphics mixed with photographic material.

The repository now contains 124 committed hub media files under `public/assets/hub-photos*`; the source-media QA gate verifies that every referenced asset resolves. Supabase now contains 92 of the supplied source photographs as a **pending review inventory** with media type, alt text, provenance and source-year metadata. They are deliberately not auto-published until content verification approves them.

## 3. How the website should use them

### Photography
Use real photographs for:

- homepage moments
- hub detail photo strips
- Gallery photography
- event recaps
- visual archive
- story cards

### Artwork / presentation graphics
Use separately for:

- hub identity cards
- event posters
- archive/editorial stories
- visual explainers

Do not label these as photographs.

### Logos / banners
Use only as identity assets or event/hub lockups. Do not mix them into the photography count.

The Gallery now classifies source media into:

- Photography
- Artwork / design
- Other source visuals

while retaining collection role and year filtering.

## 4. Source freshness

The official JIIT 2026 admission brochure explicitly lists the JYC 128 ecosystem and describes Qriosity, Prismatic, Vamunique, Fortissimo, BDS, CICR, JODC, RPH, Innovation Club, JSA and JIIT OPTICA among the published student communities.

The website therefore labels those records **2026 brochure verified**, not “permanently current”.

The additional supplied-hub records are retained as **source material** until their live published club records are available.

This distinction is important because JIIT's June 2026 public article describes more than 30 active hubs across the wider JIIT ecosystem. The JYC source index must therefore never imply that its 23 source-indexed communities are the exhaustive JIIT-wide roster.

## 5. Current external research that should influence the site

- JIIT's official 2026 brochure identifies JYC 128 as the central coordinating body for major college events, fests and inter-society activities.
- JIIT's current public material confirms the Sector-128 campus address.
- Dronotics' current site confirms DRONO-O-WAR 1.0 ran May 2–3, 2026 at Sector 128 and contained five arenas.
- CICR's current site describes CICR as the robotics hub of JIIT-128 and currently promotes TechTonic 2.0.
- Innovation's current site promotes RIDE Hack'26 for 1 November 2026 and maintains an event archive.
- CypherX's current LinkedIn describes it as the official cybersecurity community of JIIT-128, founded in 2026.
- JYC's current LinkedIn activity confirms JAI 2026 on October 30–31, 2026 at Sector 128, including the Agentic AI Hackathon.

These external sources should be used for freshness checks, not as a replacement for the supplied JYC source archive.

## 6. Remaining high-value work

### P0 — required before calling the site production-ready
1. Complete GitHub CI / Quality Gate / CodeQL on the latest commit.
2. Verify Vercel production project and deployment.
3. Run real browser QA at 320/360/390/430 px and desktop widths.
4. Verify Supabase Auth configuration, email confirmation/redirects and leaked-password protection.
5. Configure only the required Edge Function secrets with real values.
6. Complete final image binary ingestion/optimisation for source media that is not already represented by the committed WebP archive.
7. Audit every published gallery item for source, association, year, alt text and media kind.
8. Review the remaining raw Part-5 source photos that are not yet represented by the committed WebP archive before adding them to production.

### P1 — content quality
8. Add a visible source/freshness state to hub detail pages.
10. Add current external activity links only when independently verified.
11. Add hub-level event feeds without confusing them with the JYC-only public event calendar.
12. Build proper historical/archive separation for older JYC material.
13. Add photographer/source credit where the archive provides it.
14. Ensure every image has a useful, non-repetitive alt description.

### P1 — technical
14. Remove remaining historical QA assumptions that hard-code obsolete counts or old release names.
15. Consolidate active CSS/JS architecture further after production QA.
16. Check bundle size and image payloads after final media ingestion.
17. Confirm service-worker cache invalidation after asset changes.
18. Verify canonical URLs, OG images, JSON-LD, sitemap and robots on the actual deployment.
19. Test deep-link refreshes on every public route.
20. Test auth/RLS boundaries with anonymous, authenticated, club-admin and super-admin roles.

### P2 — future but valuable
21. Automated media provenance validation.
22. Automated stale-content detection.
23. Image focal-point metadata for better responsive crops.
24. Admin gallery bulk-review workflow.
25. Search indexing for hub/event/gallery provenance.
26. Public “source / archive” indicators that remain unobtrusive.
27. Performance budgets for hero images, gallery images and JavaScript.

## 7. Explicit non-goals

Do not turn this work into:

- a student ERP
- academic portal
- attendance/pass/certificate system
- campus utility dashboard
- social network
- public chatbot-first experience
- decorative WebGL playground

The supplied source material supports JYC's role as a student-governed cultural/technical/creative ecosystem, so the website should remain an organisational/editorial experience.
