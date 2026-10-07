# Security Policy

## Supported versions

Security fixes are applied to the current production branch (`main`). Older historical releases are not guaranteed to receive security patches.

## Reporting a vulnerability

Please do **not** open a public GitHub issue for a suspected security vulnerability.

Use GitHub's private vulnerability reporting for this repository when it is available. Include a clear summary, affected route/component/workflow/database object, reproducible steps or proof of concept, security impact, and any suggested mitigation.

If private vulnerability reporting is unavailable, contact the repository maintainers through the security contact configured on GitHub and do not publish exploit details until a fix has been coordinated.

## Secrets

Never commit Supabase service-role/secret keys, OAuth/API provider secrets, VAPID private keys, database credentials, deployment tokens, or private certificates/signing keys.

Browser code must use only the Supabase publishable/anon credential intended for public clients. Server-side secrets belong in Vercel/Supabase environment variables.

## Dependency and CI security

Dependabot monitors npm and GitHub Actions dependencies. CodeQL runs on JavaScript/TypeScript and GitHub Actions. Pull requests should pass the repository quality, security, and browser-QA gates before merge.

## Disclosure

After remediation, maintainers may publish a GitHub security advisory when appropriate.
