#!/usr/bin/env node
/** Generate minimal PNG OG/logo assets (forge palette) without external deps. */
import { writeFileSync, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ogDir = join(root, 'public/og')
mkdirSync(ogDir, { recursive: true })

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crc])
}

function pngRGB(width, height, paint) {
  const raw = Buffer.alloc((width * 3 + 1) * height)
  for (let y = 0; y < height; y++) {
    const row = y * (width * 3 + 1)
    raw[row] = 0
    for (let x = 0; x < width; x++) {
      const [r, g, b] = paint(x, y, width, height)
      const i = row + 1 + x * 3
      raw[i] = r
      raw[i + 1] = g
      raw[i + 2] = b
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function forgePaint(labelHue) {
  return (x, y, w, h) => {
    const nx = x / w
    const ny = y / h
    const glow = Math.exp(-((nx - 0.3) ** 2 + (ny - 0.25) ** 2) * 8)
    const r = Math.min(255, 10 + glow * 194 + labelHue)
    const g = Math.min(255, 7 + glow * 65)
    const b = Math.min(255, 5 + glow * 12)
    // ember bar
    if (ny > 0.72 && ny < 0.78 && nx > 0.1 && nx < 0.45) return [255, 106, 0]
    return [r, g, b]
  }
}

writeFileSync(join(ogDir, 'og-en.png'), pngRGB(1200, 630, forgePaint(0)))
writeFileSync(join(ogDir, 'og-pt.png'), pngRGB(1200, 630, forgePaint(12)))
writeFileSync(
  join(ogDir, 'logo-112.png'),
  pngRGB(112, 112, (x, y, w, h) => {
    const cx = x - w / 2
    const cy = y - h / 2
    const d = Math.sqrt(cx * cx + cy * cy) / (w / 2)
    if (d < 0.15) return [255, 138, 30]
    if (d < 0.55 && cy > -10) return [194, 65, 12]
    return [10, 7, 5]
  }),
)

console.log('[generate-assets] Wrote public/og/*.png')
// touch hash for cache busting notes
console.log(createHash('sha1').update('og').digest('hex').slice(0, 8))
