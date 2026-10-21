# JYC V56.5 Deep Research — Content, Photography, SEO & Interaction

Date: 2026-10-04

## Research basis
- supplied JYC Website Development Specification;
- supplied All Hubs / orientation material;
- committed source-media archive;
- current JIIT public information;
- Google Search Central guidance;
- current editorial/photography/event design references.

## Design decisions
### Editorial photography
The supplied image archive is treated like an editorial collection rather than a generic card background library.
Rules:
1. Use the strongest photograph as the first visual.
2. Keep varied image ratios in archive/gallery contexts.
3. Use captions and source labels beside/under images.
4. Keep posters/artwork separate from photography.
5. Use association + year + source context where available.
6. Connect every event image to its event when the source data supports that relationship.
7. Connect hub photography back to the hub profile.
8. Do not publish uncertain archive material as current fact.
9. Use lazy loading below the fold and intrinsic sizing to reduce layout shift.
10. Keep the JYC logo as identity chrome, not as a substitute for real photography.

The inspiration pass deliberately favours editorial, photography, archive and event patterns rather than SaaS/dashboard patterns.

### JYC visual language
- warm cream/paper light mode;
- near-black dark mode;
- ink typography;
- restrained red attention accents;
- muted antique-gold secondary accents;
- thin rules;
- centered composition;
- restrained motion;
- real supplied photography.

No neon, glassmorphism, random gradients, orbit UI, rotating public cards or decorative 3D background.

## Source-backed content depth
The maintained hub-detail layer includes activity areas, signature experiences, source highlights, supplied source leadership where explicitly present, source status, and current-vs-source distinction.

Examples include:
- RPH: Code Clash 25.1 / 25.2, DSA, Competitive Programming and C++;
- CICR: TechTonic, Circuit Rush, Robo Soccer, robotics/prototyping;
- Innovation: RIDE Hack, CodeAI, Innovate, Climate Data Hackathon;
- CypherX: cybersecurity workshops, CTFs and projects;
- Arcadia: Flappy Bird, Aim Labs and AR/VR Lab activities;
- Neural Nexus: AI/ML fundamentals, projects, hackathons, workshops and challenges;
- Dronotics: Dron-O-War and Top Gun Challenge;
- Aakriti: Art of the Week, Best out of Waste and campus installations;
- Aura: photo walks, event coverage and workshops;
- Eloquence: Grand Conclave 2026 and Miss Matched '26';
- JSA: Kshitij and multiple sports;
- Qriosity: quizzing and knowledge competitions;
- JIIT OPTICA: STEM/scientific exploration.

## Search / discoverability
The site uses descriptive per-page titles, dynamic descriptions, canonical URLs, Organization schema, WebSite schema, Event schema, hub Organization schema, CollectionPage/ItemList schema, BreadcrumbList, image metadata, descriptive alt text, crawlable internal routes, robots.txt, generated XML sitemap, LLM discovery content, and image sitemap entries for maintained hub photography.

The sitemap generator now attaches maintained hub images to club URLs in addition to the gallery image set.

The goal is not to promise a #1 ranking. Search engines control ranking. The implementation instead makes JYC's first-party content easy to understand, crawl and associate with relevant JIIT/JYC searches.

## Current research signals
Current official JIIT communication describes JYC as the apex student body coordinating hub activities and major fests, while also describing a wider JIIT ecosystem of 30+ active hubs. Therefore the website's 23-community maintained source index is intentionally not described as exhaustive.

Current JIIT public activity includes Dron-O-War, Innovation activity and other campus events. These are freshness signals; they do not override JYC's own publication/verification workflow.

## GLB bot
The supplied jyc-spatial.glb remains the only public 3D assistant asset.
Interaction:
- no auto-rotation;
- lazy model-viewer loading;
- route-aware context;
- hover/tap/wave/bounce/dance/context motion;
- model-native animation selection when animations exist;
- one-shot animation playback;
- subtle camera nudge;
- reduced-motion fallback;
- 2D logo fallback when WebGL/model loading fails;
- contextual assistant dialog rather than a permanent navigation bar.

The model remains an assistant/navigation affordance, not the hero or primary site content.

## Quality contract
- 320/360/390/430 mobile safety;
- no horizontal overflow;
- no accidentally off-screen visible text;
- no clipped public copy;
- centered composition;
- no accidental overlapping;
- reduced motion;
- accessible focus;
- lazy image loading;
- stable image dimensions;
- source provenance.

## Binary archive note
Five supplied archives contain 873 extracted image files. The repository already contains the maintained committed WebP source-media layer and Supabase has 92 normalized source-photo review rows.

The remaining raw archive candidates require binary transfer into the repository/storage pipeline before they can be referenced as production assets. They are not fabricated into the public UI until that transfer/review occurs.

## Latest production data integrity check
- Published gallery rows with missing alt text: 0.
- Published gallery rows with missing media type: 0.
- Orphan gallery→event relations: 0.
- Orphan gallery→club relations: 0.
- Duplicate gallery IDs: 0.
- Published events without verification: 0.
- Published clubs missing name: 0.
- Published events missing title: 0.
- All 17 published club records map to their verified slug-based content-verification rows.

## Supabase Edge Function deployment
The seven active Edge Functions were redeployed from the repository source with the current Supabase publishable/secret-key compatibility helper inlined. Current active versions: admin-management v3, send-notification v3, backup-site-data v3, ai-content-assist v3, error-report v3, media-upload v2, public-submission v2.


## V56.5 implementation follow-through

- Reconciled the five supplied image archives as 873 files / 872 image assets / 812 unique image hashes after exact duplicate removal.
- Kept the source publication boundary explicit: archive inventory is not equivalent to current official publication.
- Preserved all maintained source photography already committed to the public media layer and exposed the full source pool through PhotoStory, PhotoChapters and Gallery ingestion.
- Added a visual fallback path so a hub card never collapses into an empty media block when photography is unavailable; maintained artwork/visual identity can fill the visual slot.
- Aligned the active public gold accent with the approved JYC champagne token #bf9c6f.
- Isolated large public fallback content from src/main.jsx into src/content/jyc-public-fallbacks.js to make the application shell easier to audit and maintain.
- Added a relational consistency repair for verified Converge 2026 so the normalized event model agrees with the canonical JSON publication state.
- Kept JAI 2026 review-gated under its canonical application ID rather than bypassing verification.
- Updated release metadata and service-worker cache to V56.5.
