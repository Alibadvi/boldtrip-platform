import { existsSync } from 'node:fs'
import { getPayload } from 'payload'
import type { PostgresAdapter } from '@payloadcms/db-postgres'

if (existsSync('.env')) process.loadEnvFile('.env')
const statusOnly = process.argv.includes('--status')
if (!statusOnly && process.env.BOLDTRIP_MIGRATION_APPROVAL !== 'backup-and-staging-verified') {
  throw new Error('Refusing migration. First verify a restorable backup and rehearse this exact release on an isolated restored database. Then set BOLDTRIP_MIGRATION_APPROVAL=backup-and-staging-verified.')
}
process.env.PAYLOAD_DB_PUSH = 'false'
const { default: config } = await import('../../src/payload.config')
const { migrations } = await import('./release-migrations')
const payload = await getPayload({ config })
try {
  const adapter = payload.db as unknown as PostgresAdapter
  const existing = await adapter.pool.query<{ name: string; batch: number }>('SELECT name, batch FROM payload_migrations ORDER BY id')
  const applied = new Set(existing.rows.map((row) => row.name))
  const known = new Set(migrations.map((migration) => migration.name))
  if (existing.rows.some((row) => !known.has(row.name) || row.batch < 0)) throw new Error('Unknown or development-push migration history. Reconcile the schema on staging first.')
  const pending = migrations.filter((migration) => !applied.has(migration.name)).map((migration) => migration.name)
  console.log(JSON.stringify({ applied: [...applied], pending }, null, 2))
  if (!statusOnly) {
    if (!applied.has('20260902_172155_catalog_countries_visas') || !applied.has('20260908_062240_production_security')) throw new Error('Historical baseline is not recorded. Do not run CREATE TABLE migrations against the live database; compare a restored copy first.')
    await payload.db.migrate({ migrations })
    console.log('Reviewed pending migrations completed. Compare record counts and test before reopening traffic.')
  }
} finally { await payload.destroy() }

// Standalone Payload scripts can retain adapter handles after cleanup.
process.exit(0)
