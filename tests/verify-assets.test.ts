import { describe, expect, it } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

describe('verify-assets script', () => {
  it('is present and refuses missing asset refs', () => {
    const script = join(process.cwd(), 'scripts/verify-assets.mjs')
    expect(existsSync(script)).toBe(true)
    const src = readFileSync(script, 'utf8')
    expect(src).toContain('/assets/')
    expect(src).toContain('process.exit(1)')
  })

  it('ships a root 404.html so Pages does not soft-serve index for missing assets', () => {
    const redirects = readFileSync(join(process.cwd(), 'public/_redirects'), 'utf8')
    expect(redirects).not.toMatch(/\s404\s*$/m)
    expect(existsSync(join(process.cwd(), 'public/404.html'))).toBe(true)
    const html = readFileSync(join(process.cwd(), 'public/404.html'), 'utf8')
    expect(html).toMatch(/Not found/i)
  })
})
