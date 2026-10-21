# JYC V56.6 Deep Research & Source Integration — 2026-10-04

## Product contract

The supplied JYC Website Development Specification remains the public product contract:
- Home
- About JYC
- Hubs
- Hub Details
- Events
- Event Details
- Gallery / Archive
- Team
- Contact
- responsive navigation
- search/filter where useful
- subtle animation
- light/dark theme
- loading, empty and error states
- backend/database integration where dynamic functionality is used.

The public product remains JYC-first rather than a general student utility dashboard.

## Source hierarchy

1. Current official JIIT sources.
2. Supplied JYC / hub presentation PDFs.
3. Current official hub sites or official organization pages where available.
4. Historical JIIT annual reports for archive/history only.
5. Community/public discussion only for UX research, never as authoritative JYC facts.

Current JIIT 2026 admission brochure identifies JIIT Youth Club 128 as the central coordinating body for major college events, fests and inter-society activities and identifies the following relevant 128 communities: Aakriti, Panache, Abhivyakti, Aura, Cinekala, Eloquence, Qriosity, Prismatic, Vamunique, Fortissimo, BDS, CICR, JODC, RPH, Innovation Club, JSA and JIIT OPTICA.

Official source:
https://www.jiit.ac.in/uploads/Brochure2026_P1_643b559e11.pdf

## Supplied hub depth now represented

The supplied hub material provides source-backed activity narratives used in hub detail pages, including:
- RPH: DSA, competitive programming, C++, Code Clash and senior success stories.
- CICR: robotics, electronics, hands-on projects, TechTonic, Circuit Rush and Robo Soccer.
- Innovation: RIDE Hack, CodeAI, Innovate and Climate Data Hackathon.
- Zencoders: coding excellence, practical learning and collaborative development.
- JODC: open-source participation and developer collaboration.
- CypherX: cybersecurity awareness, CTFs, projects, workshops and senior mentorship.
- Arcadia: gaming, esports, AR/VR, Flappy Bird and Aim Labs.
- Neural Nexus: AI/ML fundamentals, projects, hackathons, challenges and workshops.
- Dronotics: drones, aerial robotics, Dron-O-War and Top Gun Challenge.
- Aakriti: Art of the Week, Best out of Waste, campus decoration and installations.
- Aura: event coverage, workshops, photo walks and visual storytelling.
- Panache: fashion, styling, modelling and performance.
- VamUnique: hip hop, contemporary, Bollywood, classical, performances and flashmobs.
- Eloquence: debating, anchoring, writing, poetry, Grand Conclave and Miss Matched.
- JSA: multiple indoor/outdoor sports and Kshitij.
- Qriosity: quizzes and knowledge-based competitions.
- JIIT OPTICA: STEM and scientific exploration.

Claims without sufficient current source evidence remain explicitly gated rather than being invented.

## Photography archive

The five supplied archives were reconciled locally:
- 873 files
- 873 image assets
- 813 unique SHA-256 hashes
- 60 duplicate relationships beyond the first occurrence
- formats: 514 PNG, 302 JPEG, 56 JPG, 1 SVG

Part counts:
- part 1: 213
- part 2: 232
- part 3: 94
- part 4: 267
- part 5: 67

Part 5 contains named hub/event assets such as Arcadia, Aura, BDS, CICR, CypherX, Dronotics, Eloquence, Innovation, Neural Nexus, Panache, Prismatic, RPH, VamUnique and Zencoders.

Raw archive files are not automatically treated as public current content. Maintained production media uses provenance, media type, association and review status.

## Image/search architecture

The website uses:
- real img elements rather than CSS-only image backgrounds for indexable photography;
- descriptive alt text;
- contextual captions;
- crawlable club/event/gallery URLs;
- image-aware sitemap entries;
- Open Graph image metadata;
- structured data with representative event/club images;
- stable canonical URLs.

Google Search Central guidance:
https://developers.google.com/search/docs/appearance/google-images

The implementation does not promise a specific Google ranking. Ranking depends on indexing, authority, relevance, content quality and external signals.

## Historical archive context

Official JIIT annual reports document JYC Sector-128 orientation, Ebullience, JYC Week and Converge history. These are treated as historical archive material, not as current club/event claims.

## Design research

Useful current patterns were taken from editorial, university, photography and event sites:
- large editorial lead image + supporting image rhythm;
- deliberate 4:3 / 16:9 / portrait crops;
- masonry/archive browsing;
- contextual captions;
- clear typography hierarchy;
- restrained interaction;
- strong detail pages;
- minimal chrome.

The JYC implementation keeps these interaction principles while retaining the supplied senior/V1 identity instead of copying another site's visual branding.

## 3D assistant

The supplied JYC GLB remains the only 3D model.

The assistant now supports:
- lazy model loading;
- model-native one-shot animation when available;
- wave;
- tap;
- bounce;
- dance;
- think;
- celebrate;
- peek;
- context-specific animation;
- pointer-driven camera response;
- reduced-motion fallback;
- logo fallback;
- mobile-safe positioning.

A second 3D model is intentionally not added because it would increase payload and visual noise without improving the JYC identity.

## Supabase publication integrity

V56.6 adds a database trigger so a normalized event cannot be marked published unless its stable slug has an active verified source record with an HTTPS source URL.

Converge 2026 remains published because its slug is verified.
JAI 2026 remains review-gated until its current canonical verification record is approved.

## Remaining external operational actions

- Enable Supabase Auth leaked-password protection in the Auth dashboard.
- Authorize/connect the JYC Vercel project for production deployment verification.
- Complete Google Search Console property verification and sitemap submission after production deployment.
- Transfer remaining raw archive binaries into GitHub/storage if a binary bridge is enabled; do not fabricate missing asset paths.

## Principle

The site should become a useful first-party source for JYC/JIIT-128 searches by being genuinely useful, source-grounded, visually rich and internally connected — not by keyword stuffing or fabricated pages.
