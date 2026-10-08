# JYC V20.0.0 — Complete Production Pass

V20 is the consolidated JYC product pass. It keeps the JYC/V15/V17 identity while completing the public experience, Phoenix motion system, light/dark worlds, Fest Mode, Admin Control Center, search, archive, planner, accessibility, security and SEO foundations.

## Included
- Deep cream / brass editorial light mode.
- Dark JYC night mode with restrained red Phoenix identity.
- Full-viewport Phoenix Flight theme transition using native View Transition API + local SVG flight choreography.
- Reduced-motion fallback.
- Sticky desktop Admin sidebar and sticky mobile Admin chrome.
- Admin command palette and keyboard routing.
- AI editorial fallback when server-side AI is not configured.
- Fest visual system with structural skins.
- Today at JYC, Archive, Moments/Gallery, Planner and global Search.
- Shareable event/club routes and registration workflows already present in the platform.
- Security, SEO, sitemap and service-worker cache versioning retained.

## Verification
Run on a machine with dependencies installed:

```powershell
npm ci
npm run qa
npm run build
npm run qa:browser
```

## GitHub release
Commit the complete source to the existing `kaustubhdua/JYC-Website` repository on `main` only after Windows build/browser QA passes.
