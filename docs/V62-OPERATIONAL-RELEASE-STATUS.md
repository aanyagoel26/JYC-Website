# V62 operational release status

V62 is the current application release.

## Verified
- Supabase project is ACTIVE_HEALTHY.
- Seven production Edge Functions are deployed and active.
- The Vercel JYC project accepted and completed a production deployment of the merged V62 commit `a521f762cdf3a664017f04f4a9c256ca6836e67b`; the project alias `jyc-website-eight.vercel.app` is live on that deployment.
- JAI/event Vercel infrastructure was not modified.

## Still externally gated
- Supabase leaked-password protection must be enabled in Auth settings.
- Gallery rights remain `review` until documentary permission is established.
- Album publication and six unalbumed gallery assignments remain editorial decisions.
- Focal points remain unset until each crop is visually reviewed.
- Responsive image optimization uses the current static pipeline; a CDN/storage transformation path is preferred over committing redundant binary variants.
- GitHub Actions must complete for the final post-release commit.
- Edge Function secret values must be verified from the Supabase project settings; secret values are intentionally not exposed by the API.
- A complete backup restore drill still needs to be executed.
- An official custom domain has not been selected/verified for this project.

This file is an operational record, not a claim that the external gates above are complete.
