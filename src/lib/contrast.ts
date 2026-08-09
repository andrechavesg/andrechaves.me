/** WCAG 2.x relative luminance and contrast helpers (sRGB). */

const FORGE = '#0A0705'
const SLAG = '#1C1917'

export const PALETTE = {
  forge: FORGE,
  slag: SLAG,
  white: '#FFFFFF',
  molten: '#FF8A1E',
  steel: '#93A3B8',
  ember: '#FF6A00',
  deepAmber: '#C2410C',
} as const

export type TextRole = 'body' | 'large' | 'non-text'

/** Rules from plan §2 */
export const ORANGE_ROLES: Record<'molten' | 'ember' | 'deepAmber', TextRole> = {
  molten: 'body',
  ember: 'large',
  deepAmber: 'non-text',
}

function srgbChannel(c: number): number {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

export function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  if (h.length !== 6) throw new Error(`Invalid hex: ${hex}`)
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ]
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex)
  return 0.2126 * srgbChannel(r) + 0.7152 * srgbChannel(g) + 0.0722 * srgbChannel(b)
}

export function contrastRatio(fg: string, bg: string): number {
  const L1 = relativeLuminance(fg)
  const L2 = relativeLuminance(bg)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function meetsAA(fg: string, bg: string, large = false): boolean {
  return contrastRatio(fg, bg) >= (large ? 3 : 4.5)
}

export function meetsAAA(fg: string, bg: string, large = false): boolean {
  return contrastRatio(fg, bg) >= (large ? 4.5 : 7)
}

export function isAllowedOrangeBody(hex: string): boolean {
  return hex.toUpperCase() === PALETTE.molten.toUpperCase()
}

export function assertPaletteRules(): {
  moltenOnForgeAAA: boolean
  emberOnForgeAA: boolean
  deepAmberFailsBodyAA: boolean
} {
  return {
    moltenOnForgeAAA: meetsAAA(PALETTE.molten, PALETTE.forge),
    emberOnForgeAA: meetsAA(PALETTE.ember, PALETTE.forge),
    deepAmberFailsBodyAA: !meetsAA(PALETTE.deepAmber, PALETTE.forge),
  }
}
