# Spec: Scroll Acts & Choreography

## Goal
Seven cinematic acts driven by GSAP ScrollTrigger against one persistent scene; spring-based motion.

## Acts
1. Cold open — extruded name, single ember, role, two glass CTAs
2. The swarm — particles ignite and self-organise
3. The guardrail — lattice + HITL approve/reject + one "green check lied" beat
4. Hefesto — studio emblem (SVG ExtrudeGeometry anvil)
5. PontoNet — product emblem (SVG ExtrudeGeometry clock/node)
6. The record — ZapSign journey + writing
7. Cooling — contact, legal, repo

## Acceptance criteria
- [x] Each act has DOM still-frame legibility (H2/title + aria-label; scene targets per progress band)
- [x] ScrollTrigger maps scroll progress → camera / scene state
- [x] Spring-based easings for camera + emblem scale (no linear lerp)
- [x] HITL approve/reject interaction in act 3
- [x] One-time "green check lied" narrative beat
- [x] Lenis smooth scroll (package `lenis`, not @studio-freight/lenis)
- [x] Metallic display type (drei `Text` + metal material) + SVG ExtrudeGeometry emblems
- [ ] Human design revision: still-frame screenshots of all 7 acts signed off visually
