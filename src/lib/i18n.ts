import { en, type Dictionary } from '@/locales/en'
import { pt } from '@/locales/pt'

export type Locale = 'en' | 'pt'

export function getDictionary(locale: Locale): Dictionary {
  return locale === 'pt' ? pt : en
}

export function localeFromPath(pathname: string): Locale {
  return pathname === '/pt' || pathname.startsWith('/pt/') ? 'pt' : 'en'
}

export function hreflangLinks(siteUrl: string): { hreflang: string; href: string }[] {
  const base = siteUrl.replace(/\/$/, '')
  return [
    { hreflang: 'en', href: `${base}/` },
    { hreflang: 'pt-BR', href: `${base}/pt/` },
    { hreflang: 'x-default', href: `${base}/` },
  ]
}

export function alternatePath(locale: Locale, hash = ''): string {
  const path = locale === 'en' ? '/pt/' : '/'
  return hash ? `${path}${hash.startsWith('#') ? hash : `#${hash}`}` : path
}
