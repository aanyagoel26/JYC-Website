# JYC Website — Release State — 2026-10-10

## Current source release

- Package release: `64.5.0`
- Current main commit: `11057d73bd4f69984dc76f1a951d62aa18209157`
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

- Latest observed preview deployment: `dpl_8mbMftXJDafezjFMH4LhV224mCAp`.
- State: **READY** for branch `fix/ui-desktop-headline-layout`, source commit `2e12750901c7d4e0fb734e986de1db6ec62bff60`.
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

## Animation and design placement

- **Hero:** Dither Veil only on the official JYC logo, with static fallback.
- **Discovery:** MagicBento on the activity set; pointer motion should remain frame-coalesced and desktop/fine-pointer only.
- **Team:** explicit click/keyboard flip with a visible return-to-photo control.
- **Gallery/event media:** controlled shared-layout transitions and accessible lightbox, not autoplay.
- **Everywhere:** respect reduced motion, preserve keyboard focus and contrast, and avoid adding continuous effects until real-device performance is measured.
