# Open-source React UX research — 2026-10-06

## Reference set

The JYC audit reviewed the current `best-of-react` catalogue by Lukas Masuch as a quality reference rather than copying a framework wholesale. The catalogue is organized around UI libraries, layout, animations, data fetching, file handling and testing, and explicitly tracks project quality and activity.

Research reference:
- https://github.com/LukasMasuch/best-of-react

## What was adopted in JYC

### 1. Accessibility is a system, not a final polish pass
- Skip links are present.
- Gallery lightboxes expose `role="dialog"`, `aria-modal`, labels, keyboard close/next/previous controls and focus restoration.
- Buttons used as image controls have explicit accessible labels.
- Responsive browser QA checks missing image alt text, keyboard-relevant controls and fixed-control separation.

### 2. Media should be treated as a first-class content system
The gallery keeps provenance with each image and separates photography from artwork/design/source visuals. Images use responsive `sizes`, async decoding and lazy loading except for the small featured set. The lightbox uses eager loading only for the selected image.

### 3. Progressive disclosure beats a giant media wall
The public gallery defaults to photography, then offers Drift Wall, Living Story and metadata archive views. The archive view shows a bounded initial set and loads more in chunks. Filters expose year, media type, role, family, collection and published albums without forcing all metadata into the first screen.

### 4. Keep dependencies purposeful
JYC already contains focused React Bits components (DriftWall, FlexCarousel, DepthCarousel, FlipCard and micro-interactions). The audit did not add a general-purpose UI framework merely for visual novelty. The existing components are isolated and lazy-loaded where appropriate.

### 5. Performance is part of correctness
The project now has production build/performance gates and multi-viewport browser QA. Large archive data is split into its own build group. Images are compressed on upload, use WebP where possible and receive lazy-loading behavior in the gallery.

### 6. Data and UI provenance stay separate
The public UI can enrich supplied source material without silently turning source-only evidence into a normalized published record. Supabase publication guards remain the authority for public normalized clubs/events.

## JYC-specific conclusion

The useful lesson from the best-of ecosystem is not “add more libraries.” It is to keep the public experience composable, accessible, testable and deliberate about performance. JYC therefore keeps its current visual identity and React Bits work while tightening media provenance, responsive behavior, publication safety and automated QA.
