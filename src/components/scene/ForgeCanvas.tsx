import { useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Swarm } from './Swarm'
import { GuardrailLattice } from './GuardrailLattice'
import { Emblems } from './Emblems'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'
import { useSceneStore } from '@/stores/sceneStore'
import {
  isSoftwareRenderer,
  selectInitialTier,
  tierConfig,
} from '@/lib/quality'
import { shouldRunAnimationLoop } from '@/lib/motion-preference'

function probeWebGL2(): { ok: boolean; software: boolean } {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true })
    if (!gl) return { ok: false, software: false }
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = dbg
      ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
      : ''
    return { ok: true, software: isSoftwareRenderer(renderer) }
  } catch {
    return { ok: false, software: false }
  }
}

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

export function ForgeCanvas() {
  const tier = useSceneStore((s) => s.tier)
  const setTier = useSceneStore((s) => s.setTier)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const [ready, setReady] = useState(false)
  const cfg = tierConfig(tier)

  useEffect(() => {
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

  // Reduced motion / static: poster only — no rAF loop (plan §4)
  if (!ready || tier === 'static' || !shouldRunAnimationLoop(reducedMotion)) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_25%_15%,#c2410c55,transparent_40%),radial-gradient(ellipse_at_70%_80%,#ff6a0018,transparent_45%),#0a0705]"
        aria-hidden
      />
    )
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
        }}
        camera={{ position: [0, 0.35, 6.2], fov: 45, near: 0.1, far: 40 }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor('#0A0705')
        }}
      >
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
