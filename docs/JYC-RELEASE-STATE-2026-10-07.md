# JYC Website — Release State — 2026-10-10

## Current source release

- Package release: `64.5.0`
- Working branch: `fix/ui-desktop-headline-layout`
- Pull request: [#193 — identity-first UI, photo QA and GLB assistant fixes](https://github.com/kaustubhdua/JYC-Website/pull/193)
- The PR remains open and unmerged.
- Package version, lockfile version and service-worker cache namespace are synchronized.

## Work completed in the current source pass

- Replaced the continuously animated homepage photo wall with a lazy React Bits Dither Veil treatment of the actual JYC logo, with a static fallback for mobile, reduced motion, constrained hardware and WebGL/image failures.
- Added a lazy magnetic MagicBento activity surface. Tilt and magnetism share one tween, reset on pointer leave, route through React Router, and disable on coarse pointers/reduced-motion preferences.
- Preserved separate visual identities for clubs and events; event cards use event-specific deterministic accents.
- Prevented club logos from being cropped and displayed as event photography when no suitable club photograph is available.
- Improved team profile flips, biography field fallbacks, safe public social links, scrollable long bios and the persistent return-to-photo control.
- Enriched CICR, Innovation JIIT and JODC profiles using supplied hub material and current official public sources.
- Expanded browser photo checks to homepage, About, clubs, events, team, gallery, achievements and Best of JYC.
- Updated README, changelog, QA contracts and this release-state record.

## Verification status — do not overstate

- Targeted source-contract checks were run during implementation. They do **not** prove the whole application builds or that the browser suite passes.
- The latest GitHub Actions runs for CI, Quality Gate, CodeQL and Browser QA fail before usable job steps/logs are returned by the connected runner interface. There is no verified green run for the current head.
- The new Playwright tests have not been executed successfully against the current branch.
- No fresh successful Vercel build/deployment has been confirmed for the current branch. Previous deployment attempts hit Vercel's `api-deployments-free-per-day` limit.
- Vercel domain verification last showed `jiityouthclub128.in` and `www.jiityouthclub128.in` unverified, while the `jyc-website-eight.vercel.app` domain was verified. The custom-domain routing mismatch remains unresolved.
- Do not merge this PR or declare production-ready until a fresh build and browser suite pass, Actions are green, the intended Vercel deployment is READY, and the production aliases resolve to that deployment.

## Required final release gate

1. Run `npm ci`, `npm run qa`, `npm run qa:seo`, `npm run qa:v64-editorial`, `npm run qa:photo-intelligence` and `npm run build` on the current PR head.
2. Install Chromium and run `npm run qa:browser` against the built production preview.
3. Inspect the Playwright report for Dither Veil fallback, photo integrity, theme parity, team flips, gallery lightbox, search/More and mobile overflow.
4. Re-run dependency/security gates and inspect any current GitHub Security alerts in the authenticated UI.
5. After Vercel rate limits clear, deploy the reviewed commit and verify deployment ID, production alias, redirects, headers, canonical URLs, JSON-LD, assets and every public route.
6. Correct domain DNS/verification only with confirmed ownership and explicit authorization.
7. Update this file only after evidence confirms each gate; keep the PR unmerged until then.
