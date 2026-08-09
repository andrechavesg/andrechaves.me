export interface MediumPost {
  title: string
  link: string
  guid: string
  pubDate: string
  excerpt: string
  categories: string[]
  language: 'pt'
}

export interface PostsFile {
  fetchedAt: string | null
  source: string
  posts: MediumPost[]
}

const TRACKING_PATTERNS = [/medium\.com\/_\/stat/i, /cdn-cgi\/image/i]

export function stripTrackingAndExcerpt(html: string, maxLen = 220): string {
  const withoutTags = html
    .replace(/<img[^>]*>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

  if (withoutTags.length <= maxLen) return withoutTags
  return `${withoutTags.slice(0, maxLen - 1).trimEnd()}…`
}

export function shouldStripUrl(url: string): boolean {
  return TRACKING_PATTERNS.some((re) => re.test(url))
}

export function normalizePost(raw: {
  title?: string
  link?: string
  guid?: string
  pubDate?: string
  content?: string
  categories?: string[]
}): MediumPost | null {
  if (!raw.title || !raw.link) return null
  return {
    title: raw.title.trim(),
    link: raw.link.trim(),
    guid: (raw.guid || raw.link).trim(),
    pubDate: raw.pubDate || '',
    excerpt: stripTrackingAndExcerpt(raw.content || ''),
    categories: raw.categories ?? [],
    language: 'pt',
  }
}

export function mergeWithFallback(
  incoming: MediumPost[] | null,
  fallback: PostsFile,
  fetchedAt: string | null,
): PostsFile {
  if (!incoming || incoming.length === 0) {
    return { ...fallback, fetchedAt: fallback.fetchedAt }
  }
  return {
    fetchedAt,
    source: 'https://medium.com/feed/@symfonymaestro',
    posts: incoming,
  }
}
