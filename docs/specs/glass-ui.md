# Spec: Glass UI Tokens & Components

## Goal
Forge/ember visual system with glass components and WCAG-correct palette usage.

## Palette (locked)
| Token | Hex | Role |
|-------|-----|------|
| forge | `#0A0705` | Base surface |
| slag | `#1C1917` | Elevated surface |
| white | `#FFFFFF` | Body text |
| molten | `#FF8A1E` | Orange body text (AAA) |
| steel | `#93A3B8` | Secondary text |
| ember | `#FF6A00` | Brand accent / large text |
| deep-amber | `#C2410C` | Non-text only (gradients, borders, geometry) |

## Contrast rules
- `#FF8A1E` only orange for body copy
- `#FF6A00` brand/accent, large text — not body under 24px claiming AAA
- `#C2410C` never text below 24px / never thin weights
- Orange occupies ~15% of frame max

## Glass recipe
- Background `rgba(255,255,255,0.06–0.10)`
- Inner border ~0.18 opacity
- Top-edge specular highlight
- Hover warm tint
- Minimise blurred surfaces; `contain: paint`; mobile may use semi-transparent approximation
- Honour `prefers-reduced-transparency`

## Components
- GlassButton, GlassCard, GlassNav, GlassModal
- Documented tokens in `@theme`
