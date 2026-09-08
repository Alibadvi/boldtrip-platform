import { APIError, type CollectionConfig } from 'payload'
import { can, getStaffRoles } from '@/modules/identity'
import { lockWorkflowRecord } from '@/shared/infrastructure/lock-workflow-record'

// One full refund per receipt. Partial refunds require a separate allocation model.
export const Refunds: CollectionConfig = {
  slug: 'refunds',
  labels: { singular: 'بازپرداخت', plural: 'بازپرداخت‌ها' },
  admin: { group: 'عملیات', useAsTitle: 'reason', defaultColumns: ['receipt', 'amount', 'status', 'updatedAt'], description: 'ثبت بازپرداخت به‌معنی انتقال بانکی نیست. پس از واریز واقعی، شناسه بانکی را ثبت کنید.' },
  access: {
    read: ({ req }) => can(getStaffRoles(req.user), 'payments.review'),
    create: ({ req }) => can(getStaffRoles(req.user), 'payments.review'),
    update: ({ req }) => can(getStaffRoles(req.user), 'payments.review'),
    delete: () => false,
  },
  hooks: { beforeValidate: [async ({ data, originalDoc, operation, req }) => {
    const next = { ...data }
    const relation = operation === 'create' ? next.receipt : originalDoc.receipt
    const id = relation && typeof relation === 'object' ? relation.id : relation
    if (!id) throw new APIError('رسید تأییدشده را انتخاب کنید.', 400)
    await lockWorkflowRecord(req, 'payment-receipts', id)
    const receipt = await req.payload.findByID({ collection: 'payment-receipts', id, depth: 0, overrideAccess: true, req })
    if (receipt.status !== 'approved') throw new APIError('فقط پرداخت تأییدشده قابل بازپرداخت است.', 400)
    if (operation === 'create') {
      next.status = 'requested'
      next.bankReference = null
      next.refundedAt = null
    } else {
      const current = await req.payload.findByID({ collection: 'refunds', id: originalDoc.id, depth: 0, overrideAccess: true, req })
      const status = next.status ?? current.status
      const allowed: Record<string, string[]> = { requested: ['approved', 'rejected'], approved: ['refunded'], rejected: ['requested'], refunded: [] }
      if (status !== current.status && !allowed[current.status].includes(status)) throw new APIError('تغییر وضعیت بازپرداخت مجاز نیست.', 400)
      if (current.status === 'refunded') throw new APIError('بازپرداخت انجام‌شده قابل ویرایش نیست.', 400)
      if (status === 'refunded' && !String(next.bankReference ?? current.bankReference ?? '').trim()) throw new APIError('شناسه انتقال بانکی الزامی است.', 400)
      next.refundedAt = status === 'refunded' ? new Date().toISOString() : null
    }
    next.receipt = id
    next.amount = receipt.amount
    return next
  }] },
  fields: [
    { name: 'receipt', type: 'relationship', relationTo: 'payment-receipts', required: true, unique: true, label: 'رسید پرداخت' },
    { name: 'amount', type: 'number', required: true, min: 1, label: 'مبلغ به تومان', admin: { readOnly: true } },
    { name: 'reason', type: 'textarea', required: true, maxLength: 1000, label: 'دلیل بازپرداخت' },
    { name: 'status', type: 'select', required: true, defaultValue: 'requested', label: 'وضعیت', options: [{ label: 'درخواست بررسی', value: 'requested' }, { label: 'تأیید برای واریز', value: 'approved' }, { label: 'رد شده', value: 'rejected' }, { label: 'واریز انجام شد', value: 'refunded' }] },
    { name: 'bankReference', type: 'text', maxLength: 120, label: 'شناسه انتقال بانکی' },
    { name: 'refundedAt', type: 'date', label: 'تاریخ ثبت واریز', admin: { readOnly: true } },
  ],
}
