# Spec: WebGL Scene & Quality Tiers

## Goal
One persistent WebGL2 scene (no WebGPU) with GPGPU swarm, guardrail lattice, bloom, and adaptive quality.

## Acceptance criteria
- [ ] Persistent canvas `z-index: 0`, never unmounts across acts
- [ ] WebGL2 only — no WebGPU / TSL compute
- [ ] FBO ping-pong or GPUComputationRenderer for swarm (constructed in useMemo from gl)
- [ ] Guardrail lattice, lighting, bloom pipeline
- [ ] Canvas `dpr={[1, 1.5]}`; composer `multisampling={0}`
- [ ] Adaptive quality: sample ~60 frames, step DPR / post / particle count
- [ ] Soft rasterizer (SwiftShader/llvmpipe) → static fallback
- [ ] Mobile / low tier: drop bloom, keep vignette/CA
- [ ] Code-split WebGL bundle; load after first paint / idle
- [ ] No direct deps on three-stdlib or troika-three-text

## Quality tiers
| Tier | Particles | Bloom | DPR max |
|------|-----------|-------|---------|
| high | ~200k–500k desktop budget | yes | 1.5 |
| medium | reduced | reduced resolutionScale | 1.25 |
| low | minimal | off | 1.0 |
| static | poster / single frame | n/a | n/a |
