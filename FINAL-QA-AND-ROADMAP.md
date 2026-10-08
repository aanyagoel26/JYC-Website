# JYC Final QA + Roadmap

This is the final implementation checklist for the JYC website. It incorporates the supplied JYC Website Development Specification and the requirements collected during the JYC website planning chats.

## Included
- Public desktop top navigation and mobile bottom navigation.
- Mobile-first layouts, safe-area spacing and light/dark phone themes.
- Translucent global search with keyboard shortcuts and published-content search.
- Guided first-visit onboarding plus a role- and workspace-specific Admin Guide.
- Role-specific admin navigation and club-scoped Club Admin workspaces.
- Events, event details, registration links, native registration, calendar export and sharing.
- Gallery, albums, lightbox and optimized uploads.
- Team, About, Contact, Recruitment, Auditions, My JYC and Notifications.
- Academic Calendar 2026–27 with JYC / Academic / All views and public visibility controls.
- Fest Mode with schedule, live board, updates, results, gallery and archive views.
- Loading, empty, error and recovery states.
- Accessibility focus states and reduced-motion support.
- SEO metadata, JSON-LD, PWA metadata and service-worker cache hygiene.
- Supabase RPC/read hardening, role-aware writes, activity/version/review workflow.
- Vercel SPA fallback and no-cache headers for `index.html` and `sw.js`.

## Explicitly excluded
- `This Week at JYC` / item #25.
- Invented clubs, events, people, statistics or official JYC claims.

## Supplied JIIT Academic Calendar coverage
The academic calendar supplied for this project is used as the source for the integrated academic view. It includes registration/reporting, commencement, test/exam periods, project milestones, semester breaks, results, vacations, holidays, JYC Function, and the summer-semester schedule.

## Final manual production checks
1. Open the deployed Vercel URL in a fresh/private browser window.
2. Test Home, About, Clubs, Events, Event Details, Gallery, Team and Contact.
3. Test mobile widths around 320, 360, 390 and 430 px.
4. Confirm the public bottom navigation is absent on desktop and pinned to the viewport bottom on phones.
5. Open Search with the button, `Ctrl/Cmd + K`, and `/`; test results and Escape.
6. Toggle light/dark mode and inspect navigation, cards, forms, calendar and overlays.
7. Test the first-visit guide and `More → Site guide`.
8. Test every admin role with a real test account and confirm the visible navigation matches its role.
9. For Club Admin, confirm only the assigned club's content is editable.
10. Open Calendar and test JYC / Academic / All and the admin visibility switches.
11. Open DevTools Console after a hard refresh and verify there are no React rendering errors.
12. If `PGRST202` or a 404 for `jyc_read_site_data` appears, run `supabase/FINAL-PRODUCTION-REPAIR.sql` in the connected Supabase project, then refresh.
13. Test direct navigation to `/clubs/...`, `/events/...`, `/calendar`, `/admin` and refresh each route.
14. Test Vercel production after deployment, not only localhost.

## Reference rule
The JYC PDF defines required structure, functionality, approved theme variables and QA expectations. Its reference images are colour/theme inspiration, not a layout to copy. The final UI therefore keeps the JYC phoenix/orbit identity while using its own layout.


> **Current release boundary:** The production public release intentionally does not expose the historical `/admin`, `/login`, `/my-jyc`, `/notifications`, or other retired student-platform routes. They resolve to safe public destinations. The backend/admin implementation remains repository infrastructure but is not part of the public-release acceptance gate unless a future release explicitly re-enables it.
