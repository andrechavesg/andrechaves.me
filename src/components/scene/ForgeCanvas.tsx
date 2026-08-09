import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Swarm } from './Swarm'
import { GuardrailLattice } from './GuardrailLattice'
import { Emblems } from './Emblems'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'
import { useSceneStore } from '@/stores/sceneStore'
import { selectInitialTier, tierConfig } from '@/lib/quality'
import { shouldRunAnimationLoop } from '@/lib/motion-preference'
import { inspectWebGLRenderer } from '@/lib/webgl-probe'

const POSTER_CLASS =
  'pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_25%_15%,#c2410c55,transparent_40%),radial-gradient(ellipse_at_70%_80%,#ff6a0018,transparent_45%),#0a0705]'

type FallbackReason = 'static-tier' | 'context-lost' | 'reduced-motion'

function SceneLights() {
  return (
    <>
      <color attach="background" args={['#0A0705']} />
      <fog attach="fog" args={['#0A0705', 8, 18]} />
      <ambientLight intensity={0.12} />
      <pointLight position={[2.8, 3.0, 2]} intensity={5.5} color="#FF6A00" distance={16} />
      <pointLight position={[0.5, 1.2, -2]} intensity={2.0} color="#FF8A1E" distance={12} />
      <spotLight
        position={[2.0, 6.0, 4]}
        angle={0.38}
        penumbra={0.9}
        intensity={4.5}
        color="#fff5eb"
        castShadow={false}
      />
    </>
  )
}

/** Pause rAF when tab hidden; resume with invalidate when visible again. */
function VisibilityGate() {
  const { invalidate, setFrameloop } = useThree()
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setFrameloop('never')
      else {
        setFrameloop('always')
        invalidate()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [invalidate, setFrameloop])
  return null
}

function ContextLossBridge({ onLost }: { onLost: () => void }) {
  const { gl } = useThree()
  useEffect(() => {
    const canvas = gl.domElement
    const handleLost = (event: Event) => {
      event.preventDefault()
      onLost()
    }
    canvas.addEventListener('webglcontextlost', handleLost, false)
    return () => canvas.removeEventListener('webglcontextlost', handleLost, false)
  }, [gl, onLost])
  return null
}

/**
 * Defer postprocessing until the GPGPU swarm has warmed up a few frames.
 * Mounting EffectComposer + Bloom in the same tick as FBO allocation is a
 * common VRAM spike that triggers Context Lost on desktop Chrome.
 */
function DeferredEffects() {
  const [ready, setReady] = useState(false)
  const frames = useRef(0)

  useFrame(() => {
    if (ready) return
    frames.current += 1
    if (frames.current >= 8) setReady(true)
  })

  if (!ready) return null
  return <Effects />
}

/**
 * Capability check on the *live* R3F renderer — never allocate a second context.
 * Only software rasterizers force the poster; a working Canvas is not torn down
 * by a flaky WebGL2 version string check.
 */
function CapabilityBootstrap({
  onMeta,
}: {
  onMeta: (meta: { renderer: string; version: string }) => void
}) {
  const { gl } = useThree()
  const setTier = useSceneStore((s) => s.setTier)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true

    const inspected = inspectWebGLRenderer(gl)
    let version = ''
    try {
      const ctx = gl.getContext()
      version = String(ctx.getParameter(ctx.VERSION) ?? '')
    } catch {
      version = ''
    }
    onMeta({ renderer: inspected.renderer, version })

    // Soft rasterizers cannot sustain the forge — fall back.
    // Do NOT treat a missing/odd version string as fatal: the Canvas already exists.
    if (inspected.software) {
      setTier('static')
      return
    }

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData

    const next = selectInitialTier({
      webgl2: true,
      softwareRasterizer: false,
      coarsePointer: coarse,
      deviceMemory: mem,
      saveData,
      reducedMotion,
      gpuTier: coarse ? 2 : 3,
    })
    // reducedMotion is already gated by the parent; keep a non-static tier here.
    setTier(next === 'static' ? 'medium' : next)
  }, [gl, onMeta, reducedMotion, setTier])

  return null
}

function Poster({
  reason,
  renderer,
  version,
}: {
  reason: FallbackReason
  renderer?: string
  version?: string
}) {
  return (
    <div
      className={POSTER_CLASS}
      data-forge-fallback={reason}
      data-forge-renderer={renderer || ''}
      data-forge-version={version || ''}
      aria-hidden
    />
  )
}

export function ForgeCanvas() {
  const tier = useSceneStore((s) => s.tier)
  const setTier = useSceneStore((s) => s.setTier)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const [contextLost, setContextLost] = useState(false)
  const [meta, setMeta] = useState({ renderer: '', version: '' })
  const cfg = tierConfig(tier === 'static' ? 'medium' : tier)

  const handleContextLost = useCallback(() => {
    setContextLost(true)
    setTier('static')
  }, [setTier])

  const handleMeta = useCallback((next: { renderer: string; version: string }) => {
    setMeta(next)
  }, [])

  if (reducedMotion || !shouldRunAnimationLoop(reducedMotion)) {
    return <Poster reason="reduced-motion" {...meta} />
  }
  if (contextLost) {
    return <Poster reason="context-lost" {...meta} />
  }
  // Soft-rasterizer path sets tier to static from CapabilityBootstrap.
  if (tier === 'static') {
    return <Poster reason="static-tier" {...meta} />
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ width: '100%', height: '100%' }}
      data-forge-fallback="live"
      data-forge-renderer={meta.renderer}
      data-forge-version={meta.version}
      aria-hidden
    >
      <Canvas
        dpr={[1, cfg.dprMax]}
        gl={{
          antialias: false,
          powerPreference: 'default',
          alpha: false,
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ position: [0, 0.35, 6.2], fov: 45, near: 0.1, far: 40 }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor('#0A0705')
        }}
      >
        <CapabilityBootstrap onMeta={handleMeta} />
        <ContextLossBridge onLost={handleContextLost} />
        <VisibilityGate />
        <SceneLights />
        <CameraRig />
        <Swarm />
        <GuardrailLattice />
        <Emblems />
        <DeferredEffects />
      </Canvas>
    </div>
  )
}
