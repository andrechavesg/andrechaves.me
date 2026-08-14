#!/usr/bin/env node
/**
 * Post-build gate: every /assets/… reference in SSG HTML must exist on disk.
 * Prevents deploys where hashed chunks are missing and Pages soft-serves HTML
 * (MIME failure for module scripts).
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const DIST = 'dist'
const ASSET_RE = /(?:src|href)=["'](\/assets\/[^"']+)["']/g
const PRELOAD_RE = /(?:href)=["'](\/assets\/[^"']+)["']/g

function collectHtmlFiles(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (name === 'assets' || name === 'fonts' || name === 'og') continue
      collectHtmlFiles(full, out)
    } else if (name.endsWith('.html') && name !== '404-asset.html') {
      out.push(full)
    }
  }
  return out
}

function refsIn(html) {
  const found = new Set()
  for (const re of [ASSET_RE, PRELOAD_RE]) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(html))) found.add(m[1])
  }
  return [...found]
}

const htmlFiles = collectHtmlFiles(DIST)
if (htmlFiles.length === 0) {
  console.error('[verify-assets] No HTML files under dist/')
  process.exit(1)
}

let failed = false
const checked = new Set()

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8')
  const refs = refsIn(html)
  for (const ref of refs) {
    checked.add(ref)
    const onDisk = join(DIST, ref.replace(/^\//, ''))
    if (!existsSync(onDisk)) {
      console.error(
        `[verify-assets] Missing ${ref} (referenced by ${relative(process.cwd(), file)})`,
      )
      failed = true
    }
  }
}

if (failed) {
  console.error(`[verify-assets] FAILED — ${checked.size} unique asset refs checked`)
  process.exit(1)
}

console.log(
  `[verify-assets] OK — ${htmlFiles.length} HTML file(s), ${checked.size} asset ref(s)`,
)
