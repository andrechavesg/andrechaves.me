# Spec: Deploy & DNS Cutover

## Goal
Cloudflare Workers static assets hosting ready; actionable DNS cutover from GoDaddy Website Builder to andrechaves.me.

## Acceptance criteria
- [x] `wrangler.toml` Workers assets config for `andrechaves-me` (`not_found_handling = "404-page"`)
- [x] Repo `robots.txt` permits GPTBot, ClaudeBot, PerplexityBot
- [x] `sitemap.xml` includes `/` and `/pt/`
- [x] OG images per locale under `public/og/`
- [x] Deploy docs: pages.dev verify → custom domain orange-cloud → delete stale GoDaddy A/AAAA/CNAME → dig verify → cancel GoDaddy last
- [x] README: develop, test, build, deploy, publish
- [x] Do not cancel or mutate real GoDaddy DNS from tooling
- [ ] **Cloudflare dashboard:** disable “AI Scrapers and Crawlers” / managed robots block — live `robots.txt` currently prepends Cloudflare Managed `Disallow` for GPTBot/ClaudeBot before our Allows (user-owned setting)
- [ ] Cancel GoDaddy Website Builder only after DNS verified (user-owned — do not automate)
