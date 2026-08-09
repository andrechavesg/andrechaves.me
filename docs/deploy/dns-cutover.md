# DNS cutover: GoDaddy Website Builder → Cloudflare Pages

**Do not cancel GoDaddy until the final step.** Cancelling the builder before DNS repoint causes a hard apex outage.

## Prerequisites
- [x] `npm run build` succeeds locally
- [x] Project deployed to Cloudflare Pages preview (`*.pages.dev`)
- [x] View Source on preview shows full EN + PT content
- [x] Rich Results / JSON-LD smoke-checked
- [x] `robots.txt` and `sitemap.xml` reachable on preview

## 1. Deploy & verify on pages.dev
```bash
npm run build
npx wrangler pages deploy dist --project-name=andrechaves-me
```
Or connect the GitHub repo (`andrechavesg/andrechaves.me`) in Cloudflare Pages with:
- Build command: `npm run build`
- Output directory: `dist`
- Node version: `22`

Open `https://andrechaves-me.pages.dev/` and `/pt/` — View Source must show H1, footer CNPJ, JSON-LD.

## 2. Add custom domain (orange-cloud)
1. Cloudflare Dashboard → Pages → `andrechaves-me` → Custom domains
2. Add `andrechaves.me` and `www.andrechaves.me`
3. Let Cloudflare create DNS records — they **must be proxied (orange cloud)**. Pages requires proxied records.

## 3. Delete stale GoDaddy records
At the DNS host controlling `andrechaves.me` (likely GoDaddy today):

**Delete** every stale `A`, `AAAA`, and `CNAME` for `@` and `www` that pointed at GoDaddy Website Builder.

Do **not** leave old records alongside new ones. A leftover proxied record pointing at a dead origin is a classic **522**.

If the zone is moved to Cloudflare nameservers, manage records only in Cloudflare.

## 4. Verify
```bash
dig +short andrechaves.me
dig +short www.andrechaves.me
dig +short andrechaves.me AAAA
# Confirm HTTPS answers on 443, not only 80
curl -I https://andrechaves.me
curl -I https://andrechaves.me/pt/
```
Use an independent DNS checker as a second opinion.

## 5. Cancel GoDaddy Website Builder last
Only after dig + HTTPS verification succeeds, cancel the GoDaddy Website Builder subscription.

**Status (2026-08-09 audit):** Completed for traffic purposes.
- Apex/`www` serve Cloudflare Pages (`andrechaves.me` CNAME → `andrechaves-me.pages.dev`, proxied).
- GoDaddy account shows a **free** “Em breve” / Sites+Marketing venture for André Chaves — **not a paid Website Builder plan** (Subscriptions UI had no billable site product; site dashboard: “Você já tem um site gratuito”).
- That venture’s Domain panel reports **no domains in the workspace** — domain already detached after Cloudflare cutover.
- Optional hygiene: delete the orphan free Coming Soon venture in GoDaddy Products if you want it gone from the account tiles; it does not affect live DNS.
- Do **not** cancel the `andrechaves.me` domain registration itself.

## Notes
- **522** = Cloudflare could not connect to origin. For Pages, almost always means a bad/stale DNS record.
- If you ever proxy a third-party static host (Vercel/Netlify) through Cloudflare DNS on the free plan, use **grey-cloud (DNS-only)** — not applicable when hosting on Pages itself.
- Asset limits: 25 MiB/file, 20,000 files/site — satisfied by this project.
