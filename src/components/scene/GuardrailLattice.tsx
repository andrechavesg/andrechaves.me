import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '@/stores/sceneStore'

export function GuardrailLattice() {
  const progress = useSceneStore((s) => s.progress)
  const act = useSceneStore((s) => s.act)
  const group = useRef<THREE.Group>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions: number[] = []
    const size = 4
    const step = 0.5
    for (let x = -size; x <= size; x += step) {
      for (let y = -size; y <= size; y += step) {
        positions.push(x, y, -size, x, y, size)
        positions.push(x, -size, y, x, size, y)
        positions.push(-size, x, y, size, x, y)
      }
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [])

  useFrame(() => {
    if (!group.current) return
    const guard = THREE.MathUtils.smoothstep(progress, 0.2, 0.45)
    const fade = 1 - THREE.MathUtils.smoothstep(progress, 0.75, 0.95)
    const opacity = guard * fade * (act === 'guardrail' ? 1 : 0.55)
    const mat = (group.current.children[0] as THREE.LineSegments)?.material as THREE.LineBasicMaterial
    if (mat) mat.opacity = opacity * 0.35
    group.current.rotation.y = progress * 0.4
  })

  return (
    <group ref={group} scale={1.1}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#C2410C" transparent opacity={0} depthWrite={false} />
      </lineSegments>
    </group>
  )
}
