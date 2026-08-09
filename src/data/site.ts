export const SITE_URL = 'https://andrechaves.me'

export const PERSON = {
  name: 'André de Moraes Chaves',
  givenName: 'André',
  familyName: 'de Moraes Chaves',
  jobTitle: 'Chief Agentic Officer',
  formerTitle: 'CTO',
  employer: 'ZapSign',
  email: 'andre@hefesto.software',
  sameAs: [
    'https://www.linkedin.com/in/andrechavesg/',
    'https://medium.com/@symfonymaestro',
    'https://pontonet.app/',
    'https://zapsign.com.br/',
    'https://github.com/andrechavesg/andrechaves.me',
  ],
} as const

export const ORGANIZATION = {
  name: 'Hefesto Software House',
  legalName: 'ANDRE DE MORAES CHAVES DESENVOLVIMENTO DE SOFTWARE LTDA',
  taxIDMasked: '25.311.859/0001-42',
  taxIDDigits: '25311859000142',
  foundingDate: '2016-07-28',
  foundingYear: 2016,
  streetAddress: 'Rua Condessa Siciliano 384',
  addressLocality: 'São Paulo',
  addressRegion: 'SP',
  postalCode: '02040-050',
  addressCountry: 'BR',
  displayLocation: 'São Paulo, Brasil',
  cnae: '6201-5/01',
  url: SITE_URL,
  logo: `${SITE_URL}/og/logo-112.png`,
  email: 'andre@hefesto.software',
} as const

export const PRODUCT = {
  name: 'PontoNet',
  url: 'https://pontonet.app/',
  description:
    'Time clock with WhatsApp and facial recognition, Portaria 671 compliance — operated by Hefesto.',
} as const

export const IDS = {
  profilePage: `${SITE_URL}/#profilepage`,
  person: `${SITE_URL}/#person`,
  organization: `${SITE_URL}/#organization`,
} as const
