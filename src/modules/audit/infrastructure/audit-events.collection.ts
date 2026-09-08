import type { CollectionConfig, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { can } from '@/modules/identity/application/can'
import { getStaffRoles } from '@/modules/identity/domain/staff-role'

export const AuditEvents: CollectionConfig = {
  slug: 'audit-events', labels: { singular: 'رویداد', plural: 'تاریخچه عملیات' },
  admin: { group: 'مدیریت', useAsTitle: 'action', defaultColumns: ['action', 'targetCollection', 'targetId', 'actor', 'fromStatus', 'toStatus', 'createdAt'] },
  access: { create: () => false, update: () => false, delete: () => false, read: ({ req }) => can(getStaffRoles(req.user), 'staff.manage') },
  fields: [
    { name: 'action', type: 'text', required: true },
    { name: 'targetCollection', type: 'text', required: true, index: true },
    { name: 'targetId', type: 'text', required: true, index: true },
    { name: 'actor', type: 'text', required: true },
    { name: 'fromStatus', type: 'text' },
    { name: 'toStatus', type: 'text' },
    { name: 'changedFields', type: 'json' },
  ],
}

const trackedFields = ['status', 'quotedAmount', 'amount', 'roles', 'accountStatus', 'mfaEnabled', 'active', 'cardNumber', 'iban', 'reviewerNote', 'staffNote']
export const recordChange: CollectionAfterChangeHook = async ({ doc, previousDoc, collection, operation, req }) => {
  const changedFields = trackedFields.filter((field) => JSON.stringify(doc[field]) !== JSON.stringify(previousDoc?.[field]))
  if (operation === 'update' && !changedFields.length) return doc
  await req.payload.create({ collection: 'audit-events', overrideAccess: true, req,
    data: {
      action: operation, targetCollection: collection.slug, targetId: String(doc.id),
      actor: req.user ? `${req.user.collection}:${req.user.id}` : 'system',
      fromStatus: typeof previousDoc?.status === 'string' ? previousDoc.status : undefined,
      toStatus: typeof doc.status === 'string' ? doc.status : undefined,
      changedFields,
    },
  })
  return doc
}

export const recordDelete: CollectionAfterDeleteHook = async ({ doc, collection, req }) => {
  await req.payload.create({ collection: 'audit-events', overrideAccess: true, req,
    data: { action: 'delete', targetCollection: collection.slug, targetId: String(doc.id), actor: req.user ? `${req.user.collection}:${req.user.id}` : 'system' },
  })
  return doc
}
