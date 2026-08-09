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
 * Always releases the temporary context in `finally`.
 *
 * Prefer skipping this entirely and inspecting the R3F renderer in `onCreated`
 * when a Canvas will mount anyway — dual contexts are the Context Lost footgun.
 */
export function probeWebGL2(): WebGLProbeResult {
  let gl: WebGL2RenderingContext | null = null
  try {
    const canvas = document.createElement('canvas')
    gl = canvas.getContext('webgl2', {
      powerPreference: 'default',
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
    // Avoid brittle `instanceof` across realm boundaries (Electron / embedded browsers).
    const version = String(ctx.getParameter(ctx.VERSION) ?? '')
    const isWeb2 =
      version.includes('WebGL 2') ||
      (typeof WebGL2RenderingContext !== 'undefined' &&
        ctx instanceof WebGL2RenderingContext)
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
