# JYC V56.8 — Final Production Checklist

Updated: 2026-10-05

## Release boundary

- Package and lockfile: V56.8.0
- Public product: JIIT Youth Club 128
- Scope: official organisational website, not a student utility portal
- Deployment target: connected Vercel production project
- Backend: Supabase project `ogbanmjokjlxfuktkicj`

## Completed in repository

- Source archive inventory preserved: 873 files / 813 unique image hashes.
- Source-media taxonomy distinguishes photography from artwork, logos, banners, layouts and illustrations.
- Source gallery merge is URL-deduplicated.
- Club and event source media is uncapped by arbitrary display slices.
- Source-only communities remain provenance-labelled instead of being silently promoted.
- Public routes remain JYC-only and retired student-platform routes redirect.
- Security headers, CSP, HSTS and private-route noindex headers are present.
- Final QA contracts are aligned to V56.8.
- Release metadata is aligned across package, lockfile, service worker and public release documentation.

## Live Supabase verification

Project status: ACTIVE_HEALTHY.

Current advisor findings should be interpreted as follows:

### Action required in Supabase dashboard

- Enable leaked-password protection in Auth.

### Intentional / review-only findings

- Four private rate-limit tables have RLS without direct policies. These are internal control tables and should remain inaccessible to public roles.
- SECURITY DEFINER warnings exist for public-read and authenticated authorization helpers. They must retain fixed search paths, minimal grants and explicit authorization checks.
- Unused-index and multiple-permissive-policy performance findings should not be bulk-deleted or merged without workload evidence. They require a measured cleanup pass after real production traffic exists.

## Production browser gate

Before declaring the release final, verify the deployed Vercel URL at:

- desktop
- tablet
- Android/mobile
- narrow mobile
- both supported themes
- direct route refresh
- back/forward navigation
- image loading and lightbox
- Supabase unavailable / empty-data states
- contact submission
- gallery filtering/search
- club detail
- event detail
- recruitment
- 404/unknown route

## Content gate

Verify every published club/event record against an authoritative source before treating it as current.

Do not infer:

- current leadership
- current social handles
- current recruitment
- current event dates
- current results

from historical material alone.

The 873-file source archive is source material. It is not a license to bulk-publish every file as current photography.

## Media gate

For promoted media retain:

- role
- association
- year when known
- alt text
- caption
- source label
- source path/page when known
- publication state

Prefer real JYC photography over decorative presentation exports.

## Deployment limitation

The repository can be verified and committed from GitHub, and Supabase can be audited through the connected project. The Vercel account connected to this ChatGPT session does not currently expose the JYC project, so deployment verification must be performed from the Vercel account that owns the JYC deployment.

## Stop condition

Do not add new student-platform features or another visual redesign until the production browser, content, media, accessibility and performance gates are green.
