# JYC Website 2 — comprehensive release audit
**Audit date:** 10 November 2026  
**Repository:** https://github.com/kaustubhdua/JYC-Website2  
**Base:** `main` at `3bbe53062928462ffded092b3594013b8da61210`  
**Work branch:** `feat/jyc-complete-experience-audit` (branched from cinematic hero PR #16 head `11ea512f93510aea0362e4ec411c532d4fd4c733`)

## Scope and evidence boundary

This document separates source inspection, automated checks, historical browser evidence and release sign-off. A route being wired in React is not proof that its full runtime experience is complete. The October 10 page audit is historical evidence and must be rerun against the current build; it is not presented as a current visual sign-off.

## Work started in this branch

- Replaced the obsolete photo-integrity assertion that required the retired Dither hero with a contract for the single semantic JYC crest and the shared responsive featured-event photo fallback.
- Added accessible in-page navigation to the About JYC long-form story: Why JYC, Communities, How it works, Campus life and Our story.
- Added stable section anchors and responsive, keyboard-focusable navigation styling.
- Extended the public-route completeness QA to assert the About navigation links, target IDs and accessible name.

## Page-by-page route inventory

| Page / route | Source implementation | Required release verification |
|---|---|---|
| `/` Home | Editorial homepage, cinematic crest hero, community discovery, campus explorer, featured/upcoming events, stories and team sections | Desktop/tablet/mobile screenshots; both themes; CTA destinations; media fallback; reduced motion; WebGL-disabled fallback; CLS/LCP and accessibility |
| `/about` About JYC | Purpose, metrics, principles, five community families, operating model, programme strands, vision/mission and source-backed timeline | New section-nav links; all family filters; source links; long-page anchor offsets; mobile horizontal nav; screen-reader order |
| `/clubs` | Searchable/filterable published community directory, family filters, media wall and hub directory | Search/filter combinations, deep links, zero-results state, keyboard and touch controls, every card destination |
| `/clubs/:slug` | Club detail route | Direct refresh, valid/unknown slug handling, source/media fallbacks, external links, events and team relationships |
| `/events` | Event discovery and filtering | Published/upcoming/past/registration states, dates, venue, poster fallbacks, search, calendar and registration links |
| `/events/:slug` | Event detail route | Direct refresh, valid/invalid slug, poster fallback, share/calendar/reminder controls, registration state and expired-link behavior |
| `/events/:slug/register` | Registration route | Only verified live registration destinations; expired/closed state; no misleading form success |
| `/fests` | Fest/flagship route or configured fallback | Verify intended redirect/fallback for current configuration and every active fest destination |
| `/gallery` | Visual archive and collections | Image decode, responsive derivatives, lightbox keyboard behavior, captions, collection rail, lazy loading and CLS |
| `/gallery/:album` | Album detail | Direct refresh, album identity, image ordering, empty/unknown album handling, lightbox and back navigation |
| `/team` | Faculty, apex and core leadership | Current roster provenance, portraits/fallbacks, profile destinations, keyboard operation and responsive cards |
| `/contact` | Contact channels and message form | Validation, accessible errors, success/error handling, privacy and real delivery configuration |
| `/archive` | Published event and media archive | Filters, source labels, date ordering, deep links and empty state |
| `/announcements` | Announcement index | Published content accuracy, event links and empty state |
| `/updates` | JYC Now / update feed | Live connector configuration, fallback behavior, refresh/error state and no false live claims |
| `/join-jyc` | Join information and next steps | Accurate recruitment state and clear path to current opportunities |
| `/recruitment` | Recruitment hub or Join fallback | Open/closed cycle, verified application URLs and deadlines |
| `/calendar` | Event calendar | Month/list navigation, date/time correctness, event details and calendar export |
| `/achievements` | Source-attributed achievements | Source links, no invented claims, deduplication and empty state |
| `/best-of-jyc` | Curated photo collection | Gallery deep links, image loading and accessibility |
| Legacy aliases | `/history`, `/leadership`, `/event-calendar`, `/moments`, `/guide`, `/resources`, etc. | Correct redirects, canonical metadata and anchor preservation |

## Known exact-head CI evidence before this branch's fixes

The latest observed PR #16 head was `11ea512f93510aea0362e4ec411c532d4fd4c733`.

- Production build passed.
- Dependency lock and vulnerability gates passed.
- Responsive breakpoint source contracts passed.
- CodeQL passed.
- Datadog Synthetic passed.
- Static release QA failed because `scripts/qa-photo-integrity.mjs` still required the removed Dither/legacy-logo homepage contract.
- Lighthouse failed: observed CLS up to approximately `0.875`; color contrast and label-content accessible-name checks failed; one performance score was `0.47`; one LCP was approximately `3.61s`; a responsive-image audit failed.
- Browser QA was still running in the last captured status. No green final browser result is claimed.

## Release blockers and acceptance criteria

1. All CI and Quality Gate checks must pass on the exact final commit.
2. Browser QA must pass all public routes and direct-entry refreshes.
3. Lighthouse must pass the configured desktop and mobile thresholds in both themes. Fix the underlying layout shifts, contrast and accessible-name defects; do not lower thresholds to hide regressions.
4. Recheck responsive layouts at 320, 390, 768, 1024 and 1440 CSS pixels.
5. Inspect real screenshots for the homepage and About page, including light/dark themes and mobile.
6. Test keyboard-only navigation, visible focus, dialogs, tabs, gallery lightbox, forms and reduced-motion behavior.
7. Verify event, club, team and history content against published source material. Never invent numbers, dates, people or registration states.
8. Verify the live deployment and custom domain separately. The prior audit reported that no Vercel project was linked and the custom domain was unverified; current linkage must be checked before making a production claim.
9. Confirm no secrets are exposed in client bundles and that configured external integrations have truthful configured/unconfigured states.

## Sign-off

**Status: IN PROGRESS — NOT RELEASE APPROVED.**

This branch contains targeted implementation and QA corrections. A successful build, CI run, visual inspection and live deployment verification are still required before calling the website complete.
