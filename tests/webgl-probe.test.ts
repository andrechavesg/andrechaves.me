import { afterEach, describe, expect, it, vi } from 'vitest'
import { probeWebGL2, releaseWebGLContext } from '@/lib/webgl-probe'

function stubDocument(fakeGl: WebGL2RenderingContext) {
  vi.stubGlobal('document', {
    createElement: (tag: string) => {
      if (tag === 'canvas') {
        return { getContext: () => fakeGl, width: 0, height: 0 }
      }
      throw new Error(`unexpected createElement(${tag})`)
    },
  })
}

function fakeWebGL(renderer: string) {
  const loseContext = vi.fn()
  const getExtension = vi.fn((name: string) => {
    if (name === 'WEBGL_lose_context') return { loseContext }
    if (name === 'WEBGL_debug_renderer_info') {
      return { UNMASKED_RENDERER_WEBGL: 0x9246 }
    }
    return null
  })
  const getParameter = vi.fn(() => renderer)
  const gl = { getExtension, getParameter } as unknown as WebGL2RenderingContext
  return { gl, loseContext }
}

describe('webgl probe lifecycle', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('releases the temporary context after probing', () => {
    const { gl, loseContext } = fakeWebGL('ANGLE (NVIDIA)')
    stubDocument(gl)

    const result = probeWebGL2()
    expect(result.ok).toBe(true)
    expect(result.software).toBe(false)
    expect(loseContext).toHaveBeenCalledTimes(1)
  })

  it('marks SwiftShader probes as software and still releases', () => {
    const { gl, loseContext } = fakeWebGL('Google SwiftShader')
    stubDocument(gl)

    const result = probeWebGL2()
    expect(result.ok).toBe(true)
    expect(result.software).toBe(true)
    expect(loseContext).toHaveBeenCalledTimes(1)
  })

  it('releaseWebGLContext is a no-op for null', () => {
    expect(() => releaseWebGLContext(null)).not.toThrow()
  })
})
