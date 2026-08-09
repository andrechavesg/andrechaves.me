#!/usr/bin/env node
/**
 * Build-time Medium RSS fetch → src/data/posts.json
 * Never fails the build: on error, keeps last-good file and exits 0.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLParser } from 'fast-xml-parser'
import sanitizeHtml from 'sanitize-html'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../src/data/posts.json')
const FEED = 'https://medium.com/feed/@symfonymaestro'
const TIMEOUT_MS = 10_000
const UA = 'andrechaves.me-prebuild/1.0 (+https://andrechaves.me; feed-sync)'

function loadFallback() {
  if (!existsSync(OUT)) {
    return {
      fetchedAt: null,
      source: FEED,
      posts: [],
    }
  }
  return JSON.parse(readFileSync(OUT, 'utf8'))
}

function toArray(v) {
  if (v == null) return []
  return Array.isArray(v) ? v : [v]
}

function excerptFromHtml(html) {
  const clean = sanitizeHtml(html || '', {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, ' ')
    .trim()
  if (clean.length <= 220) return clean
  return `${clean.slice(0, 219).trimEnd()}…`
}

function parseItems(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  })
  const doc = parser.parse(xml)
  const channel = doc?.rss?.channel
  const items = toArray(channel?.item)
  return items
    .map((item) => {
      const content =
        item['content:encoded'] || item['content'] || item.description || ''
      const cats = toArray(item.category).map((c) =>
        typeof c === 'object' ? String(c['#text'] || '') : String(c),
      )
      const link = typeof item.link === 'object' ? item.link['#text'] : item.link
      const guid =
        typeof item.guid === 'object'
          ? item.guid['#text'] || item.guid
          : item.guid
      if (!item.title || !link) return null
      return {
        title: String(item.title).trim(),
        link: String(link).trim(),
        guid: String(guid || link).trim(),
        pubDate: String(item.pubDate || ''),
        excerpt: excerptFromHtml(String(content)),
        categories: cats.filter(Boolean),
        language: 'pt',
      }
    })
    .filter(Boolean)
}

async function fetchFeed() {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(FEED, {
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/xml, text/xml' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.text()
  } finally {
    clearTimeout(timer)
  }
}

async function main() {
  const fallback = loadFallback()
  try {
    const xml = await fetchFeed()
    const posts = parseItems(xml)
    if (!posts.length) throw new Error('No items in feed')
    const payload = {
      fetchedAt: new Date().toISOString(),
      source: FEED,
      posts,
    }
    writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`)
    console.log(`[fetch-medium] Wrote ${posts.length} posts to src/data/posts.json`)
  } catch (err) {
    console.warn(`[fetch-medium] Feed error — keeping last-good posts.json: ${err.message}`)
    if (!existsSync(OUT)) {
      writeFileSync(OUT, `${JSON.stringify(fallback, null, 2)}\n`)
    }
  }
  process.exit(0)
}

main()
