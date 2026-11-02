import { loadEnv } from 'payload/node'
import { getPayload } from 'payload'
import type { PostgresAdapter } from '@payloadcms/db-postgres'
import assert from 'node:assert/strict'

loadEnv()
if (!process.env.DATABASE_URL || new URL(process.env.DATABASE_URL).pathname !== '/boldtrip_ci') throw new Error('Migration rehearsal requires the disposable boldtrip_ci database.')
const { default: config } = await import('../src/payload.config')
const { migrations } = await import('./ops/release-migrations')
const payload = await getPayload({ config })
try {
  const adapter = payload.db as unknown as PostgresAdapter
  await payload.db.migrate({ migrations: migrations.slice(0, -1) })
  await adapter.pool.query("INSERT INTO customers (name, mobile, email) VALUES ('Migration preservation fixture','09129999999','migration-sentinel@example.test')")
  const before = await adapter.pool.query("SELECT id, name, mobile, email, created_at FROM customers WHERE email='migration-sentinel@example.test'")
  await payload.db.migrate({ migrations })
  const after = await adapter.pool.query("SELECT id, name, mobile, email, created_at FROM customers WHERE email='migration-sentinel@example.test'")
  assert.deepEqual(after.rows, before.rows)
  await payload.db.migrate({ migrations })
  const repeats = await adapter.pool.query("SELECT count(*)::int AS n FROM payload_migrations WHERE name=$1", [migrations[migrations.length - 1].name])
  assert.equal(repeats.rows[0].n, 1)
  console.log('Existing customer preserved; repeat migration run did not reapply the release.')
} finally { await payload.destroy() }

// Standalone Payload scripts can retain adapter handles after cleanup.
process.exit(0)
