# Spec: JSON-LD Structured Data

## Goal
Emit three linked JSON-LD blocks (`ProfilePage`, `Person`, `Organization`) for Rich Results / entity graph.

## Acceptance criteria
- [x] Three separate `<script type="application/ld+json">` blocks (not a single `@graph`)
- [x] Cross-linked via stable `@id`: `#profilepage`, `#person`, `#organization`
- [x] Homepage marked as `ProfilePage` with `mainEntity` → Person `@id`
- [x] Person includes name, jobTitle, worksFor, sameAs (LinkedIn, Medium, PontoNet, ZapSign, GitHub)
- [x] Organization includes legalName, name (Hefesto), taxID (masked), identifier PropertyValue `BR-CNPJ` (digits), addressCountry BR, foundingDate, logo
- [x] Visible DOM footer shows CNPJ, 2016, São Paulo — matching markup (no invisible-only claims)
- [x] Do not use `vatID`
- [x] Unit tests assert shape and `@id` linking
- [x] LinkedIn sameAs = `andre-chaves-31857b112` (from GitHub profile `blog` field)

## IDs
- `https://andrechaves.me/#profilepage`
- `https://andrechaves.me/#person`
- `https://andrechaves.me/#organization`
