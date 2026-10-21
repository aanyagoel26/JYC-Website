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
