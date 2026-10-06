# Contributing to the JYC Website

> Start with [docs/CODE-ORGANIZATION.md](./docs/CODE-ORGANIZATION.md) to find the correct owner for a function or feature.

JYC is a student-facing campus website, not a generic dashboard template. Changes should preserve the compact editorial feel and the official-content model.

## Before opening a PR

```bash
npm install
npm run qa
npm run qa:seo
npm run qa:security
npm run build
npx playwright install chromium
npm run qa:browser
```

## Product rules

1. Do not invent official JYC clubs, events, people, venues or gallery records.
2. Keep public navigation simple: Home, Clubs, Events, Moments, Team, Contact, More, Search.
3. Prefer compact typography and useful information density over oversized hero sections.
4. Keep animation purposeful and respect `prefers-reduced-motion`.
5. Do not introduce mouse-driven RAF loops for decorative effects.
6. Keep admin functionality private and separate from the public experience.
7. Never commit `.env.local` or service-role credentials.
8. Test 390×844 and 400×580 before considering a public UI change complete.

## JYC quality gate

Before opening a pull request, run:

```bash
npm ci
npm run qa
npm run build
npx playwright install chromium
npm run qa:browser
```

The `main` branch also runs the same quality gate in GitHub Actions. Keep the public website compact, mobile-first, content-led and free of placeholder/dummy JYC content. Visual experiments should not bypass the established JYC colour system or reduced-motion support.
