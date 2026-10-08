# JYC Final QA + Roadmap

This is the final implementation checklist for the JYC website. It incorporates the supplied JYC Website Development Specification and the requirements collected during the JYC website planning chats.

## Current release scope
- Public homepage, Clubs, Events, Event Details, Gallery, Team, About, Contact, Recruitment/Auditions where currently routed, Search, and the current editorial/JYC Now surfaces.
- Mobile-first responsive layouts, safe-area spacing, keyboard navigation, focus states and reduced-motion support.
- SEO metadata, JSON-LD, sitemap/robots, PWA metadata and service-worker cache hygiene.
- Supabase read/RPC hardening used by the current public experience.
- Production image manifests/derivatives, lazy loading, media integrity and performance budgets.
- Current release QA suite, browser smoke tests, accessibility, security, dependency-lock and zero-glitch contracts.
- Historical admin/student-platform code remains in the repository as infrastructure/reference, but is not exposed by the current public release.

## Explicitly excluded
- `This Week at JYC` / item #25.
- Invented clubs, events, people, statistics or official JYC claims.

## Supplied JIIT Academic Calendar coverage
The academic calendar supplied for this project is used as the source for the integrated academic view. It includes registration/reporting, commencement, test/exam periods, project milestones, semester breaks, results, vacations, holidays, JYC Function, and the summer-semester schedule.

## Final manual production checks
1. Open the real production domain in a fresh/private browser window after the release is deployed.
2. Test Home, Clubs, Events, Event Details, Gallery, Team/About and Contact on desktop.
3. Repeat the same route set at approximately 320, 360, 390 and 430 px widths.
4. Confirm the mobile navigation and fixed controls do not overlap content or block keyboard focus.
5. Open Search with its visible control and keyboard shortcut; test results, Escape and empty/no-match states.
6. Toggle the available theme state and inspect navigation, cards, forms, calendar/content surfaces and overlays.
7. Hard-refresh key direct routes and confirm no React/runtime errors, broken images, horizontal overflow or accidental overlays.
8. Exercise loading, empty, error and recovery states where public data is available; confirm bounded requests do not hang the page.
9. Verify image settlement and lazy-loading behavior on image-heavy routes, especially Gallery.
10. Verify reduced-motion and keyboard navigation behavior.
11. Verify the canonical production origin, sitemap/robots/canonical metadata and service-worker update/offline behavior.
12. If a backend migration/error is actually observed, apply the documented Supabase repair procedure only after confirming the failure; do not treat historical admin flows as current public acceptance criteria.
13. Confirm the final CI, Browser QA, CodeQL and Quality Gate runs are green for the exact release commit.
14. Record any remaining Vercel infrastructure/build-rate-limit blocker separately from application-code failures.

## Reference rule
The JYC PDF defines required structure, functionality, approved theme variables and QA expectations. Its reference images are colour/theme inspiration, not a layout to copy. The final UI therefore keeps the JYC phoenix/orbit identity while using its own layout.


> **Current release boundary:** The production public release intentionally does not expose the historical `/admin`, `/login`, `/my-jyc`, `/notifications`, or other retired student-platform routes. They resolve to safe public destinations. The backend/admin implementation remains repository infrastructure but is not part of the public-release acceptance gate unless a future release explicitly re-enables it.
