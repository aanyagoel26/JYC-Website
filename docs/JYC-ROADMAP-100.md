# JYC Website — 100% Completion Roadmap

Updated: 2026-10-07

This is the execution ledger for taking the JIIT Youth Club 128 website from the current codebase to a release-ready state. Items marked **DONE** are implemented in the repository; **BLOCKED/MANUAL** items require a GitHub/Vercel/Supabase account action that the code connector cannot perform.

## A. Product and UX

- [x] Editorial JYC visual system with light/dark themes
- [x] Responsive navigation and mobile dock
- [x] Global search keyboard entry and Escape behavior
- [x] Homepage rebuild with real source media
- [x] Public route map and legacy redirects
- [x] JIIT 128 event/social scope contracts
- [ ] Finish route-by-route visual polish on every public page after browser QA evidence
- [ ] Verify every real image has stable dimensions, useful alt text, fallback and correct loading priority
- [ ] Verify every event/club/gallery CTA lands on a canonical leaf route

## B. Security

- [x] CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy and nosniff headers
- [x] Browser secret-pattern QA
- [x] Supabase publishable-key browser contract
- [x] Service-role separation contract
- [x] External JYC Now URL validation
- [x] Server-side remote update URL validation
- [x] Security policy strengthened
- [x] Dependabot configuration for npm
- [x] Dependabot configuration for GitHub Actions
- [x] CodeQL workflow modernized to current v4 actions
- [x] CodeQL scans JavaScript/TypeScript and GitHub Actions
- [x] Dependency Review workflow for pull requests
- [ ] **MANUAL:** enable Dependabot alerts in GitHub Advanced Security
- [ ] **MANUAL:** enable Private vulnerability reporting
- [ ] **MANUAL:** enable Secret scanning / Push protection where GitHub plan/settings expose it
- [ ] **MANUAL:** inspect the 17 existing CodeQL findings individually; fix real findings, dismiss only documented false positives/test-only findings
- [ ] **MANUAL:** remove/disable stale duplicate CodeQL configurations if GitHub reports multiple active origins
- [ ] **MANUAL:** add merge protection requiring the security/quality checks once the checks have a stable green run

## C. Dependencies and supply chain

- [x] npm lockfile/reproducible npm ci workflow
- [x] npm audit high-severity gate
- [x] Dependabot weekly npm updates
- [x] Dependabot weekly GitHub Actions updates
- [x] Dependency Review on PRs
- [ ] Review first Dependabot PR batch and merge safe updates
- [ ] Keep action versions current through Dependabot rather than hand-pinning old versions
- [ ] Re-run audit after each dependency update batch

## D. Data and Supabase

- [x] Public data fallback and timeout behavior
- [x] JIIT 128 public filtering
- [x] Browser service-role exclusion checks
- [x] RLS/security contracts in repository QA
- [ ] Run the live Supabase security advisor and remediate every high/critical finding
- [ ] Verify every exposed table has intentional RLS and no accidental public write policy
- [ ] Verify storage policies and upload MIME/size limits in production
- [ ] Verify admin, JYC admin and club-admin authorization boundaries with real accounts
- [ ] Verify event registration RPC cannot be abused to alter another user's registration

## E. SEO and content trust

- [x] Organization/WebSite JSON-LD
- [x] Event/Club/Breadcrumb/Collection structured data
- [x] Canonical metadata and social previews
- [x] Sitemap generation
- [x] JIIT 128 scope QA
- [ ] Validate representative pages in Google Rich Results / Search Console after production deployment
- [ ] Verify no accidental noindex on public routes
- [ ] Verify every event page has accurate date, end time and venue before publication
- [ ] Verify official club/social links against current sources

## F. Performance and media

- [x] Lazy loading for non-critical media
- [x] Hero image priority
- [x] Media fallback architecture
- [x] Performance budget script
- [x] React Bits lazy loading where heavy
- [ ] Measure production Core Web Vitals after deployment
- [ ] Check LCP hero media and largest JS chunks on real mobile
- [ ] Convert remaining heavy source images to responsive WebP/AVIF where safe
- [ ] Verify no layout shift from images, fonts or dynamic cards

## G. PWA and resilience

- [x] Web app manifest
- [x] Versioned service-worker cache
- [x] Development cache cleanup
- [x] Same-origin/API cache safety contracts
- [ ] Verify installability in Chrome/Android
- [ ] Verify offline shell and online recovery
- [ ] Verify service-worker update behavior after a release
- [ ] Confirm dynamic Supabase content is not falsely presented as offline-complete

## H. Automated QA

- [x] Production build gate
- [x] Static release QA
- [x] Security QA
- [x] SEO QA
- [x] media/photo integrity QA
- [x] JIIT 128 events/social scope QA
- [x] responsive viewport browser matrix in Playwright
- [x] global search keyboard smoke test
- [x] browser-QA GitHub workflow
- [ ] Wait for a real GitHub Actions run and fix every failing check
- [ ] Download Playwright artifacts if browser failures occur
- [ ] Keep the sandbox browser limitation separate from CI evidence

## I. Manual browser release QA

Test every route at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920px:

- [ ] Home
- [ ] About
- [ ] Clubs
- [ ] Club detail
- [ ] Events
- [ ] Event detail
- [ ] Gallery
- [ ] Team
- [ ] History
- [ ] Achievements
- [ ] Calendar
- [ ] Updates/JYC Now
- [ ] Archive
- [ ] Contact
- [ ] 404

For each route verify:

- [ ] light and dark
- [ ] keyboard focus
- [ ] touch targets
- [ ] Escape and focus restoration
- [ ] reduced motion
- [ ] 400% zoom/reflow
- [ ] no horizontal overflow
- [ ] no overlapping/floating controls
- [ ] image failure/fallback
- [ ] empty/error/loading state
- [ ] no console errors
- [ ] no dead links
- [ ] no incorrect JIIT 62 content

## J. Release

- [ ] GitHub main contains the final source
- [ ] all GitHub Actions checks green
- [ ] CodeQL open findings = 0, or every remaining finding has a documented justified disposition
- [ ] Dependabot alerts = 0 high/critical
- [ ] Supabase security advisor = 0 high/critical
- [ ] Vercel production deployment succeeds
- [ ] latest main commit is the deployed production commit
- [ ] production HTTP/security headers verified
- [ ] all public routes smoke-tested on production
- [ ] production media/link/content check complete
- [ ] release notes updated
- [ ] only then declare the site 100% release-ready

## Current blockers

1. GitHub Advanced Security account settings are not writable through the connected repository file API, so the manual toggles above must be done in GitHub Settings.
2. The screenshot reports 17 CodeQL findings, but the connected GitHub file API does not expose the alert list. They must be opened in Security and quality > Code scanning so each finding can be mapped to a source line and remediated or justified.
3. Vercel previously hit the deployment-rate limit; do not repeatedly retry deployments until the limit clears.
4. The local sandbox Chromium launch has been unreliable; GitHub Actions is the authoritative browser-QA environment once its workflow completes.

## Definition of done

The website is 100% done only when sections A–J are either implemented and green, or a manual/account-level item has an explicit verified disposition. No “looks fine” release is allowed with open high/critical security findings, unknown production deployment state, broken media, wrong campus scope, or unverified browser behavior.
