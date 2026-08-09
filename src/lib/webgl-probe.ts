import { isSoftwareRenderer } from '@/lib/quality'

export interface WebGLProbeResult {
  ok: boolean
  software: boolean
  renderer: string
}

/** Force-release a temporary probe context so it cannot starve the real Canvas. */
export function releaseWebGLContext(
  gl: WebGLRenderingContext | WebGL2RenderingContext | null | undefined,
): void {
  if (!gl) return
  try {
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    // ignore — probe canvases are discarded immediately after
  }
}

/**
 * Cheap WebGL2 capability check.
 * Always releases the temporary context in `finally` — leaving it alive is a
 * common cause of "THREE.WebGLRenderer: Context Lost" when R3F mounts next.
 *
 * Do not use `failIfMajorPerformanceCaveat`: it false-negatives in remote/VM
 * browsers and is redundant with the software-rasterizer string check.
 */
export function probeWebGL2(): WebGLProbeResult {
  let gl: WebGL2RenderingContext | null = null
  try {
    const canvas = document.createElement('canvas')
    gl = canvas.getContext('webgl2', {
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
    })
    if (!gl) return { ok: false, software: false, renderer: '' }
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = dbg
      ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
      : ''
    return { ok: true, software: isSoftwareRenderer(renderer), renderer }
  } catch {
    return { ok: false, software: false, renderer: '' }
  } finally {
    releaseWebGLContext(gl)
  }
}

/** Inspect an already-created R3F / three renderer (no extra context). */
export function inspectWebGLRenderer(gl: {
  getContext: () => WebGLRenderingContext | WebGL2RenderingContext
}): WebGLProbeResult {
  try {
    const ctx = gl.getContext()
    const isWeb2 =
      typeof WebGL2RenderingContext !== 'undefined' &&
      ctx instanceof WebGL2RenderingContext
    const dbg = ctx.getExtension('WEBGL_debug_renderer_info')
    const renderer = dbg
      ? String(ctx.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
      : ''
    return {
      ok: isWeb2,
      software: isSoftwareRenderer(renderer),
      renderer,
    }
  } catch {
    return { ok: false, software: false, renderer: '' }
  }
}
