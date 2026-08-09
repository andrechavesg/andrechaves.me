import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
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
    const on = act === 'hefesto' ? 1 : act === 'cold-open' ? 0.08 : 0.18
    const target = 0.55 * (0.65 + on * 0.55)
    const stepped = springStep(scaleVal.current, target, scaleVel.current, dt, 90, 16)
    scaleVal.current = stepped.value
    scaleVel.current = stepped.velocity
    mesh.current.position.set(-2.2, 0.1, 0)
    mesh.current.rotation.y += dt * (act === 'hefesto' ? 0.55 : 0.12)
    mesh.current.scale.setScalar(scaleVal.current)
    const mat = mesh.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.15 + on * 1.1
    mesh.current.visible = on > 0.05
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
    const on = act === 'pontonet' ? 1 : 0.18
    const target = 0.5 * (0.65 + on * 0.55)
    const stepped = springStep(scaleVal.current, target, scaleVel.current, dt, 90, 16)
    scaleVal.current = stepped.value
    scaleVel.current = stepped.velocity
    mesh.current.position.set(2.2, 0.1, 0)
    mesh.current.rotation.z -= dt * (act === 'pontonet' ? 0.65 : 0.15)
    mesh.current.scale.setScalar(scaleVal.current)
    const mat = mesh.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.12 + on * 0.95
    mesh.current.visible = on > 0.05
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

function ExtrudedName() {
  const group = useRef<THREE.Group>(null)
  const opacityVel = useRef(0)
  const opacityVal = useRef(1)
  const act = useSceneStore((s) => s.act)

  useFrame((_, dt) => {
    if (!group.current) return
    const on = act === 'cold-open' ? 1 : act === 'swarm' ? 0.35 : 0.12
    const stepped = springStep(opacityVal.current, on, opacityVel.current, dt, 70, 14)
    opacityVal.current = stepped.value
    opacityVel.current = stepped.velocity
    group.current.position.set(0, 1.55, -1.2)
    group.current.rotation.x = -0.12
    group.current.visible = opacityVal.current > 0.08
    group.current.traverse((child) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined
      if (mat && 'opacity' in mat) {
        mat.transparent = true
        mat.opacity = opacityVal.current
        mat.emissiveIntensity = 0.2 + opacityVal.current * 0.55
      }
    })
  })

  return (
    <group ref={group}>
      {/* Metallic extruded display type via troika Text (through drei — not a direct dep) */}
      <Text
        fontSize={0.52}
        letterSpacing={-0.035}
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
        outlineWidth={0.012}
        outlineColor="#0A0705"
      >
        ANDRÉ CHAVES
        <meshStandardMaterial
          color="#c4cdd8"
          metalness={1}
          roughness={0.18}
          emissive="#FF6A00"
          emissiveIntensity={0.35}
          transparent
        />
      </Text>
      {/* Depth plate under type for extruded-metal read in still frames */}
      <mesh position={[0, -0.02, -0.08]}>
        <boxGeometry args={[5.2, 0.55, 0.12]} />
        <meshStandardMaterial
          color="#1c1917"
          metalness={0.95}
          roughness={0.3}
          emissive="#C2410C"
          emissiveIntensity={0.15}
          transparent
        />
      </mesh>
    </group>
  )
}

function SingleEmber() {
  const light = useRef<THREE.PointLight>(null)
  const act = useSceneStore((s) => s.act)

  useFrame((state) => {
    if (!light.current) return
    const on = act === 'cold-open' || act === 'cooling' ? 1 : 0.25
    const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 3.2) * 0.15
    light.current.intensity = 18 * on * pulse
    light.current.position.set(0, -0.55, 0.4)
  })

  return <pointLight ref={light} color="#FF6A00" distance={12} decay={2} />
}

export function Emblems() {
  return (
    <group>
      <ExtrudedName />
      <SingleEmber />
      <HefestoEmblem />
      <PontoNetEmblem />
    </group>
  )
}
