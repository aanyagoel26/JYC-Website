# V62 operational release status

V62 is the current application release.

## Verified
- Supabase project is ACTIVE_HEALTHY.
- Seven production Edge Functions are deployed and active.
- `backup-site-data` is deployed as v4. It accepts the existing scheduler token and an authenticated active `super_admin` session; it writes timestamped snapshots to the private `jyc-backups` bucket.
- The current production deployment `jyc-website-eight.vercel.app` is READY and serves the V62 runtime from commit `a521f762cdf3a664017f04f4a9c256ca6836e67b`.
- GitHub `main` has since advanced to merge commit `be476d9fd7ca3c98456f30e30af1524d77c3333c` (CI release-verification documentation only).
- JAI/event Vercel infrastructure was not modified.

## Platform-gated
- Vercel currently rejects new deployments with `api-deployments-free-per-day` and a 24-hour retry window. No billing or unrelated project was changed.
- GitHub Actions creates the four expected jobs for the verification commit, but each failed job currently records zero steps; rerunning the CI workflow did not produce executable job steps. This is a GitHub runner/platform execution failure, not a failed application test.
- Supabase leaked-password protection is still disabled and must be enabled in Auth password-security settings. Supabase documents this as a hosted-project Auth setting.

## Editorial / authorization-gated
- All 52 gallery records remain `rights_status=review`; provenance/credit metadata is not legal permission to publish.
- All 31 album shells remain unpublished; six gallery items remain unalbumed.
- All 52 focal points remain unset because these require visual crop decisions rather than arbitrary 50/50 values.
- Production Edge Function secret values cannot be read through the management API; the configured values must be verified in Supabase settings.
- The backup bucket currently contains zero objects, so a restore drill cannot honestly be marked passed until the first real snapshot is created and restored in a controlled test.
- No custom domain has been attached; no domain or DNS changes were made because the correct official domain must be explicitly selected without disturbing the existing JAI/event infrastructure.

## Release safety
The remaining gates are intentionally not represented as completed merely by changing database statuses or writing checklist text. Human/legal/editorial authorization and platform-level limits remain explicit.
