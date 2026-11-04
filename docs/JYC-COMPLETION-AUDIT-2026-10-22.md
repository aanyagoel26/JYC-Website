# JYC Website completion audit — 22 October 2026

## Executive verdict

**Status: NOT COMPLETE / NOT RELEASE-READY.** This is a source/repository and configuration audit, not a claim that every rendered screen or image has been visually inspected. The new repository's responsive/editorial repair PR has been merged, but there is no current GitHub Actions run result for the merge commit, no verified production deployment from this repository, and the custom domain is still unverified.

## Repository and merge record

- Repository audited: `kaustubhdua/JYC-Website2` (default branch `main`).
- Merged PR: [#1 — release QA, responsive layout and editorial design polish](https://github.com/kaustubhdua/JYC-Website2/pull/1).
- Merge commit: `8d8a7f01e5af6258657df5de3a962f6dbe01ff14`.
- PR head reviewed: `926bd6596636de05f5b681ae4e15b1045de1b02a`.
- PR changes: search accessible name; dark hero contrast; mobile hero/dock spacing; 44px mobile controls; tablet event-heading wrapping; focus-visible styling; reduced-motion card safeguards; shared editorial palette/card refinements.
- Important verification boundary: the GitHub Actions API returned zero workflow runs for the repository at the time of this audit, and no combined commit statuses were available. Workflow YAML files exist, but a workflow definition is not evidence that it ran or passed.
- Local build/browser execution was not possible in this environment because the GitHub host could not be resolved by the local execution environment. No build, Playwright, Lighthouse, or manual screenshot pass is claimed.

## Critical P0 release blockers

### P0.1 — Vercel is not deploying the new repository

The Vercel project `jyc-website` is linked to repository `kaustubhdua/JYC-Website`, not `kaustubhdua/JYC-Website2`. Its latest deployment was READY but came from branch `fix/release-qa-responsive-editorial`, repository `JYC-Website`, commit `92015f2cb27071a7d19e085ffc7d5a26d7d4aade`. The deployment's target is null, so it is not evidence of a production promotion. The new repo's merge commit is not the deployed SHA.

**Required:** an authorized owner must connect the intended Vercel project to `kaustubhdua/JYC-Website2` (or explicitly designate a separate project), verify the production branch/build settings, deploy the exact reviewed SHA, and verify the resulting deployment's Git metadata. Do not assume that merging to GitHub updates the current public site.

### P0.2 — Custom domain ownership/routing is unresolved

Vercel reports both `jiityouthclub128.in` and `www.jiityouthclub128.in` as `verified: false`. The only verified project domain in the current project response is `jyc-website-eight.vercel.app`. Previous repository audits reported that the custom domain was presenting JAI 2026 summit content rather than enough evidence of the intended JYC site.

**Required:** domain owner verifies DNS/TXT ownership and project assignment, confirms apex/www redirect policy, then checks the live homepage and representative deep routes. Do not modify DNS without the authorized domain owner's approval.

### P0.3 — Exact-head automated checks have no evidence

The new repo has CI, browser, Lighthouse and quality workflow definitions, but the Actions API currently returns `total_count: 0`. The merged commit has no combined statuses. This is **unverified**, not a pass and not a confirmed failure.

**Required:** enable/trigger the configured workflows on `8d8a7f01e5af6258657df5de3a962f6dbe01ff14`; inspect logs and artifacts; fix failures without weakening valid product assertions; record the exact tested SHA.

## Route-by-route inventory

The route matrix in `docs/REDESIGN-ROUTE-MATRIX.md` was generated on 17 October and explicitly marks the routes below **NOT VISUALLY VERIFIED** for the current candidate. Older audits include a 20-route × 5-width DOM/geometry pass, but that is not proof for the current merged SHA and is not human visual sign-off.

| Route / pattern | Required current verification |
|---|---|
| `/` | Official logo/hero, Dither Veil, primary actions, hero contrast in both themes, section order, event cards, photos, footer and mobile dock overlap |
| `/about` | Copy accuracy, history narrative, image associations, headings, links and long-page responsive layout |
| `/history` → `/about#history` | Redirect/anchor target, focus and browser back/forward |
| `/clubs` | Search, filters, card data, logos/photos, empty/loading/error states and saved/follow persistence |
| `/clubs/:slug` | Published-only visibility, correct club identity, social URLs, image fallback, direct refresh and not-found handling |
| `/events` | Upcoming/past separation, accurate dates/statuses, filters, responsive heading and registration state |
| `/events/:slug` | Correct poster/venue/date/source, no recovery-boundary errors, valid canonical/legacy redirect and direct refresh |
| `/events/:slug/register` | Validated official external destination, expired/closed registration behavior and safe URL handling |
| `/fests` | Confirm documented fallback/redirect behavior or provide a meaningful fest-specific page if required |
| `/gallery` | Image correctness, loading, crop/focal point, duplicate handling, consent/rights, keyboard and touch behavior |
| `/gallery/:album` | Direct deep-link/refresh, album visibility, lightbox next/previous, Escape, focus return and error recovery |
| `/archive` | Historical labels, lazy loading, provenance, image integrity and links back to current content |
| `/team` | Correct names/roles, portrait mapping, faculty layout, flip-card keyboard/focus and fallback behavior |
| `/leadership` → `/team` | Canonical redirect and metadata |
| `/contact` | Client/server validation, success/error/loading feedback, spam/rate limits, persistence and mobile form layout |
| `/calendar` | Date navigation, event accuracy, empty states and event-detail links |
| `/event-calendar` → `/calendar` | Redirect and canonical metadata |
| `/announcements` | Correct dates, publication state, stale/expired links and target routes |
| `/updates` | Feed freshness, fallback labelling, configured/live status and error recovery |
| `/achievements` | Evidence, dates, correct media and destination links |
| `/best-of-jyc` | Curated media accuracy and working links into the matching gallery item |
| `/join-jyc` | Current recruitment cycle, valid calls to action and clear next steps |
| `/recruitment` | Open/closed state, application destination and useful closed-state actions |
| `/moments` → `/gallery` | Redirect and canonical metadata |
| `/discover` → `/clubs` | Redirect and canonical metadata |
| `/resources`, `/guide` → `/about` | Redirect target and no stale links |
| `/planner`, `/agenda`, `/map` → `/events` | Confirm these redirects are intended; if Planner/Map are promised product features, they are currently not separate experiences |
| `/projects`, `/projects/submit` → `/clubs` | Confirm intended behavior; a project-submission feature is not delivered by a redirect |
| `/my-jyc`, `/login`, `/notifications` → `/` | Confirm these are intentionally retired, not unfinished account features |
| `/settings`, `/download` → `/about` | Confirm intended redirect behavior |
| `/qr/:token` → `/events` | Confirm whether QR-specific resolution is required; current route inventory documents a redirect |
| `/admin`, `/admin/*` | Route matrix says redirect to public home and marks admin/security-sensitive paths unaudited. Verify intended CMS architecture, auth boundary, authorization, RLS and noindex behavior. |
| Unknown path / 404 | Useful Home/Clubs recovery, noindex, correct status/metadata and no uncaught errors |

## Images, gallery and media integrity

Repository audit records provide useful historical evidence, but media sign-off remains open for the current release:

- The source archive audit records **873 image entries**, **813 unique binary SHA-256 sources** and **60 exact duplicate relationships**. The archive mixes photography with logos, posters, slides, QR cards, screenshots, illustration and design assets. A file being an image does not mean it is a photograph.
- Preserve source provenance and photo/logo/banner/slide classification. Never label artwork as documentary photography or substitute an unrelated event/club image when a specific image is missing.
- Earlier release-gate records report **31 albums unpublished** and **52 gallery items awaiting rights review and/or focal-coordinate approval**. Reconcile these counts against current Supabase state before publication; the old counts are not asserted as a fresh live database query.
- Check every visible image for correct person/club/event mapping, decode success, aspect ratio, crop/focal point, duplicate content, descriptive alt text, optimized derivatives, low-bandwidth behavior and visible failure fallback.
- Verify rights/consent/attribution for every published photo, especially people and event photography. Do not publish pending assets simply to fill empty layouts.
- Re-run image-manifest, photo-integrity, local-assets, media-architecture and derivative-generation checks on the merged SHA. Inspect actual screenshots/contact sheets for all production albums; automated existence checks cannot verify semantic correctness or consent.

## Text and editorial accuracy

- Audit every heading, paragraph, button label, caption, alt text, footer item, announcement, event record and empty/error message for spelling, grammar, readability, correct identity and a meaningful next action.
- Verify event title/date/time/venue, registration open/closed/deadline, organizer source and links against official, campus-specific sources. Do not mix Sector 62 and Sector 128 club identities or social profiles.
- Historical audit notes: JAI 2026 was listed for 30–31 October 2026, while the cited registration deadline was 15 October 2026 at 23:59 IST. As of 22 October, that deadline is past; the UI must not imply registration is open unless a verified organizer source explicitly confirms an extension.
- Historical audit notes show conflicting RIDE HACK registration claims between Innovation JIIT's site and LinkedIn. Keep the state labelled unconfirmed until the organizer resolves it.
- The `/updates` API was previously observed returning `items: []`, `live: false`, `configured: false` with curated fallback cards. Re-test the current endpoint; configure approved sources if live updates are a product requirement, and visibly distinguish curated fallback from live data.
- Confirm there are no stale dates, expired registration CTAs, unsupported achievement claims, invented club details, wrong campus identity, misleading empty states or dead external links.

## Interactions and accessibility

Run each journey with mouse, keyboard-only, touch and screen-reader spot checks:
1. All navigation, More menu, mobile dock, Search button and Ctrl/Cmd+K shortcut.
2. Theme toggle; contrast of normal, hover, focus, disabled, selected and error states in light/dark themes.
3. Club/event search, filtering, detail navigation, save/follow if presented, and browser back/forward.
4. Calendar date controls and event links.
5. Gallery album/deep link, lightbox arrows, Escape, focus trapping/return, touch gestures and image failure.
6. Contact form invalid, submitting, success, server failure and rate-limit states.
7. Recruitment open/closed states and all CTAs.
8. Direct refresh on every static and dynamic route, legacy aliases and 404.
9. Visible focus indicator, accessible names, labels, landmarks, heading order, contrast, target size, reduced motion, zoom/reflow and screen-reader behavior.
10. WebGL/Dither Veil: normal GPU, unavailable WebGL/context loss, resize, tab hidden/visible, cleanup, coarse pointer, reduced motion and static official-logo fallback.
11. No console errors, unhandled promise rejections, broken network requests, blank sections or recovery-boundary screens.

The merged PR adds CSS-level guardrails, but **none of the above is considered verified for the merge commit without fresh test results and rendered evidence**.

## Responsive visual matrix

Capture and inspect the exact merged commit at each of these viewport sizes: **320×740, 360×800, 390×844, 430×932, 768×1024, 1024×768, 1280×900, 1440×900, 1920×1080**. For every route, check horizontal overflow, clipping, fixed-nav/dock overlap, text wrapping, image crops, grid density, dialog/menu placement, footer, focus and loading/empty/error states. Repeat key routes in both themes and reduced-motion mode. Save screenshots and map every defect to a route, viewport, severity, fix commit and retest artifact.

## Security, backend, SEO, performance and operations

- **Supabase/CMS:** verify environment configuration, table grants/RLS, admin login and role authorization, draft/publish workflow, media storage access, public submission rate limiting, server-side validation and no sensitive data leakage. A source-level SQL contract does not prove deployed database policies.
- **Public API:** exercise `/api/jyc-updates` against a ready deployment, including unavailable/malformed external sources, timeout, rate limiting and safe fallback. Confirm whether source connectors are actually configured.
- **SEO:** verify unique title/description/canonical per static and dynamic route; valid sitemap/robots; public-only sitemap entries; noindex for private/retired routes; correct Open Graph/social cards; valid organization/event/breadcrumb JSON-LD; redirects and 404 HTTP behavior.
- **PWA/cache:** verify manifest, service worker scope, offline behavior, update activation and cache namespace bump for this release.
- **Security:** verify CSP and headers on the actual deployment, safe external URL validation, no browser-shipped secrets, dependency audit and admin route exposure.
- **Performance:** measure mobile LCP, CLS and INP on real deployment; check JS/CSS bundle size, image transfer/decode, responsive derivatives, font delivery, WebGL cost, lazy loading and low-end-device fallback.
- **Deployment:** confirm the new repo is connected to the intended Vercel project; exact commit SHA, build logs, production target, aliases and live smoke tests must match. The current READY deployment from the old repo is not release evidence for this merged code.

## Prioritized completion plan

1. **P0 — Fix deployment provenance:** connect/confirm Vercel project for `kaustubhdua/JYC-Website2`; verify domain ownership and routing with the authorized owner.
2. **P0 — Establish CI evidence:** trigger workflows on the merged SHA; fix all dependency, build, quality, browser, Lighthouse and CodeQL failures; retain artifacts.
3. **P0 — Resolve public content trust:** refresh expired JAI registration state; resolve or clearly label RIDE HACK uncertainty; reconcile event/club campus identity and external URLs.
4. **P0 — Media rights gate:** reconcile album/item status with live data and approve rights/consent/focal coordinates before publishing affected assets.
5. **P1 — Full route/viewport screenshot pass:** all routes and aliases, all nine viewports, light/dark, reduced motion, keyboard and failure states.
6. **P1 — Dynamic feature acceptance:** prove forms, updates API, search/filter, calendar, registration, gallery lightbox, recruitment and admin/CMS persistence using real configured services.
7. **P1 — Security/accessibility:** complete manual WCAG 2.2 AA keyboard/screen-reader review, Supabase RLS/auth review, headers/CSP and dependency audit.
8. **P2 — SEO/performance/PWA:** validate structured data, sitemap/canonicals, CWV, responsive image delivery, service-worker update/offline behavior.
9. **Release sign-off:** publish a ledger of route/feature, viewport, status, defect, fix commit and screenshot/test evidence; verify the live production SHA and run smoke tests after deployment.

## Acceptance definition

Call the site complete only when: all routes and controls work as intended; text and media are accurate and cleared for publication; dynamic services are genuinely configured or honestly labelled as unavailable/fallback; no high-severity accessibility/security defects remain; exact-head CI/browser/Lighthouse checks pass; all route/viewport screenshots are reviewed; the Vercel project deploys this repository's approved SHA; and the intended custom domain serves that exact release.

**Current conclusion:** PR #1 is merged, but the website is not yet verified as complete or production-ready.


## Execution follow-up — 22 October 2026

After the initial audit was committed, additional live checks were performed:

- Current `package.json` reports version `64.5.12` and defines build, source QA, responsive, browser, SEO, security, media, photo-integrity, performance and editorial QA commands. These commands have not been run successfully in this session; script presence is not a passing result.
- Rechecked the Vercel team's Git project context: the team has a `jyc-website` project linked to `kaustubhdua/JYC-Website`, not `JYC-Website2`.
- Attempted to create a separate Vercel Git-connected project `jyc-website2` for `kaustubhdua/JYC-Website2` so the old live project would not be disrupted. Vercel rejected project creation with HTTP 403 `forbidden` (“You don't have permission to create the project”). No Vercel project or deployment was created by this attempt.
- Attempted to open a GitHub tracking issue for the release gates. GitHub returned HTTP 410: “Issues has been disabled in this repository.” No issue was created. The committed audit document remains the shared checklist.
- Rechecked the merged commit status and current Actions API; no commit statuses or workflow runs were returned. CI state therefore remains unverified.
- The repository's route inventory still explicitly marks the current route candidate as not visually verified. A complete current-SHA screenshot review has not been produced.

### Newly confirmed external blockers

1. An authorized Vercel project owner must grant project-creation access or create/link a Vercel project to `kaustubhdua/JYC-Website2`, then configure the correct deployment target.
2. Repository administration must enable GitHub Issues if a tracked issue-based release gate is desired; until then, use this audit document as the checklist.
3. Repository/workflow administration must make exact-head CI execution possible and expose run results/artifacts before QA can be signed off.

These are observed permission/configuration blockers, not code fixes. No custom-domain DNS, production alias, database content or access-control setting was changed during this follow-up.


### 22 October follow-up — canonical event navigation

- Found and fixed one additional route-integrity defect after the original audit: event-directory rows previously built detail URLs from `event.title` even when a stored canonical `event.slug` was available. Rows now prefer `slug(event.slug || event.title)`, preserving the title-derived fallback for older records.
- Added a regression assertion to `scripts/qa-current-release-coherence.mjs`.
- Merged PR [#2 — preserve canonical slugs in event directory](https://github.com/kaustubhdua/JYC-Website2/pull/2) as `ae8083820bb38545186cb778c3b339e8ed1b3fa4`. The merge and both source changes were verified against the GitHub API.
- This source-level correction is **not** a full build/browser test. The latest recheck still returns zero GitHub Actions runs and zero commit statuses for the merge commit. The Vercel project still lists the old `kaustubhdua/JYC-Website` repository; the new repository is not yet proven deployed. Production release remains blocked by deployment provenance, automated test evidence, domain verification and the visual/content/media gates above.


## Execution follow-up — 5 November 2026 — Jai Hack dark-theme integration

### Changes committed to `main`

- Dark-theme implementation and README correction commit: `e2ce3ef5fdc51d141df018e4047c20895ad7524a`. The audit follow-up itself was committed as `3aa02a59925beefd8213a2c53fcd34a500d40377`.
- Added `src/styles/jai-hack-dark-theme.css`: midnight navy surfaces, cyan/indigo accents, DM Sans / Space Grotesk / DM Mono typography, acrylic navigation, component surfaces, form and dialog treatments, focus visibility and reduced-motion handling. The theme is scoped to `html[data-theme="dark"]`; light mode is intentionally preserved.
- Corrected stylesheet placement: the Jai Hack theme is imported after the application's global stylesheet imports in `src/main.jsx`, avoiding the earlier cascade-order problem. The redundant early import was removed from `src/styles/public-entry.css`.
- Bridged both the legacy JYC design tokens and the editorial homepage's separate `--jh-*` variables to the new palette, so the homepage does not retain the old red/gold palette.
- Added `scripts/jyc-dark-theme.spec.js` and registered it in the browser QA runner and Playwright configuration. The test contract covers homepage, clubs, events and gallery at desktop/mobile sizes, theme tokens, typography, navigation surface and light-theme isolation.
- Updated `scripts/qa-visual-redesign.mjs` with static checks for the final theme cascade, dark-only scope, reduced motion and keyboard focus.
- Added lazy loading and async decoding to the JYC assistant's three logo image instances in `src/jyc-assistant.jsx`.
- Updated `README.md` to advertise the package's exact current release version, `V64.5.12`, after the quality workflow identified a release-integrity mismatch.
- Adjusted the optional Datadog synthetic workflow to skip the integration when its required credentials are not configured.

### Exact-head CI evidence and remaining uncertainty

- On commit `dbe41b49a96ac6b7b9769c026083688c119f383b`, GitHub Actions completed the Vite production build successfully. The quality workflow then failed at `scripts/qa-current-release-integrity.mjs` because the README did not contain the exact `Current release: V64.5.12` marker. That marker was added in the subsequent commit `e2ce3ef5fdc51d141df018e4047c20895ad7524a`.
- The preceding quality log showed the dependency-lock contract, 22 zero-glitch static assertions, 12 media-layout contracts, 15 public-journey assertions, 18/18 reference-archive readiness assertions, and 28 current-release coherence assertions passing before the README integrity failure.
- Datadog synthetic workflow completed successfully on `dbe41b49a96ac6b7b9769c026083688c119f383b`.
- Workflow runs for implementation SHA `e2ce3ef5fdc51d141df018e4047c20895ad7524a` remained queued when last inspected; none was recorded as passing on that SHA.
- The audit commit `3aa02a59925beefd8213a2c53fcd34a500d40377` triggered a fresh set: Quality Gate `41896308649`, Browser QA `41896308830`, Lighthouse CI `41896309161`, JYC CI `41896309112`, CodeQL `41896308769`, and Datadog `41896308860`. At the latest inspection, the Quality Gate was pending with its job queued and the other runs were queued. No exact-head result is recorded as passing. The README correction therefore remains unverified by a successful exact-head quality run.
- No browser screenshots or human visual sign-off have been produced for this exact SHA. The new Playwright coverage is registered, but its execution remains pending.

### Repository integration and deployment

- `kaustubhdua/JYC-Website2` main currently points to `3aa02a59925beefd8213a2c53fcd34a500d40377`.
- Cross-repository PR [#1](https://github.com/aanyagoel26/JYC-Website/pull/1) remains **open and unmerged**. Its head is the current `JYC-Website2` main SHA (`3aa02a59925beefd8213a2c53fcd34a500d40377`) and its base repository is `aanyagoel26/JYC-Website`. Do not describe the changes as integrated into the upstream repository.
- The current Vercel team deployment-context response did not list a project linked to `kaustubhdua/JYC-Website2`. Earlier project-creation attempt was rejected with HTTP 403. An authenticated fetch of the previously shared preview URL returned a Vercel lookup 404/access response, which is not sufficient evidence that the public site is down or healthy.
- No production project settings, DNS records, custom-domain assignments, Supabase data or access policies were changed. No production deployment from this exact SHA is verified.

### Current release verdict

**Still NOT COMPLETE / NOT RELEASE-READY.** Source changes are committed and the previous build succeeded, but exact-head quality/browser/Lighthouse/CodeQL evidence, route-by-route visual review, upstream integration, Vercel project linkage, production deployment provenance, custom-domain verification, live Supabase checks, and media rights/content sign-off remain open. Treat these as release gates, not as completed work.


## Execution follow-up — 5 November 2026 — live Supabase and deployment access

### Supabase project state (live account query)

- The configured JYC project is `ogbanmjokjlxfuktkicj` (`supabase/config.toml` points to the same ref).
- Supabase currently reports this project as **INACTIVE**, on the JYC Free organization, with PostgreSQL 17.6.1.166 in `ap-south-1`.
- Read-only table inspection failed with `Database is possibly not accessible at the moment`; therefore no current live schema, row counts, migration history, RLS policies, or advisor results can be certified from this session.
- A restore was attempted because the website's configured backend is inactive. Supabase rejected it with HTTP 403: an organization member has reached the maximum of two active free projects. The other active projects shown by the account are `common 1` and `rideforge-production`.
- No other Supabase project was paused, deleted, upgraded, or modified. I will not take one of those projects offline or incur an upgrade charge without the owner's explicit choice.
- Supabase's 2026-10-30 Data API change now makes table/function exposure opt-in by default for all projects. The repository has explicit grants in recent hardening migrations for sensitive/public-read tables, but the inactive database prevents checking the deployed grants and migration application state. Re-run live grants/RLS/advisor verification after the project is restored.

### Vercel state

- The authenticated Vercel team context available in this session does not list a project connected to `kaustubhdua/JYC-Website2`.
- Listing deployments for the previous `jyc-website` name returned zero deployment records in the current team context; fetching the previously shared `jyc-website-zeta.vercel.app` URL returned a Vercel deployment-not-found/access response.
- The prior project-creation attempt was denied with HTTP 403. No project was created, no deployment was made, and no production alias or DNS record was changed.

### Current exact-head CI state

- The audit record commit before this section was `ccbeecfe6da2803a3e71fcdc0466527a4cb57c35`.
- Runs triggered for that SHA were Quality Gate `41896497274`, Browser QA `41896497529`, Lighthouse CI `41896497556`, JYC CI `41896497525`, CodeQL `41896497428`, and Datadog `41896497825`. At the last check, all were still queued or pending; no exact-head pass is claimed.

### Additional hard blockers requiring owner action

1. Restore JYC Supabase only after the owner decides which existing active free project to pause, or authorizes an organization-plan upgrade. Do not pause `common 1` or `rideforge-production` automatically.
2. Grant Vercel permission to create/link a project for `kaustubhdua/JYC-Website2`, or have the project owner connect the intended repository.
3. Ensure GitHub Actions runners/queue are available and let the exact-head Quality, Browser, Lighthouse, CI and CodeQL runs complete.
4. Have the owner of `aanyagoel26/JYC-Website` review and merge PR #1 if that repository is still the canonical upstream. It remains open and unmerged in the observed state.

**Release verdict remains NOT COMPLETE.** The frontend theme/source work is committed, but the configured live database is paused, deployment ownership is unresolved, and exact-head automated and visual evidence is still unavailable.


## Execution follow-up — 5 November 2026 — content-trust, canonical SEO and hero-effect repairs

### Current source head and release

- Current `main`: `6aecb541aad6b82d5bd2a4e239fa74b34d84db65`.
- Package release: `V64.5.15`.
- The working changes remain in `kaustubhdua/JYC-Website2`; upstream integration PR #1 to `aanyagoel26/JYC-Website` is still open and unmerged.

### Research findings and changes implemented

1. **Canonical origin was pointed at a retired deployment.** The repository's example environment, HTML metadata and runtime fallback referred to `jyc-website-eight.vercel.app`. The canonical-origin resolver now uses an explicitly verified JYC origin first, then Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`; local builds use localhost only. Vercel builds fail closed if no HTTPS origin can be resolved. Static route shells write a canonical-origin meta tag so SPA navigation preserves the production canonical host even on preview deployments. Sitemap, route shells and runtime metadata share this resolver.
2. **The JYC custom domain is not currently safe to assume as the production canonical.** Public crawl inspection showed `www.jiityouthclub128.in` currently serves the JAI 2026 event microsite rather than a general JYC website. The previous `jyc-website-eight.vercel.app` hostname is not a verified live deployment. The JAI domain was deliberately not substituted as the JYC canonical origin.
3. **The homepage Dither Veil was imported but never rendered.** The source contained only the lazy import; the homepage hero did not mount `LazyDitherVeil`. It is now mounted behind the foreground JYC emblem with the JYC logo source, Floyd–Steinberg dithering, restrained oxblood rim and wander reveal. The OGL/WebGL2 implementation retains capped DPR, intersection/visibility lifecycle, reduced-motion and constrained-hardware static fallbacks. Homepage truth, React Bits, animation-performance and visual-redesign checks now require the component to be mounted.
4. **Static event fallbacks contained unsupported upcoming records.** Event-level web research did not establish reliable official date/registration sources for the future CyberSrishti, VamFest, Aakriti, Kshitij, Panache and Grand Conclave entries. The Code Clash fallback had a future 20 November date even though current public participant posts record Code Clash 2026 as already completed; its exact official date was not established. RIDE Hack was already marked for editorial review in prior source audits. These records are now unpublished in the static fallback until event-level official evidence confirms the date, organiser, venue and registration. The JAI event remains as a completed historical record but is no longer featured or pinned.
5. **Live CMS records now take precedence over same-ID static fallbacks.** A newly approved CMS event can supersede a hidden fallback rather than being discarded by the previous fallback-first merge order. Regression coverage exercises this precedence.
6. **Club publication gates were not applied to the static fallback.** Arcadia and Neural Nexus are source-material/orientation records but remain drafts in the editorial source audit. Their registry entries now say `publicationStatus:'draft'`; static fallback clubs are filtered through the registry publication status, and source-only clubs remain unpublished.
7. **JAI artwork was not typed consistently.** Campus photography is explicitly marked as a photo; logos, summit artwork and QR material are classified as graphics/QR, preventing them from being misrepresented as photography in the Best-of and archive surfaces.

### QA added or expanded

- `scripts/site-origin.mjs` and `scripts/qa-site-origin.mjs`: deployment-aware origin validation and precedence tests.
- `scripts/lib/public-content.js` (source path: `src/lib/public-content.js`) and `scripts/qa-event-publication-trust.mjs`: live-event precedence, unverified event publication gates, draft club publication gates and typed JAI media.
- Homepage editorial-truth QA is now part of the QA suite and checks that the Dither Veil is actually mounted with the JYC red rim.
- React Bits, animation-performance and visual-redesign checks also assert the Dither Veil mount and its reduced-motion/low-power safeguards.
- Release metadata, lockfile, README and service-worker cache namespace are synchronized to `V64.5.15`.

### Latest exact-head CI and release blockers

- Workflow runs created for `6aecb541aad6b82d5bd2a4e239fa74b34d84db65`: Quality Gate `41899127294`, Browser QA `41899127185`, Lighthouse CI `41899127222`, JYC CI `41899127094`, CodeQL `41899127132`, and Datadog `41899127322`. At the time of this update, jobs were still queued/pending; no exact-head passing result is claimed.
- Supabase still reports the configured JYC project `ogbanmjokjlxfuktkicj` as INACTIVE. Restore was rejected because the free organization has reached its two-active-project limit. No other project was paused or deleted.
- Vercel's connected team context still does not show a project linked to `kaustubhdua/JYC-Website2`; project creation was previously denied with HTTP 403. No production deployment or custom-domain alias is verified.
- PR #1 to the original repository remains open and unmerged.
- No exact-head browser screenshots or manual route-by-route visual sign-off have been produced.

**Release verdict: NOT COMPLETE / NOT PRODUCTION-READY.** The source has received substantive repairs, but exact-head automated tests, visual verification, upstream merge, authorized Vercel project linkage, a valid production canonical domain and restoration/verification of the configured Supabase backend remain release gates.


## Execution follow-up — 5 November 2026 — published-only route generation

- Release `V64.5.16`, source commit before this audit update: `7784b1aa6b09936fd60dbce6dafd745ed991a279`.
- Found a second publication leak after hiding unverified static event fallbacks: the sitemap still hard-coded URLs for unpublished/archived events, and static route-shell metadata still hard-coded those same routes. This would have continued advertising hidden events to crawlers and creating direct-entry shells for them.
- Replaced hard-coded event URL lists with `PUBLIC_EVENT_FALLBACK`-derived routes filtered to `published && !archived`. Dynamic CMS event routes retain their published/non-archived filter.
- Static club sitemap routes now use only `JYC_HUB_SOURCE_REGISTRY` entries with `publicationStatus === 'published'`, matching the public club fallback and route-shell behavior.
- Added `/archive` and `/recruitment` to the canonical sitemap's core public routes.
- Found and fixed a slug mismatch: DRONO-O-WAR was linked through the title-derived slug `drono-o-war-1-0` while the old sitemap advertised `drono-o-war-2026`. The fallback now stores `slug: 'drono-o-war-2026'`, so cards, detail pages, sitemap and route shells share the canonical route.
- Found one more unsupported event fallback, Arcadia Esports Winter Cup, tied to a club that remains a draft. It is now unpublished and excluded from public event routes.
- Expanded sitemap and route-shell tests to check all published fallback routes are present, every unpublished/archived fallback route is absent, draft club routes are absent, and stale hard-coded event shells do not return.
- Package, lockfile, README and service-worker cache are synchronized to `V64.5.16`.

### Latest execution status

- The route-hardening commit triggered exact-head CI runs, but the GitHub Actions API still showed the jobs queued/pending at the last poll. No successful exact-head quality, browser, Lighthouse or CodeQL result is claimed.
- Supabase, Vercel, upstream PR and manual visual-verification blockers remain as recorded above.

**Release remains NOT COMPLETE / NOT PRODUCTION-READY until exact-head QA passes, the actual production project/domain is connected, the database decision is resolved, upstream integration is approved, and rendered routes are visually signed off.**


## 5 November 2026 follow-up — source-truth and event-state corrections

See `docs/JYC-DEEP-RESEARCH-2026-11-05.md` for the research sources, library decisions, and complete release blocker record.

- Removed the fabricated Converge 2027 live schedule, countdown, event programme and prize claims; `/converge` and `/converge-live` now redirect to the published archive.
- JAI 2026 and RIDE Hack'26 JYC Now fallback cards now show their completed event dates. CICR TechTonic 2.0 remains date TBA.
- The JYC Now empty/live-source fallback now distinguishes source snapshots from a live social feed.
- Removed an unverified generic Linktree from the JYC-128 public identity/contact surface. The verified campus-specific LinkedIn and Instagram identities remain.
- Removed unsupported contact-desk operating hours from the Contact page.
- These are source/code corrections, not production deployment or database verification.


## 5 November 2026 follow-up — 3D explorer performance and GLB QA

- Rebuilt the 3D community constellation from the publication-gated hub registry; source-review/draft entries and unsupported member-count claims are no longer rendered.
- Fixed the animation loop so it no longer schedules React state updates every frame. It now reads interaction state from a ref and pauses for reduced motion, hidden tabs and off-screen state.
- Added keyboard-accessible community selection and corrected the UI label: the constellation is projected 3D on a 2D canvas, not a WebGL mesh renderer.
- Added a GLB 2.0 structural integrity QA script for both tracked models, including Git blob SHA/size, chunk bounds, buffer/accessor references and glTF object references. The Draco-compressed geometry still requires an actual browser decoder/render test.


## 5 November 2026 follow-up — production read-only fallback

- Fixed the production data loader's empty-state behavior: when Supabase is unconfigured, paused, times out, or the public RPC fails, the site now uses the last saved cache or curated publication-gated public fallback records instead of rendering empty club/event data.
- Offline fallback excludes the extra PDF gallery collection, is visibly labelled as limited public mode, and blocks content writes until the live database reconnects.
- This improves public browsing resilience but does not restore sign-in, internal submissions, or the inactive Supabase project.
