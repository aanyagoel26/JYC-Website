# V58.0.4 — Album Guard Security Hardening

V58.0.4 is the current JYC public-site patch release.

- Retains V58.0.3 album publication gating.
- Revokes direct EXECUTE privileges from the album publication SECURITY DEFINER trigger function for public, anon and authenticated roles.
- Keeps the function trigger-only while preserving its SECURITY DEFINER behavior for the database trigger itself.
- Aligns package, lockfile, service-worker cache and release QA to V58.0.4.

Supabase production has the privilege-revocation migration applied and the security advisor no longer reports the album guard as directly executable. The remaining security warnings are the intentionally public site-data SECURITY DEFINER bridge, intentionally protected admin SECURITY DEFINER helpers, rate-limit tables without client policies, and the Supabase Auth leaked-password-protection setting that requires dashboard configuration.

Vercel production is still pinned to the older deployment because the team's free-plan daily deployment quota is exhausted. The latest main branch must be published after that quota resets, followed by production browser/performance smoke testing.
