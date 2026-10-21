# JYC V56.8 — Final Execution Status — 2026-10-05

## Completed in this pass

- CI now runs the production performance budget after the production build.
- Browser smoke coverage now includes:
  - legacy-route redirects;
  - unknown-route safety;
  - deployment security-header assertions when `JYC_BASE_URL` points at a deployment;
  - skip-link keyboard reachability;
  - the existing desktop/mobile/runtime/accessibility/photo checks.
- README production-gate language now reflects the CI performance gate.
- Supabase production state was re-checked after the latest hardening migrations.
- The public read RPC was executed successfully and returns data.
- Current Vercel connector access was checked by repository and by project name; no JYC Vercel project is visible to the connected Vercel account.

## Live Supabase state

- Project: `jyc-website`
- Status: `ACTIVE_HEALTHY`
- PostgreSQL: 17.6
- Published clubs: 17
- Draft clubs: 6
- Published events: 1
- Events under review: 7
- Pending gallery items: 92
- Verification records in review: 112
- `jyc_read_site_data()`: returns data
- `jyc_read_site_data()`: intentionally SECURITY DEFINER because it is the public compatibility read model.

## Security findings

The remaining Supabase advisor warnings were reviewed rather than blindly suppressed.

### Intentional / architectural

- Four internal rate-limit tables have RLS without public policies. They are control tables and should remain inaccessible through ordinary public row access.
- `jyc_read_site_data()` is intentionally executable by `anon` and `authenticated` because the public website uses it as a read API. It strips creator information and filters to public records.
- Several authenticated SECURITY DEFINER helpers are editor/admin authorization primitives. Their grants should remain restricted to the roles that need them.

### Action still required outside repository code

- Enable Supabase Auth leaked-password protection in the dashboard. This is an Auth configuration setting, not a repository migration.
- Continue periodic advisor review. Do not bulk-delete the 65 currently unused indexes without workload evidence.

## Editorial/content state

The current publication gate is working as intended. Current/future event evidence should be verified before changing an event to `published`.

JAI 2026 has current external evidence on Unstop stating that it is organised by JYC 128 and scheduled for 30–31 October 2026. It remains under review in Supabase because it does not yet have a verification record. This is deliberate: external evidence was found, but publication should still receive an authorised editorial verification record.

RIDE Hack'26 has current evidence on Unstop and Innovation JIIT, but remains under review and already has an official-website verification source. It should not be auto-published until the JYC editorial owner confirms the public event ownership/relationship.

The six source-backed draft communities remain draft until a current official club identity/publication source is approved.

## Deployment state

GitHub contains the latest QA changes, including:

- performance-budget CI gate;
- expanded browser smoke coverage;
- release-gate documentation alignment.

The connected Vercel account currently exposes no project matching `kaustubhdua/JYC-Website` and no project named JYC. Therefore production deployment verification cannot honestly be marked complete from this connection.

## Remaining P0 actions

1. Enable Supabase leaked-password protection.
2. Connect/authorize the correct Vercel team/project in the Vercel integration.
3. Run browser smoke against `https://www.jiityouthclub128.in`.
4. Verify production environment variables and custom-domain status.
5. Editorially verify/publish eligible current events and clubs.
6. Review the 92 pending gallery records and 112 verification records.
7. Run final performance checks against the deployed image set.

## Product direction

Do not add more decorative effects or student-portal functionality. V56.8 should remain a restrained, photo-led, JYC-first editorial website with source-backed content, strong mobile behavior and explicit publication provenance.
