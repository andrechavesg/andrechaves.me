import * as THREE from 'three'

/**
 * Minimal SVG path → THREE.Shape for the M/L/C/Z/A commands used by forge emblems.
 * Avoids SVGLoader (DOMParser) so geometry builds in Node/tests and the browser.
 */
export function shapesFromPathD(d: string): THREE.Shape[] {
  const shapes: THREE.Shape[] = []
  let shape: THREE.Shape | null = null
  let hole: THREE.Path | null = null
  let target: THREE.Shape | THREE.Path | null = null
  let cx = 0
  let cy = 0
  let subpath = 0
  const tokens = d.match(/[MLCZA]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []
  let i = 0

  const num = () => {
    const v = Number(tokens[i++])
    if (Number.isNaN(v)) throw new Error(`Invalid path number near ${tokens[i - 1]}`)
    return v
  }

  while (i < tokens.length) {
    const cmd = tokens[i++]!.toUpperCase()
    if (cmd === 'M') {
      cx = num()
      cy = num()
      subpath += 1
      if (subpath === 1 || !shape) {
        shape = new THREE.Shape()
        shape.moveTo(cx, cy)
        shapes.push(shape)
        target = shape
        hole = null
      } else {
        // Subsequent closed subpaths become holes of the first shape (ring marks)
        hole = new THREE.Path()
        hole.moveTo(cx, cy)
        shape.holes.push(hole)
        target = hole
      }
      while (i < tokens.length && !/^[MLCZA]$/i.test(tokens[i]!)) {
        cx = num()
        cy = num()
        target.lineTo(cx, cy)
      }
    } else if (cmd === 'L') {
      if (!target) throw new Error('L without M')
      while (i < tokens.length && !/^[MLCZA]$/i.test(tokens[i]!)) {
        cx = num()
        cy = num()
        target.lineTo(cx, cy)
      }
    } else if (cmd === 'C') {
      if (!target) throw new Error('C without M')
      while (i < tokens.length && !/^[MLCZA]$/i.test(tokens[i]!)) {
        const x1 = num()
        const y1 = num()
        const x2 = num()
        const y2 = num()
        const x = num()
        const y = num()
        target.bezierCurveTo(x1, y1, x2, y2, x, y)
        cx = x
        cy = y
      }
    } else if (cmd === 'Z') {
      if (hole) hole.closePath()
      else shape?.closePath()
    } else if (cmd === 'A') {
      if (!target) throw new Error('A without M')
      while (i < tokens.length && !/^[MLCZA]$/i.test(tokens[i]!)) {
        const rx = num()
        const ry = num()
        num() // x-axis-rotation
        const large = num()
        const sweep = num()
        const x = num()
        const y = num()
        approxArc(target, cx, cy, x, y, rx, ry, large === 1, sweep === 1)
        cx = x
        cy = y
      }
    }
  }

  return shapes
}

function approxArc(
  path: THREE.Shape | THREE.Path,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  _large: boolean,
  sweep: boolean,
) {
  const mx = (x0 + x1) / 2
  const my = (y0 + y1) / 2
  const dx = x1 - x0
  const dy = y1 - y0
  const dist = Math.hypot(dx, dy) || 1
  const r = Math.max(rx, ry)
  const ox = (-dy / dist) * r * (sweep ? 1 : -1) * 0.55
  const oy = (dx / dist) * r * (sweep ? 1 : -1) * 0.55
  path.quadraticCurveTo(mx + ox, my + oy, x1, y1)
}

/** Parse SVG path `d` → ExtrudeGeometry, Y-flipped, centered, scaled to targetSize. */
export function extrudeSvgPath(
  d: string,
  depth = 0.22,
  targetSize = 1.6,
): THREE.ExtrudeGeometry {
  const shapes = shapesFromPathD(d)
  if (shapes.length === 0) {
    const fallback = new THREE.Shape()
    fallback.moveTo(-0.5, -0.5)
    fallback.lineTo(0.5, -0.5)
    fallback.lineTo(0.5, 0.5)
    fallback.lineTo(-0.5, 0.5)
    fallback.closePath()
    shapes.push(fallback)
  }

  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.028,
    bevelSegments: 2,
    curveSegments: 16,
  })

  geo.scale(1, -1, 1)
  geo.computeBoundingBox()
  const box = geo.boundingBox!
  const size = new THREE.Vector3()
  box.getSize(size)
  const maxXY = Math.max(size.x, size.y, 0.0001)
  const s = targetSize / maxXY
  geo.scale(s, s, 1)
  geo.center()
  return geo
}

export function mergeGeometries(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry()
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  let indexOffset = 0
  const indices: number[] = []

  for (const geo of geos) {
    const pos = geo.getAttribute('position')
    const nor = geo.getAttribute('normal')
    const uv = geo.getAttribute('uv')
    const idx = geo.getIndex()
    for (let i = 0; i < pos.count; i++) {
      positions.push(pos.getX(i), pos.getY(i), pos.getZ(i))
      if (nor) normals.push(nor.getX(i), nor.getY(i), nor.getZ(i))
      if (uv) uvs.push(uv.getX(i), uv.getY(i))
    }
    if (idx) {
      for (let i = 0; i < idx.count; i++) indices.push(idx.getX(i) + indexOffset)
    } else {
      for (let i = 0; i < pos.count; i++) indices.push(indexOffset + i)
    }
    indexOffset += pos.count
    geo.dispose()
  }

  merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  if (normals.length) merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  if (uvs.length) merged.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  merged.setIndex(indices)
  merged.computeVertexNormals()
  merged.center()
  return merged
}
