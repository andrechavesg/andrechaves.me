import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '@/stores/sceneStore'
import { tierConfig } from '@/lib/quality'
import { simFragment, simVertex, renderFragment, renderVertex } from './shaders'

const SIZE = 256 // 65,536 particles base; scaled via draw range

export function Swarm() {
  const { gl } = useThree()
  const tier = useSceneStore((s) => s.tier)
  const progress = useSceneStore((s) => s.progress)
  const hitl = useSceneStore((s) => s.hitl)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const cfg = tierConfig(tier)

  const { rtA, rtB, simScene, simCamera, simMaterial, points, geo } = useMemo(() => {
    const rtOpts: THREE.RenderTargetOptions = {
      type: THREE.HalfFloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
    }
    const rtA = new THREE.WebGLRenderTarget(SIZE, SIZE, rtOpts)
    const rtB = new THREE.WebGLRenderTarget(SIZE, SIZE, rtOpts)

    // seed positions
    const data = new Float32Array(SIZE * SIZE * 4)
    for (let i = 0; i < SIZE * SIZE; i++) {
      data[i * 4] = (Math.random() - 0.5) * 0.2
      data[i * 4 + 1] = (Math.random() - 0.5) * 0.2
      data[i * 4 + 2] = (Math.random() - 0.5) * 0.2
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
    const simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial)
    simScene.add(simQuad)

    const count = SIZE * SIZE
    const positions = new Float32Array(count * 3)
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
        uSize: { value: cfg.pointSize },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geo, renderMat)

    return { rtA, rtB, simScene, simCamera, simMaterial, points, geo }
  }, [gl, cfg.pointSize])

  const flip = useRef(false)
  const frames = useRef<number[]>([])
  const setTier = useSceneStore((s) => s.setTier)

  useEffect(() => {
    const max = Math.min(cfg.particles, SIZE * SIZE)
    geo.setDrawRange(0, max)
  }, [cfg.particles, geo])

  useEffect(() => {
    return () => {
      rtA.dispose()
      rtB.dispose()
      simMaterial.dispose()
      geo.dispose()
      ;(points.material as THREE.Material).dispose()
    }
  }, [rtA, rtB, simMaterial, geo, points])

  useFrame((state, delta) => {
    if (reducedMotion || tier === 'static') return

    frames.current.push(delta * 1000)
    if (frames.current.length > 60) {
      frames.current.shift()
      if (frames.current.length === 60) {
        const avg = frames.current.reduce((a, b) => a + b, 0) / 60
        if (avg > 22 && tier === 'high') setTier('medium')
        else if (avg > 28 && tier === 'medium') setTier('low')
      }
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

    ;(points.material as THREE.ShaderMaterial).uniforms.uPositions.value = write.texture
    ;(points.material as THREE.ShaderMaterial).uniforms.uSize.value = cfg.pointSize
    flip.current = !flip.current
  })

  if (tier === 'static') return null
  return <primitive object={points} />
}
