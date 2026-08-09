import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useSceneStore } from '@/stores/sceneStore'
import { springStep } from '@/lib/spring'
import { extrudeSvgPath, mergeGeometries } from '@/lib/svg-shape'
import {
  HEFESTO_ANVIL_PATH,
  PONTONET_HAND_PATH,
  PONTONET_HUB_PATH,
  PONTONET_RING_PATH,
} from '@/lib/emblem-paths'

const metal = {
  color: '#1c1917',
  metalness: 0.92,
  roughness: 0.22,
  emissive: '#FF6A00',
} as const

function HefestoEmblem() {
  const mesh = useRef<THREE.Mesh>(null)
  const scaleVel = useRef(0)
  const scaleVal = useRef(0.4)
  const act = useSceneStore((s) => s.act)
  const geometry = useMemo(() => extrudeSvgPath(HEFESTO_ANVIL_PATH, 0.28, 1.7), [])

  useFrame((_, dt) => {
    if (!mesh.current) return
    // Only fully present on the Hefesto act — faint bleed on other acts + bloom
    // washed out DOM copy (especially on mobile).
    const on = act === 'hefesto' ? 1 : 0
    const target = on > 0 ? 0.72 : 0
    const stepped = springStep(scaleVal.current, target, scaleVel.current, dt, 90, 16)
    scaleVal.current = stepped.value
    scaleVel.current = stepped.velocity
    mesh.current.position.set(1.6, 0.15, 0)
    mesh.current.rotation.y += dt * (act === 'hefesto' ? 0.55 : 0.12)
    mesh.current.scale.setScalar(scaleVal.current)
    const mat = mesh.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.2 + on * 0.75
    mesh.current.visible = scaleVal.current > 0.04
  })

  return (
    <mesh ref={mesh} geometry={geometry} castShadow={false}>
      <meshStandardMaterial {...metal} emissiveIntensity={0.3} />
    </mesh>
  )
}

function PontoNetEmblem() {
  const mesh = useRef<THREE.Mesh>(null)
  const scaleVel = useRef(0)
  const scaleVal = useRef(0.4)
  const act = useSceneStore((s) => s.act)
  const geometry = useMemo(() => {
    const ring = extrudeSvgPath(PONTONET_RING_PATH, 0.16, 1.5)
    const hand = extrudeSvgPath(PONTONET_HAND_PATH, 0.2, 1.5)
    const hub = extrudeSvgPath(PONTONET_HUB_PATH, 0.24, 1.5)
    return mergeGeometries([ring, hand, hub])
  }, [])

  useFrame((_, dt) => {
    if (!mesh.current) return
    const on = act === 'pontonet' ? 1 : 0
    const target = on > 0 ? 0.65 : 0
    const stepped = springStep(scaleVal.current, target, scaleVel.current, dt, 90, 16)
    scaleVal.current = stepped.value
    scaleVel.current = stepped.velocity
    mesh.current.position.set(1.7, 0.1, 0)
    mesh.current.rotation.z -= dt * (act === 'pontonet' ? 0.65 : 0.15)
    mesh.current.scale.setScalar(scaleVal.current)
    const mat = mesh.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.15 + on * 0.7
    mesh.current.visible = scaleVal.current > 0.04
  })

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshStandardMaterial
        color="#0a0705"
        metalness={0.88}
        roughness={0.28}
        emissive="#FF8A1E"
        emissiveIntensity={0.25}
      />
    </mesh>
  )
}

function SingleEmber() {
  const light = useRef<THREE.PointLight>(null)
  const act = useSceneStore((s) => s.act)

  useFrame((state) => {
    if (!light.current) return
    const on = act === 'cold-open' || act === 'cooling' ? 1 : 0.25
    const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 3.2) * 0.15
    light.current.intensity = 8 * on * pulse
    // Bias right so left-column DOM copy stays readable
    light.current.position.set(1.1, -0.55, 0.4)
  })

  return <pointLight ref={light} color="#FF6A00" distance={12} decay={2} />
}

export function Emblems() {
  return (
    <group>
      <SingleEmber />
      <HefestoEmblem />
      <PontoNetEmblem />
    </group>
  )
}
