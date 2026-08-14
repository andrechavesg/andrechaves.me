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

  it('redirects missing assets to a dedicated 404 page', () => {
    const redirects = readFileSync(join(process.cwd(), 'public/_redirects'), 'utf8')
    expect(redirects).toMatch(/\/assets\/\*\s+\/404-asset\.html\s+404/)
    expect(existsSync(join(process.cwd(), 'public/404-asset.html'))).toBe(true)
  })
})
