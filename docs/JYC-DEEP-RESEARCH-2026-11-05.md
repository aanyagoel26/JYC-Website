# JYC Website — Deep Research & Execution Notes

**Research date:** 5 November 2026  
**Repository:** `kaustubhdua/JYC-Website2`  
**Purpose:** Record source-truth decisions and implementation changes before any production sign-off.

## Executive finding

The codebase has a mature React/Vite implementation, responsive-media pipeline, route QA, and an established Motion/GSAP/OGL stack. The main remaining work is not solved by adding more animation libraries. The highest-value corrections are trustworthy campus attribution, event-state accuracy, removal of fabricated schedules, a verifiable deployment, and live backend recovery.

## Current source research

### JYC 128 identity

- The JIIT Youth Club Wish Town Campus LinkedIn profile identifies the organization as the Sector 128/Wish Town campus identity: https://in.linkedin.com/in/jyc128
- The separate JIIT Youth Club LinkedIn company page describes Sector 62, so it must not be used as a JYC-128 source: https://www.linkedin.com/company/jiityouthclub
- The generic Linktree account at https://linktr.ee/jiityouthclub currently surfaces older Converge'24 forms and registrations. The reviewed public material does not establish it as a JYC-128 link hub. It has therefore been removed from JYC-128's approved social identities, Organization JSON-LD, contact page, and JYC Now fallback. The campus-specific LinkedIn and Instagram identities remain.
- The JYC custom domain currently resolves in public search to the JAI 2026 summit microsite, not the general JYC public information architecture. Treat it as an event destination until the authorized owner confirms the intended canonical main-site domain.

### Event-state accuracy

- JAI 2026 was scheduled for 30–31 October 2026. The current official event page shows the completed summit and Round 1 shortlist/results information: https://www.jiityouthclub128.in/
- RIDE Hack'26's dedicated official page lists an application close date of 15 October 2026 and an offline finale on 1 November 2026: https://www.innovationjiit.in/ride-hack-2026/events.html. Those dates have passed. The Innovation homepage still contains an outdated "Registrations are NOW OPEN" banner, so the dedicated event page is the safer source and the fallback card must not imply registration is open.
- CICR currently lists TechTonic 2.0 with its date/time to be announced: https://www.cicr.in/. No date has been invented in JYC content.
- The previous Converge Live component displayed an unverified 2027 date, seven invented stage schedule items, fabricated prize amounts, and "LIVE NOW" states. This was not source-backed and was removed. Both `/converge` and `/converge-live` now redirect to the archive until an organizer-approved 2027 schedule exists.

## UI/animation library research and decision

| Library | Current project role | Decision |
|---|---|---|
| Motion for React | Already installed as `motion`; React-native declarative state, gesture and shared-layout transitions | Keep as the primary React animation layer. Use `MotionConfig reducedMotion="user"`, `useReducedMotion`, and restrained `layoutId` transitions where they improve navigation. |
| GSAP | Already installed | Keep for isolated timeline choreography or scroll sequences that genuinely need it. Do not duplicate ordinary React state transitions already handled by Motion. |
| OGL | Already installed | Keep for the single custom WebGL hero effect. OGL is a low-level WebGL layer, not a reason to make every route a 3D canvas. Preserve a static image fallback and disable expensive motion for reduced-motion/coarse-pointer devices. |
| React Bits | Existing source components are already integrated | Adopt source selectively, with local QA and accessibility review. Avoid stacking multiple perpetual backgrounds, global cursor effects, or hover-only essential content. |
| shadcn/ui | Existing UI patterns can inform component semantics | Borrow accessible Dialog/Sheet, Tabs, Accordion and form patterns only when a current component has a tested gap. Do not migrate the application or introduce a second primitive stack just for styling. |
| Lenis | Optional smooth-scroll library | Not added. Native scrolling remains the safer default until measured scroll/WebGL synchronization problems justify a smooth-scroll layer. |
| Tremor | Data visualization/dashboard component system | Not added to the editorial public website. Use factual status/date hierarchy without introducing dashboard-style cards or unsupported metrics. |

Research references:
- Motion React and reduced motion: https://motion.dev/docs/react and https://motion.dev/docs/react-accessibility
- Motion layout/shared elements: https://motion.dev/docs/react-layout-animations
- React Bits: https://reactbits.dev/ and https://github.com/DavidHDev/react-bits
- OGL: https://oframe.github.io/ogl/
- shadcn/ui: https://ui.shadcn.com/
- Lenis: https://lenis.dev/

## Implemented in this research pass

1. Removed the unsupported Converge 2027 live schedule component and its stylesheet.
2. Added permanent Vercel redirects and client-side redirects from `/converge` and `/converge-live` to `/archive`.
3. Added release QA assertions preventing the fabricated schedule from returning.
4. Updated JYC Now fallback cards so JAI and RIDE are explicitly marked completed, and CICR's TechTonic date remains TBA.
5. Changed JYC Now's no-live-data state to say no live updates are available and present source snapshots rather than implying a live feed.
6. Replaced the unverified generic Linktree with the campus-specific JYC-128 LinkedIn profile in JYC Now and removed the generic Linktree from approved identity metadata.
7. Removed unsupported "student desk active" operating hours from Contact and removed the unverified Linktree contact card. Contact now emphasizes the verified JYC-128 Instagram/LinkedIn channels.

## External release blockers still present

- Vercel team context has only the `JYC - WEBSITE` team and no JYC Website2 project. Creating a Git-connected project for `kaustubhdua/JYC-Website2` returned HTTP 403. No deployment or domain configuration was changed.
- Supabase project `ogbanmjokjlxfuktkicj` is INACTIVE. Database inspection reports that the database is not accessible. Restore was rejected because the free organization has reached its two-active-project limit. No other project was paused or deleted.
- The current account has read-only access to `aanyagoel26/JYC-Website`; PR #1 remains open and unmerged. Do not claim the upstream or production site is updated.
- Exact-head GitHub Actions, browser screenshots, Lighthouse and CodeQL have not yet produced a passing run for the current candidate. No current-SHA human visual review has been completed.

## Release verdict

**NOT COMPLETE / NOT RELEASE-READY.** Source corrections are committed, but production deployment, active Supabase, exact-head CI, visual review, domain ownership, and upstream integration still require owner-controlled access and successful verification.


## 3D explorer and binary asset integrity follow-up

- The homepage's community constellation was not actually WebGL: it uses a projected 2D canvas. Its previous animation loop called React `setRotY` on every animation frame while also depending on `rotY` in the effect, causing repeated teardown/restart and avoidable React work. It also carried hard-coded membership counts and descriptions for source-review/draft communities.
- The constellation is now explicitly described as a projected 3D canvas, reads its community names/families/descriptions from the publication-gated hub registry, excludes draft entries, removes unsupported membership counts, and adds a keyboard-accessible community selector. Animation now pauses for reduced-motion preference, hidden tabs and off-screen state; interaction state is read through a ref rather than scheduling React state updates each frame.
- The repository contains two GLB assets. `public/models/jyc-spatial.glb` was inspected directly: GLB magic/version/declared length and chunk boundaries are valid; its glTF JSON declares version 2.0, one scene, one node, one mesh, four accessors, four bufferViews, one material and three embedded WebP textures. It uses `KHR_draco_mesh_compression` and `KHR_materials_specular`. The second, larger GLB could not be fully read through the GitHub text-file API in this session.
- Added `scripts/qa-glb-integrity.mjs` to validate both tracked assets' Git blob identity, GLB 2.0 header/length/chunk boundaries, buffer/view/accessor bounds, mesh/node/scene/material/texture/animation references, and Draco extension declarations. It is registered in the canonical QA suite. This is structural integrity validation; it does not replace a browser decoder/render check of the Draco-compressed geometry.

- Follow-up interaction correction: when a user begins dragging after auto-rotation, the drag target is rebased to the current visual rotation so the constellation does not snap back to a stale React state angle.


## Live-backend resilience correction

- The production loader previously returned `norm(empty)` when Supabase was unconfigured, paused, timed out, or returned an RPC error. With the connected JYC project currently inactive, that meant the production app could lose its club/event directory even though the repository contains publication-gated public records.
- Added a read-only fallback mode: use the last saved public cache when present; otherwise render the 21 publication-approved hub profiles, source-reviewed event records and current 2026–27 leadership campaign. It deliberately excludes the extra PDF/gallery fallback collection until the database/media rights pipeline is available.
- The fallback mode is explicitly disclosed in a responsive notice. Content edits/publishing are blocked while in fallback mode, and fallback-only metadata is stripped before any save payload.
- The gallery fallback remains constrained; this change does not widen media rights/publication access.

- A final contact-copy review also removed an unsupported claim that the retained WhatsApp invite is an official enrolled-student broadcast. The page now identifies it as a community invite and directs visitors to check the group's own current membership/announcement description.

- RAF lifecycle follow-up: static redraws no longer clear the ID of a pending animation frame. The scheduled callback clears its own ID when it begins, so unmount/visibility cleanup can still cancel the active request and cannot leave a detached-canvas animation loop running.

## DitherVeil reveal interaction correction

- The hero was requesting a missing `/assets/jyc-logo-medium.avif` texture and relying on a fallback. It now uses the existing optimized AVIF directly with the existing WebP and original PNG fallbacks.
- The DitherVeil container sat inside a `pointer-events:none` hero layer and its own CSS also disabled pointer events, while the effect listened only on the container. That prevented reveal tracking when the foreground emblem intercepted pointer movement. Added an opt-in global pointer-tracking mode for this hero, scoped to the container bounds, with blur cleanup.
- Increased the hero veil's restrained opacity slightly so the effect is perceptible without overwhelming the editorial hero.
- Added QA checks for source asset existence and global pointer wiring.

- The original DitherVeil low-power guard disabled WebGL on any device reporting fewer than six CPU cores, which can exclude ordinary four-core phones. Relaxed the gate to very-low CPU/memory devices only; coarse-pointer devices still render at DPR 1. The mobile veil opacity was also raised slightly while keeping the effect restrained.

## First-visit visual system and actual GLB viewer integration

- First-time visitors now receive the midnight/cyan theme. Explicit saved light/dark preferences remain respected, and both browser theme-color meta entries track the active selection.
- Replaced the remaining JYC hero's oxblood/brass/magenta canvas accents and DitherVeil rim with cyan/blue/indigo tones.
- Found a functional 3D gap: the hero already rendered a `<model-viewer>` element for `/models/jyc-spatial.glb`, but the Google model-viewer web component was never registered. The spatial toggle therefore rendered an inert unknown custom element.
- The spatial mode now lazy-loads pinned `@google/model-viewer` 4.4.0 from Google's CDN only when the visitor selects it, waits for `customElements.whenDefined`, shows a loading/error state and offers the GLB download as a fallback. This avoids loading the 3D viewer on every route/initial page view.
- Updated Vercel CSP for the pinned Google loader, gstatic Draco decoder resources and WebAssembly. The GLB QA now checks both asset integrity and the viewer/CSP integration.

- Added the model-viewer's recommended `touch-action="pan-y"` interaction contract so mobile visitors can orbit the model without losing vertical page scrolling.
