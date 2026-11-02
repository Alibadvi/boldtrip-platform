import { build } from 'esbuild'

await build({
  entryPoints: ['scripts/ops/migrate-release.ts'], bundle: true, platform: 'node', format: 'esm',
  packages: 'external', outfile: 'release-tools/migrate.mjs',
  alias: { 'next/headers': 'next/headers.js', 'next/navigation': 'next/navigation.js', 'next/link': 'next/link.js', 'next/cache': 'next/cache.js' },
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
})
