# JYC Website — Release State — 2026-10-07

## Verified on main

- Main commit: `d5406ecd9aefeecb93cf66b0798b0dcc58f5ae41`
- Quality Gate: PASS
- CI: PASS
- CodeQL: PASS
- Browser QA: PASS (156 tests; GitHub Actions runner)
- Open pull requests: 0
- Production project: READY on Vercel
- Production HTTP: 200
- Production security headers: present (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, nosniff)
- JIIT 128 scope and public-route contracts: PASS

## Current release blocker

The Vercel project is still serving an older production deployment. A deployment of the current main commit was attempted and Vercel rejected it with `api-deployments-free-per-day` (Hobby limit: 100 deployments per 86400 seconds). The current deployment window must clear before the final main commit can be promoted.

The current Vercel production project must therefore **not** be described as running the final main SHA yet.

## Security alert disposition

The latest CodeQL workflow is green. The GitHub Security UI screenshot supplied on 2026-10-07 showed 142 open code-scanning alerts; the connected repository tooling does not expose the authenticated alert list, so those UI alerts cannot be individually closed from this connection. A fresh Security > Code scanning review is required to distinguish stale findings/configurations from findings that still need remediation or documented dismissal.

## Final production gate

After the Vercel deployment window clears:

1. Deploy commit `d5406ecd9aefeecb93cf66b0798b0dcc58f5ae41`.
2. Verify the deployment is READY and the production alias points to it.
3. Re-run production HTTP/security/header smoke checks.
4. Smoke-test every public route and representative event/club/gallery detail route.
5. Confirm media, canonical URLs, JSON-LD, theme, mobile dock, search and contact behavior.
6. Re-check the GitHub Security UI and resolve/dismiss every remaining CodeQL alert with evidence.
7. Only then declare 100% release-ready.
