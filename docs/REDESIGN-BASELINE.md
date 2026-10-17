# JYC redesign baseline

Audit timestamp: 2026-10-17 UTC  
Repository: https://github.com/kaustubhdua/JYC-Website  
Starting candidate SHA: `483a95b0e6030edcfd2049d2453ca8126ea405b5`  
Starting branch: `fix/gallery-neutral-photo-fallbacks`  
PR: #261 (open, draft, not merged)  
Base SHA recorded by PR: `1da5867a4f4920f4854810efd275d59bf44c344d`

## State verified from repository and CI
- Candidate preview deployment: READY at https://jyc-website-mdk271ooc-jyc-website.vercel.app for the exact starting SHA above.
- Production deployment: READY at https://jyc-website-icbitp32r-jyc-website.vercel.app, deployed SHA `55bef8b7a6ec6a2647eb3dc892371a7b54507065`; this is not the candidate SHA.
- Candidate CodeQL: passed.
- Candidate JYC Browser QA: failed (81 passed, 2 failed, 4 skipped); both failures are neutral gallery fallback assertions on mobile 360 and 390.
- Candidate Lighthouse CI: failed with `label-content-name-mismatch` accessibility audit on all configured routes.
- Candidate Quality Gate: failed, including a stale sparse-faculty/mobile assistant source contract.
- Candidate JYC CI: failed, including the same stale sparse-faculty/mobile assistant contract.
- Derivative generation in those CI runs: 4,172 generated, 36 skipped, 0 failed; production media optimization: 1 optimized, 2,661 skipped, 0 failed.
- PR description records unresolved issue #251: gallery rights/focal review, approved visual baselines, and production/domain verification. Production data/DNS/security settings were not changed.

## Application architecture notes
- React + Vite, React Router and Supabase integrations.
- Existing motion stack includes `motion/react`, custom OGL/React Bits components, Dither Veil, Magic Bento, Depth Carousel and DriftWall.
- CSS is imported from `src/styles/public-entry.css` and several existing layered stylesheets; `src/main.jsx` imports public entry, experience system, reference restoration and innovation-inspired 3D CSS.
- Build scripts generate sitemap, image manifest, photo derivatives, production media optimization and route shells.
- Existing package scripts include `build`, `qa`, `qa:browser`, `qa:responsive`, `qa:security`, `qa:seo`, `qa:performance` and numerous targeted source/browser contracts. See `package.json`.

## Browser evidence boundary
GitHub Actions ran Playwright against its own Vite server and produced screenshots/traces on failure. Those are real browser test results, but no independent manual screenshot review is claimed in this baseline. The current preview URL exists and is READY; visual route-by-route review remains unverified until screenshots are rendered and inspected.
