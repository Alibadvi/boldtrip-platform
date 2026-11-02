import type { CollectionAfterChangeHook, CollectionConfig, PayloadRequest, Where } from 'payload'
import { can, getStaffRoles } from '@/modules/identity'

function allowed(req: PayloadRequest): Where | boolean {
  const roles = getStaffRoles(req.user)
  if (can(roles, 'staff.manage')) return true
  const targets: string[] = []
  if (can(roles, 'cases.manage'))
    targets.push('customers', 'service-requests', 'customer-documents', 'country-questions')
  if (can(roles, 'content.manage')) targets.push('country-questions')
  if (can(roles, 'scheduling.manage')) targets.push('consultation-bookings')
  if (can(roles, 'payments.review')) targets.push('payment-receipts')
  return targets.length ? { targetCollection: { in: targets } } : false
}

export const AdminNotifications: CollectionConfig = {
  slug: 'admin-notifications',
  labels: { singular: 'اعلان', plural: 'اعلان‌ها' },
  admin: { group: 'عملیات', useAsTitle: 'title', defaultColumns: ['title', 'status', 'createdAt'] },
  access: {
    create: () => false,
    delete: () => false,
    read: ({ req }) => allowed(req),
    update: ({ req }) => allowed(req),
  },
  fields: [
    { name: 'targetLink', type: 'ui', admin: { components: { Field: '/modules/notifications/presentation/notification-target#NotificationTarget' } } },
    { name: 'title', type: 'text', required: true, access: { update: () => false } },
    {
      name: 'targetCollection',
      type: 'text',
      required: true,
      index: true,
      access: { update: () => false },
    },
    { name: 'targetId', type: 'text', required: true, access: { update: () => false } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'unread',
      index: true,
      options: [
        { label: 'خوانده‌نشده', value: 'unread' },
        { label: 'خوانده‌شده', value: 'read' },
      ],
    },
  ],
}

// IDs and event names only. Never copy applicant details, documents or receipts into alerts.
export const notifyNewSubmission: CollectionAfterChangeHook = async ({
  collection,
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc
  const titles: Record<string, string> = {
    customers: 'ثبت‌نام کاربر جدید',
    'service-requests':
      doc.requestType === 'freeAssessment' ? 'ارزیابی رایگان جدید' : 'درخواست خدمت جدید',
    'customer-documents': 'مدرک جدید',
    'payment-receipts': 'فیش پرداخت جدید',
    'consultation-bookings': 'رزرو مشاوره جدید',
    'country-questions': 'پرسش جدید',
  }
  const title = titles[collection.slug]
  if (title)
    await req.payload.create({
      collection: 'admin-notifications',
      overrideAccess: true,
      req,
      data: {
        title,
        targetCollection: collection.slug,
        targetId: String(doc.id),
        status: 'unread',
      },
    })
  return doc
}
