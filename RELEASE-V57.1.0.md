# V57.1.0 — Production Finish

## Product focus

V57.1 completes the production-finish pass around the existing JYC 128 runtime rather than adding another visual system.

- Event detail remains the primary participation surface: status, date/time, venue, registration, share, calendar export, reminders, rules/eligibility, gallery, official sources, organiser/community connection and related experiences.
- Club detail remains the community surface with published identity, people, activities, recruitment state, media and official links.
- The public event calendar remains JYC-events-only and keeps Google Calendar / ICS support.
- Sector-128 filtering remains enforced at the normalized event boundary.
- Gallery/archive remain source-backed and photography-first.
- Projects, Impact and standalone FAQ navigation remain intentionally excluded.
- The service-worker cache namespace is rotated to prevent stale V57.0 shells from surviving the release.
- Static QA now includes an explicit V57.1 production-finish contract.

## Release verification

Run:

```bash
npm ci
npm run qa
npm run build
npm run qa:browser
```

The final browser/deployment smoke pass still needs to run against the connected Vercel deployment once deployment quota permits it.

## Scope boundary

No new animation library, icon library, scroll-jacking layer, giant WebGL surface, Projects page, Impact page, FAQ page, or generic student-platform dashboard is introduced by this release.
