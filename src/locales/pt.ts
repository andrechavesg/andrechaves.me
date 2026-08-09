import type { Dictionary } from '@/locales/en'
import { ORGANIZATION, PERSON, PRODUCT } from '@/data/site'

export const pt: Dictionary = {
  locale: 'pt' as const,
  htmlLang: 'pt-BR',
  path: '/pt/',
  altPath: '/',
  altLabel: 'English',
  meta: {
    title: `${PERSON.name} — Chief Agentic Officer na ZapSign`,
    description:
      'André de Moraes Chaves — Chief Agentic Officer na ZapSign (ex-CTO). Fundador da Hefesto Software House. Orquestração agentic, governança e a forja que se opera sozinha.',
    ogImage: '/og/og-pt.png',
  },
  nav: {
    work: 'Trabalho',
    studio: 'Estúdio',
    writing: 'Escrita',
    contact: 'Contato',
    motionOn: 'Movimento ligado',
    motionOff: 'Movimento desligado',
    skip: 'Ir para o conteúdo',
  },
  acts: {
    coldOpen: {
      id: 'act-cold-open',
      h1: PERSON.name,
      role: `Chief Agentic Officer na ${PERSON.employer}`,
      sub: 'Quase cinco anos como CTO de uma plataforma de assinatura com 5M+ usuários e 70M+ documentos em 81 países — agora construindo a camada agentic.',
      ctaPrimary: 'Ver a forja',
      ctaSecondary: 'Contato',
    },
    swarm: {
      id: 'act-swarm',
      title: 'O enxame',
      lead: 'De único desenvolvedor a revisor de um time inteiro de agentes.',
      body: 'Orquestração agentic, RAG como curadoria, sistemas multiagente que convergem e resolvem — martelos que se balançam sozinhos.',
    },
    guardrail: {
      id: 'act-guardrail',
      title: 'O guarda-corpo',
      lead: 'O agente ganhou as mãos. Não a chave.',
      body: 'Governança, trilhas de auditoria e human-in-the-loop. Aprove ou rejeite o que o enxame produz — você senta na cadeira.',
      approve: 'Aprovar',
      reject: 'Rejeitar',
      liedLabel: 'Verificado',
      liedReveal: 'O check verde mentiu.',
    },
    hefesto: {
      id: 'act-hefesto',
      title: ORGANIZATION.name,
      lead: 'Uma entidade. O estúdio desde 2016.',
      body: `${ORGANIZATION.legalName}. Software sob encomenda sob CNAE ${ORGANIZATION.cnae}. Hefesto é a forja — não uma segunda empresa.`,
    },
    pontonet: {
      id: 'act-pontonet',
      title: PRODUCT.name,
      lead: 'O artefato que a forja produziu.',
      body: 'Ponto eletrônico com WhatsApp e reconhecimento facial, conformidade com a Portaria 671 — operado pela Hefesto.',
      cta: 'Visitar PontoNet',
    },
    record: {
      id: 'act-record',
      title: 'O registro',
      lead: `${PERSON.formerTitle} → Chief Agentic Officer na ${PERSON.employer}.`,
      body: 'Escrita pública sobre auditoria de agentes, reembolsos HITL, orquestração multiagente e RAG corporativo — nove agentes, 4.709 fontes, e a disciplina de verificar o check verde.',
    },
    cooling: {
      id: 'act-cooling',
      title: 'Resfriamento',
      lead: 'A forja abaixa o fogo.',
      body: 'Aberto a conversas sobre sistemas agentic, governança e software sob encomenda.',
      cta: 'Email para André',
      repo: 'Ver código no GitHub',
    },
  },
  writing: {
    title: 'Escrita',
    lead: 'Ensaios no Medium — sistemas agentic, governança e o ofício.',
    languageChip: 'em português',
    empty: 'Os posts aparecerão aqui após a próxima sincronização do feed.',
    readOn: 'Ler no Medium',
  },
  footer: {
    legalName: ORGANIZATION.legalName,
    tradeName: ORGANIZATION.name,
    cnpj: `CNPJ ${ORGANIZATION.taxIDMasked}`,
    founded: `Desde ${ORGANIZATION.foundingYear}`,
    location: ORGANIZATION.displayLocation,
    address: `${ORGANIZATION.streetAddress}, ${ORGANIZATION.addressLocality}/${ORGANIZATION.addressRegion}`,
    rights: `© ${ORGANIZATION.foundingYear}–${new Date().getFullYear()} ${ORGANIZATION.name}`,
  },
}
