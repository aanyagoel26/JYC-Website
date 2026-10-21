# Vercel public access

The JYC application is a normal public Vite site. The repository cannot switch a Vercel account's Deployment Protection setting by itself; that is an account/project setting in Vercel.

For the public website deployment, open the Vercel project and check **Settings → Deployment Protection**. Turn off any protection that requires visitors to sign in to Vercel for the production deployment. Keep preview/development protection as desired.

Then redeploy `main` and test the production URL in a private/incognito window while signed out of Vercel.

The repository already contains the SPA rewrite in `vercel.json`, so direct routes such as `/clubs`, `/events`, `/gallery`, `/calendar`, and `/admin` resolve to the React application instead of returning a static 404.

Do not put Supabase service-role keys or other secrets in `VITE_*` variables. Only the public Supabase URL and anonymous key belong in the client environment.


## Current public experience

- Production should be left publicly accessible; Vercel Authentication should not protect the production domain.
- `/download` is a legacy route and now redirects to the JYC Guide; the public product no longer exposes a source-download utility page.
- The source repository remains the canonical place for project code and deployment documentation.
- Preview deployments may remain protected; Vercel documents that production and preview protection can be configured separately.
- The website itself never needs a visitor to sign into Vercel.
