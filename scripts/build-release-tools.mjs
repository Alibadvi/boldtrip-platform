import { build } from 'esbuild'
import { nodeFileTrace } from 'next/dist/compiled/@vercel/nft/index.js'
import { lstat, mkdir, copyFile, readlink, symlink } from 'node:fs/promises'
import path from 'node:path'

await build({
  entryPoints: ['scripts/ops/migrate-release.ts'], bundle: true, platform: 'node', format: 'esm',
  packages: 'external', outfile: 'release-tools/migrate.mjs',
  alias: { 'next/headers': 'next/headers.js', 'next/navigation': 'next/navigation.js', 'next/link': 'next/link.js', 'next/cache': 'next/cache.js' },
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
})

if (process.argv.includes('--standalone')) {
  const root = process.cwd()
  const destination = path.join(root, '.next/standalone')
  const { fileList } = await nodeFileTrace(['release-tools/migrate.mjs'], { base: root, processCwd: root })
  for (const file of fileList) {
    if (file.startsWith('..')) throw new Error('Migration runtime dependency escaped the repository root.')
    const source = path.join(root, file)
    const target = path.join(destination, file)
    await mkdir(path.dirname(target), { recursive: true })
    const stat = await lstat(source)
    if (stat.isSymbolicLink()) {
      try { await symlink(await readlink(source), target) } catch (error) { if (error.code !== 'EEXIST') throw error }
    } else if (stat.isFile()) await copyFile(source, target)
  }
  console.log(`Copied ${fileList.size} traced migration runtime files into the standalone artifact.`)
}
