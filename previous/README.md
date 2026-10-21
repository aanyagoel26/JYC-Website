# Previous JYC Website — Preservation Status

## Important: this is not a copied application snapshot

This directory currently contains this README only. The previous website's source files, assets, and configuration have **not** been physically moved or copied into `previous/`.

The pre-rebuild application is preserved in Git history on the `main` branch and at the parent commit from which `rebuild/v1-editorial-from-reference` was created. Use that branch/commit to inspect or restore the original implementation. Do not describe this folder itself as a complete backup.

## What is active in the rebuild

The rebuild branch uses the editorial homepage from `src/jyc-editorial-home.jsx`, while the existing React application, data/CMS integration, route resolver, and many legacy page components remain in the shared app. That means:
- the old homepage presentation is replaced at the root route when this branch is deployed;
- existing page routes and components can still appear on their own routes where the router continues to mount them;
- files remaining in `src/` are not automatically displayed; visibility depends on imports and route/component usage;
- this branch does not remove or rewrite production's `main` branch.

## Preservation rule

Do not delete or overwrite the old routes, CMS/Supabase integration, event data, club data, media, SEO, admin, or release tooling while rebuilding the public UI. Preserve the prior source through Git history until a complete, verified snapshot is intentionally created.

## Current rebuild direction

- dark editorial canvas, warm ivory typography, restrained red accent;
- oversized stacked “THE VOICE. THE TALENT. THE SPIRIT.” hero;
- JYC 128 identity and campus label;
- genuine photography separated from posters, logos, and promotional graphics;
- clear navigation and event/clubs/get-involved actions;
- responsive layout, readable contrast, no accidental overlays or clipping.

The rebuild should improve the public presentation layer without discarding the existing product capabilities.
