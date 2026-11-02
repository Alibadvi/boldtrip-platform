import { createHash } from 'node:crypto'
import type { PostgresAdapter } from '@payloadcms/db-postgres'
import { APIError, type CollectionBeforeOperationHook } from 'payload'

// Persist outside the business transaction: rejecting a mutation must not undo its rate limit.
export const limitCustomerSubmissions: CollectionBeforeOperationHook = async ({
  operation,
  req,
  collection,
}) => {
  if (operation !== 'create' || req.user?.collection !== 'customers') return
  const key = createHash('sha256')
    .update(`submission:${collection.slug}:${req.user.id}`)
    .digest('hex')
  const adapter = req.payload.db as unknown as PostgresAdapter
  const result = await adapter.pool.query<{ hits: number }>(
    `
    INSERT INTO auth_rate_limits (key, hits, window_started_at, created_at, updated_at)
    VALUES ($1, 1, NOW(), NOW(), NOW())
    ON CONFLICT (key) DO UPDATE SET
      hits = CASE WHEN auth_rate_limits.window_started_at < NOW() - INTERVAL '15 minutes' THEN 1 ELSE auth_rate_limits.hits + 1 END,
      window_started_at = CASE WHEN auth_rate_limits.window_started_at < NOW() - INTERVAL '15 minutes' THEN NOW() ELSE auth_rate_limits.window_started_at END,
      updated_at = NOW()
    RETURNING hits`,
    [key],
  )
  const maximum = ['customer-documents', 'payment-receipts'].includes(collection.slug) ? 20 : 5
  if (result.rows[0].hits > maximum)
    throw new APIError('تعداد ارسال‌ها زیاد است. ۱۵ دقیقه دیگر امتحان کنید.', 429)
}
