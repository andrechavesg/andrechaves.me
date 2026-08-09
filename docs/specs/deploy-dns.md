# Spec: Deploy & DNS Cutover

## Goal
Cloudflare Pages hosting ready; actionable DNS cutover from GoDaddy Website Builder to andrechaves.me.

## Acceptance criteria
- [x] `wrangler.toml` (or Pages config) for project `andrechaves-me`
- [x] Repo `robots.txt` permits GPTBot, ClaudeBot, PerplexityBot
- [x] `sitemap.xml` includes `/` and `/pt/`
- [x] OG images per locale under `public/og/`
- [x] Deploy docs: pages.dev verify → custom domain orange-cloud → delete stale GoDaddy A/AAAA/CNAME → dig verify → cancel GoDaddy last
- [x] README: develop, test, build, deploy, publish
- [x] Do not cancel or mutate real GoDaddy DNS from tooling
- [ ] **Cloudflare dashboard:** disable “AI Scrapers and Crawlers” / managed robots block — live `robots.txt` currently prepends Cloudflare Managed `Disallow` for GPTBot/ClaudeBot before our Allows (user-owned setting)
- [ ] Cancel GoDaddy Website Builder only after DNS verified (user-owned — do not automate)
