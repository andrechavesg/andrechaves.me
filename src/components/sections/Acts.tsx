import { useState } from 'react'
import { motion } from 'motion/react'
import type { Dictionary } from '@/locales/en'
import type { MediumPost } from '@/lib/medium'
import { PERSON, PRODUCT } from '@/data/site'
import { GlassButton } from '@/components/glass/GlassButton'
import { GlassCard } from '@/components/glass/GlassCard'
import { useSceneStore } from '@/stores/sceneStore'

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 }

function ActShell({
  id,
  children,
  className = '',
  label,
}: {
  id: string
  children: React.ReactNode
  className?: string
  /** Still-frame label — communicates the act without relying on choreography */
  label?: string
}) {
  return (
    <section
      id={id}
      className={`section-act ${className}`}
      data-act={id}
      aria-label={label}
    >
      <div className="mx-auto w-full max-w-6xl section-reveal" data-reveal>
        {children}
      </div>
    </section>
  )
}

export function ColdOpen({ dict }: { dict: Dictionary }) {
  const a = dict.acts.coldOpen
  return (
    <ActShell id={a.id} label={a.h1}>
      <motion.div
        initial={false}
        animate={{ y: 0 }}
        transition={spring}
        style={{ transform: 'translateY(0)' }}
      >
        <p className="text-molten text-sm font-medium tracking-wide mb-4">{a.role}</p>
        {/* Hero H1: full opacity from frame 1 — animate transform only (LCP) */}
        <h1 className="hero-h1 text-[clamp(2.4rem,7vw,4.75rem)] text-white max-w-4xl opacity-100">
          {a.h1}
        </h1>
        <p className="mt-6 max-w-xl text-steel text-lg leading-relaxed">{a.sub}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <GlassButton href={`#${dict.acts.swarm.id}`}>{a.ctaPrimary}</GlassButton>
          <GlassButton variant="secondary" href={`#${dict.acts.cooling.id}`}>
            {a.ctaSecondary}
          </GlassButton>
        </div>
      </motion.div>
    </ActShell>
  )
}

export function SwarmAct({ dict }: { dict: Dictionary }) {
  const a = dict.acts.swarm
  return (
    <ActShell id={a.id} label={a.title}>
      <GlassCard className="max-w-xl">
        <h2 className="font-display text-3xl md:text-4xl text-white">{a.title}</h2>
        <p className="mt-3 text-molten text-lg">{a.lead}</p>
        <p className="mt-4 text-steel leading-relaxed">{a.body}</p>
      </GlassCard>
    </ActShell>
  )
}

export function GuardrailAct({ dict }: { dict: Dictionary }) {
  const a = dict.acts.guardrail
  const hitl = useSceneStore((s) => s.hitl)
  const setHitl = useSceneStore((s) => s.setHitl)
  const greenCheckLied = useSceneStore((s) => s.greenCheckLied)
  const triggerLied = useSceneStore((s) => s.triggerGreenCheckLied)
  const [showVerified, setShowVerified] = useState(false)

  return (
    <ActShell id={a.id} label={a.title}>
      <GlassCard className="max-w-xl">
        <h2 className="font-display text-3xl md:text-4xl text-white">{a.title}</h2>
        <p className="mt-3 text-molten text-lg">{a.lead}</p>
        <p className="mt-4 text-steel leading-relaxed">{a.body}</p>

        <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label={a.title}>
          <GlassButton
            onClick={() => {
              setHitl('approved')
              setShowVerified(true)
              window.setTimeout(() => triggerLied(), 1400)
            }}
            disabled={hitl === 'lied'}
          >
            {a.approve}
          </GlassButton>
          <GlassButton
            variant="secondary"
            onClick={() => {
              setHitl('rejected')
              setShowVerified(false)
            }}
          >
            {a.reject}
          </GlassButton>
        </div>

        {showVerified && (
          <p
            className={`mt-4 text-sm font-medium ${greenCheckLied ? 'text-molten' : 'text-emerald-400'}`}
            role="status"
            aria-live="polite"
          >
            {greenCheckLied ? a.liedReveal : `✓ ${a.liedLabel}`}
          </p>
        )}
        {hitl === 'rejected' && (
          <p className="mt-4 text-sm text-steel" role="status" aria-live="polite">
            {a.reject}
          </p>
        )}
      </GlassCard>
    </ActShell>
  )
}

export function HefestoAct({ dict }: { dict: Dictionary }) {
  const a = dict.acts.hefesto
  return (
    <ActShell id={a.id} label={a.title}>
      <GlassCard className="max-w-xl">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-gradient-to-br from-ember to-deep-amber font-display text-sm font-semibold text-forge"
          aria-hidden
        >
          H
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-white">{a.title}</h2>
        <p className="mt-3 text-molten text-lg">{a.lead}</p>
        <p className="mt-4 text-steel leading-relaxed">{a.body}</p>
      </GlassCard>
    </ActShell>
  )
}

export function PontoNetAct({ dict }: { dict: Dictionary }) {
  const a = dict.acts.pontonet
  return (
    <ActShell id={a.id} label={a.title}>
      <GlassCard className="max-w-xl">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-molten/50 bg-slag font-display text-xs font-semibold text-molten"
          aria-hidden
        >
          PN
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-white">{a.title}</h2>
        <p className="mt-3 text-molten text-lg">{a.lead}</p>
        <p className="mt-4 text-steel leading-relaxed">{a.body}</p>
        <div className="mt-6">
          <GlassButton href={PRODUCT.url}>{a.cta}</GlassButton>
        </div>
      </GlassCard>
    </ActShell>
  )
}

export function RecordAct({ dict, posts }: { dict: Dictionary; posts: MediumPost[] }) {
  const a = dict.acts.record
  return (
    <ActShell id={a.id} label={a.title}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <GlassCard>
          <h2 className="font-display text-3xl md:text-4xl text-white">{a.title}</h2>
          <p className="mt-3 text-molten text-lg">{a.lead}</p>
          <p className="mt-4 text-steel leading-relaxed">{a.body}</p>
        </GlassCard>
        <div id="writing">
          <h3 className="font-display text-2xl text-white mb-2">{dict.writing.title}</h3>
          <p className="text-steel text-sm mb-4">{dict.writing.lead}</p>
          <ul className="space-y-3">
            {posts.length === 0 && (
              <li className="text-steel text-sm">{dict.writing.empty}</li>
            )}
            {posts.map((post) => (
              <li key={post.guid}>
                <article className="glass rounded-sm p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] uppercase tracking-wider text-forge bg-molten px-1.5 py-0.5 rounded-sm font-medium">
                      {dict.writing.languageChip}
                    </span>
                    {post.pubDate && (
                      <time className="text-xs text-steel" dateTime={new Date(post.pubDate).toISOString()}>
                        {new Date(post.pubDate).toLocaleDateString(dict.htmlLang)}
                      </time>
                    )}
                  </div>
                  <h4 className="text-white font-medium leading-snug">
                    <a href={post.link} className="hover:text-molten" rel="noopener noreferrer">
                      {post.title}
                    </a>
                  </h4>
                  <p className="mt-1 text-sm text-steel line-clamp-2">{post.excerpt}</p>
                  <a
                    href={post.link}
                    className="mt-2 inline-block text-xs text-molten"
                    rel="noopener noreferrer"
                  >
                    {dict.writing.readOn} →
                  </a>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ActShell>
  )
}

export function CoolingAct({ dict }: { dict: Dictionary }) {
  const a = dict.acts.cooling
  return (
    <ActShell id={a.id} label={a.title}>
      <GlassCard className="max-w-xl">
        <h2 className="font-display text-3xl md:text-4xl text-white">{a.title}</h2>
        <p className="mt-3 text-molten text-lg">{a.lead}</p>
        <p className="mt-4 text-steel leading-relaxed">{a.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <GlassButton href={`mailto:${PERSON.email}`}>{a.cta}</GlassButton>
          <GlassButton
            variant="secondary"
            href="https://github.com/andrechavesg/andrechaves.me"
          >
            {a.repo}
          </GlassButton>
        </div>
      </GlassCard>
    </ActShell>
  )
}
