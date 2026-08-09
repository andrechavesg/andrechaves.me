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
  // Medium until ForgeCanvas capability bootstrap — avoids a high-VRAM first frame.
  tier: 'medium',
  reducedMotion: false,
  hitl: 'idle',
  greenCheckLied: false,
  setAct: (act) => set((s) => (s.act === act ? s : { act })),
  setProgress: (progress) => set((s) => (s.progress === progress ? s : { progress })),
  setTier: (tier) => set((s) => (s.tier === tier ? s : { tier })),
  setReducedMotion: (reducedMotion) =>
    set((s) => (s.reducedMotion === reducedMotion ? s : { reducedMotion })),
  setHitl: (hitl) => set((s) => (s.hitl === hitl ? s : { hitl })),
  triggerGreenCheckLied: () => set({ greenCheckLied: true, hitl: 'lied' }),
}))
