import type { PostgresAdapter } from '@payloadcms/db-postgres'
import { loadEnv } from 'payload/node'
loadEnv()
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
try {
  let expired = 0
  const bookings = await payload.find({ collection: 'consultation-bookings', depth: 0, limit: 200, overrideAccess: true, where: { and: [{ status: { equals: 'awaitingPayment' } }, { holdExpiresAt: { less_than_equal: new Date().toISOString() } }] } })
  for (const booking of bookings.docs) {
    try {
      await payload.update({ collection: 'consultation-bookings', id: booking.id, data: { status: 'expired' }, overrideAccess: true })
      expired++
    } catch {
      // A concurrent receipt may have moved the booking into paymentReview.
      payload.logger.warn({ bookingId: booking.id }, 'Booking changed during expiry; retry next run')
    }
  }
  const adapter = payload.db as unknown as PostgresAdapter
  await adapter.pool.query("DELETE FROM auth_rate_limits WHERE updated_at < NOW() - INTERVAL '1 day'")
  payload.logger.info({ expired }, 'Booking expiry completed')
} finally { await payload.destroy() }
