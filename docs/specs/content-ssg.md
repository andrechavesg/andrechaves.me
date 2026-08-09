# Spec: Content & SSG

## Goal
Prerender both locales to static HTML so AI crawlers (GPTBot, ClaudeBot, PerplexityBot) see full content without executing JavaScript.

## Acceptance criteria
- [ ] `vite-react-ssg` (or equivalent) emits static HTML for `/` and `/pt/`
- [ ] View Source on `/` and `/pt/` contains name, role, Hefesto, PontoNet, ZapSign, writing list, contact, legal footer — not an empty `#root`
- [ ] Meta, Open Graph, and JSON-LD are present in the initial HTML
- [ ] Hero `<h1>` ships at full opacity from frame 1; only `transform` is animated
- [ ] Production build succeeds with `npm run build`
- [ ] Critical content is locale-specific and complete for EN and PT

## Content entities (both locales)
1. Cold open — name, role line, two CTAs
2. Swarm — agentic orchestration / what I do
3. Guardrail — governance, HITL
4. Hefesto — studio since 2016
5. PontoNet — product
6. Record — ZapSign CTO → CAO, Medium writing
7. Cooling — contact, legal, repo link

## Locked facts
- Role: Chief Agentic Officer at ZapSign (ex-CTO)
- Legal: ANDRE DE MORAES CHAVES DESENVOLVIMENTO DE SOFTWARE LTDA, nome fantasia HEFESTO SOFTWARE HOUSE
- CNPJ: 25.311.859/0001-42
- Founded: 2016-07-28
- Address preference: CNPJ registered — Rua Condessa Siciliano 384, Jardim São Paulo, São Paulo/SP (or "São Paulo, Brasil" alignment)
- Hefesto = legal entity; PontoNet = product
