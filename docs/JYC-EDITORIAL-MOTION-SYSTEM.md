# JYC Editorial Motion System

This pass strengthens the existing editorial design rather than introducing another UI framework or replacing working product flows.

## Visual direction
- Warm paper and charcoal surfaces, JYC oxblood, and restrained champagne accents.
- The existing JYC logo / React Bits-inspired Dither Veil hero remains the focal point.
- Oversized, tight-tracked display typography with readable supporting copy.
- Shared card geometry, fine borders, subtle elevation, and deliberate image hover behavior.
- Explicit mobile/tablet hero layouts, visible keyboard focus, and reduced-motion handling.

## Implementation notes
- CSS is source-owned and dependency-free; no new runtime packages are required.
- public-entry.css imports the new layer last so the design intent is predictable.
- Existing components, routes, media provenance, and registration logic remain untouched.
- Hover lift and image zoom only run for fine pointers when reduced motion is not requested.
- Tremor is intentionally not introduced into public editorial pages.

## Verification
Run npm run qa:visual-redesign, npm run build, and the existing responsive/browser QA suite. Visual checks must include mobile (360/390 px), tablet (768/900 px), and desktop (1280/1440 px), plus keyboard-only and reduced-motion checks.