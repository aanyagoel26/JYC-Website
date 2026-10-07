# V58.0.1 — Accessibility, Event Modal & Archive Polish

## Release boundary

V58.0.1 is the current JYC public-site release. It keeps the V58 editorial/community product boundary while completing the latest accessibility, event-modal, media-governance and release-integrity work.

## Included

- Accessible featured JAI 2026 modal with keyboard focus management, Escape handling, focus restoration and mobile-safe scrolling.
- Canonical JAI 2026 event routing with registration and official-source actions preserved.
- Verified Cinekala official LinkedIn metadata.
- V58.0.1 package, lockfile and service-worker cache alignment.
- Final hygiene QA aligned to the active release.
- Institutional media-governance migration for photographer/rights metadata and draft event/club archive albums.
- Reviewer foreign-key index for the governed gallery records.
- Complete supplied media archive remains provenance-aware and excludes audited non-photographic assets from the strict photography pool.

## Production verification

- Supabase production contains the V58.0.2 media-governance migration and the reviewer foreign-key index migration.
- Supabase performance review no longer reports the missing reviewer foreign-key index; remaining performance findings are unused-index observations and intentional multi-policy observations.
- The current Vercel production deployment is still pinned to commit `3c0704e`; `main` has since advanced and requires the next production deployment once the Vercel daily deployment quota permits it.
- The Vercel team currently reports the free-plan daily deployment limit as exhausted, so a production deployment cannot be triggered from the integration until that limit resets.

## Definition of done

The code, database migration state and release metadata are aligned. The only external operational gate remaining is publishing the latest `main` commit to Vercel and running the production browser smoke/performance pass against that resulting deployment.
