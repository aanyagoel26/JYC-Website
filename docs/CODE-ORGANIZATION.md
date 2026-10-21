# JYC Website — Code Organization & Function Ownership

## Purpose

This is the maintainer map. A contributor should know where a function belongs before editing code.

## Golden rule

**One responsibility → one owner → one obvious file/domain.** Do not create a second implementation of behaviour that already has an owner.

## Runtime layers

### Application composition — src/main.jsx
Owns public route selection, top-level composition, application bootstrap and wiring existing domain helpers into pages. Keep new generic utilities, datasets and reusable components out of this file.

### Page experiences
- src/jyc-editorial-home.jsx — homepage composition.
- src/extra-features.jsx — established public feature/page surfaces.
- src/jyc-history-page.jsx — history.
- src/jyc-now.jsx — JYC Now / announcements.
- src/jyc-next-experience.jsx — next-experience/editorial layer.

Page modules own page-specific state and composition. Reusable behaviour belongs elsewhere.

### Content and domain data
- src/content/ — structured public fallback/content records.
- src/jyc-hub-registry.js — hub/source registry.
- src/jyc-source-media.js — source-media normalization and enrichment.
- src/jyc-source-archive.js — supplied archive inventory.
- src/public-v1/config.js — public product configuration.
- src/jyc-socials.js — social identity records.

Content transforms should live with their domain rather than inside page JSX.

### Shared UI
- src/components/ — reusable application components.
- src/components/react-bits/ and src/react-bits/ — isolated visual/interactive components.

Interactive components need narrow props, keyboard/focus support where relevant, reduced-motion support, and no unnecessary idle work.

### Browser/platform helpers — src/lib/
Own storage, search, Supabase client boundaries, media upload, UI/toast primitives and other reusable browser adapters.

### Backend/security
- supabase/migrations/ — schema, RLS and SQL contracts.
- supabase/functions/ — privileged server-side operations.

Never move service-role credentials or privileged writes into browser code.

### QA/tooling — scripts/
Each QA script should answer one domain: security, SEO, source integrity, media, architecture, accessibility, performance, hygiene or browser smoke. run-qa-suite.mjs is the release orchestrator.

## Naming rules

Functions should use clear verbs: mergePublicFallback, normalizeSearch, rankSearchResults, safeExternalUrl.

Avoid vague names such as doStuff, processData or helper2.

Components use PascalCase and describe the rendered responsibility: JYCEditorialHome, JYCHistory, Gallery, DriftWall.

Data constants use descriptive nouns such as JYC_HUB_CONTENT, PUBLIC_EVENT_FALLBACK and TEAM_LOCAL_PHOTOS.

## Change ownership table

| Change | Owner |
|---|---|
| New public route | main.jsx routing + dedicated page module |
| Homepage section | jyc-editorial-home.jsx |
| Shared event behaviour | reusable component/domain module |
| Event data normalization | content/domain module |
| Search ranking | src/lib/search.js |
| Supabase client/query boundary | src/lib/ |
| Privileged database operation | supabase/functions/ |
| New visual effect | isolated React Bits component |
| Accessibility contract | component + accessibility QA |
| Performance regression | component/page + performance QA |
| SEO metadata | extra-features.jsx + SEO QA |
| Source/archive media | source-media/archive pipeline |
| GitHub automation | .github/workflows/ |

## Dependency direction

Prefer: data/domain → reusable UI → page → app composition.

Avoid page-to-page dependencies and importing a giant page module just to reuse one helper. Extract shared helpers into the correct domain module.

## Performance contract

Interactive effects should be deferred below the fold where practical, simplified for reduced-motion/coarse-pointer environments, bounded in DOM count, free of unnecessary continuous RAF loops, lazy for non-critical media, and free of persistent will-change unless actively needed.

## Content truth contract

Source material is not automatically current truth. Current public claims about clubs, people, events, social accounts, venues, recruitment and awards need an appropriate source/verification path. Never invent missing handles, roles, dates or venues.

## PR contract

Every PR should solve one coherent problem, identify affected domains/routes, include QA evidence, avoid unrelated formatting churn and document migrations/config changes. The target state is a clean main branch with zero open PRs.
