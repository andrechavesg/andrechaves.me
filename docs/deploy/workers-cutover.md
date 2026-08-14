# Workers cutover (from Pages)

Cloudflare MCP connectors expose Workers/bindings/builds — not Pages deploys.
This repo is configured as a **Workers static assets** project.

## Current state

| Surface | Status |
|---------|--------|
| Code + `wrangler.toml` | Workers assets + `not_found_handling = "404-page"` |
| MCP `workers_list` | Empty until first `wrangler deploy` / Workers Builds |
| Live `andrechaves.me` | Still the **Pages** project until domain moves |
| GitHub Actions | Needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` |

## Path A — Local / CI token (fastest)

1. Create API token: [Create token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) with **Edit Cloudflare Workers** (+ Account read).
2. Either:
   - Export `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` and run `npm run deploy`, or
   - Add the same as GitHub repo secrets, merge this PR, push `main` (workflow `Deploy Cloudflare Workers`).
3. Open `https://andrechaves-me.<your-subdomain>.workers.dev` and check:
   - `/` and `/pt/` render
   - `/assets/missing-test.js` → **404** (not 200 HTML)

## Path B — Workers Builds (Git) via dashboard

1. Dashboard → **Workers & Pages** → **Create** → import `andrechavesg/andrechaves.me`.
2. Ensure it creates a **Worker** (not Pages). Name must match wrangler: `andrechaves-me`.
3. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Production branch: `main`
4. Push to `main` triggers builds; MCP **Cloudflare-builds** can then list/debug via `workers_list` → `workers_builds_list_builds`.

## Move andrechaves.me off Pages

Do this only after the Worker looks good on `workers.dev`:

1. Pages project → Custom domains → remove `andrechaves.me` / `www`.
2. DNS: remove the apex CNAME to `*.pages.dev` if it remains (Workers custom domains cannot attach over an existing CNAME).
3. Worker → Domains → **Add custom domain** `andrechaves.me` (and `www` or a redirect rule).
4. Optionally: `npx wrangler pages project delete andrechaves-me` after traffic is on the Worker.

Optional wrangler snippet (after Pages domain is gone):

```toml
[[routes]]
pattern = "andrechaves.me"
custom_domain = true
```
