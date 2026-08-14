# Spec: Scroll Acts & Choreography

## Goal
Seven cinematic acts driven by GSAP ScrollTrigger against one persistent scene; spring-based motion.

## Acts
1. Cold open — DOM H1 name (LCP), single ember, role, two glass CTAs
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
- [x] Name is DOM-only H1 (no 3D display type); SVG ExtrudeGeometry emblems for Hefesto / PontoNet
- [x] Human design revision: still-frame screenshots of all 7 acts signed off visually (stage-right forge, act-gated emblems, reduced bloom; mobile copy clear)
- [x] Scrollbar hidden in cinematic mode; act sections snap (`scroll-snap-align: start`)
- [x] Pin + scrub ScrollTrigger per act drives WebGL progress and DOM `[data-reveal]` transitions
- [x] Autoplay advances acts (~7s dwell) until first wheel/touch/keyboard scroll; session-persisted takeover
- [x] Reduced motion / Motion off: no Lenis, no pin/autoplay (hook disabled)
