import { describe, expect, it } from 'vitest'
import {
  mergeWithFallback,
  normalizePost,
  shouldStripUrl,
  stripTrackingAndExcerpt,
  type PostsFile,
} from '@/lib/medium'

const fallback: PostsFile = {
  fetchedAt: '2026-01-01T00:00:00.000Z',
  source: 'https://medium.com/feed/@symfonymaestro',
  posts: [
    {
      title: 'Fallback',
      link: 'https://medium.com/@symfonymaestro/fallback',
      guid: 'g1',
      pubDate: '',
      excerpt: 'kept',
      categories: [],
      language: 'pt',
    },
  ],
}

describe('medium prebuild helpers', () => {
  it('strips tags and truncates excerpts', () => {
    const html = '<p>Hello <img src="https://medium.com/_/stat?x=1" /> world</p>'
    expect(stripTrackingAndExcerpt(html)).toBe('Hello world')
    expect(shouldStripUrl('https://medium.com/_/stat?foo=1')).toBe(true)
  })

  it('normalizes posts as Portuguese language', () => {
    const post = normalizePost({
      title: 'Título',
      link: 'https://medium.com/x',
      content: '<p>Corpo longo '.repeat(40) + '</p>',
    })
    expect(post?.language).toBe('pt')
    expect(post?.excerpt.endsWith('…')).toBe(true)
  })

  it('falls back to last-good when feed empty', () => {
    const merged = mergeWithFallback(null, fallback, null)
    expect(merged.posts[0]?.title).toBe('Fallback')
  })

  it('replaces when feed succeeds', () => {
    const incoming = [
      normalizePost({ title: 'New', link: 'https://medium.com/n', content: 'x' })!,
    ]
    const merged = mergeWithFallback(incoming, fallback, '2026-08-09T00:00:00.000Z')
    expect(merged.posts).toHaveLength(1)
    expect(merged.posts[0]?.title).toBe('New')
  })
})
