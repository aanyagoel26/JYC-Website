# JYC UI/UX, Photography & Source Audit — 10 October 2026

## Scope

This audit covers the merged V64.5.0 source and the follow-up `fix/media-fallback-state-rerender` V64.5.1 branch, its source-media pipeline, the supplied 2026–27 All Hubs PDFs, official public club profiles/sites, and the newest available Vercel preview metadata. It distinguishes source-level verification from tests actually executed in a browser.

## Implemented in the release branch

- **Hero identity:** left-aligned editorial JYC headline and actions; right-side official `/JYC Logo(4).png` rendered through the lazy React Bits Dither Veil. Coarse pointers, reduced-motion preference and constrained hardware use the static official-logo fallback. No continuously animated photo wall is mounted in the hero.
- **Magnetic discovery:** activity Bento is lazy-mounted near the section, desktop-only for tilt/magnetism, and disables heavy effects for coarse pointers/reduced motion. Pointer leave resets transforms; router navigation is used rather than assigning arbitrary external URLs.
- **Team:** React Bits flip cards show portrait, name and role on the front, with available biography/about text and safely resolved LinkedIn/Instagram links on the back. A persistent return-to-photo control is present. Missing public bios are not fabricated.
- **Club and event identity:** club accents/motifs come from maintained identity records; event accents are event-specific. Club logos are contained rather than cropped as photography when a genuine photo is unavailable.
- **Photography:** supplied archive records are classified by role and provenance; identity assets are kept out of the photo-only pool; archive frames use stable geometry; responsive AVIF/WebP derivatives and lazy decoding are enabled where appropriate; image fallbacks are local.
- **Source-backed content:** the All Hubs material grounds the five community families and hub activity narratives. Current official profiles/sites supplement, rather than replace, the supplied orientation source.
- **Accessibility/theme:** reduced-motion support, keyboard-focus styles, search/More theme checks, responsive overflow checks and team flip keyboard behavior are covered in the browser suite.

## Current public-source recheck

### CICR — Robotics Hub of JIIT-128

- LinkedIn: https://in.linkedin.com/company/cicrjiit128/
- Official site: https://www.cicr.in/
- The profile identifies CICR as the official Robotics Hub of JIIT Sector 128.
- Public updates describe **AI Unlocked** on 11 August 2026 and **ROBOSPARK** on 21 September 2026, including practical AI, sensors/electronics, Arduino/ESP32/STM32 and robotics fundamentals.
- The official site lists **TechTonic 2.0** as a future AI/ML + robotics workshop with the date still TBA. Do not invent a date or open registration state.

### Innovation JIIT

- LinkedIn: https://in.linkedin.com/company/innovation-jiit/
- Official site: https://www.innovationjiit.in/
- The profile describes an innovation/entrepreneurship hub with RIDE Hack, Innovate, startup-oriented programmes, workshops and mentorship.
- The current site lists **RIDE HACK 26** for 1 November 2026 at JIIT Sector 128. The public LinkedIn post says applications closed on 5 October, shortlisting is 15 October and the final is 1 November; the official website still displays “Registrations are NOW OPEN”. This is a source inconsistency. JYC should link to the official source and avoid asserting that registration is currently open unless the organiser confirms it.
- Historical activities include Innovate 3.0, CodeAI and Climate Data Hackathon; retain them as past experiences, not upcoming registrations.

### JODC vs OSDC — campus identity guard

- JODC LinkedIn: https://in.linkedin.com/company/jodc/
- JODC identifies itself as the Open Source Society of JIIT-128 and describes contributions, collaboration, developer networking, GSoC/GSoD/Outreachy preparation, meetups, dev-sprints and hackathons.
- A separately named **Open Source Developers Community (OSDC)** appears on LinkedIn at https://in.linkedin.com/company/os-dc and is associated with JIIT Sector 62. Do not merge that profile's events, leadership, photos or links into the Sector-128 JYC/JODC record without independent venue/identity evidence.

### JYC 128 and JAI 2026

- JYC 128 public profile: https://in.linkedin.com/in/jyc128
- The current public post identifies JAI 2026 as a JYC Wish Town / Sector-128 event on **30–31 October 2026**. Keep its canonical event route and official event landing page as the primary registration source.
- Converge 2026 (14–15 March 2026) and DRON-O-WAR 1.0 (2–3 May 2026) are past events; do not present them as upcoming.
- Dronotics source: https://www.linkedin.com/company/dronotics-jiit-128

### GDG JIIT 128

- LinkedIn: https://in.linkedin.com/company/dsc-jiit/
- Its recent public update advertises Hack Day ’26 for 23 October 2026 at Sector 128. The organisation's LinkedIn location metadata has historically lagged behind its current 128 posts, so event-specific campus evidence should govern inclusion. Keep this as a hub-originated event unless JYC's editorial workflow approves it as a JYC-organised event.

## Media and browser QA additions

- Added a photo-integrity contract that parses the maintained team portrait map and requires local, committed WebP files for each mapped portrait.
- Added a Playwright regression that scrolls through About, Clubs, Events, Team, Gallery, Achievements and Best of JYC; forces lazy images to load/decode; then checks for broken images and missing `alt` attributes.
- The existing browser suite already checks the Dither Veil hero, magnetic interactions, team flip + LinkedIn links, search/More light/dark surfaces, reduced motion, route SEO, photo-led routes and overlap/overflow guardrails.

## Validation status — do not overstate

- The newest Vercel preview metadata reports **READY** for commit `139d235b9da90c68e1fdd8e44aad612ed314d780` (Dither Veil/Bento QA commit). The latest added photo-integrity/browser-test commits are newer than that preview, so they are not included in that build yet.
- The preview is protected by Vercel authentication for an unauthenticated browser; a live browser session could not be completed from the external browser runner.
- GitHub Actions for the previewed commit report failure, but all inspected jobs return **zero steps** and the log download reports the log blob is unavailable. This is not a passing test result and does not identify an application-code failure; CI must be rerun where a runner/logs are available.
- No production deployment, public custom-domain routing, or DNS ownership change is claimed here.

## Prioritized next steps

1. **P0 — Release gates:** run `npm ci`, full `npm run qa`, `npm run build`, and the complete Playwright suite on the exact branch head; retain logs/artifacts. Do not merge if any job fails or does not execute.
2. **P0 — Live browser access:** provide an unprotected preview URL or an authenticated browser session so 320/360/390/768/1024/1280/1440/1920 widths can be visually checked in light and dark themes. Check the hero, team flips, gallery lightbox, event posters and fixed controls.
3. **P0 — Production routing:** verify Vercel custom-domain ownership and aliases before touching DNS. Do not change DNS based solely on an unverified project-domain state.
4. **P1 — Event truth:** reconcile RIDE HACK 26 registration status with Innovation JIIT because the application deadline and current site CTA conflict. Keep JAI 2026 as the canonical JYC event and keep old events clearly marked as past.
5. **P1 — Editorial profile quality:** continue verifying each hub's identity, current official links and campus-specific events. Do not scrape LinkedIn CDN images into the public archive; use owned/permissioned media with source/provenance records.
6. **P2 — Performance:** capture real LCP/INP/CLS and image bytes on mobile/desktop; compare Dither Veil versus static logo fallback on capable hardware; keep heavy effects below the fold and avoid stacking multiple pointer-driven animations on one element.
7. **P2 — Maintainability:** consolidate the historical CSS cascade only after visual regression coverage is reliable; keep the source-media manifest and QA contracts as release gates.

## Design direction

Use restrained, purposeful motion: Dither Veil only for the official logo; magnetic movement only on discovery cards; short, reduced-motion-aware page reveals; a controlled photo lightbox; and the team flip as an explicit interaction. Avoid adding more continuous animation until real-device performance is measured. JYC's identity should remain champagne/beige, near-black and ivory, with club-specific muted accents rather than a new competing palette.


## Incremental follow-up — 10 October 2026

- **Portrait failure semantics hardened:** team cards reserve a 600×720 intrinsic ratio and keep lazy/async image decoding. A failed portrait now uses the official `/JYC Logo(4).png`, not the generic hub photograph; the fallback is contained, and its alternative text explicitly says the portrait is unavailable. All `ResponsivePhoto` failures now fall back to the official JYC logo instead of substituting an unrelated campus photograph; fallback alt text identifies the logo placeholder, source sets are cleared, and branded fallbacks are contained. Club cards prefer their own logo, event cards prefer their own poster, and the homepage featured-event image uses the official mark when media is missing.
- **Regression coverage added:** the photo-integrity contract now guards the team fallback and alt-text transitions; Playwright aborts `/assets/team/**` image requests and checks that the official logo is loaded, labelled correctly and rendered with `object-fit: contain`.
- **Source identity check:** current public LinkedIn results confirm JODC is the JIIT-128 Open Source Society, while the separately named OSDC profile is associated with Sector 62. Do not merge OSDC posts, photos, people or event listings into the Sector-128 JYC site without separate evidence. The official Innovation JIIT LinkedIn post still gives RIDE HACK 26 an application close date of 5 October 2026 while its website CTA says registrations are open; as of 10 October this must remain marked as an organiser-side inconsistency, not a JYC-confirmed registration state.
- **Validation boundary remains unchanged:** these source edits and source-contract checks do not prove that Playwright or the production build passed. The latest GitHub Actions jobs still expose zero steps/logs; the current head needs an executable CI run before the PR can be approved.

## Incremental follow-up — 10 October 2026 (continued)

- **Removed a retired QA expectation:** the V64 editorial contract still expected the old animated photo wall in the homepage hero, despite the current design intentionally using the official JYC logo + Dither Veil + magnetic activity Bento. Updated the contract to validate the current identity-first hero and keep DriftWall scoped to gallery/event/community rails. This prevents a stale design assertion from blocking the intended release.
- **Magnetic motion cost:** MagicBento now coalesces pointer movement to one animation-frame callback, ignores a queued move after pointer-leave, cancels queued work on unmount, and guards the center division against zero-sized cards. This bounds transform updates on high-refresh-rate mice and avoids a late transform after pointer leave.
- **Missing team portraits:** a team record with no portrait mapping previously rendered the official logo through the same `object-fit: cover` rule used for people photographs. It now marks that branch explicitly and uses `object-fit: contain` with a branded neutral background; the photo-integrity contract covers the case. This preserves the official mark instead of cropping it like a portrait.
- **Validation status:** these are source edits and QA-contract changes. They have not been validated by a successful local full-suite execution or a successful GitHub Actions run. The latest available preview remains Vercel-auth-protected for the external browser, and the GitHub Actions failures still return jobs with no steps/logs. Re-check the new branch head's Vercel build and executable CI/browser results before considering the release complete.

## Incremental follow-up — 10 October 2026 (team profile polish)

- **Team card information order:** the front face now presents the portrait, member name, role/position and flip hint in that order. The back face can display an available LinkedIn headline (`linkedinHeadline`, `linkedin_headline`, `headline` or `tagline`) separately from the person's biography; it supports common LinkedIn URL field variants without inventing content.
- **Flip-card regression correction:** the browser test was asserting `aria-expanded` on the card wrapper, which does not own that attribute. It now asserts the expanded state on the actual front button, matching the component's accessible interaction contract.
- **Release QA consistency:** the V64 source contract was corrected where it expected retired hero/photo-wall markup or obsolete implementation strings. The current contract now follows the real Dither Veil hero, current image fallback implementation, event-specific identity styling and front-control ARIA state.
- **Current validation:** 12/12 focused hardening assertions and 10/10 targeted media/team assertions passed against fetched source. The newest GitHub Actions runs are queued; no successful full build/browser run has yet been observed for the current head. The latest available Vercel preview remains protected from the external browser and predates these newest source changes.

## Incremental follow-up — responsive derivative integrity

- **Intrinsic dimensions now drive responsive sources.** The responsive photo component no longer treats a card's HTML/display width as the source image's real pixel width. For eligible archive/hub photos it resolves the intrinsic width from the build-generated `/image-manifest.json` (cached once per page), then emits only matching AVIF/WebP candidates. If the manifest is unavailable, it safely keeps the original source instead of guessing derivative paths.
- **No upscaled width descriptors.** Derivative generation and runtime `srcset` selection now both require candidate widths to be no greater than the source's actual pixel width. This avoids advertising a 480w file when Sharp's `withoutEnlargement` actually produced a smaller image, and prevents requests for derivative sizes that were never generated for small originals.
- **Release checks updated:** V64, photo-integrity and photo-intelligence contracts now cover manifest-backed intrinsic dimensions, managed-folder scoping and truthful `srcset` widths.
- **Build evidence available for the previous source head:** Vercel built commit `4acb8de` successfully, transformed 6,620 modules, generated 1,316 AVIF/WebP derivatives from 480 eligible source files with `skipped=0` and `failed=0`, optimized the official logo from 5,897,819 to 1,685,566 bytes, and generated 47 route shells. This build predates the intrinsic-width correction and does not validate the newest code.
- **Release still blocked:** the newest source-width changes require a fresh Vercel build and executable QA/browser run. GitHub Actions continues to fail before exposing steps/logs; do not treat those failures as passing checks.

## Incremental follow-up — logo payload and manifest eligibility

- **Logo payload:** production post-build now generates a transparent 1600px WebP derivative from the original official PNG. The header, homepage hero/Dither texture, boot screen and media fallbacks prefer the compact derivative in production, with the original PNG retained as the safe fallback. Social-preview metadata and the original asset remain unchanged.
- **Image manifest eligibility:** the build manifest now explicitly marks whether an asset actually receives photo derivatives. Source-archive identity/logo assets remain available as identity marks but are excluded from photo derivative generation, avoiding guessed URLs for assets intentionally not processed.
- **Low-resolution source finding:** the last built manifest contained 482 derivative-managed candidates, including 101 sources narrower than 480px. The previous component could choose 480w/960w/1600w variants before knowing a photo's intrinsic dimensions; many of those variants do not exist for small sources. Runtime selection now waits for manifest width + eligibility and falls back to the original source when a valid derivative is unavailable.
- **Truthful responsive widths:** both generator and runtime now skip candidates wider than the original pixel width, keeping `srcset` width descriptors consistent with actual encoded files.
- **Validation:** 15/15 targeted source assertions passed for the optimized-logo fallback, manifest eligibility, intrinsic widths, low-resolution candidate behavior and QA wiring. This does not replace a fresh production build or browser run.
- **Deployment state:** the V64.5.1 follow-up head `dcf2336` has a READY Vercel preview. Its manifest contains 530 images with 444 derivative-eligible records; the 1311×25 Aakriti strip, 1500×211 Neural Nexus panorama and small 235×200 image are marked ineligible, while their originals remain available. The preview is not the production deployment, and browser interaction remains unverified because the connected GitHub job log blobs are missing.


## Incremental follow-up — image fallback and derivative eligibility

- **React fallback stability:** the previous ResponsivePhoto error handler mutated the image src/alt and parent picture source nodes directly. A later React render could re-apply the original src prop and undo a successful branded fallback. The component now tracks fallback stage in React state, derives active src and alt from that state, removes derivative source elements declaratively while falling back, and resets only when the requested source or contextual fallback changes.
- **Regression test:** the Playwright photo-failure test deliberately fails team portrait requests and the optimized logo request, verifies the original official PNG loads, toggles the theme to force a parent render, and then verifies the fallback stage, accessible label and PNG source remain stable. The test is added to the browser suite; it still needs to execute successfully in CI.
- **Derivative audit of the current READY preview manifest:** the deployed manifest contained 530 image records, of which 480 were marked derivative-eligible by folder path alone. A dimension-aware analysis found 36 of those records were unsuitable for generated photo variants. Examples included /assets/hub-photos/aakriti-01.webp at 1311×25 and /assets/hub-photos/neural-01.webp at 1500×211, plus small archive thumbnails that cannot benefit from 480w+ derivatives. These remain usable as original assets; the fix only prevents wasteful/non-useful derivative generation and incorrect eligibility claims.
- **Shared eligibility rule:** isDerivativeDimensionEligible(width,height) is now shared by the manifest generator and derivative encoder. It requires at least 320×120 source pixels and an aspect ratio between 0.25 and 5. The manifest and generator therefore agree about which files actually receive variants; the browser continues to use the original source when a source is not eligible.
- **Expanded responsive media coverage:** curated /assets/team, /assets/events and /assets/home sources are now eligible for AVIF/WebP variants too. The 23 team portraits, 3 event posters and 6 homepage photos found in the current manifest all pass the dimension rule. The next build is expected to include them; final derivative counts must be taken from that build log rather than inferred.
- **Validation boundary:** 15/15 targeted source-contract assertions passed before the expanded team/event/home derivative coverage was added; the additional source-level contract checks were added afterward. The preceding V64.5.1 preview built 1,158 photo derivatives, skipped 36 unsuitable sources, generated 48 route shells and reported zero media optimization failures. The new coverage requires a fresh build for final derivative counts. GitHub Actions/Browser QA still fail before exposing steps or logs, so the Playwright regression is not confirmed passing. The preview is not production, and the custom domain still requires separate verification.
- **Patch release hygiene:** package.json, both package-lock root version fields, the service-worker cache namespace, README release header and CHANGELOG are synchronized to V64.5.1 on the follow-up branch.

## Next visual QA pass

1. After a fresh preview is available, compare the home hero at 1440, 1024, 768, 390 and 320 CSS pixels in both themes. Confirm the Dither Veil has no black flash, no clipped logo, no hydration shift, and that low-power/reduced-motion fallback is visually equivalent.
2. Inspect a representative sample from every hub and event: square identity mark, portrait photo, landscape event poster, panorama, missing image, broken URL, transparent PNG and low-resolution original. Confirm logos use contain, photos use the intended crop, and no non-photo strip is treated as a full-width photograph.
3. Run the browser image-failure and theme-toggle tests on the built production preview; record natural dimensions, currentSrc, layout shift, and console/network errors rather than relying only on static assertions.
4. Measure mobile LCP/CLS and desktop INP before adding further animation. Keep Dither Veil limited to the logo and magnetic motion limited to the Bento/intentional club-event cards; avoid adding another continuously animated full-page background.
