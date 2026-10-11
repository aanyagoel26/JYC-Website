# JYC UI/UX, Media & Release Audit — 11 October 2026

## Executive status

The V64.5.9 branch contains the identity-first homepage, React Bits Dither Veil using the official JYC logo, magnetic Bento interactions, team profile flip cards, themed search/More surfaces, responsive photo delivery, curated gallery/event/club identities, and a strict image-manifest pipeline. This audit adds a terminal image-failure state and refreshes the JAI registration deadline from the stale 10 October value to 15 October 2026, 23:59 IST.

**This is not a production sign-off.** The latest READY Vercel preview located during this pass is [jyc-website-5no2h8gpi](https://jyc-website-5no2h8gpi-jyc-website.vercel.app), commit `78755d0`, still V64.5.8—not the current V64.5.9 head. GitHub Actions jobs for the current branch are failing before producing executable steps/logs, so no full build or Playwright pass can be claimed.

## Work completed in this follow-up

### Photo integrity
- Empty and whitespace-only source/fallback values are normalized to a local JYC mark before an `img` is rendered, avoiding accidental requests for the current document.
- Responsive AVIF/WebP candidates are only emitted when the runtime manifest validates the source dimensions and marks the record eligible.
- Existing fallback order remains source photo → contextual club/event mark → optimized official JYC logo → original official JYC PNG.
- If every candidate fails, the responsive picture now keeps a visible branded placeholder with a descriptive accessible name instead of hiding the image and leaving a silent blank frame.
- Added source-contract assertions for normalized fallback URLs, placeholder markup/CSS and the release contract; added a Playwright test that intercepts image requests and checks the final accessible placeholder.
- Rotated the service-worker cache namespace to `jyc-cache-v64-5-8` and synchronized package.json, package-lock.json, README and changelog.

### Event source correction
- Current JYC-128 LinkedIn content advertises JAI 2026 for 30–31 October 2026, with four thematic tracks and the flagship hackathon.
- The official JAI website displays the 30–31 October dates, ₹15 lakh hackathon prize pool and ₹1 crore pre-seed pool.
- The Unstop listing gives a registration deadline of 15 October 2026, 11:59 PM IST. A prior migration had set 10 October; the new migration corrects this while preserving the authenticated editorial approval gate.
- Innovation JIIT's official site and LinkedIn remain inconsistent about RIDE HACK 26 registration status: LinkedIn states an application close date of 5 October while the site still shows “Registrations are NOW OPEN.” Do not display an unqualified open/closed state until the organizer confirms.
- The JIIT Youth Club LinkedIn company page describes Sector 62; the separate JYC-128 profile is the correct source for the Wish Town/Sector-128 site. Likewise, JODC identifies itself as the JIIT-128 open-source society, while the separately named OSDC profile is associated with Sector 62. Do not mix their people, photos, events or claims.

## Visual system and animation placement

| Surface | Keep / use | Guardrails |
| --- | --- | --- |
| Home hero | Left-aligned JYC headline and clear actions; right-side official mark with Dither Veil | Keep the static official-logo fallback; disable WebGL on reduced motion, coarse pointers and constrained devices; do not animate the whole headline and logo independently at the same time. |
| Club/event discovery | Magic Bento spotlight and restrained magnetic tilt on desktop cards | Fine-pointer only; reset offsets on pointer leave; use requestAnimationFrame; no magnetism on touch; keep click targets and text stable. |
| Team | Click/keyboard flip for portrait → biography and verified public links | Keep the inactive face inert/hidden, preserve focus, constrain back-face text scrolling and disable flip transitions for reduced motion. |
| Gallery | Shared-layout card-to-lightbox transition | Use reduced-motion-aware duration, lazy-load noncritical photos, preserve keyboard arrows/Escape/focus return and visible collection navigation. |
| Club/event detail | Domain-specific identity accent, contained logo/poster, shared media layout | Prefer each club's own logo and each event's own poster; never replace a missing photo with an unrelated event image. |
| Search and More | Themed surfaces and high-contrast focus states | Check both themes, keyboard escape/return focus, short-screen overflow and safe-area insets. |
| Loading/route transitions | Existing compact branded boot state and restrained route transitions | Keep perceived wait short; don't block on the GLB or gallery image set; never add decorative loaders that delay navigation. |

Avoid adding more animation libraries or a second 3D framework. Motion/GSAP/OGL/React Bits already cover the necessary interactions; additional dependencies would increase bundle and maintenance cost without fixing the remaining release blockers.

## Next actions, ordered by impact

1. **Exact-head verification:** obtain a fresh successful `npm ci`, production build, photo-integrity QA, source QA, Playwright suite and CodeQL run on V64.5.9. Preserve logs and Playwright artifacts. Current Actions results are not usable because jobs expose no steps/logs.
2. **Preview verification:** deploy the exact reviewed head to a READY Vercel preview; confirm the manifest, original images, AVIF/WebP derivatives, GLB, static route shells, canonical tags and JAI page before approving.
3. **Visual matrix:** test 320, 360, 390, 430, 768, 1024, 1280 and 1440+ widths; light/dark; reduced motion; keyboard only; slow image loading; failed image and manifest; coarse pointer and WebGL unavailable. Capture screenshots and inspect actual crops, not only overflow.
4. **Media audit:** inspect every source archive record, team portrait, club logo, event poster and gallery item for file readability, aspect ratio, descriptive alt text, ownership/attribution and correct association. Preserve the photo-vs-logo-vs-banner classification.
5. **Content trust:** verify every published event and club record against a campus-specific official profile or website. Keep RIDE HACK status flagged until resolved. Do not publish private team bios or infer LinkedIn profile identity from a name alone.
6. **Production operations:** verify Supabase configuration for `/api/jyc-updates`, confirm domain ownership and correct Vercel DNS/aliases with the authorized owner, and re-check CSP/headers/redirects on the deployed domain.
7. **Performance:** measure LCP/CLS/INP on mobile; preserve intrinsic dimensions; keep hero/logo eager only when above the fold; lazy-load archive, below-fold gallery and team media; cap image decode/animation work on constrained devices.
8. **Release hygiene:** keep README/changelog/package-lock/service-worker cache aligned; do not merge or call the site production-ready until the exact head passes and production routing is verified.

## Source references checked

- JYC-128 LinkedIn profile: https://in.linkedin.com/in/jyc128
- Official JAI 2026 site: https://www.jiityouthclub128.in/
- JAI 2026 Unstop listing: https://unstop.com/hackathons/jai-2026-hackathon-jaypee-agentic-ai-hackathon-2026-jaypee-institute-of-information-technology-jiit-noida-1763378/
- Innovation JIIT LinkedIn: https://in.linkedin.com/company/innovation-jiit/
- Innovation JIIT website: https://www.innovationjiit.in/
- JODC LinkedIn (Sector 128): https://in.linkedin.com/company/jodc/
- OSDC LinkedIn (separate Sector 62 identity): https://in.linkedin.com/company/os-dc
- CICR LinkedIn: https://in.linkedin.com/company/cicrjiit128/
- Dronotics LinkedIn: https://www.linkedin.com/company/dronotics-jiit-128/
- React Bits: https://reactbits.dev/

## Final release boundary

Source-level checks are useful, but they are not equivalent to a build, browser run or verified deployment. This branch remains draft until current-head CI logs are available, the V64.5.9 preview is tested, the new SQL migration is reviewed/applied by the authorized Supabase owner, and the production domain/API are confirmed.
