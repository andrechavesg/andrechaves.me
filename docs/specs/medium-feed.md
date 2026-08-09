# Spec: Medium Feed Prebuild

## Goal
Build-time fetch of Medium RSS → `src/data/posts.json` with last-good fallback; never fail the build.

## Acceptance criteria
- [ ] Script `scripts/fetch-medium.mjs` fetches `https://medium.com/feed/@symfonymaestro`
- [ ] Parse with `fast-xml-parser`; sanitize with `sanitize-html`
- [ ] Emit `src/data/posts.json` (title, link, guid, pubDate, excerpt, categories, language: pt)
- [ ] Strip Medium tracking pixels; rewrite relative URLs
- [ ] On feed error/timeout: keep committed last-good file, log warning, exit 0
- [ ] 10s timeout; descriptive User-Agent
- [ ] Writing UI shows language chip ("in Portuguese")
- [ ] Link out to Medium canonical — do not republish full text
- [ ] Tests cover fallback and sanitization behavior
