# JYC V56.8 DEEP RESEARCH + CONTENT DESIGN PASS — 2026-10-05

## Source set reviewed
- Supplied JYC Website V1 / senior design specification.
- Supplied JYC 2026–27 Orientation / All Hubs presentations.
- Supplied source-photo archive and maintained hub media.
- Existing repository source registry, hub identity system, event identity system and Supabase relational model.
- Current official JIIT public website and current JIIT event/archive signals.

## Source-derived content model
The supplied orientation deck describes JYC as a student-governed organisation, a platform for student talent, a coordinator of inter- and intra-institutional activities, and a support layer for first-year acclimatisation. It also organises the ecosystem into Cultural, Literary, Technical, Creative and Sports families and presents an organisational chain from Faculty Advisor to Apex Body, Hubs/Societies, coordinators/volunteers and festival committees.

The 2026–27 hub material also provides richer society-specific material now surfaced in hub detail pages: VamUnique dance genres and induction, BDS performances/workshops/team culture, Arcadia esports and AR/VR activity, RPH DSA/CP/Code Clash, Panache fashion and performance, Prismatic design and visual communication, Aura photography practice and photo walks, and Aakriti art, campus decoration and inter-college activity.

## Visual research direction
Use editorial photography principles: large hero frame, contact-sheet/masonry archive, varied image ratios, metadata close to the image, progressive loading, captions that explain why the frame matters, and direct links from image → club/event record. Do not turn the JYC archive into a decorative carousel or generic stock-photo wall.

Current JIIT public communication reinforces a beyond-classroom framing around cultural and technical hubs, a visible event archive, Innovation Hub storytelling and a large image-led campus/life presentation. JYC uses the same information architecture principle without copying JIIT branding.

## Search / discoverability
The site now maintains:
- route-specific metadata;
- canonical URLs;
- BreadcrumbList, Organization, WebSite, CollectionPage, Event and hub Organization JSON-LD where applicable;
- maintained hub URLs in the sitemap;
- image sitemap entries for hub/source photography;
- public robots.txt with sitemap;
- llms.txt with the maintained community vocabulary and source hierarchy;
- unique hub/event page content instead of a single generic club description.

Search ranking cannot be guaranteed by code. The correct strategy is source-backed unique pages, crawlable canonical URLs, structured data, descriptive image metadata, internal links, current official references, and genuine external references/backlinks.

## Performance
Large visual assets remain lazy-loaded except the first photo-story/hero media. The GLB assistant is lazy-loaded and does not block initial page rendering. Continuous decorative 3D rotation is intentionally disabled. CSS motion respects prefers-reduced-motion.

## Production data model
Supabase currently relates events to clubs and gallery media to clubs/events through foreign keys. Source photography is provenance-labelled and review-gated. The 92 normalized source-photo rows are linked to club records where source association is known and remain pending rather than being silently promoted to current official publication.

## External research references
- https://www.jiit.ac.in/
- https://www.jiit.ac.in/alumni/photo-gallery
- https://www.jiit.ac.in/sites/default/files/Anunaad_Newsletter_Vol2_Issue2_62d618f19b.pdf

## V1 / senior contract
Keep the JYC logo as the primary identity. Keep the shared cream/beige, ink, gold and restrained red palette. Keep the public navigation compact. Prefer meaningful motion over decorative motion. Keep text readable and centred as a system, while the desktop brand/editorial block may use the approved left-copy/right-emblem composition. Do not introduce neon/glass/orbital/constant-rotation visual language.