# JYC Website — Reference Repository Audit

Audit date: 2026-10-11

## Scope and limits

Reviewed public repository metadata, READMEs, package definitions, representative source files, file layouts, and current JYC PR/check state for the references below. This is a design and engineering pattern audit, not a claim that the references were fully installed, built, or penetration-tested. Prefer original implementation over copying source code. Where source code is reused, verify its license first; some referenced repositories do not declare a license in GitHub metadata.

## References reviewed

- https://github.com/8BitsLife/jodc-fromroots
- https://github.com/Mercy036/drone-wars
- https://github.com/amancodes8/CICRCombined
- https://github.com/osdc/osdhack26
- https://github.com/Omtripathi007/Innovationjiit.in

## High-value ideas for JYC

### 1. JODC Fromroots — identity and reusable design system

The README documents a logo-derived design system, reusable components, reduced-motion-aware interactive backdrop, and a written-scroll-stroke moment.

Adopt the concepts, not the exact branding:
- Refine existing hub profiles with clear descriptions, beginner-friendly entry points, verified events, team information and ways to participate; improve existing content rather than creating a new curated spotlight feature.
- Keep event/date and club content in typed, source-backed data modules rather than spreading copy across components.
- Extend design tokens and reusable UI patterns; keep JYC charcoal/cream/gold rather than copying JODC orange.
- Make motion a progressive enhancement: pointer/GPU/reduced-motion checks, viewport pause, frame-budget fallback, and no mandatory WebGL on mobile.
- Do not add curated project or achievement spotlights. Any future user-submitted content workflow would require a separate approved scope, authenticated submissions, moderation, rate limits, audit trail and correct RLS.

### 2. Dron-o-War / Dronotics — event campaign storytelling

The repository describes a dedicated event microsite using Next App Router, focused event categories, motion, and a rulebook viewer. It is event-specific rather than a generic club directory.

Adopt:
- A reusable JYC event page template with cover/identity, organizer, timeline, venue, tracks/categories, rules/resource PDFs, FAQs, eligibility, registration status and official CTA.
- Promote large events with their own campaign pages while retaining the canonical JYC event detail and archive.
- Add an accessible in-page PDF/resource viewer with a direct download/open link and a plain-text summary.
- Keep registration state factual: no CTA unless a verified HTTP(S) link and current registration window exist. Historical event dates remain archive-only.
- Use a distinct visual accent for a specific event while preserving JYC navigation and design tokens.

Do not treat dates or prize values from a historical event README as current JYC data; README details can be stale.

### 3. CICRCombined — structured member operations (selectively)

Its README describes a broad operations app: projects, events, meetings, members/hierarchy, inventory, learning programmes, issue tracking, communications, admin, and health/readiness endpoints, with separately deployed frontend/backend.

Adopt only when JYC public website needs a matching workflow:
- Improve existing public hub/team content using a verified current roster and approved copy.
- Clear internal status pages/health probes if JYC gains a server API.
- Deployment/rollback documentation and explicit API boundaries.
- Keep privileged workflows separate from public pages.

Do not import its auth/backend implementation blindly. Audit authentication, token/cookie handling, password reset and email flows, account enumeration, CORS, request validation, secrets, encryption, migrations, logging, rate limits, and data-layer authorization. Never use unsafe default secrets, insecure TLS bypasses, predictable OTPs, or unverified “email sent” success states. Do not change production Supabase policies without owner approval.

### 4. OSDHack26 — campaign as an interactive experience

The repository includes a distinctive CRT/arcade-themed event entry, dedicated CSS/JS modules for the opening sequence/menu/animations/audio and responsive styling. It is a strong reference for event identity, but its full-screen, sound/video-heavy shell is too opinionated for the entire JYC site.

Adopt:
- Optional, bounded event-specific “experience mode” for fests/hackathons: a strong entry sequence, themed menu, tracks, schedule, sponsors, rulebook/resources and registration actions.
- Play sound only after explicit user action, offer a mute control, and never gate access to content on audio/video.
- Provide a skip-intro route, direct content access, keyboard controls and reduced-motion/static mode.
- Defer large video/audio assets until needed; do not preload multiple heavy videos on the general JYC homepage.
- Keep the main JYC site editorial, readable and immediately navigable rather than turning every page into a game menu.

### 5. Innovationjiit.in — editorial depth and visual content

The README describes page-oriented content for about, domains, events, gallery, projects, contact and team; it documents semantic HTML, responsive CSS, reusable navigation/footer, accessible modal/form patterns and media categories. The default branch also contains a very large root HTML file and historical/alternate directories, so preserve the good content ideas while avoiding a monolithic template.

Adopt:
- Make event/gallery/project pages editorial: real photos, a concise narrative, outcomes, and a clear next action.
- Maintain a consistent media taxonomy (team, events, gallery, hub identity, posters, documents) with provenance and alt text.
- Use image optimization, lazy loading for below-fold photos, responsive image sizes, and visible fallbacks.
- Keep components and copy modular; avoid accumulating duplicate site trees or large one-file HTML bundles.

## JYC-specific implementation priorities

### P0 — restore reliable validation first
The latest observed JYC CI, Quality Gate, Browser QA and CodeQL reruns terminate before any runner is assigned (runner_id 0, empty steps array). A retry of the new audit-document commit's Browser QA job also failed before steps. This is a GitHub Actions execution/runner issue; it does not tell us whether the code compiles. Diagnose repository Actions availability/runners or run the exact Node 24 commands in an authorized environment. Do not bypass checks or merge unvalidated code.

### P1 — finish three current draft PRs safely
- PR #201: native event registration path and malformed QA-contract fix.
- PR #202: responsive gallery accordion.
- PR #203: homepage public journey and safe event registration CTA.

They overlap in scripts/browser-smoke.spec.js and scripts/qa-v64-editorial-release.mjs; integrate carefully, then run npm ci, npm audit --audit-level=high, npm run build, npm run qa, npm run qa:seo, npm run qa:photos, npm run qa:v64-editorial, npm run qa:photo-intelligence, performance QA, and Playwright smoke checks under Node 24. The sandbox previously lacked Node 24 and Playwright, so don't report a pass until it executes.

### P1 — public journeys
- Preserve the JYC identity/Dither Veil hero but always allow the logo fallback.
- Make Events, Clubs, Gallery and Team useful for mobile and keyboard-only navigation.
- Keep the event accordion/photo lightbox composable and source-backed; no guessed image derivatives.
- Use verified official hub logos, not a random poster or portrait as a logo.
- Provide event detail resource/rulebook/FAQ sections for organisers who need campaign pages.

### P2 — meaningful community features
- Improve existing hub profiles and event storytelling using verified club/event content; do not add curated project or achievement spotlight sections.
- Consider event filters (upcoming, registration open, archived, hub, type), clear status badges, and downloadable resource links.
- New content must come from approved source records; historical PDFs and README details do not become live event state by themselves.

### P2 — accessibility and performance gates
- Add responsive screenshots and browser tests at 360/390px, tablet and desktop.
- Test keyboard route access, focus restore, reduced motion, contrast, image fallback, broken image detection, and no horizontal overflow.
- Defer high-cost shaders/animations until visibility checks pass and respect the user's motion preference.
- Prefer transform/opacity animation; avoid global cursor overrides, scroll traps and forced full-viewport fixed shells.
- Track real image payload and bundle/performance budgets rather than claiming 60 FPS without measurement.

### P3 — safe operational workflow
- Write a rollback runbook and environment-variable inventory.
- Add source/asset provenance and license checks for imported assets/code.
- Keep public content, privileged administration, and any future API workflows separate.
- Do not alter production Supabase, DNS, custom domain, or deployment settings without explicit authorization.

## Current status at audit time

The references were inspected through public GitHub repository pages/API content. The full projects were not cloned and built in this environment. JYC Actions reruns were attempted, but the latest known jobs still fail immediately with no runner or steps. The audit document was committed on main; its own Browser QA workflow also encountered the same runner failure. The three JYC PRs remain open drafts, and no production deployment or merge is claimed by this audit.

## Recommended order

1. Fix Actions runner/execution so checks can run.
2. Resolve overlap and validate PRs #201–#203.
3. Add an event-page/resource template from the event microsite pattern.
4. Improve existing hub profiles and event storytelling using JODC/Innovation editorial patterns; do not add curated project or achievement spotlights.
5. Add measured responsive/accessibility/performance checks before release.
