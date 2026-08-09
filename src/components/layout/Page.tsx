import { useEffect, useState, lazy, Suspense } from 'react'
import type { Locale } from '@/lib/i18n'
import { getDictionary } from '@/lib/i18n'
import {
  readStoredMotion,
  resolveReducedMotion,
  writeStoredMotion,
  type MotionPreference,
} from '@/lib/motion-preference'
import postsData from '@/data/posts.json'
import { GlassNav } from '@/components/glass/GlassNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { JsonLd } from '@/components/layout/JsonLd'
import { HeadTags } from '@/components/layout/HeadTags'
import {
  ColdOpen,
  SwarmAct,
  GuardrailAct,
  HefestoAct,
  PontoNetAct,
  RecordAct,
  CoolingAct,
} from '@/components/sections/Acts'
import { useSceneStore } from '@/stores/sceneStore'
import { useScrollChoreography } from '@/hooks/useScrollChoreography'

const ForgeCanvas = lazy(() =>
  import('@/components/scene/ForgeCanvas').then((m) => ({ default: m.ForgeCanvas })),
)

export function Page({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const setReducedMotion = useSceneStore((s) => s.setReducedMotion)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const [pref, setPref] = useState<MotionPreference>('system')
  const [showCanvas, setShowCanvas] = useState(false)

  useScrollChoreography(!reducedMotion)

  useEffect(() => {
    const stored = readStoredMotion()
    setPref(stored)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      const reduced = resolveReducedMotion(stored, mq.matches)
      setReducedMotion(reduced)
    }
    apply()
    const onChange = () => {
      const current = readStoredMotion()
      setReducedMotion(resolveReducedMotion(current, mq.matches))
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [setReducedMotion])

  useEffect(() => {
    if (reducedMotion) return
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setShowCanvas(true))
      : window.setTimeout(() => setShowCanvas(true), 200)
    return () => {
      if (typeof idle === 'number') window.clearTimeout(idle)
      else window.cancelIdleCallback?.(idle as number)
    }
  }, [reducedMotion])

  const toggleMotion = () => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const next: MotionPreference =
      pref === 'off' ? 'on' : pref === 'on' ? 'system' : mq.matches ? 'on' : 'off'
    // cycle: system → opposite of system → system...
    // simpler: toggle between on and off with explicit override
    const explicit: MotionPreference = resolveReducedMotion(pref, mq.matches) ? 'on' : 'off'
    writeStoredMotion(explicit)
    setPref(explicit)
    setReducedMotion(resolveReducedMotion(explicit, mq.matches))
    if (explicit === 'on') setShowCanvas(true)
  }

  const posts = postsData.posts

  return (
    <>
      <HeadTags locale={locale} />
      <JsonLd locale={locale} />
      <div className="relative min-h-screen bg-forge text-white">
        {!reducedMotion && showCanvas && (
          <Suspense fallback={null}>
            <ForgeCanvas />
          </Suspense>
        )}
        {reducedMotion && (
          <div
            className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_30%_20%,#c2410c33,transparent_50%),#0a0705]"
            aria-hidden
          />
        )}
        <GlassNav
          dict={dict}
          motionEnabled={!reducedMotion}
          onToggleMotion={toggleMotion}
        />
        <main id="main" className="relative z-1">
          <ColdOpen dict={dict} />
          <SwarmAct dict={dict} />
          <GuardrailAct dict={dict} />
          <HefestoAct dict={dict} />
          <PontoNetAct dict={dict} />
          <RecordAct dict={dict} posts={posts} />
          <CoolingAct dict={dict} />
        </main>
        <SiteFooter dict={dict} />
      </div>
    </>
  )
}
