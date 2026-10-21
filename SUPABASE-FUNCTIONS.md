# JYC Supabase Edge Functions

The Admins panel uses the `admin-management` Edge Function. Web Push uses `send-notification`.

## Deploy

Install/login to the Supabase CLI, link this project, then run:

```bash
npx supabase login
npx supabase link --project-ref ogbanmjokjlxfuktkicj
npx supabase functions deploy admin-management
npx supabase functions deploy send-notification
```

For production, set the `SITE_ORIGIN` secret to the deployed website origin (for example `https://jyc.example.com`). Do not put service-role or VAPID private keys in Vite `.env` files. Configure VAPID secrets only in the Edge Function environment.

The local Admins screen now reports a clear setup message instead of showing a generic Edge Function fetch error when the function has not been deployed yet.

## V3 notification secrets
Full Web Push needs a VAPID key pair. Put only the public key in `VITE_VAPID_PUBLIC_KEY`. Keep the VAPID private key server-side as an Edge Function secret; never place it in frontend code. The notification function should use the server-side VAPID values when sending push messages.

## Platform V3 migration
Run `supabase/platform-v3.sql` after `supabase/relational-v2.sql`. It creates push subscriptions, page views, error reports, event reminders, notification preferences and media albums with RLS.

## Automated backups
`supabase/functions/backup-site-data/index.ts` can create timestamped JSON snapshots in the private `jyc-media` storage area. Deploy it with JWT verification disabled only if you protect it with the `BACKUP_FUNCTION_TOKEN` secret; otherwise keep the function protected and invoke it from a trusted scheduler. Do not expose the service-role key or backup token in the browser. A production scheduler (for example an external cron/CI runner) should call the function daily and retain a documented number of snapshots.
