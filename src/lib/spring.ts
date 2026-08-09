/** Critically-damped spring step for camera / UI motion (never linear). */
export function springStep(
  current: number,
  target: number,
  velocity: number,
  dt: number,
  stiffness = 80,
  damping = 14,
): { value: number; velocity: number } {
  const clampedDt = Math.min(Math.max(dt, 0), 0.05)
  const force = (target - current) * stiffness
  const nextVelocity = velocity + (force - velocity * damping) * clampedDt
  const nextValue = current + nextVelocity * clampedDt
  if (Math.abs(target - nextValue) < 0.0001 && Math.abs(nextVelocity) < 0.0001) {
    return { value: target, velocity: 0 }
  }
  return { value: nextValue, velocity: nextVelocity }
}
