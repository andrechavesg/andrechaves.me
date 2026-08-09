import { describe, expect, it } from 'vitest'
import {
  HEFESTO_ANVIL_PATH,
  PONTONET_HAND_PATH,
  PONTONET_HUB_PATH,
  PONTONET_RING_PATH,
} from '@/lib/emblem-paths'
import { extrudeSvgPath } from '@/lib/svg-shape'

describe('emblem SVG paths', () => {
  it('defines non-empty path data for Hefesto and PontoNet', () => {
    expect(HEFESTO_ANVIL_PATH.length).toBeGreaterThan(20)
    expect(PONTONET_RING_PATH.length).toBeGreaterThan(20)
    expect(PONTONET_HAND_PATH.length).toBeGreaterThan(10)
    expect(PONTONET_HUB_PATH.length).toBeGreaterThan(10)
  })

  it('extrudes SVG paths into BufferGeometry with positions', () => {
    const geo = extrudeSvgPath(HEFESTO_ANVIL_PATH, 0.2, 1.5)
    const pos = geo.getAttribute('position')
    expect(pos).toBeTruthy()
    expect(pos.count).toBeGreaterThan(24)
    geo.dispose()
  })
})
