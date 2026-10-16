# JYC V1 Editorial Design System

Status: implementation contract for `rebuild/v1-editorial-from-reference`. This document describes intended public-site behaviour; it is not a claim that every route or external integration has passed QA.

## Product intent
JYC 128 should feel like a confident campus-culture publication: editorial, energetic, photo-led and unmistakably JYC. Expressive visual design must not compromise navigation, accessibility, performance or factual accuracy. Keep this a public organisational website, not a student portal.

## Brand tokens
Use these as proposed design tokens until the official logo artwork is sampled and the values are confirmed. Do not recolour the logo itself.

| Token | Value | Primary use |
| --- | --- | --- |
| JYC Navy | `#172747` | identity, selected navigation, structural accents |
| Heritage Gold | `#C6A45A` | small highlights, dividers, metadata accents |
| Warm Cream | `#F5EFE3` | light editorial surfaces |
| Deep Charcoal | `#111318` | dark editorial surfaces |
| Crimson | `#C93645` | primary actions and limited emphasis |
| Teal | `#168C87` | secondary category accent |
| Ice Blue | `#B9DDF2` | information and technical-community accent |
| White | `#FFFFFF` | high-contrast content surfaces |

### Surface modes
- **Dark editorial:** homepage hero, featured event, selected gallery/memory features. Cream typography, restrained gold/crimson accents, generous negative space.
- **Light editorial:** explanatory copy, directory/filter interfaces, event information, announcements and contact. Cream/white backgrounds, charcoal text, navy structure.
- Use crimson and teal as accents, not competing full-page backgrounds. Never use colour alone to communicate event state.

## Typography and layout
- Display: heavy condensed or grotesk headline face; tight leading and tracking only for short display headlines.
- Reading: accessible sans-serif, comfortable line length, minimum 16px body text on desktop and mobile where practical.
- Metadata: uppercase labels with increased tracking; never use tiny tracked text for essential instructions.
- Content width: generally 1120–1240px; mobile gutters 20–24px, tablet 28–36px, desktop 32px or more.
- Use intentional whitespace and varied editorial rhythm, not empty decorative blocks. Keep cards aligned and avoid forcing all content into equal-height tiles.

## Shared component rules
- Header: clear JYC identity, active-route indication, keyboard-operable navigation and a visible mobile menu state.
- Buttons and links: meaningful labels, visible hover/focus states, minimum 44px touch target where possible; every interactive-looking element must work.
- Cards: entire-card links only when the card has one unambiguous destination; otherwise use explicit actions.
- Images: authentic, correctly classified photos first. Posters, logos, QR codes, textures and decorative assets must not be presented as event photography. Provide useful alt text; use empty alt for decoration. Lazy-load below-the-fold images and reserve dimensions/aspect ratios to limit layout shift.
- Motion: short, purposeful transitions; respect `prefers-reduced-motion`; no continuous decorative rotation or interaction that blocks reading.
- State handling: loading, empty, unavailable and error states must be designed, not left as blank space. Never invent an event date, registration URL, achievement, person, contact detail or social account.

## Public route contract
1. **Home** — brand-led hero, organisation intro, community families, verified upcoming event, announcements, activity types, team/history teaser, photo moments and clear next actions.
2. **About JYC** — purpose, role, structure, values and a source-backed timeline in one page; legacy `/history` redirects to the timeline anchor.
3. **Leadership** — faculty guidance and student leadership grouped by real role; verified names/photos/social links only.
4. **Clubs** — search and filter by category/interest; readable descriptions and explicit detail links; distinguish official/published records from source-only records.
5. **Club detail** — identity, purpose, activities, verified team, related events/gallery and real recruitment status.
6. **Events** — featured event, search, category and time/status filters; chronological sorting with robust missing/invalid-date handling.
7. **Event detail** — date/time/timezone, venue, organiser, description, schedule/rules/eligibility/prizes only when available, registration status and contact. Hide unavailable fields rather than fabricating them.
8. **Event calendar** — accessible month/list views, keyboard-operable date selection and valid event links; calendar export only with valid event data.
9. **Gallery** — source-verified collections and year filters; accessible lightbox, keyboard escape/arrow handling, focus restoration and sensible mobile gestures.
10. **Achievements / Best of JYC** — verifiable accomplishments with date and evidence/context; avoid unsupported superlatives.
11. **Announcements** — publication status, date, deadline and archive state; show only public/published notices.
12. **Recruitment / Join JYC** — explicit open/closed/coming-soon state; never imply applications are open without a verified destination and dates.
13. **Contact** — verified channels, campus location and clear form success/error states; do not claim a message was sent unless submission succeeds.
14. **Archive** — legacy and historical content with clear dates/context, distinct from upcoming activity.

## Accessibility and responsive acceptance
- One clear page-level H1; headings follow a meaningful hierarchy.
- All functionality usable by keyboard; visible focus is not clipped or obscured.
- Sufficient text/control contrast in both surface modes; errors include text, not colour alone.
- Reduced-motion preference respected.
- At 320px viewport width, no horizontal page overflow or clipped primary actions.
- Images have stable dimensions; text can zoom to 200% without loss of content/function.
- Links are descriptive, buttons perform actions, and controls have accessible names.
- Empty/loading/error states remain understandable to screen readers.

## Data integrity and runtime rules
- Public content must be published and not archived before appearing in public listings.
- Upcoming events must have valid dates and be on/after the user's local calendar day; invalid dates must not sort as real events.
- Route slugs must be generated consistently between cards and detail pages.
- Internal links should remain on the canonical site; external links should be intentional and clearly identifiable where appropriate.
- Images need a safe fallback and must not repeatedly trigger an error loop.
- Do not include admin-only/private data in public fallbacks.
- Keep official public site scope separate from student accounts, attendance/check-in, passes/certificates, campus utility dashboards and other portal-only functions.

## Release gate (must be run against the final commit)
1. Install from lockfile and run production build.
2. Run repository tests, lint/type checks and all maintained QA scripts; investigate each failure rather than suppressing checks.
3. Exercise every public route directly and through navigation at desktop/tablet/mobile widths.
4. Verify search, filters, event detail links, calendar controls, gallery lightbox, announcement links, contact form and recruitment state.
5. Inspect network requests and browser console; fix failed assets, React warnings, broken routes and runtime errors.
6. Check image loading/fallbacks, layout shift, reduced motion, keyboard navigation, focus management and contrast.
7. Validate SEO title/description, canonical URL, robots/sitemap, social metadata and structured data.
8. Confirm preview deployment is READY and matches the exact tested commit. Do not merge/deploy based only on a queued deployment or a passing older commit.
9. Recheck the production site after deployment and preserve a rollback path.

## Reference and provenance
This is a design/QA contract, not a claim of source-by-source ZIP review. Original project archives and official logo colours must be verified before treating the proposed palette or asset classification as final. Inspiration may inform quality and patterns, but JYC content, identity and imagery must remain original.
