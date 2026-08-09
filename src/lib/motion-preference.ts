const STORAGE_KEY = 'andrechaves.motion'

export type MotionPreference = 'system' | 'on' | 'off'

export function readStoredMotion(): MotionPreference {
  if (typeof localStorage === 'undefined') return 'system'
  const v = localStorage.getItem(STORAGE_KEY)
  if (v === 'on' || v === 'off' || v === 'system') return v
  return 'system'
}

export function writeStoredMotion(value: MotionPreference): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, value)
}

export function resolveReducedMotion(
  preference: MotionPreference,
  systemPrefersReduced: boolean,
): boolean {
  if (preference === 'on') return false
  if (preference === 'off') return true
  return systemPrefersReduced
}

/** When reduced: render one static frame and stop rAF — never merely slow. */
export function shouldRunAnimationLoop(reducedMotion: boolean): boolean {
  return !reducedMotion
}
