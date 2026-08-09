import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
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
      <ambientLight intensity={0.15} />
      <pointLight position={[2, 3, 2]} intensity={12} color="#FF6A00" distance={20} />
      <pointLight position={[-3, 1, -2]} intensity={4} color="#FF8A1E" distance={16} />
      <spotLight
        position={[0, 6, 4]}
        angle={0.4}
        penumbra={0.8}
        intensity={8}
        color="#fff5eb"
        castShadow={false}
      />
    </>
  )
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

  if (!ready || tier === 'static' || !shouldRunAnimationLoop(reducedMotion)) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_25%_15%,#c2410c44,transparent_45%),#0a0705]"
        aria-hidden
      />
    )
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0" style={{ width: '100%', height: '100%' }} aria-hidden>
      <Canvas
        dpr={[1, cfg.dprMax]}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
        }}
        camera={{ position: [0, 0.4, 6.5], fov: 45, near: 0.1, far: 40 }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor('#0A0705')
        }}
      >
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
