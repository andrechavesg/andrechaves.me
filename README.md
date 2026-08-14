# andrechaves.me

Personal **craft-flex** site for [André de Moraes Chaves](https://andrechaves.me) — Chief Agentic Officer at ZapSign (ex-CTO), founder of **Hefesto Software House**.

Spectacle is primary; conversion is secondary. One persistent WebGL2 forge scene drives seven cinematic acts. English at `/`, Portuguese at `/pt/`, both statically prerendered so AI crawlers see real content without executing JavaScript.

**Repository:** https://github.com/andrechavesg/andrechaves.me

---

## What you get

- Seven scroll acts: cold open → swarm → guardrail (HITL + “green check lied”) → Hefesto → PontoNet → record/writing → cooling
- SSG via `vite-react-ssg` — View Source shows name, role, entities, writing, legal footer, JSON-LD
- Three JSON-LD blocks linked by `@id` (`ProfilePage`, `Person`, `Organization` with CNPJ `taxID` + `BR-CNPJ` identifier)
- Forge/ember palette with WCAG rules (`#FF8A1E` body orange, `#FF6A00` brand, `#C2410C` non-text)
- Medium RSS prebuild → `src/data/posts.json` with last-good fallback (never fails the build)
- Writing section shows Portuguese titles with a visible language chip
- Adaptive WebGL2 quality tiers + reduced-motion static path (kills rAF)
- Cloudflare Workers static assets (`wrangler.toml`) + DNS cutover runbook from GoDaddy Website Builder

---

## Stack (hard-pinned)

| Package | Version |
|---------|---------|
| `react` / `react-dom` | `19.2.8` |
| `vite` | `8.2.1` |
| `three` | `0.185.1` (+ `overrides`) |
| `@react-three/fiber` | `9.7.0` |
| `@react-three/drei` | `10.7.8` |
| `@react-three/postprocessing` | `3.0.5` |
| `postprocessing` | `6.39.4` |
| `tailwindcss` / `@tailwindcss/vite` | `4.3.3` |
| `gsap` | `3.15.0` |
| `lenis` | `1.3.26` |
| `motion` | `13.0.0` |
| `zustand` | `5.0.14` |
| `vite-react-ssg` | `0.9.2` |

Node: `>=20.19` or `>=22.12`. Do **not** bump `three` past `0.185.1` without checking `postprocessing` peer range. No WebGPU / TSL compute. No direct `three-stdlib` or `troika-three-text` deps.

---

## Spec-driven + TDD

Acceptance criteria live under [`docs/specs/`](docs/specs/):

| Spec | Covers |
|------|--------|
| `content-ssg.md` | Prerender, View Source, LCP hero rules |
| `i18n.md` | `/` + `/pt/`, hreflang, language chip |
| `json-ld.md` | ProfilePage / Person / Organization |
| `glass-ui.md` | Palette + glass components |
| `medium-feed.md` | Prebuild + fallback |
| `webgl-scene.md` | Persistent canvas, tiers, bloom |
| `scroll-acts.md` | Seven acts + HITL choreography |
| `a11y-reduced-motion.md` | Focus, contrast, rAF kill |
| `deploy-dns.md` | Pages + cutover checklist |

Unit tests (`tests/`) cover contrast, JSON-LD shape, i18n, quality/reduced-motion, and Medium fallback. Write/adjust failing tests first for logic changes in those modules.

---

## Develop

```bash
npm install
npm run dev          # vite-react-ssg (SSR-consistent) or use vite for CSR-only
```

`predev` / `prebuild` run `scripts/fetch-medium.mjs`. On feed errors the committed `src/data/posts.json` is kept and the process exits `0`.

Self-hosted fonts: `public/fonts/` (Space Grotesk + IBM Plex Sans) with preload + `size-adjust` fallbacks in CSS.

---

## Test

```bash
npm test             # vitest run
npm run test:watch
```

---

## Build

```bash
npm run build        # → dist/ with / and /pt/ HTML
npm run preview
```

**Self-check:** open `dist/index.html` and `dist/pt/index.html` — you must see full content and three `application/ld+json` blocks, not an empty `#root`. Hero `<h1>` is full opacity from frame one (transform-only motion).

---

## Deploy (Cloudflare Workers static assets)

Config: [`wrangler.toml`](wrangler.toml) — Worker `andrechaves-me`, assets from `dist`, `not_found_handling = "404-page"`.

`npm run build` runs `scripts/verify-assets.mjs` so every `/assets/…` hash referenced by SSG HTML must exist on disk (prevents MIME `text/html` module failures).

```bash
npx wrangler login          # once per machine
npm run deploy              # build + wrangler deploy
# dry-run (no upload):
# npm run deploy:dry
```

**CI:** [`.github/workflows/deploy-workers.yml`](.github/workflows/deploy-workers.yml) deploys on push to `main` when these repo secrets exist:

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | Workers edit token |
| `CLOUDFLARE_ACCOUNT_ID` | Account id |

Or connect this GitHub repo in the Cloudflare dashboard (Workers & Pages → Create → Worker → Connect Git / Workers Builds):

| Setting | Value |
|---------|--------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node version | `22` |

Verify on `*.workers.dev` (or a Workers preview URL), then attach custom domain `andrechaves.me`. Missing `/assets/*` must return **404** (not 200 HTML).

---

## Publish andrechaves.me (DNS cutover)

Full runbook: [`docs/deploy/dns-cutover.md`](docs/deploy/dns-cutover.md).

Safe order:

1. Deploy + verify on `pages.dev` (both locales, View Source, HTTPS)
2. Add custom domains in Pages — **orange-cloud (proxied)**
3. **Delete** stale GoDaddy `A` / `AAAA` / `CNAME` for `@` and `www` (do not leave them alongside)
4. `dig +short` + `curl -I https://andrechaves.me` (and `/pt/`)
5. **Cancel GoDaddy Website Builder last**

Do not cancel the builder before DNS repoint — that causes a hard apex outage.

---

## Legal / identity (visible in footer)

- **Hefesto Software House** — nome fantasia of *ANDRE DE MORAES CHAVES DESENVOLVIMENTO DE SOFTWARE LTDA*
- CNPJ `25.311.859/0001-42` · since 2016 · São Paulo, Brasil (CNPJ registered address)
- **PontoNet** is the product Hefesto ships, not a second company

---

## License

Source intended as open (MIT when published). GSAP is used under the GreenSock Standard “No Charge” license.
