import { describe, expect, it } from 'vitest'
import {
  ACT_IDS,
  AUTOPLAY_DWELL_MS,
  globalProgress,
} from '@/lib/scroll-progress'

describe('globalProgress', () => {
  it('maps act-local scrub into a continuous 0–1 range', () => {
    expect(globalProgress(0, 0, 7)).toBeCloseTo(0)
    expect(globalProgress(0, 1, 7)).toBeCloseTo(1 / 7)
    expect(globalProgress(3, 0.5, 7)).toBeCloseTo((3 + 0.5) / 7)
    expect(globalProgress(6, 1, 7)).toBeCloseTo(1)
  })

  it('clamps local progress and act index', () => {
    expect(globalProgress(-1, -2, 7)).toBeCloseTo(0)
    expect(globalProgress(99, 2, 7)).toBeCloseTo(1)
    expect(globalProgress(2, 1.5, 7)).toBeCloseTo(3 / 7)
  })

  it('exposes seven act DOM ids and a dwell budget', () => {
    expect(ACT_IDS).toHaveLength(7)
    expect(ACT_IDS[0]).toBe('act-cold-open')
    expect(ACT_IDS[6]).toBe('act-cooling')
    expect(AUTOPLAY_DWELL_MS).toBeGreaterThanOrEqual(5000)
  })
})
