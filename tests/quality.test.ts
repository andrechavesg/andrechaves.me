import { describe, expect, it } from 'vitest'
import {
  adaptTier,
  isSoftwareRenderer,
  selectInitialTier,
  tierConfig,
} from '@/lib/quality'
import {
  resolveReducedMotion,
  shouldRunAnimationLoop,
} from '@/lib/motion-preference'

describe('quality tier selection', () => {
  it('gates software rasterizers and missing WebGL2 to static', () => {
    expect(isSoftwareRenderer('Google SwiftShader')).toBe(true)
    expect(isSoftwareRenderer('Mesa llvmpipe')).toBe(true)
    expect(
      selectInitialTier({
        webgl2: false,
        softwareRasterizer: false,
        reducedMotion: false,
      }),
    ).toBe('static')
    expect(
      selectInitialTier({
        webgl2: true,
        softwareRasterizer: true,
        reducedMotion: false,
      }),
    ).toBe('static')
  })

  it('reduced motion forces static and kills rAF', () => {
    expect(
      selectInitialTier({
        webgl2: true,
        softwareRasterizer: false,
        reducedMotion: true,
      }),
    ).toBe('static')
    expect(shouldRunAnimationLoop(true)).toBe(false)
    expect(shouldRunAnimationLoop(false)).toBe(true)
  })

  it('motion preference overrides system MQ', () => {
    expect(resolveReducedMotion('on', true)).toBe(false)
    expect(resolveReducedMotion('off', false)).toBe(true)
    expect(resolveReducedMotion('system', true)).toBe(true)
  })

  it('adaptive loop steps down when frames miss budget', () => {
    const slow = Array.from({ length: 60 }, () => 32)
    expect(adaptTier('high', { frameMs: slow })).toBe('medium')
    expect(tierConfig('low').bloom).toBe(false)
    expect(tierConfig('high').dprMax).toBe(1.5)
  })
})
