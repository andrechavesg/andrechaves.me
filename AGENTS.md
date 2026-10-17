# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static personal site** (`andrechaves.me`) built with Vite + React 19 + `vite-react-ssg`, deployed to Cloudflare Pages. There is a single frontend service; no backend, database, or external services are required for local development. No secrets are needed for local dev, test, or build (Cloudflare credentials are only used by CI/`wrangler` at deploy time).

### Commands (see `package.json` scripts and `README.md`)
- Dev server: `npm run dev` — runs `vite-react-ssg dev` on `http://localhost:5173/`. English is at `/`, Portuguese at `/pt/`.
- Tests: `npm test` (`vitest run`). All specs under `tests/` (JSON-LD shape, i18n, contrast, quality/reduced-motion, Medium fallback, etc.).
- Build: `npm run build` — SSG build that emits `dist/index.html` + `dist/pt/index.html`, then runs `scripts/verify-assets.mjs`.
- Preview built output: `npm run preview`.

### Non-obvious gotchas
- **WebGL background does not render in this VM.** The persistent WebGL2 "forge" background canvas shows solid black because the Cloud VM has no GPU acceleration. This is an environment limitation, **not** a code bug — all HTML content, scroll acts, navigation, and i18n still work and are the testable surface here.
- **`predev`/`prebuild` fetch Medium RSS** via `scripts/fetch-medium.mjs`. On any network/feed error it keeps the committed `src/data/posts.json` and exits `0`, so dev/build never fail offline.
- **No lint script exists.** Running `npx tsc --noEmit` reports pre-existing type "errors" in `src/locales/pt.ts` (the PT locale is intentionally typed against the EN locale's literal string types). These are expected and do **not** block the build — the build uses `vite-react-ssg`/rolldown, not `tsc`. Do not treat them as regressions.
- **Node engine warnings are benign.** `npm install` prints `EBADENGINE` warnings (e.g. `jsdom`, `undici` want a slightly newer Node patch) on the VM's Node 22.14; install/test/build/dev all succeed. Required range is `>=20.19` or `>=22.12`.
