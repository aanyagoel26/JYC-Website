# JYC Website — Final V7 — Final Responsive UI + Fest Theme System

This package is a UI-focused upgrade of JYC V6.5. It keeps the existing Supabase/database architecture and adds a compact, responsive public experience plus themed Fest Mode and club-scoped themes.

## Included
- Responsive desktop + mobile public UI
- Persistent 5-item mobile bottom navigation: Home, Clubs, Events, Gallery, More
- Persistent mobile menu/search/theme controls
- Compact hero and section spacing
- Desktop phoenix presentation without the rectangular hero visual box
- Mobile-friendly Clubs, Events, Gallery, Team and Contact layouts
- Mobile-friendly Admin control center
- Fest Mode full-site visual themes: JYC Original, Cyberpunk, Diwali, Neon Night, Aurora, Heritage
- Fest Mode mobile bottom navigation
- Club-scoped themes: JYC, Midnight, Cyberpunk, Diwali, Neon, Minimal
- Reduced-motion and focus-visible accessibility support
- Existing RBAC/Supabase features retained

## Installation into an existing V6.5 project
Copy these files into your existing project:
- src/main.jsx
- src/admin-chunk.jsx
- src/mobile-polish.css

Also replace public/sw.js with the fixed service worker from this package.

Do not replace your Supabase folder or environment files.

## Verify
npm install
npm run build
npm run dev

Do not commit .env.local, node_modules or dist.


## V9 final pass
This release includes the final responsive/admin polish: independently scrollable Control Center sidebar, compact Events editorial heading, tighter homepage first viewport, zero-content states without dead space, accessibility focus states, and the packaged admin-management Edge Function deployment helper.
