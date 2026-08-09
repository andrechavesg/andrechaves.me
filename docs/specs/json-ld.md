# Spec: JSON-LD Structured Data

## Goal
Emit three linked JSON-LD blocks (`ProfilePage`, `Person`, `Organization`) for Rich Results / entity graph.

## Acceptance criteria
- [ ] Three separate `<script type="application/ld+json">` blocks (not a single `@graph`)
- [ ] Cross-linked via stable `@id`: `#profilepage`, `#person`, `#organization`
- [ ] Homepage marked as `ProfilePage` with `mainEntity` → Person `@id`
- [ ] Person includes name, jobTitle, worksFor, sameAs (LinkedIn, Medium, PontoNet, ZapSign, GitHub when available)
- [ ] Organization includes legalName, name (Hefesto), taxID (masked), identifier PropertyValue `BR-CNPJ` (digits), addressCountry BR, foundingDate, logo
- [ ] Visible DOM footer shows CNPJ, 2016, São Paulo — matching markup (no invisible-only claims)
- [ ] Do not use `vatID`
- [ ] Unit tests assert shape and `@id` linking

## IDs
- `https://andrechaves.me/#profilepage`
- `https://andrechaves.me/#person`
- `https://andrechaves.me/#organization`
