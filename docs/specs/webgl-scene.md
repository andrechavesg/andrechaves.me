# Spec: WebGL Scene & Quality Tiers

## Goal
One persistent WebGL2 scene (no WebGPU) with GPGPU swarm, guardrail lattice, bloom, and adaptive quality.

## Acceptance criteria
- [x] Persistent canvas `z-index: 0`, never unmounts across acts
- [x] WebGL2 only — no WebGPU / TSL compute
- [x] FBO ping-pong or GPUComputationRenderer for swarm (constructed in useMemo from gl)
- [x] Guardrail lattice, lighting, bloom pipeline
- [x] Canvas `dpr={[1, 1.5]}`; composer `multisampling={0}`
- [x] Adaptive quality: sample ~60 frames, step DPR / post / particle count via `adaptTier`
- [x] Soft rasterizer (SwiftShader/llvmpipe) → static fallback
- [x] Mobile / low tier: drop bloom, keep vignette/CA
- [x] Code-split WebGL bundle; load after first paint / idle
- [x] No direct deps on three-stdlib or troika-three-text
- [x] Tab hidden → frameloop `never`; resume + invalidate on visible
- [x] Designer pass: particle budgets / bloom intensity tuned for mobile + mid-tier (smaller points, lower bloom, stage-right bias)

## Quality tiers
| Tier | Particles | Bloom | DPR max |
|------|-----------|-------|---------|
| high | ≤16,384 (FBO slots) | yes (mipmap) | 1.25 |
| medium | reduced | yes (no mipmap) | 1.0 |
| low | minimal | off | 1.0 |
| static | poster / single frame | n/a | n/a |

## Notes
FBO is 128² = 16,384 max points; tier particle counts clamp via draw range.
Capability probe must call `WEBGL_lose_context` before mounting the R3F Canvas — a leaked probe context is a common cause of immediate Context Lost on desktop Chrome.
Context-lost events fall back to the CSS poster (no black void).
