# JYC Website 2 — UI/UX, visual design and motion implementation specification

**Status:** Active implementation specification  
**Target branch:** `fix/release-readiness-remediation`  
**Source:** User-approved complete UI/UX and animation roadmap supplied on 6 November 2026  
**Rule:** A checklist item is complete only when implementation and its acceptance evidence both pass. This document is not itself proof of completion.

## Product quality goal

JYC should feel like an established university youth organisation: recognisable campus identity, real and attributable content, predictable navigation, clear page hierarchy, fast mobile use, accessible controls, and purposeful motion. Improve the existing React application incrementally; do not replace its routing, content, media, or animation architecture without evidence that a replacement is necessary.

## Phase 1 — Brand and design foundation

### Visual direction
- Editorial typography and whitespace; campus photography and real club identities; premium restraint; JYC-specific visual language.
- Use editorial sections, event posters, directories, statistics, timelines, and galleries as appropriate. Do not turn every section into a glass card.
- Keep the established warm-paper/ink/oxblood/champagne identity in light mode. Dark mode must remain a deliberate, readable alternative and must not introduce unrelated neon/purple accents.

### Shared tokens
The shared design system in `src/styles/jyc-design-system.css` is the source for reusable values:
- Brand colours: paper, raised paper, ink, muted ink, oxblood, champagne, borders and semantic status.
- Typography: display, body and mono font stacks; page heading, body, caption and label hierarchy.
- Spacing: 4px base scale with 8/12/16/20/24/32/40/48px steps.
- Shape: shared small/medium/large/extra-large radii.
- Elevation: restrained small/medium/large shadows.
- Motion: fast, hover, overlay and entrance durations; standard, ease-in and ease-out curves.
- Layers: header, mobile dock, overlays and lightbox.
- Breakpoints: preserve responsive component rules; test intermediate widths, not only named breakpoints.

### Acceptance
- Same brand identity and token usage across all public routes.
- No unexplained one-off typography, colours, radii, shadows or z-index values in shared components.
- Real JYC photography only; logos are not substitutes for missing photographs.
- One clear primary action and hierarchy on each page.

## Phase 2 — Navigation and discovery

### Header and navigation
- Consistent logo, active-route state, spacing and sticky behaviour.
- Desktop navigation and mobile dock/header do not overlap content or one another.
- More and Search are keyboard operable, dismissible, theme-aware, scroll-locking and restore focus.
- Every navigation item resolves to a real, meaningful destination. Retired destinations must not be advertised as live pages.

### More menu
- Group routes by purpose; title and short description for each; active route visible.
- Escape closes; Tab remains within the modal; outside click closes; body scroll is locked; focus returns to the invoking control.
- Search handoff from More must not restore focus to the now-hidden More trigger while Search is open.

### Global Search
- Index published pages, clubs, events, people, achievements, announcements, updates and gallery records.
- Search title, descriptions, venue, role, category, year and relevant keywords.
- Exact and title matches rank above partial matches.
- Highlight matching terms, show accurate result counts, and offer category filters.
- Recent searches and discovery suggestions appear before typing; empty and no-results states are useful.
- Arrow Up/Down and Enter work; Escape closes; Ctrl/Cmd+K and / open Search.
- Malformed collections and storage failures must not crash the dialog.
- Never return draft, archived, source-only or unpublished content.

### Acceptance
- Route matrix has no dead/misleading links.
- Search category counts match the filtered result set.
- Every result's destination exists and is public.
- Search and More work together on desktop and mobile.

## Phase 3 — Route-by-route experience

Every route must pass: visual completeness, information hierarchy, intended task completion, responsive layout, and loading/empty/error/success states.

| Route | Experience acceptance |
|---|---|
| `/` Home | Distinct JYC identity; readable hero; genuine campus activity; featured clubs/events; attributable achievements; current updates; clear primary actions; strong footer. |
| `/about` | Clear purpose, governance, values and campus context; avoid unsupported claims. |
| `/clubs` | Consistent club identity, genuine logo/photo treatment, search, family/type/domain filters, sorting where relevant, empty/loading states and meaningful profile navigation. |
| `/clubs/:slug` | Organisation identity, activities, events, people and photography; clear contact/join action; no fabricated people or social links. |
| `/events` | Poster ratios, upcoming/live/past states, date/venue/registration/deadline, search and filters, no expired registration links. |
| `/events/:slug` | Canonical detail route; source-backed details; lifecycle status; registration state; useful related content; safe external links. |
| `/fests` | Only when fest mode is enabled; flagship experience with clear dates, venue, programme and participation status. |
| `/team` | Consistent portrait treatment; names, roles and departments; accessible profile interactions; no clipped text or inaccessible flip cards. |
| `/gallery` | Intentional grid/masonry, consistent image treatment, captions/alt, album navigation, keyboard-operable lightbox, previous/next, zoom/share, responsive loading and neutral failure fallback. |
| `/best-of-jyc` | Curated published images; links into the corresponding gallery photo; no duplicate or fabricated photography. |
| `/join-jyc` and `/recruitment` | Explain organisation/opportunities/process/eligibility/deadlines; valid application path; accurate open/closed state; confirmation and error feedback. |
| `/calendar` | Event-only calendar content, readable dates and event links; no unrelated academic calendar entries mixed into JYC events. |
| `/updates` | Chronological published updates with dates, categories, attribution and meaningful links. |
| `/announcements` | Current notices, registration state and dates; no stale or unverified notices. |
| `/achievements` | Attributable milestones only; visible source context; no unsupported counts or claims. |
| `/archive` and `/history` | Chronological, source-backed archive with stable route links and empty states. |
| `/contact` | Correct contact channels; accessible form labels, validation, submitting, success and failure feedback. |
| All remaining public routes | Dedicated visual review, H1, metadata, navigation, empty/error states and mobile layout. |

## Phase 4 — Component and state system

Each interactive component must have intentional default, hover, focus-visible, active, disabled and loading states where applicable.

| Component | Required states and behaviour |
|---|---|
| Buttons | Primary/secondary/outline/ghost; hover, focus, active, loading, disabled; clear action outcome. |
| Cards | Consistent structure; meaningful click target; hover and keyboard focus; no hover-only information. |
| Inputs/forms | Visible labels, instructions, validation, invalid, submitting, success and failure states. |
| Search | Suggestions, recent, category filters, results, highlighted match, loading, empty and error states. |
| Tabs/filters | Selected state, keyboard support, URL/state synchronisation where appropriate. |
| Accordions | Accessible controls, expanded state and reduced-motion-aware expansion. |
| Dialogs | Accessible name, focus trap, Escape, outside-click policy, scroll lock and focus restoration. |
| Toasts | Success/warning/error semantics; readable duration; do not rely on colour alone. |
| Tooltips | Keyboard and touch alternative; sensible positioning; no essential hidden content. |
| Dropdowns | Keyboard operation, active/selected state and outside-click handling. |
| Breadcrumbs | Correct parent/route hierarchy. |
| Pagination/load more | Correct count, state and navigation; no disappearing content. |
| Image viewer | Loading, failed image, fallback, zoom, previous/next and close. |
| Footer | Valid routes, external link safety and responsive layout. |

## Phase 5 — Motion and animation

### Motion principles
Animation must communicate interaction, explain a transition, or add intentional visual character. Prefer transform and opacity. Motion must be interruptible and must not hide content if JavaScript fails.

### Motion tokens and starting durations
| Motion | Duration |
|---|---:|
| Button press | 100–150ms |
| Hover feedback | 150–200ms |
| Icon transition | 150–220ms |
| Dropdown | 180–240ms |
| Modal | 200–280ms |
| Card entrance | 300–450ms |
| Hero sequence | 400–700ms |
| Route transition | 150–250ms |

Use ease-out for entry, ease-in for exit, ease-in-out/standard for state changes. Keep spring motion selective.

### Motion map
- Home hero: subtle logo/heading/CTA reveal; restrained background depth; headline immediately readable.
- Scroll: headings/cards/images/statistics/timeline may reveal once; never keep critical content hidden.
- Micro-interactions: button press, icon, nav underline, toggle, input focus, copy confirmation and toast.
- Navigation: More/Search/mobile navigation open-close; active route; interruptible route transition.
- Gallery: image load, lightbox, navigation and image replacement.
- Team/events/clubs: gentle image or card feedback on fine pointers only.

### Avoid
Constantly moving backgrounds, excessive parallax/zoom, long delayed text, magnetic cursor effects that impair pointer use, custom cursors, repeated scroll-triggered card motion, layout-jumping animations, and multiple libraries controlling the same element.

### Accessibility
- Respect `prefers-reduced-motion` globally and within component/JS animation logic.
- No non-essential persistent auto-running motion without a pause/stop mechanism.
- No animation may block input, route navigation or reading.

## Phase 6 — Responsive design and accessibility

### Viewport matrix
Test 320×700, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1280×900, 1440×900 and 1920×1080, plus landscape and short-height mobile.

### Responsive acceptance
- No horizontal overflow, overlap, clipped headings, broken cards or off-screen text.
- Faces and logos remain appropriately framed.
- Sticky header/dock never covers actions or dialog content.
- Dialogs fit short screens and respect safe areas.
- Important touch controls target at least 44×44 CSS px.
- Text remains readable at 200% zoom.

### WCAG 2.2 AA review
- Keyboard-only route and component operation.
- Visible focus and logical focus order.
- Semantic HTML and heading hierarchy.
- Accessible names/labels and descriptive errors.
- Meaningful alt text; decorative imagery is hidden from assistive technology.
- Contrast for text, controls and focus indicators.
- Screen-reader dialog and live-region behaviour.
- Reduced motion; no keyboard traps.
- Captions/transcripts for relevant media.
- Status is not communicated by colour alone.
- Automated axe checks plus manual keyboard and screen-reader review.

## Phase 7 — Performance and stability

Targets at the 75th percentile of real visits: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.

- AVIF/WebP derivatives and responsive `srcset/sizes`.
- Lazy-load below-fold images; prioritise only genuine LCP imagery.
- Explicit dimensions/aspect ratios prevent layout shift.
- Efficient font loading and `font-display`.
- Remove unused CSS/JS and avoid unnecessary dependencies.
- Lazy-load expensive animation/3D.
- Avoid expensive blur/filter and layout-triggering scroll handlers.
- Animate transform/opacity; avoid unnecessary React renders.
- Profile ordinary/low-end Android and throttled networks.
- Preserve graceful fallbacks if image manifest, remote data or optional models fail.

## Phase 8 — QA and release acceptance

### Required QA
- Visual regression for all public routes at 1440×900, 1024×768, 390×844 and 320×700.
- Navigation, More, Search, result destinations, all visible controls and forms.
- Animation start/end/interruption/mobile/reduced-motion/cleanup.
- Accessibility automated and manual review.
- Responsive matrix and landscape.
- Chrome, Edge, Firefox and Safari.
- Runtime/console/network errors.
- Broken/misleading media and source integrity.
- No placeholder or misleading content.
- Core Web Vitals and bundle/media review.
- Production smoke test after deployment; verify actual deployed commit and live desktop/mobile pages.

### Animation test questions
For each animation: does it start/end correctly, remain interruptible, work on mobile, respect reduced motion, avoid layout shift, remain smooth on weaker devices, clean up listeners/instances and behave correctly when navigating away?

## 35-point approval checklist

A checkbox is marked only after its evidence passes.

### Brand and design system (5)
- [ ] Consistent JYC identity across all routes.
- [ ] Complete colour, typography and spacing tokens.
- [ ] Consistent component styling.
- [ ] No random visual patterns or conflicting styles.
- [ ] High-quality, genuine photography and media.

### Navigation and discovery (6)
- [ ] Desktop navigation fully functional.
- [ ] Mobile navigation fully functional.
- [ ] More menu fully functional.
- [ ] Search fully functional.
- [ ] All public links and routes verified.
- [ ] No dead or misleading destinations.

### Page experience (5)
- [ ] Every public page visually reviewed.
- [ ] Every page has clear content hierarchy.
- [ ] All forms and primary actions work.
- [ ] Loading, empty, success and error states complete.
- [ ] No clipped text, broken images or layout defects.

### Motion and interaction (6)
- [ ] Consistent animation tokens.
- [ ] All interactive controls have proper feedback.
- [ ] Hero and scroll animations are purposeful.
- [ ] Menus and dialogs animate correctly.
- [ ] No stuck or conflicting animations.
- [ ] Reduced-motion mode works.

### Responsive and accessible (6)
- [ ] 320px to 1920px layout coverage.
- [ ] No horizontal overflow.
- [ ] Keyboard navigation works throughout.
- [ ] Focus is visible and correctly managed.
- [ ] WCAG 2.2 AA review completed.
- [ ] Screen-reader and touch interaction reviewed.

### Performance and release (7)
- [ ] Core Web Vitals targets achieved.
- [ ] Images and fonts optimised.
- [ ] No major console errors.
- [ ] No critical or high-severity accessibility defects.
- [ ] Visual regression suite passes.
- [ ] Browser QA passes.
- [ ] Production deployment verified.

## Current implementation notes

The existing application already has React Router, Motion for React, route-specific experience modules, responsive photo components, a global More/Search layer, a shared design-system stylesheet, reduced-motion rules, Playwright viewport projects and several media/security QA scripts. Standardise and correct those systems before adding another animation library.

Known release blockers from the current audit must remain visible:
- The latest recorded browser run on the previous PR head had 71 passing and 21 failing tests. That is a failing baseline, not an acceptance pass.
- The current public event header is `.jyc-events-header`; tests must target the current component rather than retired `.events-page .compact-page-head` markup.
- The current club directory uses a text/identity fallback when no photo URL exists. A failed-photo assertion should only expect an image fallback when an image request actually exists.
- Supabase project activation and Vercel deployment access have not been verified; do not represent deployment as complete until a live release is proven.

## Evidence log

Update this section with commit SHA, workflow run URL, test counts, browser matrix, Lighthouse/axe results, and deployed commit. Never mark completion based only on static source assertions.
