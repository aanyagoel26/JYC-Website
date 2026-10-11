# JYC Website — Release State — 2026-10-11

## Current source release

- Package release: `64.5.7`
- Current main commit: `ab3764ba19d3539b1428cb64956ef2cec01dfcfd`
- Active media/photo reliability PR: [#196 — prevent guessed variants and unify photo fallbacks](https://github.com/kaustubhdua/JYC-Website/pull/196), branch `fix/media-fallback-state-rerender` (draft). The branch now contains current `main`; the GitHub API confirms it is mergeable, but release checks are still red/unusable.
- UI/media work: merged by pull request [#193 — identity-first UI, photo QA and GLB assistant fixes](https://github.com/kaustubhdua/JYC-Website/pull/193).
- The source changes are merged into `main`; do not describe PR #193 as open.
- Package version, lockfile version and service-worker cache namespace are synchronized.

## Implemented in the source release

- The homepage uses the official JYC logo with a lazy React Bits Dither Veil treatment and a static, branded fallback for reduced motion, coarse pointers, constrained hardware, WebGL failure and image failure.
- A lazy MagicBento activity discovery surface adds restrained magnetic/tilt interaction, pointer-leave reset and router-based navigation.
- Team cards show portrait, name and position on the front, and available biography/headline plus safely resolved public social links on the back. Missing biographies and profile URLs are not fabricated.
- Club and event cards retain separate identities. Club logos are contained as marks rather than cropped as photos, and event media uses event-appropriate fallbacks.
- Responsive media delivery uses the generated image manifest and truthful AVIF/WebP derivative widths; non-critical images lazy-load and reserve layout space.
- All Hubs material and checked public sources inform the club/about content. Historical content remains distinct from current operational claims.
- Static and Playwright contracts cover routes, theme contrast, reduced motion, team flips, image failures, photo integrity, responsive layout and other release requirements.

## Verification evidence available now

### Vercel preview build

- Latest observed READY preview deployment: `dpl_5619EWGbre1L2BLqjsTEcZJGUDmY` (`https://jyc-website-lf9fd8ii6-jyc-website.vercel.app`), branch `fix/media-and-photo-qa-hardening`, source commit `fbedaefc679efc2ab8f1f142debd076ff1647be8`.
- This preview is **not** the current PR head (`fix/media-fallback-state-rerender`); it is useful for baseline endpoint checks only and does not validate the latest changes.
- The deployment log confirms the Vite build completed, production media optimization reported `optimized=1 skipped=1115 failed=0`, and 48 route-specific HTML shells were generated.
- The preview deployment has only its branch-specific Vercel alias. It is **not** a production-target deployment and does not prove the custom domain is serving this release.
- The source commit is part of the merged UI/media change; nevertheless, a production deployment and production-domain smoke test remain separate release gates.

### GitHub Actions

- CI, Quality Gate, CodeQL and Browser QA were re-run for the latest observed source commit.
- These runs still conclude **failure** and the connected GitHub run/job API returns no usable step list or logs. Therefore there is no verified green CI, CodeQL or Playwright result for this source pass.
- The failures are not evidence of a specific application-code defect while the job steps/logs remain unavailable. They are also not passing results. A runner execution with retained logs is required.

## Production and account-level blockers

- Vercel project `jyc-website` currently reports `live: false`.
- `jyc-website-eight.vercel.app` is verified as a project domain.
- `jiityouthclub128.in` and `www.jiityouthclub128.in` are both unverified and still require the Vercel TXT verification records shown in project-domain settings. Do not edit DNS without confirming domain ownership and the correct DNS provider.
- The preview is protected by Vercel SSO, so an unauthenticated browser run cannot complete visual verification against it.
- The connected repository tools do not expose an authenticated, actionable list of individual GitHub code-scanning alerts. Any open alerts must be reviewed in GitHub Security and fixed or dismissed with evidence; they must not be marked resolved by assumption.
- Production Supabase and third-party secrets/auth settings require their own authenticated operational verification. Repository contracts alone do not prove the live settings.

## Required final release gates

1. Obtain a usable GitHub Actions execution and retain the complete logs for `npm ci`, full `npm run qa`, SEO/editorial/media checks, `npm run build`, performance budget and CodeQL.
2. Run the complete Playwright suite against the built artifact; inspect the report for all public routes, image failure/decode, Dither Veil fallback, light/dark contrast, team flips, gallery lightbox, search/More, reduced motion and overflow at mobile/tablet/desktop sizes.
3. Use an authenticated browser or an appropriately accessible preview to inspect the actual visual result; do not infer visual correctness from source contracts alone.
4. Verify the current main SHA is deployed to the intended Vercel production target, and confirm production aliases, redirects, security headers, canonical URLs, JSON-LD, images and representative detail routes.
5. Verify custom-domain ownership and DNS/TXT records with the domain owner before changing records. Confirm both apex and `www` routing after verification.
6. Review each active CodeQL/dependency/security alert in GitHub Security and document remediation or a justified dismissal. Verify Dependency Graph/Dependabot settings in the authenticated repository UI.
7. Verify production Supabase RLS/storage/auth boundaries and required Edge Function secrets in the Supabase dashboard.
8. Capture production Core Web Vitals (LCP, INP and CLS) on representative desktop and mid-range mobile hardware after the correct production release is live.
9. Update this state record only when the corresponding evidence is available. Do not call the site 100% production-ready while any P0 gate above is blocked.

## Additional visual reference used — Innovation JIIT

The companion audit `docs/JYC-UIUX-MEDIA-DEEP-AUDIT-2026-10-10.md` now documents a reference review of `Omtripathi007/Innovationjiit.in` and the publicly indexed Innovation JIIT site. Patterns selected for JYC are editorial photography, asymmetric featured-story hierarchy, rich event detail structure, clear cross-navigation among clubs/events/gallery/team, warm editorial typography, and deliberate mobile navigation. These principles are being adapted to JYC's existing champagne/beige and ivory/navy identity; reference code, assets, palette and unverified content are not copied. The supplied `share.google` link did not resolve to an identifiable destination during this pass, so no claims are attributed to it.

## Animation and design placement

- **Hero:** Dither Veil only on the official JYC logo, with static fallback.
- **Discovery:** MagicBento on the activity set; pointer motion should remain frame-coalesced and desktop/fine-pointer only.
- **Team:** explicit click/keyboard flip with a visible return-to-photo control.
- **Gallery/event media:** controlled shared-layout transitions and accessible lightbox, not autoplay.
- **Everywhere:** respect reduced motion, preserve keyboard focus and contrast, and avoid adding continuous effects until real-device performance is measured.

## V64.5.7 follow-up — 11 October 2026

- Normalized empty and whitespace-only `ResponsivePhoto` sources to a local branded fallback before rendering. This avoids the browser interpreting an empty image URL as a request for the current document.
- Added browser coverage that rejects empty `src` values on shared responsive-image elements, and updated source contracts to match the normalized-source state model.
- Synchronized package and lockfile versions at V64.5.7, documented the 64.5.6 and 64.5.7 changes, and rotated the service-worker cache namespace to `jyc-cache-v64-5-7`. Photo-integrity and photo-intelligence contracts now expect the same namespace.
- Targeted source-contract verification: 18/18 checks passed for version/cache synchronization, normalized image fallback, manifest schema validation, service-worker caching and browser regression wiring. A separate 18/18 design contract pass verified the Dither Veil hero/fallback, deferred magnetic Bento, accessible team flip, gallery transitions, club/event identity styling, All Hubs content wiring and campus-gated social profile policy. These are source-level assertions, not executed build or browser behavior tests.
- GitHub Actions for the exact updated head still conclude failure before usable job steps or logs are returned. No full build or Playwright run is claimed.
- A fresh Vercel preview deployment request for the exact head was blocked by the `api-deployments-free-per-day` limit (HTTP 402; retry after 24 hours). The latest READY preview predates the current PR head.
- Custom production domains and `/api/jyc-updates` credentials remain independent release gates. Do not change DNS without verified domain ownership, and do not merge or label the release production-ready until exact-head build/browser evidence is available.
