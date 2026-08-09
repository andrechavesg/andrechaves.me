import { useEffect, useState } from 'react'
import type { Dictionary } from '@/locales/en'
import { alternatePath, localeFromPath } from '@/lib/i18n'
import { GlassButton } from './GlassButton'

interface Props {
  dict: Dictionary
  motionEnabled: boolean
  onToggleMotion: () => void
}

export function GlassNav({ dict, motionEnabled, onToggleMotion }: Props) {
  const [localeHref, setLocaleHref] = useState(dict.altPath)

  useEffect(() => {
    const sync = () => {
      const locale = localeFromPath(window.location.pathname)
      setLocaleHref(alternatePath(locale, window.location.hash))
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-slag focus:px-3 focus:py-2 focus:text-white"
      >
        {dict.nav.skip}
      </a>
      <nav
        className="mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 px-4"
        aria-label="Primary"
      >
        <div className="glass flex items-center gap-1 rounded-sm px-2 py-1.5 contain-paint">
          <a
            href={dict.path}
            className="font-display text-sm font-semibold tracking-tight text-white px-2 py-1"
          >
            andrechaves.me
          </a>
          <a href={`${dict.path}#act-swarm`} className="hidden sm:inline text-steel hover:text-white text-sm px-2 py-1">
            {dict.nav.work}
          </a>
          <a href={`${dict.path}#act-hefesto`} className="hidden sm:inline text-steel hover:text-white text-sm px-2 py-1">
            {dict.nav.studio}
          </a>
          <a href={`${dict.path}#act-record`} className="hidden sm:inline text-steel hover:text-white text-sm px-2 py-1">
            {dict.nav.writing}
          </a>
          <a href={`${dict.path}#act-cooling`} className="hidden sm:inline text-steel hover:text-white text-sm px-2 py-1">
            {dict.nav.contact}
          </a>
        </div>
        <div className="glass flex items-center gap-2 rounded-sm px-2 py-1.5">
          <button
            type="button"
            onClick={onToggleMotion}
            className="text-xs text-steel hover:text-white px-2 py-1"
            aria-pressed={motionEnabled}
          >
            {motionEnabled ? dict.nav.motionOn : dict.nav.motionOff}
          </button>
          <GlassButton variant="ghost" href={localeHref} className="!px-2 !py-1 text-xs">
            {dict.altLabel}
          </GlassButton>
        </div>
      </nav>
    </header>
  )
}
