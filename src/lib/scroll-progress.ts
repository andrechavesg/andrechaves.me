/** Map a ScrollTrigger local progress (0–1) inside an act to global 0–1. */
export function globalProgress(
  actIndex: number,
  localProgress: number,
  actCount: number,
): number {
  if (actCount <= 0) return 0
  const local = Math.min(1, Math.max(0, localProgress))
  const index = Math.min(Math.max(0, actIndex), actCount - 1)
  return (index + local) / actCount
}

export const ACT_IDS = [
  'act-cold-open',
  'act-swarm',
  'act-guardrail',
  'act-hefesto',
  'act-pontonet',
  'act-record',
  'act-cooling',
] as const

export type ScrollActDomId = (typeof ACT_IDS)[number]

export const AUTOPLAY_DWELL_MS = 7000
export const USER_TAKEOVER_KEY = 'forge-scroll-user'
