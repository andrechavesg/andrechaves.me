# Spec: Deploy & DNS Cutover

## Goal
Cloudflare Pages hosting ready; actionable DNS cutover from GoDaddy Website Builder to andrechaves.me.

## Acceptance criteria
- [ ] `wrangler.toml` (or Pages config) for project `andrechaves-me`
- [ ] `robots.txt` permits GPTBot, ClaudeBot, PerplexityBot
- [ ] `sitemap.xml` includes `/` and `/pt/`
- [ ] OG images per locale under `public/og/`
- [ ] Deploy docs: pages.dev verify → custom domain orange-cloud → delete stale GoDaddy A/AAAA/CNAME → dig verify → cancel GoDaddy last
- [ ] README: develop, test, build, deploy, publish
- [ ] Do not cancel or mutate real GoDaddy DNS from tooling
