import { describe, expect, it } from 'vitest'
import { springStep } from '@/lib/spring'

describe('springStep', () => {
  it('moves toward the target without overshooting forever', () => {
    let value = 0
    let velocity = 0
    for (let i = 0; i < 120; i++) {
      const next = springStep(value, 1, velocity, 1 / 60, 80, 14)
      value = next.value
      velocity = next.velocity
    }
    expect(value).toBeGreaterThan(0.95)
    expect(Math.abs(velocity)).toBeLessThan(0.05)
  })

  it('snaps when already at rest on target', () => {
    const next = springStep(1, 1, 0, 1 / 60)
    expect(next.value).toBe(1)
    expect(next.velocity).toBe(0)
  })
})
