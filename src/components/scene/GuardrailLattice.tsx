import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '@/stores/sceneStore'
import { springStep } from '@/lib/spring'

export function GuardrailLattice() {
  const progress = useSceneStore((s) => s.progress)
  const act = useSceneStore((s) => s.act)
  const hitl = useSceneStore((s) => s.hitl)
  const group = useRef<THREE.Group>(null)
  const opacityVal = useRef(0)
  const opacityVel = useRef(0)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions: number[] = []
    const size = 3.5
    const step = 0.7
    for (let x = -size; x <= size + 0.001; x += step) {
      for (let y = -size; y <= size + 0.001; y += step) {
        positions.push(x, y, -size, x, y, size)
        positions.push(x, -size, y, x, size, y)
        positions.push(-size, x, y, size, x, y)
      }
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [])

  useFrame((_, dt) => {
    if (!group.current) return
    const guard = THREE.MathUtils.smoothstep(progress, 0.22, 0.4)
    const fade = 1 - THREE.MathUtils.smoothstep(progress, 0.72, 0.92)
    let target = guard * fade * (act === 'guardrail' ? 0.55 : 0.22)
    if (hitl === 'approved') target *= 1.25
    if (hitl === 'lied') target *= 0.35
    if (hitl === 'rejected') target *= 0.5

    const stepped = springStep(opacityVal.current, target, opacityVel.current, dt, 70, 14)
    opacityVal.current = stepped.value
    opacityVel.current = stepped.velocity

    const mat = (group.current.children[0] as THREE.LineSegments)?.material as THREE.LineBasicMaterial
    if (mat) {
      mat.opacity = opacityVal.current
      mat.color.set(hitl === 'lied' ? '#FF6A00' : hitl === 'approved' ? '#34d399' : '#C2410C')
    }
    group.current.rotation.y += dt * 0.08
    group.current.scale.setScalar(1.05 + (act === 'guardrail' ? 0.08 : 0))
  })

  return (
    <group ref={group}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#C2410C" transparent opacity={0} depthWrite={false} />
      </lineSegments>
    </group>
  )
}
