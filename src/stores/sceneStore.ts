import { create } from 'zustand'
import type { QualityTier } from '@/lib/quality'

export type ActId =
  | 'cold-open'
  | 'swarm'
  | 'guardrail'
  | 'hefesto'
  | 'pontonet'
  | 'record'
  | 'cooling'

export type HitlState = 'idle' | 'pending' | 'approved' | 'rejected' | 'lied'

interface SceneState {
  act: ActId
  progress: number
  tier: QualityTier
  reducedMotion: boolean
  hitl: HitlState
  greenCheckLied: boolean
  setAct: (act: ActId) => void
  setProgress: (n: number) => void
  setTier: (t: QualityTier) => void
  setReducedMotion: (v: boolean) => void
  setHitl: (s: HitlState) => void
  triggerGreenCheckLied: () => void
}

export const useSceneStore = create<SceneState>((set) => ({
  act: 'cold-open',
  progress: 0,
  tier: 'high',
  reducedMotion: false,
  hitl: 'idle',
  greenCheckLied: false,
  setAct: (act) => set({ act }),
  setProgress: (progress) => set({ progress }),
  setTier: (tier) => set({ tier }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setHitl: (hitl) => set({ hitl }),
  triggerGreenCheckLied: () => set({ greenCheckLied: true, hitl: 'lied' }),
}))
