# Security Operations Notes

## 2026-10-07 Supabase review

The live project ogbanmjokjlxfuktkicj was checked with Supabase Security and Performance Advisors.

### Security findings

- 4 rls_enabled_no_policy findings are INFO-level on internal rate-limit tables. These tables intentionally have RLS with no public policies; access is expected through privileged server-side functions.
- 1 anon_security_definer_function_executable warning is the intentional public jyc_read_site_data() read RPC. The function has an empty search path and explicitly strips unpublished/admin-only content for non-admin callers.
- 7 authenticated_security_definer_function_executable warnings are intentional authorization/RLS helpers and the authenticated jyc_save_site_data() RPC. The live definitions use an empty search path; the save function checks the caller's active JYC admin role before writing.
- 1 auth_leaked_password_protection warning remains. Supabase exposes leaked-password protection as an Auth setting on supported plans; enable it in the dashboard when the project plan supports it.

### RLS cleanup

Seven exact duplicate policies were removed from production because they had identical role/action/USING/WITH CHECK expressions:

- Users can read own JYC admin record
- users delete own registrations
- users read own registrations
- users update own registrations
- reminders owner
- admins read project submissions
- admins update project submissions

Supabase reported the multiple-permissive-policy warning count falling from 56 to 48 after this cleanup.

The remaining multiple-policy warnings must be reviewed conservatively because many represent deliberate public-read + authenticated-admin policy layers.

### Performance

Supabase currently reports 61 unused-index INFO findings. These are not automatically problems: a low-traffic production site can legitimately have indexes that have not been used yet. Reassess after real traffic and query statistics exist rather than deleting indexes blindly.
