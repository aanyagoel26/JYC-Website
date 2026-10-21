# JYC Final QA Checklist — V18.21.0

This checklist consolidates the JYC product brief, the V15/V17 experience baseline, the V18 functional/security work and the V20 compact-theme pass.

## Public experience
- [ ] Home is the first public navigation item.
- [ ] Public navigation: Home, Clubs, Events, Moments, Team, Contact, More, Search.
- [ ] JYC Planner remains available through More and `/planner`.
- [ ] More menu traps focus and locks page scroll while open.
- [ ] Search works from the navigation and keyboard shortcut.
- [ ] No primary navigation item is duplicated inside More.
- [ ] Footer contains official JYC links and required creator/legal information.

## Homepage
- [ ] Hero is compact and readable at desktop and mobile sizes.
- [ ] JYC Pulse, Next Moment, Impact, Ecosystem, Moments and content-driven sections remain available.
- [ ] Phoenix is recognizable, centered and restrained.
- [ ] Phoenix orbit/orb system never becomes a continuous animation demo.
- [ ] No cursor-driven star animation loop is present.
- [ ] Empty content states are compact and do not manufacture clubs/events/gallery records.
- [ ] Only approved/data-driven JYC content is presented as official content.

## Pages
- [ ] About
- [ ] Clubs + search/filter + saved/follow behavior
- [ ] Events + upcoming/past separation + event detail
- [ ] Gallery + empty/loading/error states
- [ ] Team
- [ ] Contact + social channels + submission fallback
- [ ] Campus Map + campus switch + venue search + directions
- [ ] JYC Planner
- [ ] JYC FAQ/Guide
- [ ] My JYC / account surfaces

## Visual system
- [ ] Light palette follows the JYC PDF: cream, white, near-black text, red attention, gold secondary.
- [ ] Dark palette follows the JYC PDF: near-black, warm off-white, red and gold.
- [ ] No random blue/purple gradients.
- [ ] Headings remain compact rather than poster-sized.
- [ ] Cards have restrained borders/radii and do not look like a SaaS dashboard.
- [ ] Night mode reads as a subtle night sky rather than a particle demo.
- [ ] Reduced-motion mode disables continuous decorative motion.

## Map
- [ ] OpenStreetMap attribution/source remains visible.
- [ ] Map receives a JYC-specific warm/dark visual treatment without obscuring map data.
- [ ] Map controls and overlays remain readable.
- [ ] No giant empty side panel when no JYC venue is published.
- [ ] Mobile map becomes a single-column flow.

## Admin/CMS
- [ ] Admin remains a separate private product.
- [ ] Sidebar is readable and label-first.
- [ ] Main content fills the available space.
- [ ] Tables/forms do not overflow the main content area.
- [ ] AI Content Copilot remains inside Admin, not the public homepage.
- [ ] Draft/publish permissions are preserved.
- [ ] No service-role key or secret is shipped to the browser.

## SEO/PWA/security
- [ ] Dynamic page titles/descriptions/canonicals work.
- [ ] Organization/event/breadcrumb JSON-LD remains valid.
- [ ] Robots and sitemap expose public pages only.
- [ ] Private routes are noindex where appropriate.
- [ ] PWA manifest is same-origin.
- [ ] Service-worker cache is bumped for every release.
- [ ] CSP/security headers remain intact.
- [ ] `.env.local`, `.env.*.local`, `.vercel` and `node_modules` stay ignored.

## Responsive browser QA
Test at minimum:

- [ ] 390 × 844
- [ ] 400 × 580
- [ ] 768 × 1024
- [ ] 1280+ desktop

Check especially:
- [ ] navbar / mobile dock
- [ ] hero + Phoenix
- [ ] ecosystem orbit
- [ ] cards and filters
- [ ] contact form
- [ ] map
- [ ] More sheet
- [ ] search overlay
- [ ] footer

## Release commands

```bash
npm install
npm run qa
npm run qa:seo
npm run qa:security
npm run build
npx playwright install chromium
npm run qa:browser
```

Do not push a release until the production build and browser QA are green.
