import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useSceneStore } from '@/stores/sceneStore'

function extrudeFromShape(shape: THREE.Shape, depth = 0.25) {
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 2,
  })
}

function HefestoEmblem() {
  const mesh = useRef<THREE.Mesh>(null)
  const act = useSceneStore((s) => s.act)
  const geometry = useMemo(() => {
    // Abstract anvil / hammer silhouette
    const s = new THREE.Shape()
    s.moveTo(-0.8, -0.4)
    s.lineTo(0.8, -0.4)
    s.lineTo(0.6, -0.1)
    s.lineTo(0.25, -0.1)
    s.lineTo(0.25, 0.7)
    s.lineTo(-0.25, 0.7)
    s.lineTo(-0.25, -0.1)
    s.lineTo(-0.6, -0.1)
    s.closePath()
    return extrudeFromShape(s)
  }, [])

  useFrame((state) => {
    if (!mesh.current) return
    const on = act === 'hefesto' ? 1 : 0.15
    mesh.current.position.x = -2.2
    mesh.current.rotation.y = state.clock.elapsedTime * 0.35
    mesh.current.scale.setScalar(0.55 * (0.7 + on * 0.5))
    ;(mesh.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + on * 0.8
  })

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshStandardMaterial
        color="#1c1917"
        metalness={0.9}
        roughness={0.25}
        emissive="#FF6A00"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

function PontoNetEmblem() {
  const mesh = useRef<THREE.Mesh>(null)
  const act = useSceneStore((s) => s.act)
  const geometry = useMemo(() => {
    // Clock / node mark
    const s = new THREE.Shape()
    s.absarc(0, 0, 0.7, 0, Math.PI * 2, false)
    const hole = new THREE.Path()
    hole.absarc(0, 0, 0.45, 0, Math.PI * 2, true)
    s.holes.push(hole)
    const geo = extrudeFromShape(s, 0.18)
    return geo
  }, [])

  useFrame((state) => {
    if (!mesh.current) return
    const on = act === 'pontonet' ? 1 : 0.15
    mesh.current.position.x = 2.2
    mesh.current.rotation.z = -state.clock.elapsedTime * 0.4
    mesh.current.scale.setScalar(0.5 * (0.7 + on * 0.5))
    ;(mesh.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15 + on * 0.7
  })

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshStandardMaterial
        color="#0a0705"
        metalness={0.85}
        roughness={0.3}
        emissive="#FF8A1E"
        emissiveIntensity={0.25}
      />
    </mesh>
  )
}

export function ExtrudedName() {
  // Lightweight metallic plate stand-in for extruded type (Text from drei pulls troika transitively)
  const mesh = useRef<THREE.Mesh>(null)
  const act = useSceneStore((s) => s.act)
  const geometry = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-2.4, -0.35)
    s.lineTo(2.4, -0.35)
    s.lineTo(2.2, 0.35)
    s.lineTo(-2.2, 0.35)
    s.closePath()
    return extrudeFromShape(s, 0.12)
  }, [])

  useFrame(() => {
    if (!mesh.current) return
    const on = act === 'cold-open' ? 1 : 0.2
    mesh.current.position.set(0, 1.6, -1)
    mesh.current.visible = on > 0.25
    ;(mesh.current.material as THREE.MeshStandardMaterial).opacity = on
  })

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshStandardMaterial
        color="#93a3b8"
        metalness={1}
        roughness={0.2}
        transparent
        emissive="#FF6A00"
        emissiveIntensity={0.15}
      />
    </mesh>
  )
}

export function Emblems() {
  return (
    <group>
      <ExtrudedName />
      <HefestoEmblem />
      <PontoNetEmblem />
    </group>
  )
}
