# JYC 128 — Senior Logo Design & Content Contract

Updated: 2026-10-03

## Visual source of truth

The senior-provided JYC emblem is now the visual reference for the public site.

### Core palette

The public implementation uses the **JYC Website Development Specification** as the canonical theme-token source. The senior-provided emblem is the identity reference; it does not override the approved site token values.

- Light paper: `#f5f1e6`
- Light card: `#ffffff`
- Light ink: `#1a191d`
- Light muted: `#6e6a75`
- Light attention red: `#a82420`
- Light secondary gold: `#bf9c6f`
- Dark surface: `#0f0e11`
- Dark card: `#18161d`
- Dark ink: `#fff8e1`
- Dark muted: `#a8a3b0`
- Dark attention red: `#c92a2a`
- Dark secondary gold: `#d2b48c`

The JYC logo is used for identity, while club/event photography provides the individual visual character. No random blue/purple gradients, neon/glass effects or unrelated accent palettes are introduced.

## Light mode

Light mode uses warm paper beige with near-black text, white cards and restrained red/gold accents. Body text is never placed over low-contrast gold surfaces.

## Dark mode

Dark mode uses near-black surfaces with warm-white text and restrained red/gold accents. Cards, borders and controls remain visibly separated from the background.

## Motion

Motion is editorial and functional:

- hero entrance
- logo float/glow
- restrained gold sweep
- section reveal
- image hover zoom
- card lift
- theme-toggle feedback

The public shell must respect `prefers-reduced-motion` and remove non-essential movement when requested.

## Content source contract

The supplied All Hubs / JYC orientation material is the source for:

- five JYC families: Cultural, Technical, Creative, Literary and Sports
- the JYC organisational hierarchy
- major programme names: Induction, Ebullience, Hackathons, Ethnic Day, Converge, Dron-O-War and Farewell
- supplied hub stories and photography

Live dates, registration status, current people and operational links remain controlled by published JYC records / Supabase rather than being inferred from presentation material.

## Photography

The repository currently contains the extracted JYC hub archive under:

- `public/assets/hub-photos/`
- `public/assets/hub-photos-extra/`
- `public/assets/hub-stories/`

The public gallery and hub pages use these maintained source assets. More existing PDF-derived assets were activated in the homepage and hub media mapping instead of fabricating imagery.

## Layout contract

- Public sections use a shared centered content width.
- Section headings are centered.
- Cards and grids stretch consistently to eliminate orphan/empty columns.
- Mobile layouts collapse intentionally rather than leaving desktop whitespace.
- Navigation remains simple and professional.
- No site-wide chatbot, giant campus map, orbit-heavy hero or unrelated visual effects.

## Accessibility contract

- Visible keyboard focus.
- 44px minimum interactive targets in the final public layer.
- Higher-contrast preference support.
- Reduced-motion support.
- Text remains readable independently of accent colour.

## Next product work

The next major improvements should be data/product work rather than another visual redesign:

1. Complete production Supabase baseline and migration reconciliation.
2. Make content verification status actually gate publication.
3. Connect every published content record to campus scope.
4. Relationalize events, results, galleries and recruitment records.
5. Add image dimensions/srcset/responsive delivery and Lighthouse/Core Web Vitals monitoring.
6. Add automated axe accessibility checks.
7. Finish JYC Pulse / My JYC / saved events / reminders around the verified event model.
8. Add branch protection requiring CI, Quality Gate and CodeQL before merge.
