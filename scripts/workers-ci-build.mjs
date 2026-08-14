#!/usr/bin/env node
/**
 * Workers Builds runs `npm clean-install` then the deploy command.
 * Dashboard build command is currently empty, so dist/ never exists.
 * Cloudflare injects WORKERS_CI=1 — build only in that environment.
 */
import { spawnSync } from 'node:child_process'

if (process.env.WORKERS_CI !== '1') {
  process.exit(0)
}

console.log('[workers-ci] WORKERS_CI=1 — running npm run build before deploy')
const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: process.env,
  shell: false,
})
process.exit(result.status ?? 1)
