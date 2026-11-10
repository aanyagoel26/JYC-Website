# JYC Website 2 — UI/UX, Visual Design, Motion & Release Specification

**Status:** living acceptance specification; not a claim that every item has passed.
**Scope:** public JYC-128 website routes, global navigation, shared components, motion, responsive behavior, accessibility, performance, content trust and release verification.
**Implementation baseline:** React 19, Vite, React Router, Motion, selective GSAP/OGL. Preserve the current application, data and media pipeline; do not add overlapping animation libraries or fabricate organization content.

## Release principles
1. Truth before decoration: publish only source-backed JYC-128 information. Keep unverified content visibly marked or unpublished.
2. One system: all routes use shared semantic tokens and component contracts; theme changes must not leave old accents or unreadable surfaces behind.
3. Progressive enhancement: content is readable without JavaScript animation, WebGL, remote fonts or optional media.
4. Accessible by default: WCAG 2.2 AA is the target; automated checks are necessary but do not replace keyboard, screen-reader and human contrast review.
5. Mobile-first: test 320, 360, 375, 390, 430, 600, 768, 900, 1024, 1280, 1440 and 1920 CSS px, including short landscape screens.
6. Measure rather than infer: field Core Web Vitals, production deployment parity, live integrations and content rights require observed evidence.

## 1. Design system acceptance
- [ ] Semantic color tokens exist for canvas, raised canvas, surface, strong surface, text, muted text, border, focus, primary accent, secondary accent, success, warning and danger.
- [ ] Light theme uses the approved warm-paper/editorial identity; dark theme uses layered midnight/indigo depth, lavender moonlight and restrained champagne/gold.
- [ ] Every legacy semantic token maps to the active theme; dark mode must not reveal stray red, blue, cyan or white-surface defaults.
- [ ] Typography defines display, h1–h4, body, compact body, caption, eyebrow, label and mono roles with fluid sizing and readable line-height.
- [ ] Spacing, content widths, grid gaps, radii, shadows, borders, breakpoints and z-index layers use a documented scale.
- [ ] Icon family, stroke weight and icon-to-label spacing are consistent.
- [ ] Photography uses approved genuine media, consistent ratios/crops, alt text, responsive derivatives, intrinsic dimensions and neutral fallback states.
- [ ] Every token and component is checked in both themes, including hover, focus, active, disabled, loading and error states.

## 2. Global shell, navigation and discovery
### Header and mobile dock
- [ ] Logo has a meaningful accessible name and a working home destination.
- [ ] Active route is indicated visually and with aria-current.
- [ ] Sticky/scroll header behavior does not obscure headings, anchor targets or focused controls.
- [ ] Desktop navigation, mobile dock and More entry remain reachable at all viewport widths.
- [ ] Controls have at least 44×44 CSS px hit areas where practical, safe-area padding and visible focus.
- [ ] No menu overlaps or clipped labels at 320px and 200% zoom.

### More directory
- [ ] Destinations are grouped by meaningful categories with accurate title/description and no retired or misleading link.
- [ ] Every destination resolves to a published route or an explicitly labelled external destination.
- [ ] Keyboard behavior covers Tab/Shift+Tab, Escape, focus containment where modal, outside click, and focus restoration.
- [ ] Search opened from More has a deliberate focus handoff; closing restores focus to the invoking control.
- [ ] Background scroll is locked only while appropriate and restored on close/unmount.

### Site-wide Search
- [ ] Search indexes published pages, clubs, events, people, achievements, announcements and gallery content as available.
- [ ] Index fields include titles and meaningful descriptive keywords; never index unpublished/draft/hidden content.
- [ ] Exact title and canonical entity matches rank above descriptive/fuzzy matches.
- [ ] Non-matches are excluded; empty state is genuine, useful and never fabricated.
- [ ] Result count reflects the full filtered result set, not only the visible first page/window.
- [ ] Category filters, highlighted matches, recent searches and suggestions have accurate states.
- [ ] Malformed local history and missing/optional content arrays are handled safely.
- [ ] Keyboard supports Ctrl/Cmd+K, / where appropriate, arrows, Enter and Escape.
- [ ] Screen readers receive useful labels, selected-option state and accurate result-count announcements.
- [ ] No duplicate destinations, broken route slugs or hidden-content results.

## 3. Route-by-route acceptance matrix
Every public route must be checked in both themes and representative viewports, including direct deep-link refresh, back/forward navigation, loading/error/empty states, keyboard use and no-JavaScript fallback where applicable.

| Route / surface | Required experience | Critical acceptance checks |
|---|---|---|
| `/` Home | JYC identity, clear introduction, primary actions, featured activities/events, real campus media, achievements, latest updates and strong footer | Hero text contrast; crest asset fallback; no unverified counters/countdowns; CTAs work; dock clearance; page readable before motion |
| `/about` | Purpose, campus identity, ecosystem, how JYC works, programmes and source-backed history | Chapter links land correctly; timeline chronology and source links verified; metrics are sourced; mobile grids do not clip |
| `/clubs` | Directory with clear family/category, club identity, media and discovery | Search/filter/sort work; empty state; all published clubs have canonical profiles; social links verified |
| `/clubs/:slug` | Individual club profile, focus, activities, media, verified links and contact/join action | Canonical slug; missing profile state; no invented membership/activity facts |
| `/events` | Event list with status, dates, venue, organiser, poster and registration state | Past/upcoming/ongoing logic; registration deadlines and verification; no expired registration action |
| `/events/:slug` | Event overview, schedule/rules/FAQs/gallery and registration as supported by verified record | Canonical slug; hidden/unpublished/archived events excluded; timezone/date correctness; outbound registration destination checked |
| `/converge` and fest routes | Fest identity, editions, event details and source-backed archive | Distinguish JYC-128 from other campus orgs; no retired registration CTA |
| `/team` | Current leadership/teams with roles, portraits and contact links | Current period/source verified; no clipped names; image fallback is not a logo-as-face substitute |
| `/gallery` | Intentional image grid, caption/date/association, lightbox and album navigation | Rights/consent status; image-to-event/club association; keyboard lightbox; lazy loading and stable layout |
| `/join-jyc` | Explain opportunities, eligibility, process, deadlines and application CTA | Application is real/current; expired form is not actionable; confirmation/error feedback where form exists |
| `/calendar` | Calendar/list modes and date navigation | Event visibility follows publication rules; keyboard-operable mode switch; narrow viewport fit |
| `/updates` | Current updates with categories, date and source | Stale content labelled; pagination/filter semantics work |
| `/announcements` | Chronological official announcements | Only authorized/public material; clear dates and source links |
| `/achievements` | Verified achievements and evidence/source | No unverified claims or implied affiliation |
| `/best-of-jyc` | Curated archive with editorial context | Clear selection criteria; all media rights and captions checked |
| `/archive` | Searchable historic records, media and chronology | Historical records visibly distinguished from current; source provenance |
| `/contact` | Correct campus-specific contact and social routes | No cross-campus or unverified Linktree; phone/email are genuine; external links safe |
| Every remaining public/dynamic route | Purpose-specific layout and correct data | Add it to the route registry and run the same matrix; no route is exempt because it is rarely visited |

## 4. Shared component contracts
- [ ] Buttons: primary, secondary, outline, quiet, danger, icon-only, loading and disabled; correct type; pressed state for toggles.
- [ ] Cards: consistent content hierarchy, keyboard behavior when interactive, focus treatment and reduced-motion hover.
- [ ] Forms: associated labels, instructions, field-level errors, summary where needed, submitting/success/failure state and no silent failures.
- [ ] Tabs/segmented controls: real tab semantics only when implementing the tabs keyboard pattern; otherwise use a labelled button group with aria-pressed.
- [ ] Accordions: keyboard operation, aria-expanded, relationship to content and reduced-motion-safe height transition.
- [ ] Dialogs/sheets: accessible name, modal semantics only when truly modal, focus management, Escape, focus restoration, scroll lock and mobile viewport fit.
- [ ] Toasts: appropriate live-region politeness and enough time; critical errors also persist in page context.
- [ ] Tooltips: supplemental only; content available on focus/touch and never required to understand an action.
- [ ] Breadcrumbs: semantic navigation with current page.
- [ ] Pagination: stable URL/state, page count and disabled boundaries.
- [ ] Lightbox: focus trap, Escape, arrow navigation, descriptive alt/caption, close control and focus restoration.
- [ ] Skeletons: reserve final geometry, avoid pretending content exists, and always resolve to success/empty/error.

## 5. Motion specification
### Motion tokens
Use existing Motion/CSS capabilities. Keep durations restrained and consistent:
- press: 100–150ms
- hover/focus: 150–200ms
- icon/state: 150–220ms
- dropdown/sheet: 180–240ms
- dialog: 200–280ms
- section/card entrance: 300–450ms
- hero sequence: 400–700ms maximum
- page transition: 150–250ms, never delaying navigation

Use ease-out for entering, ease-in for leaving, ease-in-out for state changes. Animate transform/opacity first; avoid layout-affecting animation unless needed. Motion must be interruptible and clean up observers, event handlers, RAFs and GSAP instances.

### Approved placements
- Home hero: short identity/heading/CTA reveal; optional restrained ambient depth.
- Sections: progressive reveals that never hide content indefinitely; one-time viewport entrance; no repeated scroll animation loop.
- Cards/buttons: tiny elevation/press feedback with a clear no-motion fallback.
- More/Search/dialogs: fade/translate/scale that supports immediate interaction.
- Gallery: image opacity/transform transition and keyboard-operated lightbox.
- Timeline/statistics: subtle progression; count-up only for genuine sourced values.
- Route changes: subtle, optional and never delay navigation.

### Prohibited patterns
No persistent moving backgrounds, excessive parallax, large zoom, delayed text reveal, custom cursor replacement, animation of every card on every scroll, scroll hijacking, layout jumps, unbounded WebGL/RAF, or two libraries controlling the same element.

### Reduced motion
- [ ] prefers-reduced-motion: reduce removes non-essential movement and smooth scrolling.
- [ ] Content remains immediately visible when JavaScript or observers fail.
- [ ] Canvas/WebGL/GSAP interactions pause or switch to static rendering.
- [ ] User can pause any persistent auto-running motion.
- [ ] Toggle/theme changes remain understandable without transition.

## 6. Responsive and accessibility QA
Viewports: 320×700, 360×800, 375×812, 390×844, 430×932, 768×1024, 900×900, 1024×768, 1280×800, 1440×900 and 1920×1080; include landscape and short-height dialog cases.
- [ ] No horizontal overflow, clipped text, hidden CTA, overlapping dock or broken sticky region.
- [ ] No fixed width that forces media, cards, menus or dialogs beyond viewport.
- [ ] Images reserve intrinsic width/height and use responsive sizes.
- [ ] Text remains readable at 200% zoom and browser text enlargement.
- [ ] Semantic landmarks, one clear h1, logical headings, skip link and meaningful link text.
- [ ] Keyboard-only journey covers header, More, Search, filters, cards, forms, dialogs, lightbox and footer.
- [ ] Focus is visible, not obscured by sticky UI, and restored after overlays.
- [ ] Contrast reviewed for normal/large text, controls, hover/focus/disabled and both themes.
- [ ] Status is not conveyed by colour alone.
- [ ] Screen-reader spot checks include NVDA/Firefox or Chrome and VoiceOver/Safari where available.
- [ ] axe-core scans supplemented by manual testing; no critical/serious unresolved violations without documented disposition.
- [ ] WCAG 2.2 AA review recorded; automated pass alone is not a conformance claim.

## 7. Performance and technical quality
- [ ] Real-world field targets at the 75th percentile: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.
- [ ] Lighthouse is a lab diagnostic, not a substitute for field INP.
- [ ] Hero media prioritised; below-the-fold media lazy-loaded; AVIF/WebP derivatives and correct sizes used.
- [ ] Fonts use limited families/weights, appropriate preload and font-display; no avoidable layout shifts.
- [ ] Heavy 3D/WebGL/animation is lazy-loaded and disabled for reduced-motion/low-capability cases.
- [ ] Bundle/build output reviewed; unused dependencies and duplicated styles removed only with regression coverage.
- [ ] No uncaught runtime errors, failed asset requests, hydration/mount warnings or console errors on public routes.
- [ ] Service worker/offline behavior is tested for stale asset recovery and version changes.
- [ ] CSP/security headers and external-link rel behavior are validated.

## 8. Content trust and owner-side gates
These cannot be approved by visual code alone:
- [ ] Verify campus identity and all club/team/social references against current JYC-128 sources.
- [ ] Verify every current/upcoming event title, date, timezone, venue, organiser, registration window and destination.
- [ ] Verify historic records are labelled historic and no expired CTA remains.
- [ ] Verify photo rights, consent, source, caption and association before publication; current media records with rights_status=review remain unpublished.
- [ ] Verify contact information and official domain ownership before changing canonical URL/redirects.
- [ ] Verify live Supabase project health, RLS, storage, auth settings, admin roles and real user workflows.
- [ ] Do not expose secrets or service-role credentials to browser code.
- [ ] Distinguish curated/offline fallback from live data; do not claim live synchronization where connectors are unavailable.

## 9. Release acceptance and evidence
For each PR head SHA:
- [ ] npm ci and lockfile check pass.
- [ ] Production build passes.
- [ ] Static release QA passes (including search, source integrity, accessibility, security, media and route contracts).
- [ ] Browser smoke, route matrix, responsive, overlay, theme, logo fallback and reduced-motion tests pass.
- [ ] Lighthouse CI completes and its reports are reviewed.
- [ ] CodeQL completes with no new unresolved findings.
- [ ] Compare screenshots for desktop, tablet, mobile and 320px for every public route in both themes; human reviewer signs off.
- [ ] Verify the exact accepted SHA is deployed, not merely a previous READY deployment.
- [ ] Production routes, static assets, headers, search, More, theme toggle, forms and media are smoke-tested on real mobile and desktop browsers.
- [ ] Field Web Vitals are measured after enough real traffic; lab observations are labelled separately.
- [ ] Deployment/domain/DNS/Supabase owner actions are recorded with evidence.
- [ ] Known limitations are documented; no blanket 100% complete claim while any release blocker remains.

## 10. Working sequence
1. Baseline current main and open PR heads; map overlap and choose one consolidation branch.
2. Fix current failing QA contracts and real product defects without weakening tests.
3. Consolidate tokens and global shell; verify both themes.
4. Complete Search/More and shared accessible components.
5. Finish home and About, then clubs/events/team/gallery and remaining routes.
6. Add motion only after interaction behavior is correct.
7. Run responsive and accessibility passes.
8. Run performance/media/build/security checks.
9. Obtain content/rights and infrastructure owner sign-off.
10. Deploy the exact approved SHA and verify production.

## Evidence ledger
| Evidence | Status at creation | Required next action |
|---|---|---|
| PR #5 build and CodeQL | Passed on head `6dceb1119b29aed601725011ded2c29495c3833e` | Re-run after fixes |
| PR #5 static release QA | Failed in `qa-animation-performance.mjs` on stale DitherVeil asset expectation | Align contract with compact AVIF + WebP + PNG behavior and rerun |
| PR #5 browser/Lighthouse/quality | In progress at last inspection | Retrieve final conclusions and logs |
| Vercel JYC team | No project linked to `JYC-Website2` in current team context | Confirm intended project/ownership; do not create or alter without authorization |
| Supabase | Prior PR #4 reports project inactive and restore blocked by free-project limit | Owner must restore/choose authorized project; then run live auth/RLS/workflow tests |
| Content rights | Prior audits report records awaiting review | Obtain consent/rights and human editorial sign-off |
