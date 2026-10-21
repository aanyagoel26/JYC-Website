# JYC Website — Master Build & Release Order

This is the single execution order for the JIIT Youth Club 128 public website. Work through the list in order; do not reopen completed phases unless QA finds a regression.

## 01 — Foundation
- JYC visual tokens and light/dark themes
- Space Grotesk + Inter typography
- global spacing, borders, radii, buttons and focus states
- responsive breakpoints: 320 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920
- reduced-motion behavior
- shared page/layout primitives
- error, loading, empty and 404 states
- public/admin visual separation
- Supabase source-of-truth and safe fallback behavior

## 02 — Navigation & discovery
- desktop sticky navigation
- mobile top bar
- mobile dock: Home / Clubs / Events / Gallery / More
- More sheet with all public destinations
- search modal
- Ctrl/Cmd+K and / shortcuts
- keyboard focus and Escape behavior
- route aliases and canonical leaf URLs

## 03 — Home
- editorial split hero
- real JYC photography
- JYC story
- activity discovery
- clubs/community discovery
- upcoming events
- gallery/moments
- history
- people
- final CTA
- restrained React Bits interactions

## 04 — Events
- upcoming/live/planned/past states
- search
- category and club filters
- URL-synced filters
- cards/list/calendar views
- event visual wall
- event detail pages
- registration state
- Google Calendar / calendar tools
- reminders
- event structured data
- JIIT 128 scope enforcement

## 05 — Clubs
- community discovery
- family/category filters
- club profiles
- activity areas
- events
- gallery
- team
- recruitment
- verified social links
- club canonical URLs

## 06 — Gallery
- real media manifest
- editorial/masonry presentation
- featured visual interactions
- lazy loading below the fold
- image fallbacks
- accessible alt text
- responsive image handling
- lightbox/keyboard interaction where supported
- no broken media

## 07 — Team
- faculty guidance
- apex leadership
- core team
- hub/community directory
- real photographs where available
- accessible profile interactions

## 08 — About JYC (including the timeline)
- JYC purpose and role
- how JYC works
- community families
- evidence-led historical milestones in the same page
- source links and deep links to each milestone
- no separate History destination
- no invented founding date or statistics

## 09 — Achievements
- source-backed records only
- community milestones
- outcomes/awards where published
- archive cross-links
- no fabricated numbers

## 10 — Calendar
- JYC events only
- month navigation
- mobile-friendly agenda presentation
- planned/published distinction
- event links

## 11 — Updates / Announcements
- current JYC notices
- event registration updates
- verified hub updates
- source links
- useful empty states
- no stale/fabricated updates

## 12 — Archive
- year navigation
- events
- clubs
- photos/stories
- institutional memory
- visual archive distinct from Gallery

## 13 — Contact
- official JYC links
- Instagram / LinkedIn / WhatsApp
- contact form with graceful fallback
- campus information
- website creator credit and creator links

## 14 — SEO
- route titles/descriptions
- canonical URLs
- Organization/WebSite JSON-LD
- Event JSON-LD on event pages
- breadcrumb/page metadata
- social preview metadata
- sitemap
- robots/indexing rules
- 404 handling

## 15 — Performance
- lazy-load non-critical components
- lazy-load below-fold images
- reserve image space
- keep hero/LCP media eager
- split heavy React Bits components
- avoid unnecessary global animation
- respect reduced motion

## 16 — Security & data
- Supabase RLS
- safe public RPC usage
- no service-role key in browser
- safe external URLs
- admin/club-admin boundaries
- content revision logging
- review workflow support

## 17 — PWA / resilience
- manifest
- installability
- offline shell
- cached public data where appropriate
- online/offline status
- graceful Supabase failure
- no claim that dynamic content is fully offline

## 18 — Automated QA
- production build
- 128 event-scope contract
- 128 social-scope contract
- trust contract
- media integrity
- hygiene
- SEO
- security
- performance
- release metadata
- GitHub Actions gate on pushes and PRs

## 19 — Manual browser QA
For every public route:
- desktop
- tablet
- 320 / 375 / 390 / 430 mobile
- light/dark
- mouse/touch
- keyboard
- Escape/focus restoration
- reduced motion
- 400% zoom/reflow
- image failures
- empty states
- console/runtime errors
- overflow/overlap
- broken links

Browser automation must not be called passed unless Chromium actually launches and completes the suite.

## 20 — Release
- verify GitHub main
- verify Actions
- verify Vercel deployment
- verify production HTTP
- verify latest commit is deployed
- smoke-test every public route
- final content/link/media check
- only then call the site release-ready

## Product rules
- JIIT 128 only for JYC public event/community scope.
- No fake statistics.
- No invented history.
- No placeholder CTAs.
- No empty decorative sections.
- Every image needs a purpose and useful alt text.
- Every interaction needs keyboard/touch behavior.
- Every animation must have a reason.
- Public pages remain editorial; admin pages remain operational.
