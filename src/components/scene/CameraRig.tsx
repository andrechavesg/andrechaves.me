import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore, type ActId } from '@/stores/sceneStore'
import { springStep } from '@/lib/spring'

/** Looks bias +X so the forge sits in the right half; DOM copy stays left-clear. */
const POSES: Record<ActId, { pos: THREE.Vector3; look: THREE.Vector3 }> = {
  'cold-open': { pos: new THREE.Vector3(1.4, 0.35, 6.2), look: new THREE.Vector3(1.2, -0.2, 0) },
  swarm: { pos: new THREE.Vector3(2.2, 0.7, 5.2), look: new THREE.Vector3(1.4, 0.05, 0) },
  guardrail: { pos: new THREE.Vector3(1.6, 2.2, 4.4), look: new THREE.Vector3(1.2, 0, 0) },
  hefesto: { pos: new THREE.Vector3(0.4, 0.55, 4.2), look: new THREE.Vector3(1.5, 0.1, 0) },
  pontonet: { pos: new THREE.Vector3(0.6, 0.55, 4.2), look: new THREE.Vector3(1.6, 0.1, 0) },
  record: { pos: new THREE.Vector3(1.5, 0.15, 5.8), look: new THREE.Vector3(1.2, 0, 0) },
  cooling: { pos: new THREE.Vector3(1.2, -0.55, 7.2), look: new THREE.Vector3(1.0, -0.4, 0) },
}

export function CameraRig() {
  const act = useSceneStore((s) => s.act)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const pos = useRef(POSES['cold-open'].pos.clone())
  const look = useRef(POSES['cold-open'].look.clone())
  const velPos = useRef(new THREE.Vector3())
  const velLook = useRef(new THREE.Vector3())

  useFrame((state, dt) => {
    if (reducedMotion) return
    const pose = POSES[act]
    const axes: Array<'x' | 'y' | 'z'> = ['x', 'y', 'z']
    for (const axis of axes) {
      const p = springStep(pos.current[axis], pose.pos[axis], velPos.current[axis], dt, 55, 12)
      pos.current[axis] = p.value
      velPos.current[axis] = p.velocity
      const l = springStep(look.current[axis], pose.look[axis], velLook.current[axis], dt, 55, 12)
      look.current[axis] = l.value
      velLook.current[axis] = l.velocity
    }
    state.camera.position.copy(pos.current)
    state.camera.lookAt(look.current)
  })

  return null
}
