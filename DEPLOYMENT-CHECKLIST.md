# JYC V11 Deployment Checklist

## 1. Install and build

```bash
npm ci
npm run build
npm run preview
```

Do not deploy until the production build completes successfully.

## 2. Environment

Create `.env.local` / deployment environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_VAPID_PUBLIC_KEY` (only if Web Push is being enabled)

Never expose a Supabase service-role/secret key in frontend variables.

## 3. Supabase migrations

Run, in order:

1. `supabase/00-core-migration.sql`
2. `supabase/relational-v2.sql`
3. `supabase/platform-v3.sql`
4. `supabase/platform-v4-fix.sql`
5. `supabase/final-role-hardening.sql`
6. `supabase/platform-v5-production.sql`

Deploy the Edge Functions when their related features are needed:

- `admin-management`
- `send-notification`
- `backup-site-data`

## 4. Auth

Configure Supabase Auth redirect URLs for the production origin, including:

- `/my-jyc` for passwordless student sign-in
- `/admin` for administrator OAuth

## 5. Storage

Confirm the `jyc-media` bucket exists and its RLS policies are present.

## 6. QA

Test public pages at 320, 360, 390, 412, 768, 1024, 1280 and 1440px widths.

Test:

- Search and keyboard shortcuts
- Mobile bottom navigation
- Club save/open
- Event save/reminder/share/calendar/QR
- Native registration
- Account sign-in and My JYC registration list
- Gallery lightbox and Escape key
- Admin login and logout
- Role-specific admin navigation
- Draft → preview → publish
- Club-admin review submission
- Registration export/status changes
- Gallery upload/delete
- Backup/restore
- Maintenance mode
- Feature flags
- Offline fallback

## 7. Final security check

Verify anonymous users cannot query unpublished content directly from `jyc_site_data`, and verify administrator roles cannot cross their assigned permissions.


## V13 release gate
- [ ] `npm install` completes successfully
- [ ] `npm run build` completes with zero errors
- [ ] Test destructive actions use the custom confirmation modal
- [ ] Test restore backup flow on a staging project
- [ ] Verify Supabase RLS and registration policies after migration
- [ ] Test mobile widths from 320px through 430px
- [ ] Test admin permissions for each role
- [ ] Verify recruitment buttons redirect to the intended external registration URLs


> **Current release boundary:** The production public release intentionally does not expose the historical `/admin`, `/login`, `/my-jyc`, `/notifications`, or other retired student-platform routes. They resolve to safe public destinations. The backend/admin implementation remains repository infrastructure but is not part of the public-release acceptance gate unless a future release explicitly re-enables it.
