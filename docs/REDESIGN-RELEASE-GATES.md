# JYC redesign release gates

Status as of 2026-10-17 UTC: **NOT READY**.

| Gate | Status | Evidence / requirement |
|---|---|---|
| Exact branch/SHA/PR baseline recorded | PASS | `483a95b0e6030edcfd2049d2453ca8126ea405b5`, PR #261 open/draft |
| Exact candidate preview deployed | PASS | READY deployment `jyc-website-mdk271ooc-jyc-website.vercel.app`, candidate SHA matches |
| Production serves candidate/merged SHA | BLOCKED | Production SHA is `55bef8b7a6ec6a2647eb3dc892371a7b54507065`; candidate is not merged |
| CodeQL on candidate | PASS | Run 38989318555 |
| Browser QA on candidate | FAIL | Run 38989318581; 81 passed, 2 failed, 4 skipped |
| Lighthouse CI on candidate | FAIL | Run 38989318501; `label-content-name-mismatch` |
| Quality Gate on candidate | FAIL | Run 38989318521; stale sparse-faculty/mobile assistant contract |
| JYC CI on candidate | FAIL | Run 38989318512; same source-contract failure |
| Full route inventory from router/sitemap/links | BLOCKED / IN PROGRESS | Not yet exhaustively derived and reconciled |
| Real-browser screenshots inspected route by route | BLOCKED | Playwright artifacts exist; manual visual review not yet completed |
| WebGL enabled/fallback and reduced motion visually verified | BLOCKED | Source contracts exist; independent rendered evidence pending |
| Content and event states verified | IN PROGRESS | JAI deadline updated to 15 Oct 2026 23:59 IST; continue reviewing all content |
| Gallery rights/consent/focal points | BLOCKED | Issue #251: 31 albums unpublished, 52 items rights review + missing focal coordinates |
| Production domain verification | BLOCKED | Custom domains require owner-managed TXT verification |
| Production Supabase/auth/security review | BLOCKED | Existing findings require owner/security review; no changes authorized |
| WCAG 2.2 AA manual keyboard/screen-reader review | BLOCKED | Automated audits failing; manual review not complete |
| Performance, SEO, security, media integrity | IN PROGRESS | Derivative pipeline succeeded; full candidate suite not green |
| Final merge/release | BLOCKED | Do not merge/deploy until CI failures and external approval gates are resolved |

## Release policy
A blocked or uninspected gate is never marked passed. Do not merge or change production configuration/data until the exact candidate checks pass and human rights/visual/domain gates have been resolved. The exact deployed SHA must be verified after any authorized release.
