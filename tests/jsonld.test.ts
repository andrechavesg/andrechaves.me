import { describe, expect, it } from 'vitest'
import { IDS, ORGANIZATION } from '@/data/site'
import { buildAllJsonLd, validateJsonLdLinks } from '@/lib/jsonld'

describe('JSON-LD linked blocks', () => {
  it('emits three blocks linked by @id', () => {
    const blocks = buildAllJsonLd('en')
    expect(blocks).toHaveLength(3)
    expect(blocks.map((b) => b['@id'])).toEqual([
      IDS.profilePage,
      IDS.person,
      IDS.organization,
    ])
    expect(validateJsonLdLinks(blocks)).toEqual([])
  })

  it('Organization uses taxID + BR-CNPJ identifier, not vatID', () => {
    const org = buildAllJsonLd('pt').find((b) => b['@id'] === IDS.organization)!
    expect(org.taxID).toBe(ORGANIZATION.taxIDMasked)
    expect(org.vatID).toBeUndefined()
    expect(org.identifier).toMatchObject({
      propertyID: 'BR-CNPJ',
      value: ORGANIZATION.taxIDDigits,
    })
    expect((org.address as { addressCountry: string }).addressCountry).toBe('BR')
  })

  it('ProfilePage mainEntity points at Person', () => {
    const profile = buildAllJsonLd('en').find((b) => b['@id'] === IDS.profilePage)!
    expect(profile['@type']).toBe('ProfilePage')
    expect(profile.mainEntity).toEqual({ '@id': IDS.person })
  })
})
