# Spec: Accessibility & Reduced Motion

## Goal
Full keyboard traversal, visible focus rings, contrast compliance, and hard reduced-motion path.

## Acceptance criteria
- [ ] `prefers-reduced-motion`: render one static frame and stop rAF entirely
- [ ] Subscribe to media query `change` for mid-session OS toggles
- [ ] In-page motion toggle persisted to `localStorage` overrides MQ both ways
- [ ] Kill parallax / scroll-jacking under reduced motion; opacity/colour transitions OK
- [ ] Visible focus rings on interactive elements
- [ ] Full keyboard traversal of scroll/sections
- [ ] Contrast verification against palette §2
- [ ] Unit tests for contrast helpers and quality/reduced-motion selection
