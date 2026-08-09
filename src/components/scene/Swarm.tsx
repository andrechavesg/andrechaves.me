import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '@/stores/sceneStore'
import { adaptTier, tierConfig } from '@/lib/quality'
import { simFragment, simVertex, renderFragment, renderVertex } from './shaders'

/** 128² = 16,384 slots — enough for high tier, far less VRAM than 256². */
const SIZE = 128
const SLOT_COUNT = SIZE * SIZE

export function Swarm() {
  const { gl } = useThree()
  const tier = useSceneStore((s) => s.tier)
  const progress = useSceneStore((s) => s.progress)
  const hitl = useSceneStore((s) => s.hitl)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const cfg = tierConfig(tier)

  // GPU resources are created once per gl — never rebuild on tier/pointSize changes
  // (that previously leaked FBOs under StrictMode / adaptive tier steps).
  const gpu = useMemo(() => {
    const rtOpts: THREE.RenderTargetOptions = {
      type: THREE.HalfFloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false,
    }
    const rtA = new THREE.WebGLRenderTarget(SIZE, SIZE, rtOpts)
    const rtB = new THREE.WebGLRenderTarget(SIZE, SIZE, rtOpts)

    const data = new Float32Array(SLOT_COUNT * 4)
    for (let i = 0; i < SLOT_COUNT; i++) {
      data[i * 4] = (Math.random() - 0.5) * 0.15
      data[i * 4 + 1] = (Math.random() - 0.5) * 0.15 - 0.55
      data[i * 4 + 2] = (Math.random() - 0.5) * 0.15
      data[i * 4 + 3] = 1
    }
    const seed = new THREE.DataTexture(data, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    seed.needsUpdate = true

    const simMaterial = new THREE.ShaderMaterial({
      vertexShader: simVertex,
      fragmentShader: simFragment,
      uniforms: {
        uPositions: { value: seed },
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uHitl: { value: 0 },
      },
    })
    const simScene = new THREE.Scene()
    const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const simGeo = new THREE.PlaneGeometry(2, 2)
    const simQuad = new THREE.Mesh(simGeo, simMaterial)
    simScene.add(simQuad)

    const positions = new Float32Array(SLOT_COUNT * 3)
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const i = y * SIZE + x
        positions[i * 3] = x / (SIZE - 1)
        positions[i * 3 + 1] = y / (SIZE - 1)
        positions[i * 3 + 2] = Math.random()
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const renderMat = new THREE.ShaderMaterial({
      vertexShader: renderVertex,
      fragmentShader: renderFragment,
      uniforms: {
        uPositions: { value: rtA.texture },
        uSize: { value: 1.0 },
        uProgress: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geo, renderMat)

    return { rtA, rtB, simScene, simCamera, simMaterial, points, geo, seed, simGeo }
  }, [gl])

  const { rtA, rtB, simScene, simCamera, simMaterial, points, geo, seed, simGeo } = gpu

  const flip = useRef(false)
  const frames = useRef<number[]>([])
  const setTier = useSceneStore((s) => s.setTier)

  useEffect(() => {
    const max = Math.min(cfg.particles, SLOT_COUNT)
    geo.setDrawRange(0, max)
  }, [cfg.particles, geo])

  useEffect(() => {
    return () => {
      rtA.dispose()
      rtB.dispose()
      seed.dispose()
      simMaterial.dispose()
      simGeo.dispose()
      geo.dispose()
      ;(points.material as THREE.Material).dispose()
    }
  }, [rtA, rtB, seed, simMaterial, simGeo, geo, points])

  useFrame((state, delta) => {
    if (reducedMotion || tier === 'static') return
    if (typeof document !== 'undefined' && document.hidden) return
    if (gl.getContext().isContextLost()) return

    frames.current.push(delta * 1000)
    if (frames.current.length >= 60) {
      const sample = frames.current.slice(-60)
      const next = adaptTier(tier, { frameMs: sample })
      if (next !== tier) setTier(next)
      if (frames.current.length > 120) frames.current = sample
    }

    const hitlVal =
      hitl === 'approved' ? 1 : hitl === 'rejected' ? -1 : hitl === 'lied' ? 2 : 0

    simMaterial.uniforms.uTime.value = state.clock.elapsedTime
    simMaterial.uniforms.uProgress.value = progress
    simMaterial.uniforms.uHitl.value = hitlVal

    const read = flip.current ? rtB : rtA
    const write = flip.current ? rtA : rtB
    simMaterial.uniforms.uPositions.value = read.texture

    const prev = gl.getRenderTarget()
    gl.setRenderTarget(write)
    gl.render(simScene, simCamera)
    gl.setRenderTarget(prev)

    const renderMat = points.material as THREE.ShaderMaterial
    renderMat.uniforms.uPositions.value = write.texture
    renderMat.uniforms.uSize.value = cfg.pointSize
    renderMat.uniforms.uProgress.value = progress
    flip.current = !flip.current
  })

  if (tier === 'static') return null
  return <primitive object={points} />
}
