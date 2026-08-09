export type QualityTier = 'high' | 'medium' | 'low' | 'static'

export interface CapabilityInput {
  webgl2: boolean
  softwareRasterizer: boolean
  gpuTier?: number
  coarsePointer?: boolean
  deviceMemory?: number
  saveData?: boolean
  reducedMotion: boolean
}

export interface AdaptiveSample {
  frameMs: number[]
  budgetMs?: number
}

const DEFAULT_BUDGET_MS = 1000 / 55

export function isSoftwareRenderer(renderer: string | undefined | null): boolean {
  if (!renderer) return false
  const r = renderer.toLowerCase()
  return r.includes('swiftshader') || r.includes('llvmpipe') || r.includes('softpipe')
}

export function selectInitialTier(input: CapabilityInput): QualityTier {
  if (input.reducedMotion) return 'static'
  if (!input.webgl2 || input.softwareRasterizer) return 'static'

  let tier: QualityTier = 'high'
  if (input.gpuTier !== undefined && input.gpuTier <= 1) tier = 'low'
  else if (input.gpuTier === 2 || input.coarsePointer) tier = 'medium'

  if (input.saveData) tier = tier === 'high' ? 'medium' : 'low'
  if (input.deviceMemory !== undefined && input.deviceMemory <= 4) {
    tier = tier === 'high' ? 'medium' : 'low'
  }

  return tier
}

export function adaptTier(current: QualityTier, sample: AdaptiveSample): QualityTier {
  if (current === 'static') return 'static'
  const budget = sample.budgetMs ?? DEFAULT_BUDGET_MS
  if (sample.frameMs.length < 30) return current

  const avg = sample.frameMs.reduce((a, b) => a + b, 0) / sample.frameMs.length
  // Never auto-step into `static` — that unmounts the Canvas and looks like a crash.
  // Static is reserved for software GL / reduced-motion / context-lost.
  const order: QualityTier[] = ['high', 'medium', 'low']
  const idx = order.indexOf(current)
  if (idx < 0) return current

  if (avg > budget * 1.35 && idx < order.length - 1) return order[idx + 1]!
  if (avg < budget * 0.7 && current === 'medium') return 'high'
  return current
}

export function tierConfig(tier: QualityTier) {
  // Particle counts must stay ≤ Swarm FBO slots (128² = 16_384).
  switch (tier) {
    case 'high':
      return {
        particles: 12_288,
        bloom: true,
        bloomMipmap: true,
        bloomScale: 0.28,
        dprMax: 1.25,
        pointSize: 0.85,
      }
    case 'medium':
      return {
        particles: 7_168,
        bloom: true,
        bloomMipmap: false,
        bloomScale: 0.22,
        dprMax: 1.0,
        pointSize: 0.7,
      }
    case 'low':
      return {
        particles: 3_072,
        bloom: false,
        bloomMipmap: false,
        bloomScale: 0,
        dprMax: 1.0,
        pointSize: 0.55,
      }
    case 'static':
      return {
        particles: 0,
        bloom: false,
        bloomMipmap: false,
        bloomScale: 0,
        dprMax: 1.0,
        pointSize: 0,
      }
  }
}
