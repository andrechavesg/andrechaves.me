import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useSceneStore, type ActId } from '@/stores/sceneStore'

const ACT_MAP: { id: string; act: ActId }[] = [
  { id: 'act-cold-open', act: 'cold-open' },
  { id: 'act-swarm', act: 'swarm' },
  { id: 'act-guardrail', act: 'guardrail' },
  { id: 'act-hefesto', act: 'hefesto' },
  { id: 'act-pontonet', act: 'pontonet' },
  { id: 'act-record', act: 'record' },
  { id: 'act-cooling', act: 'cooling' },
]

export function useScrollChoreography(enabled: boolean) {
  const setAct = useSceneStore((s) => s.setAct)
  const setProgress = useSceneStore((s) => s.setProgress)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const triggers: ScrollTrigger[] = []

    ACT_MAP.forEach(({ id, act }, index) => {
      const el = document.getElementById(id)
      if (!el) return
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setAct(act),
        onEnterBack: () => setAct(act),
        onUpdate: (self) => {
          const global = (index + self.progress) / ACT_MAP.length
          setProgress(global)
        },
      })
      triggers.push(st)
    })

    return () => {
      triggers.forEach((t) => t.kill())
      gsap.ticker.remove(ticker)
      lenis.destroy()
    }
  }, [enabled, setAct, setProgress])
}
