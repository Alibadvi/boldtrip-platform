'use client'

import Link from 'next/link'
import { useFormFields } from '@payloadcms/ui'

export function NotificationTarget() {
  const collection = useFormFields(([fields]) => fields.targetCollection?.value)
  const id = useFormFields(([fields]) => fields.targetId?.value)
  if (typeof collection !== 'string' || !['customers', 'service-requests', 'customer-documents', 'payment-receipts', 'consultation-bookings', 'country-questions'].includes(collection) || typeof id !== 'string' || !/^\d+$/.test(id)) return null
  return <Link href={`/admin/collections/${collection}/${id}`} className="bt:inline-flex bt:rounded-xl bt:bg-violet-50 bt:px-4 bt:py-3 bt:font-bold bt:text-violet-800 bt:no-underline">مشاهده مورد مرتبط ←</Link>
}
