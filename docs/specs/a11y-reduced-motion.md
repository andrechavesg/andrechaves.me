# Spec: Accessibility & Reduced Motion

## Goal
Full keyboard traversal, visible focus rings, contrast compliance, and hard reduced-motion path.

## Acceptance criteria
- [x] `prefers-reduced-motion`: no Canvas / no rAF — static poster gradient only
- [x] Subscribe to media query `change` for mid-session OS toggles
- [x] In-page motion toggle persisted to `localStorage` overrides MQ both ways
- [x] Kill Lenis/ScrollTrigger under reduced motion; opacity/colour transitions OK
- [x] Visible focus rings on interactive elements (`:focus-visible` molten outline)
- [x] Sections keyboard-reachable via skip link + nav anchors
- [x] Contrast helpers unit-tested against palette §2 (`#FF8A1E` body orange, not `#C2410C`)
- [x] Glass: `backdrop-filter` only on fine pointers; coarse = solid slag approx; `prefers-reduced-transparency` respected
- [x] Unit tests for contrast helpers and quality/reduced-motion selection
- [x] Manual full keyboard audit on production after deploy (36 focusables; skip-link first; molten focus outlines on nav/CTAs/HITL/footer)
