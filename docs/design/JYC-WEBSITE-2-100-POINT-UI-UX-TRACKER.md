# JYC Website 2 — 100-point UI/UX implementation tracker

This is the engineering checklist for the visual and interaction blueprint. It distinguishes code already present from work that has not yet been implemented or independently verified.

**Status legend**
- `[x]` Implemented and verified against the relevant release checks.
- `[~]` Implementation exists in the repository; runtime, visual, accessibility or device verification is still required.
- `[ ]` Work remains or there is no reliable evidence that the requirement is implemented.

Do not mark an item complete from a source-code assertion alone. A visual item needs rendered review; an interaction needs keyboard/touch testing; a performance item needs current measurements.

## 1. Homepage and hero experience

**Hero refinement pass (10 November 2026):** The follow-up visual pass strengthens the desktop headline scale and crest stage, restores the JIIT location line on phones, increases the mobile crest presentation, and visually demotes the tertiary Join action while preserving all three destinations. Decorative orbital rim/highlight layers remain behind the semantic crest and are disabled under reduced motion. These remain implementation-complete-but-unverified until current Browser QA, Lighthouse and real-device visual review pass.


- [~] 01. Balance headline, supporting copy, CTA hierarchy and JYC crest in the hero.
- [~] 02. Build a layered astronomical night sky with galaxies, Milky Way and nebula.
- [~] 03. Establish distant, medium and foreground star depth.
- [~] 04. Render a dark galactic dust lane rather than a single glowing gradient.
- [~] 05. Give nebula layers slow, different movement speeds.
- [~] 06. Keep the JYC crest as the focal point with dimensional lighting and a metallic rim.
- [~] 07. Use editorial headline typography, intentional line breaks and controlled tracking.
- [~] 08. Use a champagne-gold identity badge with restrained glow and status treatment.
- [~] 09. Give primary, secondary and tertiary hero actions distinct visual weights.
- [~] 10. Recompose the hero at phone widths rather than merely shrinking desktop layout.

## 2. Colour, theme and design system

- [~] 11. Centralise shared semantic colour tokens.
- [~] 12. Keep the light and dark palettes independent.
- [~] 13. Define warm ivory, champagne, beige, antique gold and bronze for light mode.
- [~] 14. Define midnight, blue-black, indigo, violet, muted nebula red and starlight for dark mode.
- [~] 15. Define semantic success, warning, error, information and event/registration states.
- [~] 16. Standardise hero, card, button and ambient gradient recipes.
- [~] 17. Standardise surface elevation and overlay layers.
- [~] 18. Standardise radii across controls, cards, images, menus and dialogs.
- [~] 19. Keep borders and focus rings visible in both themes.
- [~] 20. Transition theme colours without flashes or excessive motion.

## 3. Texture, depth and atmosphere

- [~] 21. Add an extremely subtle film-grain texture to selected large surfaces.
- [~] 22. Use fine, restrained star particles in dark backgrounds.
- [~] 23. Add a restrained champagne paper/noise texture to selected light surfaces.
- [~] 24. Layer foreground, middle-ground and distant atmosphere.
- [~] 25. Place soft radial light sources behind important content.
- [~] 26. Use glass treatment selectively for overlays and floating controls.
- [~] 27. Use metallic gold accents for selected badges, icons and featured borders.
- [~] 28. Add subtle inner highlights to selected cards.
- [~] 29. Blend major sections with atmospheric transitions.
- [~] 30. Distinguish editorial, interactive and featured-event surface treatments.

## 4. WebGL, 3D and interactive effects

- [~] 31. Extend the existing OGL shader for the astronomical atmosphere.
- [~] 32. Add multi-layer, pointer-responsive star depth.
- [~] 33. Add subtle cursor-responsive crest lighting.
- [~] 34. Use slow, organic nebula shader movement.
- [~] 35. Add restrained star twinkling with varied timing and intensity.
- [~] 36. Keep constellation connections sparse and intentional.
- [~] 37. Add a few depth-aware floating hero details without obscuring content.
- [~] 38. Keep optional crest depth/interaction subtle and accessible.
- [~] 39. Use a warm gold/light-field treatment in light mode, not a dark-sky recolour.
- [~] 40. Preserve a high-quality static fallback when WebGL is unavailable, reduced or delayed.

## 5. Animation and motion design

- [~] 41. Use shared motion durations and easing conventions.
- [~] 42. Sequence the hero entrance without delaying useful content.
- [~] 43. Reveal sections as they enter the viewport.
- [~] 44. Keep card hover motion small and purposeful.
- [~] 45. Restrict magnetic interactions to capable fine-pointer devices.
- [~] 46. Use a refined animated navigation underline/active treatment.
- [~] 47. Apply gentle image zoom only to selected photo cards.
- [~] 48. Reserve shimmer for selected featured-event states.
- [~] 49. Provide consistent, non-disruptive route transitions (a transform/opacity route-stage transition is now implemented; browser verification remains).
- [~] 50. Respect reduced-motion preferences with usable static alternatives.

## 6. Cards, clubs, events and campus content

- [~] 51. Present the club directory as a visual discovery experience.
- [~] 52. Give club cards a consistent identity, description and clear actions.
- [~] 53. Use club-family accents without fragmenting the JYC identity.
- [~] 54. Give event cards strong poster, date, venue and registration hierarchy.
- [~] 55. Feature the most relevant published event without inventing counters.
- [~] 56. Distinguish upcoming, live, completed and registration-closed states.
- [~] 57. Provide calendar month/list views.
- [~] 58. Support event search and useful filters.
- [~] 59. Use editorial, source-grounded campus photography and varied layouts.
- [~] 60. Provide a keyboard-operable gallery lightbox with captions and mobile support.

## 7. Navigation, UX and usability

- [~] 61. Give desktop navigation clear spacing and hierarchy.
- [~] 62. Provide a usable mobile navigation drawer/sheet.
- [~] 63. Show the active page/section clearly.
- [~] 64. Provide keyboard-accessible search/command-palette access.
- [~] 65. Make search results understandable and navigable.
- [~] 66. Use breadcrumbs on deeper content routes.
- [~] 67. Keep important actions available without hover.
- [~] 68. Provide loading, empty, success and error states.
- [~] 69. Explain form errors inline and announce them accessibly.
- [~] 70. Make discover-a-club, find-an-event and join-JYC journeys easy to complete.

## 8. Typography, iconography and content presentation

- [~] 71. Maintain a deliberate type scale from display headings to micro-labels.
- [~] 72. Pair an expressive display face with a readable body face.
- [~] 73. Keep line height and paragraph width comfortable.
- [~] 74. Standardise uppercase labels, tracking and metadata.
- [~] 75. Consolidate the icon language so components do not mix unrelated icon treatments (a reusable JYC line-icon set now powers navigation and dialog controls; wider component migration remains).
- [~] 76. Replace emoji-as-icons where they weaken clarity or consistency.
- [~] 77. Maintain readable text contrast over photography with controlled overlays.
- [~] 78. Supply meaningful alt text or mark decorative imagery appropriately.
- [~] 79. Standardise event date, category and venue metadata.
- [~] 80. Keep club and event detail pages rich, structured and source-grounded.

## 9. Micro-interactions, accessibility and responsive polish

- [~] 81. Provide visible keyboard focus on all interactive elements.
- [~] 82. Verify WCAG AA contrast for text and interface controls across both themes (the earlier seven-route Lighthouse run passed its colour-contrast audit; repeat across both themes and manual states).
- [~] 83. Maintain comfortable mobile touch targets.
- [~] 84. Give buttons tactile press feedback.
- [~] 85. Confirm copy/share actions with clear feedback.
- [~] 86. Make menus, tabs, dialogs and carousels keyboard-operable.
- [~] 87. Give interactive cards accessible names without nested-click traps.
- [~] 88. Test narrow phone, phone, tablet, laptop and large desktop breakpoints.
- [~] 89. Prevent horizontal overflow, clipped labels and awkward wrapping.
- [~] 90. Add a user-facing pause/reduced-intensity control for decorative motion.

## 10. Performance, testing and final design quality

- [~] 91. Deliver responsive AVIF/WebP variants for hero and featured imagery.
- [~] 92. Lazy-load below-the-fold imagery and non-essential modules.
- [~] 93. Split heavy visual effects and route experiences into deferred chunks.
- [~] 94. Pause WebGL, particle and scroll work when hidden or offscreen.
- [~] 95. Prevent duplicate animation loops and clean up WebGL resources.
- [~] 96. Enforce measurable JavaScript, image and rendering budgets.
- [~] 97. Run Lighthouse across key routes, themes and viewport classes (desktop and mobile configs now cover all seven routes in both light and dark modes; current run must pass).
- [~] 98. Maintain Playwright route, interaction and visual-regression coverage.
- [~] 99. Combine automated accessibility checks with manual keyboard/screen-reader review.
- [ ] 100. Complete a final review on real midrange Android devices and desktop browsers.

## Cinematic homepage hero refresh — PR #14

The follow-up art-direction pass is intentionally focused on clarity and performance rather than adding more effects:

- Recompose the hero as an open, cinematic crest stage instead of a bordered dashboard-like panel.
- Keep the existing OGL shader as the single atmospheric sky layer; keep the original JYC crest as the focal point, with only a restrained CSS orbital halo.
- Remove the duplicate Dither crest, telemetry labels, animated ring canvas, audio toggle and external model-viewer; keep one accessible responsive crest as the visual anchor.
- Strengthen the headline and make community discovery the primary action, with events and joining as clear secondary paths.
- On mobile, reorder the hero as identity → headline → supporting copy → crest → actions, with full-size touch targets and no transform scaling.
- Let ordinary 8-core / 8 GB desktop devices run the shader at a reduced quality tier rather than disabling it outright.
- Keep both theme treatments distinct: deep midnight/indigo/violet/champagne for dark mode and warm ivory/champagne/brass for light mode.
- Match the crest image `srcset`, `sizes` and preload to its rendered dimensions (220px mobile, 360px tablet, 480px desktop) so high-DPR screens receive a crisp asset without a misleading 80px hint.
- Keep the hero dependency-free beyond the existing OGL field and Motion stack; the new crest itself is DOM/CSS and does not load a separate 3D viewer, audio engine or canvas loop.

Source assertions are added to the homepage hero QA. Runtime screenshots, exact-head browser tests, Lighthouse and physical-device review remain required before promoting any hero item to [x].

## Current PR #12 implementation notes

The existing branch already contains a substantial hero, theme, atmosphere, card, directory, search, calendar, gallery, accessibility and performance foundation. The following new release fixes are part of this work:

- The hero QA assertion array had a missing separator; corrected.
- The public-journey QA expected retired CTA copy; aligned it with the current visible hero actions.
- The search trigger's accessible name now includes the visible keyboard hint ("Ctrl K").
- Public routes now render cache/curated fallback content before asynchronous live refresh, reducing the large footer layout shifts seen on content-heavy routes.
- The editorial homepage is route-lazy so non-home routes do not eagerly load the hero/WebGL module.
- The responsive crest candidate is preloaded with matching `imagesrcset`/`imagesizes`; OGL and Dither initialization is deferred beyond the initial hero paint.
- The More JYC sheet now includes a persistent Pause/Resume decorative motion control; the ambient canvas, hero WebGL/Dither, crest canvas and interactive Bento respond to the preference.
- A small reusable grain texture now adds subtle film/paper texture with separate light/dark blending.
- Route changes now use a short transform/opacity entrance transition, disabled for OS reduced-motion and the user pause setting.
- Event poster cards and their detail pages now share a native browser View Transition, with a route-stage fallback and reduced-motion/user-pause guards.
- A reusable JYC line-icon component now powers the main navigation and dialog close control without adding an icon dependency.
- The command palette is now loaded on demand; the public shell no longer eagerly imports Motion just for event-poster shared-element wrappers.
- Lighthouse coverage now includes all seven public routes in both themes at desktop and mobile presets; the mobile run has its own report output directory.

## Release verification and follow-up

PR #12 was merged at `3bbe53062928462ffded092b3594013b8da61210`. The merge itself is not a release sign-off: its exact-head Browser QA and Lighthouse runs failed, while JYC CI, Quality Gate, CodeQL and Datadog Synthetic passed.

A follow-up branch, `fix/release-matrix-visual-accessibility`, addresses the observed browser contracts and visual regressions:
- Reserve the first viewport for lazy route chunks to reduce layout shifts.
- Improve dark-theme metadata contrast on public gallery, club and event surfaces.
- Keep reveal content visible if IntersectionObserver is unavailable.
- Support legacy MediaQueryList change listeners in the ambient animation engine.
- Apply club-family deep links on initial route render.
- Correct search/category, route-reveal, family-navigation and 320px gallery test contracts.
- Keep emblem control targets at least 48px tall and improve featured-event metadata legibility.
- Keep the champagne and cosmic homepage token sets distinct.

These follow-up changes are **not yet merged or verified by a fresh CI run**. The current branch should be reviewed and tested before merge. Do not promote [~] items to [x] from source inspection alone. Real midrange Android and desktop review remains a manual release step.

**Release rule:** [~] is not a pass. Promote an item to [x] only after the relevant current-head CI/browser/Lighthouse checks and any required manual visual, keyboard, touch or real-device review pass. Do not claim production readiness until the release matrix is green.
