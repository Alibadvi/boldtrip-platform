import { sql } from '@payloadcms/db-postgres'
import { APIError, type PayloadRequest } from 'payload'

export type WorkflowCollection = 'service-requests' | 'consultation-bookings'

const tables: Record<WorkflowCollection, string> = {
  'service-requests': 'service_requests',
  'consultation-bookings': 'consultation_bookings',
}

/** Hold the parent row until Payload commits the receipt and its status change together. */
export async function lockWorkflowRecord(
  req: PayloadRequest,
  collection: WorkflowCollection,
  id: string | number,
): Promise<void> {
  const transactionID = await req.transactionID
  const transaction = transactionID == null ? undefined : req.payload.db.sessions[transactionID]?.db
  const table = req.payload.db.tables[tables[collection]]

  if (!transaction || !('execute' in transaction) || !table) {
    throw new APIError('امکان ذخیره امن تغییرات فراهم نیست. دوباره تلاش کنید.', 503)
  }

  await transaction.execute(
    sql`SELECT ${table.id} FROM ${table} WHERE ${table.id} = ${id} FOR UPDATE`,
  )
}
