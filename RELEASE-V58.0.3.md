# V58.0.4 — Album Publication Guard

## Release boundary

V58.0.4 is the current JYC public-site release.

## Included

- V58.0.1 accessibility and featured-event hardening remains in the current release line.
- Institutional media governance for photographer, rights, license, review and explicit album relationships.
- Draft club/event visual-album shells that remain unpublished until editorial approval.
- Album publication is now blocked unless linked photographs are approved, rights-cleared and provenance verification is resolved where applicable.
- Reviewer foreign-key indexing for governed gallery records.
- Public social-link handling no longer falls back to placeholder targets.
- Release QA and hygiene contracts are aligned to the active 58.0.4 package/service-worker boundary.

## Production state

Supabase production contains the V58.0.2 media-governance migration, the reviewer-index migration and the V58.0.4 album-publication guard.

The code repository is ahead of the current Vercel production deployment. The Vercel free-plan daily deployment quota is exhausted, so the final production publish and production browser/performance verification must occur after the quota resets.
