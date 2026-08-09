import { Head } from 'vite-react-ssg'
import { SITE_URL } from '@/data/site'
import { hreflangLinks, type Locale, getDictionary } from '@/lib/i18n'

/** Document head managed for SSG (react-helmet via vite-react-ssg). */
export function HeadTags({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const links = hreflangLinks(SITE_URL)
  const url = locale === 'en' ? `${SITE_URL}/` : `${SITE_URL}/pt/`
  const og = `${SITE_URL}${dict.meta.ogImage}`

  return (
    <Head>
      <html lang={dict.htmlLang} />
      <title>{dict.meta.title}</title>
      <meta name="description" content={dict.meta.description} />
      <meta property="og:type" content="profile" />
      <meta property="og:site_name" content="andrechaves.me" />
      <meta property="og:title" content={dict.meta.title} />
      <meta property="og:description" content={dict.meta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={og} />
      <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'pt_BR'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={dict.meta.title} />
      <meta name="twitter:description" content={dict.meta.description} />
      <meta name="twitter:image" content={og} />
      <link rel="canonical" href={url} />
      {links.map((l) => (
        <link key={l.hreflang} rel="alternate" hrefLang={l.hreflang} href={l.href} />
      ))}
    </Head>
  )
}
