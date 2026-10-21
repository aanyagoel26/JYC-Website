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
| `/clubs/innovation` | Mounted; no broken visible images or horizontal document overflow. A request to `/api/jyc-updates` returned HTTP 500. Root cause found in `api/jyc-updates.js`: the YouTube response mapper had an extra closing parenthesis, making the entire serverless function fail to parse. Fixed on this branch and added a Node syntax check plus a browser endpoint contract test. |
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
- At 768px, the events/fests hero headline's scroll width initially exceeded its text box. The new tablet breakpoint changes the hero to a single column and reduces the headline size; the fixed headline now fits its box.
- The JAI event detail route initially entered the application recovery boundary. The deployed fix now renders the JAI title and Notify me action without the recovery screen.
- Re-ran the full 20-route × 5-viewport matrix against the ready preview after the fixes: zero horizontal-overflow routes, broken visible images, missing `alt` attributes, unnamed controls, recovery screens, uncaught page errors or same-origin HTTP error responses.
- The protected-preview browser environment logged CSP blocks for Vercel's injected `vercel.live` feedback script and could not fetch the external Google Fonts stylesheet. These are not app-origin HTTP failures or uncaught JavaScript exceptions; do not weaken the site's CSP merely to accommodate Vercel's injected preview script. Recheck font delivery in a normal browser/network environment.

## Changes in this branch

1. Declare `eventPoster` in `EventDetail` before its first render use.
2. Pass the existing `notify` callback from the route into `EventDetail`.
3. Make events/clubs directory heroes safe at tablet widths and very narrow mobile widths.
4. Improve gallery collection rail discoverability with a scroll hint and scrollbar styling.
5. Make Best of JYC cards open the matching gallery photo.
6. Add useful navigation actions to the closed-recruitment empty state.
7. Add browser regression tests for JAI event detail rendering, tablet headline geometry, closed recruitment actions, Best of JYC gallery navigation and the Updates API response.
8. Add current-release coherence assertions, including `node --check` for the serverless Updates API.

## Release gates still open

- The live custom domain `www.jiityouthclub128.in` returned JAI 2026 summit content for the homepage and sampled JYC routes during the public-site check, while Vercel reports both `jiityouthclub128.in` and `www.jiityouthclub128.in` as unverified on the JYC project. Resolve domain/DNS ownership and routing before treating the custom domain as the verified JYC production site.
- The Updates API is now HTTP 200 and returns valid JSON: `{\"items\":[],\"live\":false,\"configured\":false}`. The parser crash is fixed. This preview has no update connector environment configured, so live aggregated updates are not active; configure the approved feed credentials/settings to enable them.
- The Vercel preview for commit `928f0158c810ab0ecdbdcec1dcfa38571f24b600` is READY and contains all application-source fixes. A GitHub compare confirmed that the subsequent commits through the current PR head only modify the audit document and QA/test scripts, not the application bundle. The exact latest head still has no green CI result.
- A manual deployment request was rejected by Vercel with HTTP 402 `api-deployments-free-per-day` (more than 100 deployment API calls; retry after 24 hours). Automatic Git-linked deployment succeeded for the app-code fix commit. Do not merge until CI/quality checks are green.
