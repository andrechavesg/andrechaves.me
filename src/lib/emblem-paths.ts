/**
 * SVG path data for ExtrudeGeometry emblems (viewBox ~0–100).
 * Sourced as path strings so the forge can ship without runtime SVG fetch.
 */
export const HEFESTO_ANVIL_PATH =
  'M12 72 L88 72 L80 52 L62 52 L62 28 L70 28 L70 18 L30 18 L30 28 L38 28 L38 52 L20 52 Z'

/** Clock/node mark: outer ring + hub + hand (compound via multiple shapes). */
export const PONTONET_RING_PATH =
  'M50 8 C73.2 8 92 26.8 92 50 C92 73.2 73.2 92 50 92 C26.8 92 8 73.2 8 50 C8 26.8 26.8 8 50 8 Z M50 22 C34.5 22 22 34.5 22 50 C22 65.5 34.5 78 50 78 C65.5 78 78 65.5 78 50 C78 34.5 65.5 22 50 22 Z'

export const PONTONET_HAND_PATH = 'M48 28 L52 28 L52 52 L66 62 L63.5 66 L48 54 Z'

export const PONTONET_HUB_PATH =
  'M50 44 C53.3 44 56 46.7 56 50 C56 53.3 53.3 56 50 56 C46.7 56 44 53.3 44 50 C44 46.7 46.7 44 50 44 Z'
