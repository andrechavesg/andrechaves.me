import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Swarm } from './Swarm'
import { GuardrailLattice } from './GuardrailLattice'
import { Emblems } from './Emblems'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'
import { useSceneStore } from '@/stores/sceneStore'
import { selectInitialTier, tierConfig } from '@/lib/quality'
import { shouldRunAnimationLoop } from '@/lib/motion-preference'
import { inspectWebGLRenderer, probeWebGL2 } from '@/lib/webgl-probe'

const POSTER_CLASS =
  'pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_25%_15%,#c2410c55,transparent_40%),radial-gradient(ellipse_at_70%_80%,#ff6a0018,transparent_45%),#0a0705]'

function SceneLights() {
  return (
    <>
      <color attach="background" args={['#0A0705']} />
      <fog attach="fog" args={['#0A0705', 8, 18]} />
      <ambientLight intensity={0.12} />
      <pointLight position={[2.5, 3.2, 2]} intensity={10} color="#FF6A00" distance={18} />
      <pointLight position={[-3, 1.2, -2]} intensity={3.5} color="#FF8A1E" distance={14} />
      <spotLight
        position={[0, 6.5, 4]}
        angle={0.42}
        penumbra={0.85}
        intensity={7}
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
      // Prefer a clean poster fallback over a half-dead GPGPU pipeline.
      event.preventDefault()
      onLost()
    }
    canvas.addEventListener('webglcontextlost', handleLost, false)
    return () => canvas.removeEventListener('webglcontextlost', handleLost, false)
  }, [gl, onLost])
  return null
}

export function ForgeCanvas() {
  const tier = useSceneStore((s) => s.tier)
  const setTier = useSceneStore((s) => s.setTier)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const [ready, setReady] = useState(false)
  const [contextLost, setContextLost] = useState(false)
  const bootstrapped = useRef(false)
  const cfg = tierConfig(tier === 'static' ? 'medium' : tier)

  const handleContextLost = useCallback(() => {
    setContextLost(true)
    setTier('static')
  }, [setTier])

  useEffect(() => {
    // Probe releases its temporary context immediately (see webgl-probe.ts).
    // This only decides whether to mount the real Canvas at all.
    const { ok, software } = probeWebGL2()
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData
    const next = selectInitialTier({
      webgl2: ok,
      softwareRasterizer: software,
      coarsePointer: coarse,
      deviceMemory: mem,
      saveData,
      reducedMotion,
      gpuTier: coarse ? 2 : 3,
    })
    setTier(next)
    setReady(true)
  }, [reducedMotion, setTier])

  const showPoster =
    !ready ||
    contextLost ||
    tier === 'static' ||
    !shouldRunAnimationLoop(reducedMotion)

  if (showPoster) {
    return <div className={POSTER_CLASS} aria-hidden />
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ width: '100%', height: '100%' }}
      aria-hidden
    >
      <Canvas
        dpr={[1, cfg.dprMax]}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ position: [0, 0.35, 6.2], fov: 45, near: 0.1, far: 40 }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor('#0A0705')
          // Re-validate on the real context (no second allocation). Soft rasterizers
          // that slipped past the probe still fall back to the poster.
          if (bootstrapped.current) return
          bootstrapped.current = true
          const inspected = inspectWebGLRenderer(gl)
          if (!inspected.ok || inspected.software) {
            setTier('static')
          }
        }}
      >
        <ContextLossBridge onLost={handleContextLost} />
        <VisibilityGate />
        <SceneLights />
        <CameraRig />
        <Swarm />
        <GuardrailLattice />
        <Emblems />
        <Effects />
      </Canvas>
    </div>
  )
}
