import { buildAllJsonLd } from '@/lib/jsonld'
import type { Locale } from '@/lib/i18n'

export function JsonLd({ locale }: { locale: Locale }) {
  const blocks = buildAllJsonLd(locale)
  return (
    <>
      {blocks.map((block) => (
        <script
          key={String(block['@id'])}
          type="application/ld+json"
          // SSG: must appear in initial HTML
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}
