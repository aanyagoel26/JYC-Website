# JYC page-by-page UI audit — 10 October 2026

## Scope and method

Audited the current Vercel preview in a live browser across desktop, tablet and mobile viewport widths. The route matrix covered 20 routes at 320, 390, 768, 1024 and 1440 CSS pixels (100 route/viewport combinations). Checks included page title and primary heading, visible image decode/failure, explicit image alt attributes, unnamed interactive controls, horizontal document overflow, off-screen content, text clipping, recovery-boundary output and console/runtime failures.

This was a DOM/geometry and interaction audit, not a substitute for human visual sign-off on every screenshot. The protected Vercel preview was used because the configured custom domain is not currently verified in the connected Vercel project.

## Route inventory

| Route | Result / action |
| --- | --- |
| `/` | Homepage mounted; no document overflow, broken visible images, missing alt attributes or unnamed controls found. |
| `/about` | Mounted; long editorial page remained within viewport guardrails. |
| `/history` | Mounted; timeline and story content remained within viewport guardrails. |
| `/clubs` | Mounted; directory images and controls passed basic media/accessibility checks. |
| `/clubs/innovation` | Mounted; no broken visible images or horizontal document overflow. A request to `/api/jyc-updates` returned HTTP 500 in the preview; investigate independently. |
| `/events` | Mounted; tablet headline clipping reproduced at 768px. Added a single-column tablet hero breakpoint and safe headline sizing. |
| `/events/jai-2026-jaypee-agentic-ai-hackathon` | **Critical failure reproduced:** React recovery boundary displayed “That page hit a problem.” Root cause: `eventPoster` was referenced without being declared inside `EventDetail`; the reminder `notify` callback was also used without being passed into the component. Both are fixed and covered by regression checks. |
| `/team` | Mounted; member cards and images passed basic media/accessibility checks. |
| `/gallery` | Mounted; archive photos passed media checks. The collection row is intentionally horizontally scrollable; added a visible scrollbar treatment and “Swipe or scroll to explore” hint so off-screen collection cards are discoverable. |
| `/gallery/converge-2026` | Album route mounted; collection rail and photo media passed basic checks. |
| `/achievements` | Mounted; evidence-first record and navigation links were visible. |
| `/announcements` | Mounted; announcement list rendered. Its JAI update linked to the broken event detail route; the detail crash is fixed in this branch. |
| `/recruitment` | Mounted; empty state had no next-step actions when recruitment was closed. Added Explore clubs, See events and Join JYC updates actions. |
| `/calendar` | Mounted; calendar controls and published event rows were visible. |
| `/archive` | Mounted; archive event list and gallery entry point were visible. |
| `/updates` | Mounted; editorial update feed rendered with fallback content. The preview's `/api/jyc-updates` 500 should be verified against a ready deployment. |
| `/contact` | Mounted; contact channels and message form were visible. |
| `/fests` | Redirects to `/events` when no fest-specific mode is enabled; expected fallback behavior, not a separate rendered page. |
| `/best-of-jyc` | Mounted; selected images rendered but were not interactive. Made each image card link to its matching photo in the full gallery. |
| `/join-jyc` | Mounted; joining-cycle state and community/event next steps were visible. |

## Geometry and media findings

- No horizontal **document** overflow was found across the audited route/viewport matrix.
- No broken visible images, missing `alt` attributes or unnamed interactive controls were detected in the route-level scan.
- At 320px and 390px, collection cards outside the viewport belong to the intended horizontal gallery collection scroller; they are not document overflow. The scroller now has a clearer affordance.
- At 768px, the events/fests hero headline's scroll width exceeded its text box. The new tablet breakpoint changes the hero to a single column and reduces the headline size to prevent clipping.
- The JAI event detail route was the only route found in the matrix that entered the application recovery boundary.

## Changes in this branch

1. Declare `eventPoster` in `EventDetail` before its first render use.
2. Pass the existing `notify` callback from the route into `EventDetail`.
3. Make events/clubs directory heroes safe at tablet widths and very narrow mobile widths.
4. Improve gallery collection rail discoverability with a scroll hint and scrollbar styling.
5. Make Best of JYC cards open the matching gallery photo.
6. Add useful navigation actions to the closed-recruitment empty state.
7. Add browser regression tests for JAI event detail rendering, tablet headline geometry, closed recruitment actions and Best of JYC gallery navigation.
8. Add current-release coherence assertions for the route-level fixes.

## Release gates still open

- The live custom domain `www.jiityouthclub128.in` returned JAI 2026 summit content for the homepage and sampled JYC routes during the public-site check, while Vercel reports both `jiityouthclub128.in` and `www.jiityouthclub128.in` as unverified on the JYC project. Resolve domain/DNS ownership and routing before treating the custom domain as the verified JYC production site.
- The preview's `/api/jyc-updates` request returned HTTP 500. The runtime-error aggregation did not show a corresponding recorded exception, so re-check on a ready deployment and inspect function logs if it persists.
- The page-level fixes need a fresh ready deployment and a green browser/quality run before merge. The current audit did not declare a production deployment or all-tests-passed state.
