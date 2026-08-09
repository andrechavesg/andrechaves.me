# Spec: Scroll Acts & Choreography

## Goal
Seven cinematic acts driven by GSAP ScrollTrigger against one persistent scene; spring-based motion.

## Acts
1. Cold open — extruded name, single ember, role, two glass CTAs
2. The swarm — particles ignite and self-organise
3. The guardrail — lattice + HITL approve/reject + one "green check lied" beat
4. Hefesto — studio emblem
5. PontoNet — product emblem
6. The record — ZapSign journey + writing
7. Cooling — contact, legal, repo

## Acceptance criteria
- [ ] Each act legible as a still frame
- [ ] ScrollTrigger maps scroll progress → camera / scene state
- [ ] Spring-based easings for identity motion (no linear)
- [ ] HITL approve/reject interaction in act 3
- [ ] One-time "green check lied" narrative beat
- [ ] Lenis smooth scroll (package `lenis`, not @studio-freight/lenis)
- [ ] Extruded metallic type + SVG ExtrudeGeometry emblems
