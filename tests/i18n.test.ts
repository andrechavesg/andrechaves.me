import { describe, expect, it } from 'vitest'
import { alternatePath, getDictionary, hreflangLinks, localeFromPath } from '@/lib/i18n'

describe('i18n routing', () => {
  it('maps paths to locales', () => {
    expect(localeFromPath('/')).toBe('en')
    expect(localeFromPath('/pt/')).toBe('pt')
    expect(localeFromPath('/pt')).toBe('pt')
  })

  it('emits reciprocal hreflang including x-default', () => {
    const links = hreflangLinks('https://andrechaves.me')
    expect(links).toEqual([
      { hreflang: 'en', href: 'https://andrechaves.me/' },
      { hreflang: 'pt-BR', href: 'https://andrechaves.me/pt/' },
      { hreflang: 'x-default', href: 'https://andrechaves.me/' },
    ])
  })

  it('dictionaries expose language chip for writing', () => {
    expect(getDictionary('en').writing.languageChip).toBe('in Portuguese')
    expect(getDictionary('pt').writing.languageChip).toBe('em português')
  })

  it('alternatePath preserves hash/act', () => {
    expect(alternatePath('en', '#act-swarm')).toBe('/pt/#act-swarm')
    expect(alternatePath('pt', 'act-guardrail')).toBe('/#act-guardrail')
  })
})
