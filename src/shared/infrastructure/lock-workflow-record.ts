import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import { APIError, type PayloadRequest } from 'payload'

export type WorkflowCollection = 'service-requests' | 'consultation-bookings' | 'consultation-slots' | 'payment-receipts'

const tables: Record<WorkflowCollection, string> = {
  'consultation-slots': 'consultation_slots',
  'payment-receipts': 'payment_receipts',
  'service-requests': 'service_requests',
  'consultation-bookings': 'consultation_bookings',
}

/** Hold the parent row until Payload commits the receipt and its status change together. */
export async function lockWorkflowRecord(
  req: PayloadRequest,
  collection: WorkflowCollection,
  id: string | number,
): Promise<void> {
  const adapter = req.payload.db as unknown as PostgresAdapter
  const transactionID = await req.transactionID
  const transaction = transactionID == null ? undefined : adapter.sessions[transactionID]?.db
  const table = adapter.tables[tables[collection]]

  if (!transaction || !('execute' in transaction) || !table) {
    throw new APIError('امکان ذخیره امن تغییرات فراهم نیست. دوباره تلاش کنید.', 503)
  }

  await transaction.execute(
    sql`SELECT ${table.id} FROM ${table} WHERE ${table.id} = ${id} FOR UPDATE`,
  )
}
