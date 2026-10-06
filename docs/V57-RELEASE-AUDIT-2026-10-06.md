# JYC V57 Release Audit — 06 Oct 2026

## Completed in this finalization pass

- Reconciled the V57 trust/provenance work on the PR 137 branch and continued hardening it instead of merging PR 136 separately. PR 137 contains the overlapping PR 136 source-safety work; PR 136 remains closed as superseded.
- Promoted the supplied 2026–27 orientation material into a canonical 23-community registry: 21 orientation-backed JYC 128 communities + 2 brochure-backed communities.
- Recorded publication state in the registry: 21 currently published normalized clubs and 2 publication-gated drafts.
- Added verified public hub links where current evidence is strong, and independently promoted CypherX, Dronotics, GDG and Zencoders through the Supabase verification guard.
- Kept Arcadia and Neural Nexus publication-gated because this pass did not find equally strong official community URLs; GDG is now verified through its current Linktree and LinkedIn presence.
- Added the supplied 2026–27 hub/leadership/photo source audit to the repository.
- Verified the supplied leadership photo set contains 23 files: 11 clean campaign cards and 12 social-post screenshots. The public team assets cover the 12 photographed leaders; no broken Divye campaign-gallery asset is referenced.
- Added source-backed leadership copy to the public fallback layer for the 12 photographed campaign identities while leaving Harisha and Dhruv as source-only text records because the supplied photo set does not contain clean cards for them.
- Added direct event-card/list registration-state labels: REGISTER, REGISTRATION CLOSED, REGISTRATION NOT PUBLISHED, VIEW EVENT.
- Added a verified-registration exception for JAI 2026 so its official Unstop registration remains actionable even while the event record itself is marked planned.
- Removed the unnecessary authenticated EXECUTE grant from jyc_read_site_data() in the connected Supabase project and committed the corresponding migration.
- Fixed duplicate Supabase migration numbering before release QA.
- Synced the machine-readable llms-full.txt registry with the canonical hub registry.

## Connected Supabase observations

The live jyc_read_site_data() RPC currently returns:

- 16 published team records including two faculty advisors.
- 8 event records in the public JSON feed: 1 completed/published record and 7 planned/upcoming records.
- 92 approved gallery records.
- 17 verified club records and 6 review club records in the normalized verification table.
- 2 verified event records and 35 review event records in the normalized verification table.

All normalized public event publication is guarded to Sector 128; Sector-62/non-128 events are moved to review and cannot be published by the database trigger.

## Remaining external blocker

The connected Vercel integration cannot resolve the current production deployment, and the public deployment URL tested from the earlier audit is not accessible from the available runtime. Therefore real-browser certification (desktop/mobile, console, layout, direct-route refresh, service worker, production environment) is still not honestly claimable.

## Remaining Supabase security items

The Supabase security advisor still reports:

- intentional anonymous execution of the SECURITY DEFINER public read RPC;
- several authenticated SECURITY DEFINER authorization helpers;
- leaked-password protection disabled;
- four rate-limit tables with RLS enabled and no policies (intentional service-role-only pattern);
- a large legacy set of multiple-permissive-policy and unused-index performance findings.

The first read-RPC privilege surface was reduced. The remaining warnings need a deliberate schema/auth migration and should not be fixed by disabling the site's required public read path.

## Release decision

Do not call production certification complete until the V57 branch passes the repository Quality Gate and the production deployment can be browser-tested. The source/data/provenance side is materially stronger and the Supabase public-data boundary is now verified at the database layer.
