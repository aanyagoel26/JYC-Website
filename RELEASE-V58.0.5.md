# V58.0.5 — Album Guard Security Hardening

V58.0.5 is the current JYC public-site patch release.

- Retains V58.0.3 album publication gating and V58.0.4 privilege hardening.
- Adds the final trigger-only hardening so the internal album publication SECURITY DEFINER function is not exposed as a callable PostgREST RPC.
- Keeps publication gated by approved photographs, cleared rights and resolved provenance verification.
- Aligns package, lockfile, service-worker cache and release QA to V58.0.5.

Supabase production contains the album publication guard, reviewer index and successive execute-privilege hardening migrations. The security advisor no longer reports the album guard as directly executable; the remaining warnings are the intentionally public site-data bridge, intentional admin SECURITY DEFINER helpers, rate-limit tables without client policies and the Supabase Auth leaked-password-protection setting.

Vercel production remains pinned to the older deployment because the team's free-plan daily deployment quota is exhausted. The latest main branch must be published after the quota resets, followed by production browser/performance smoke testing.
