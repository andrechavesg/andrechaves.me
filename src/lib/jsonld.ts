import { IDS, ORGANIZATION, PERSON, SITE_URL } from '@/data/site'

export type JsonLdBlock = Record<string, unknown>

export function buildProfilePageJsonLd(locale: 'en' | 'pt'): JsonLdBlock {
  const description =
    locale === 'en'
      ? 'Chief Agentic Officer at ZapSign. Founder of Hefesto Software House.'
      : 'Chief Agentic Officer na ZapSign. Fundador da Hefesto Software House.'

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': IDS.profilePage,
    name: PERSON.name,
    url: locale === 'en' ? `${SITE_URL}/` : `${SITE_URL}/pt/`,
    dateCreated: ORGANIZATION.foundingDate,
    dateModified: new Date().toISOString().slice(0, 10),
    description,
    mainEntity: { '@id': IDS.person },
    about: { '@id': IDS.organization },
  }
}

export function buildPersonJsonLd(): JsonLdBlock {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': IDS.person,
    name: PERSON.name,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    jobTitle: PERSON.jobTitle,
    url: SITE_URL,
    email: PERSON.email,
    image: ORGANIZATION.logo,
    worksFor: { '@id': IDS.organization },
    sameAs: [...PERSON.sameAs],
  }
}

export function buildOrganizationJsonLd(): JsonLdBlock {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': IDS.organization,
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    email: ORGANIZATION.email,
    foundingDate: ORGANIZATION.foundingDate,
    taxID: ORGANIZATION.taxIDMasked,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'BR-CNPJ',
      value: ORGANIZATION.taxIDDigits,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORGANIZATION.streetAddress,
      addressLocality: ORGANIZATION.addressLocality,
      addressRegion: ORGANIZATION.addressRegion,
      postalCode: ORGANIZATION.postalCode,
      addressCountry: ORGANIZATION.addressCountry,
    },
    sameAs: ['https://pontonet.app/', 'https://medium.com/@symfonymaestro'],
  }
}

export function buildAllJsonLd(locale: 'en' | 'pt'): JsonLdBlock[] {
  return [buildProfilePageJsonLd(locale), buildPersonJsonLd(), buildOrganizationJsonLd()]
}

export function validateJsonLdLinks(blocks: JsonLdBlock[]): string[] {
  const errors: string[] = []
  const ids = new Set(blocks.map((b) => b['@id']))

  if (!ids.has(IDS.profilePage)) errors.push('missing ProfilePage @id')
  if (!ids.has(IDS.person)) errors.push('missing Person @id')
  if (!ids.has(IDS.organization)) errors.push('missing Organization @id')

  const profile = blocks.find((b) => b['@id'] === IDS.profilePage)
  const main = profile?.mainEntity as { '@id'?: string } | undefined
  if (main?.['@id'] !== IDS.person) errors.push('ProfilePage.mainEntity must link Person')

  const org = blocks.find((b) => b['@id'] === IDS.organization)
  if (org?.vatID !== undefined) errors.push('vatID must not be used')
  const identifier = org?.identifier as { propertyID?: string; value?: string } | undefined
  if (identifier?.propertyID !== 'BR-CNPJ') errors.push('identifier.propertyID must be BR-CNPJ')
  if (identifier?.value !== ORGANIZATION.taxIDDigits) errors.push('identifier.value must be digits')
  if (org?.taxID !== ORGANIZATION.taxIDMasked) errors.push('taxID must be masked form')

  return errors
}
