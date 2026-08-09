import { ORGANIZATION, PERSON, PRODUCT } from '@/data/site'

export const en = {
  locale: 'en' as const,
  htmlLang: 'en',
  path: '/',
  altPath: '/pt/',
  altLabel: 'Português',
  meta: {
    title: `${PERSON.name} — Chief Agentic Officer at ZapSign`,
    description:
      'André de Moraes Chaves — Chief Agentic Officer at ZapSign (ex-CTO). Founder of Hefesto Software House. Agentic orchestration, governance, and the forge that runs itself.',
    ogImage: '/og/og-en.png',
  },
  nav: {
    work: 'Work',
    studio: 'Studio',
    writing: 'Writing',
    contact: 'Contact',
    motionOn: 'Motion on',
    motionOff: 'Motion off',
    skip: 'Skip to content',
  },
  acts: {
    coldOpen: {
      id: 'act-cold-open',
      h1: PERSON.name,
      role: `Chief Agentic Officer at ${PERSON.employer}`,
      sub: 'Nearly five years as CTO of a signature platform with 5M+ users and 70M+ documents across 81 countries — now building the agentic layer.',
      ctaPrimary: 'See the forge',
      ctaSecondary: 'Contact',
    },
    swarm: {
      id: 'act-swarm',
      title: 'The swarm',
      lead: 'From sole developer to reviewer of an entire team of agents.',
      body: 'Agentic orchestration, RAG as curation, multi-agent systems that converge and resolve — hammers that swing themselves.',
    },
    guardrail: {
      id: 'act-guardrail',
      title: 'The guardrail',
      lead: 'The agent got hands. Not the key.',
      body: 'Governance, audit trails, and human-in-the-loop. Approve or reject what the swarm produces — you sit in the chair.',
      approve: 'Approve',
      reject: 'Reject',
      liedLabel: 'Verified',
      liedReveal: 'The green check lied.',
    },
    hefesto: {
      id: 'act-hefesto',
      title: ORGANIZATION.name,
      lead: 'One entity. The studio since 2016.',
      body: `${ORGANIZATION.legalName}. Custom software under CNAE ${ORGANIZATION.cnae}. Hefesto is the forge — not a second company.`,
    },
    pontonet: {
      id: 'act-pontonet',
      title: PRODUCT.name,
      lead: 'The artifact the forge produced.',
      body: PRODUCT.description,
      cta: 'Visit PontoNet',
    },
    record: {
      id: 'act-record',
      title: 'The record',
      lead: `${PERSON.formerTitle} → Chief Agentic Officer at ${PERSON.employer}.`,
      body: 'Public writing on agent auditing, HITL refunds, multi-agent orchestration, and corporate RAG — nine agents, 4,709 sources, and the discipline to verify the green check.',
    },
    cooling: {
      id: 'act-cooling',
      title: 'Cooling',
      lead: 'The forge banks its fire.',
      body: 'Open to conversations on agentic systems, governance, and custom software.',
      cta: 'Email André',
      repo: 'View source on GitHub',
    },
  },
  writing: {
    title: 'Writing',
    lead: 'Essays on Medium — agentic systems, governance, and the craft.',
    languageChip: 'in Portuguese',
    empty: 'Posts will appear here after the next feed sync.',
    readOn: 'Read on Medium',
  },
  footer: {
    legalName: ORGANIZATION.legalName,
    tradeName: ORGANIZATION.name,
    cnpj: `CNPJ ${ORGANIZATION.taxIDMasked}`,
    founded: `Since ${ORGANIZATION.foundingYear}`,
    location: ORGANIZATION.displayLocation,
    address: `${ORGANIZATION.streetAddress}, ${ORGANIZATION.addressLocality}/${ORGANIZATION.addressRegion}`,
    rights: `© ${ORGANIZATION.foundingYear}–${new Date().getFullYear()} ${ORGANIZATION.name}`,
  },
} as const

export type Dictionary = typeof en
