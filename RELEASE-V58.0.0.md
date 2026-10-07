# V58.0.0 — Production Trust, CMS Workflow & Content Graph

## Scope

V58 is the production follow-through after the V57.1 public experience pass.

### Added

- Publication Health workspace for JYC administrators.
- Live provenance coverage for clubs, events and gallery.
- Content-graph relationship coverage for event→club and gallery→club/event links.
- Explicit unresolved-review queue visibility.
- Release QA contract for the trust/CMS layer.
- V58 service-worker cache rotation and release metadata.

### Deliberately not automated

Verification is not auto-promoted. A record moves to verified/published only after an authorised editor confirms current Sector-128 evidence. Missing event-gallery, people, member or official-link relationships are surfaced as gaps rather than inferred.

### Product boundaries

- JIIT Sector 128 / Wish Town remains the public campus boundary.
- Projects, Impact and standalone FAQ remain excluded from public navigation.
- No new animation/icon dependency is introduced.
- No deployment is certified from source-only checks.

## Remaining release blockers

1. Complete browser/mobile smoke against the actual deployed origin.
2. Resolve the connected Vercel deployment quota.
3. Enable/configure repository CodeQL scanning if GitHub still rejects security-event uploads.
4. Resolve remaining content verification reviews with authoritative evidence.
5. Populate people/member/event-gallery relationships only from authoritative sources.

## Verification

Run:

`npm ci`
`npm run build`
`npm run qa`

For the live trust dashboard, sign into the Control Center and open **Publication Health**.


## Visual archive follow-through

The production media pass now keeps the photography boundary separate from source identity/design material while preserving useful discarded assets. Verified CICR and JODC logo material is reused as club identity fallback, and JODC banner material remains available as source identity material without entering the photography pool.

The public gallery now supports:

- editorial featured frames separated from the archive grid;
- collection, year and published-album filtering;
- permanent album routes under `/gallery/<album-slug>`;
- shareable photograph entry points under `/gallery?photo=<id-or-url>`;
- previous/next keyboard navigation, focus return and modal focus containment;
- mobile swipe navigation, double-tap zoom and explicit zoom controls;
- source/provenance context and open/download actions;
- progressive gallery rendering with bounded initial results;
- reduced-motion-safe visual treatment.

Responsive `srcset`/alternate-resolution delivery remains intentionally gated on generating genuine alternate image files. The site does not advertise multiple resolutions until those resources actually exist.
