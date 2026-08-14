import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useSceneStore, type ActId } from '@/stores/sceneStore'
import {
  ACT_IDS,
  AUTOPLAY_DWELL_MS,
  USER_TAKEOVER_KEY,
  globalProgress,
} from '@/lib/scroll-progress'

const ACT_MAP: { id: string; act: ActId }[] = [
  { id: 'act-cold-open', act: 'cold-open' },
  { id: 'act-swarm', act: 'swarm' },
  { id: 'act-guardrail', act: 'guardrail' },
  { id: 'act-hefesto', act: 'hefesto' },
  { id: 'act-pontonet', act: 'pontonet' },
  { id: 'act-record', act: 'record' },
  { id: 'act-cooling', act: 'cooling' },
]

function readUserTookOver(): boolean {
  try {
    return sessionStorage.getItem(USER_TAKEOVER_KEY) === '1'
  } catch {
    return false
  }
}

function writeUserTookOver() {
  try {
    sessionStorage.setItem(USER_TAKEOVER_KEY, '1')
  } catch {
    /* private mode */
  }
}

/**
 * Lenis + pin/scrub ScrollTrigger for seven acts, DOM reveals, and
 * autoplay that yields to the first wheel/touch/keyboard scroll.
 */
export function useScrollChoreography(enabled: boolean) {
  const setAct = useSceneStore((s) => s.setAct)
  const setProgress = useSceneStore((s) => s.setProgress)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)
    document.documentElement.classList.add('cinematic-scroll')

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.1,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const triggers: ScrollTrigger[] = []
    const tweens: gsap.core.Tween[] = []

    const syncHash = (id: string) => {
      const next = `#${id}`
      if (window.location.hash !== next) {
        history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}${next}`,
        )
        window.dispatchEvent(new HashChangeEvent('hashchange'))
      }
    }

    ACT_MAP.forEach(({ id, act }, index) => {
      const el = document.getElementById(id)
      if (!el) return

      const reveal = el.querySelector<HTMLElement>('[data-reveal]')
      if (reveal) {
        gsap.set(reveal, { autoAlpha: index === 0 ? 1 : 0, y: index === 0 ? 0 : 36 })
        const tween = gsap.to(reveal, {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            end: 'top 35%',
            scrub: true,
          },
        })
        tweens.push(tween)
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
      }

      // Record act can be taller than the viewport — pin for one viewport of scrub.
      const pinEnd =
        id === 'act-record'
          ? () => `+=${Math.max(window.innerHeight, el.scrollHeight * 0.35)}`
          : '+=100%'

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: pinEnd,
        pin: true,
        pinSpacing: true,
        scrub: 0.65,
        anticipatePin: 1,
        snap: {
          snapTo: 1,
          duration: { min: 0.15, max: 0.45 },
          ease: 'power1.inOut',
          delay: 0.04,
        },
        onEnter: () => {
          setAct(act)
          syncHash(id)
        },
        onEnterBack: () => {
          setAct(act)
          syncHash(id)
        },
        onUpdate: (self) => {
          setProgress(globalProgress(index, self.progress, ACT_MAP.length))
        },
      })
      triggers.push(st)
    })

    // --- Autoplay: advance acts until the user takes over ---
    let userTookOver = readUserTookOver()
    let autoplayTimer = 0
    let autoplayIndex = Math.max(
      0,
      ACT_MAP.findIndex(({ id }) => id === window.location.hash.slice(1)),
    )
    if (autoplayIndex < 0) autoplayIndex = 0

    const clearAutoplay = () => {
      if (autoplayTimer) {
        window.clearTimeout(autoplayTimer)
        autoplayTimer = 0
      }
    }

    const markUserTookOver = () => {
      if (userTookOver) return
      userTookOver = true
      writeUserTookOver()
      clearAutoplay()
      document.documentElement.classList.add('scroll-user-control')
    }

    const scheduleAutoplay = () => {
      clearAutoplay()
      if (userTookOver) return
      autoplayTimer = window.setTimeout(() => {
        if (userTookOver) return
        autoplayIndex = Math.min(autoplayIndex + 1, ACT_MAP.length - 1)
        const target = document.getElementById(ACT_MAP[autoplayIndex]!.id)
        if (target) {
          lenis.scrollTo(target, { offset: 0, duration: 1.45, easing: (t) => 1 - Math.pow(1 - t, 3) })
        }
        if (autoplayIndex < ACT_MAP.length - 1) scheduleAutoplay()
      }, AUTOPLAY_DWELL_MS)
    }

    const onWheel = () => markUserTookOver()
    const onTouch = () => markUserTookOver()
    const onKey = (e: KeyboardEvent) => {
      if (
        e.code === 'ArrowDown' ||
        e.code === 'ArrowUp' ||
        e.code === 'PageDown' ||
        e.code === 'PageUp' ||
        e.code === 'Space' ||
        e.code === 'Home' ||
        e.code === 'End'
      ) {
        markUserTookOver()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('keydown', onKey)

    // Honour in-page nav clicks without counting as "takeover" until they scroll.
    const onHashNav = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href*="#act-"]') as
        | HTMLAnchorElement
        | null
      if (!a) return
      const hash = a.hash?.slice(1)
      if (!hash || !ACT_IDS.includes(hash as (typeof ACT_IDS)[number])) return
      e.preventDefault()
      markUserTookOver()
      const el = document.getElementById(hash)
      if (el) lenis.scrollTo(el, { offset: 0, duration: 1.1 })
    }
    document.addEventListener('click', onHashNav)

    if (!userTookOver) {
      // Brief beat on cold open, then autoplay.
      autoplayTimer = window.setTimeout(() => scheduleAutoplay(), 1800)
    } else {
      document.documentElement.classList.add('scroll-user-control')
    }

    ScrollTrigger.refresh()

    return () => {
      clearAutoplay()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onHashNav)
      document.documentElement.classList.remove('cinematic-scroll', 'scroll-user-control')
      tweens.forEach((t) => t.kill())
      triggers.forEach((t) => t.kill())
      gsap.ticker.remove(ticker)
      lenis.destroy()
    }
  }, [enabled, setAct, setProgress])
}
