# Security maintenance - 2026-10-22

## Scope

Next.js upgraded from 14.1.0 to 15.5.28 following the upstream October 14 security release:
https://nextjs.org/blog/nextjs-security-update-october-14-2026

React and React DOM are pinned to 19.3.1. Request headers APIs and JSX types
were adapted. PostCSS and its selector parser are overridden to patched versions.
The portal hostname allowlist now rejects lookalike domain suffixes.

## Runtime isolation

The Docker runtime installs production dependencies only and runs as the node user.
Build tools, source repository, backend files, certificates and environment files
are not copied into the runtime image. The build and runtime use Node 22.

## Remaining build-time risk

The full npm audit still reports five high-severity entries in the Tailwind 3
dependency chain (braces, chokidar, micromatch, fast-glob, tailwindcss), caused by
GHSA-vfj7-8cjw-p6xm. braces 3.0.3 has no published patched version at this date.
These packages are not installed in the runtime image. They process trusted
repository input during builds; do not build untrusted submitted configurations.
This is containment, not a fix. Removing the build-time finding requires a
separately tested Tailwind 4 migration across all sites and portal screens.

## Validation

- npm audit --omit=dev
- npm run build
- SMOKE_BASE_URL=http://localhost:3101 node scripts/security-smoke.mjs
- Browser checks of desktop/mobile, menu, service accordion and login screens.

This review covers the npm findings, not an exhaustive audit of the Python
backend, database credentials, operating system or container base packages.
