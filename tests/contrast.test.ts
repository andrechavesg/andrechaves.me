import { describe, expect, it } from 'vitest'
import {
  assertPaletteRules,
  contrastRatio,
  isAllowedOrangeBody,
  meetsAA,
  meetsAAA,
  ORANGE_ROLES,
  PALETTE,
} from '@/lib/contrast'

describe('palette contrast rules (§2)', () => {
  it('molten on forge meets AAA for body', () => {
    expect(meetsAAA(PALETTE.molten, PALETTE.forge)).toBe(true)
    expect(contrastRatio(PALETTE.molten, PALETTE.forge)).toBeGreaterThan(7)
  })

  it('ember on forge meets AA but not AAA for body', () => {
    expect(meetsAA(PALETTE.ember, PALETTE.forge)).toBe(true)
    expect(meetsAAA(PALETTE.ember, PALETTE.forge)).toBe(false)
  })

  it('deep amber fails AA for body text', () => {
    expect(meetsAA(PALETTE.deepAmber, PALETTE.forge)).toBe(false)
    expect(ORANGE_ROLES.deepAmber).toBe('non-text')
  })

  it('only molten is allowed for orange body copy', () => {
    expect(isAllowedOrangeBody(PALETTE.molten)).toBe(true)
    expect(isAllowedOrangeBody(PALETTE.ember)).toBe(false)
    expect(isAllowedOrangeBody(PALETTE.deepAmber)).toBe(false)
  })

  it('assertPaletteRules summarises plan verdicts', () => {
    expect(assertPaletteRules()).toEqual({
      moltenOnForgeAAA: true,
      emberOnForgeAA: true,
      deepAmberFailsBodyAA: true,
    })
  })
})
