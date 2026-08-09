import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore, type ActId } from '@/stores/sceneStore'

const POSES: Record<ActId, { pos: THREE.Vector3; look: THREE.Vector3 }> = {
  'cold-open': { pos: new THREE.Vector3(0, 0.4, 6.5), look: new THREE.Vector3(0, 0.2, 0) },
  swarm: { pos: new THREE.Vector3(1.2, 0.8, 5.2), look: new THREE.Vector3(0, 0, 0) },
  guardrail: { pos: new THREE.Vector3(0, 2.2, 4.5), look: new THREE.Vector3(0, 0, 0) },
  hefesto: { pos: new THREE.Vector3(-2.5, 0.6, 4.2), look: new THREE.Vector3(-2, 0, 0) },
  pontonet: { pos: new THREE.Vector3(2.5, 0.6, 4.2), look: new THREE.Vector3(2, 0, 0) },
  record: { pos: new THREE.Vector3(0, 0.2, 5.8), look: new THREE.Vector3(0, 0, 0) },
  cooling: { pos: new THREE.Vector3(0, -0.4, 7.5), look: new THREE.Vector3(0, -0.2, 0) },
}

export function CameraRig() {
  const act = useSceneStore((s) => s.act)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const target = useRef(POSES['cold-open'].pos.clone())
  const look = useRef(POSES['cold-open'].look.clone())

  useFrame((state) => {
    if (reducedMotion) return
    const pose = POSES[act]
    target.current.lerp(pose.pos, 0.04)
    look.current.lerp(pose.look, 0.04)
    state.camera.position.copy(target.current)
    state.camera.lookAt(look.current)
  })

  return null
}
