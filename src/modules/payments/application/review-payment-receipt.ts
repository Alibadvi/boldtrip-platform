import {
  APIError,
  type CollectionAfterChangeHook,
  type CollectionBeforeValidateHook,
  type CollectionSlug,
} from 'payload'

import { isCustomerAuthUser } from '@/modules/identity/domain/customer'
import {
  lockWorkflowRecord,
  type WorkflowCollection,
} from '@/shared/infrastructure/lock-workflow-record'
import { isPayableStatus, isPaymentAccountReady } from '../domain/payment-policy'

function relationId(value: unknown): string | number | undefined {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) return relationId(value.id)
  return undefined
}

export const preparePaymentReceipt: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const next = { ...data }
  const source = operation === 'create' ? next : originalDoc
  if (!['consultation', 'serviceRequest'].includes(source.payableType)) {
    throw new APIError('نوع پرداخت معتبر نیست.', 400)
  }
  const consultation = source.payableType === 'consultation'
  const field = consultation ? 'consultationBooking' : 'serviceRequest'
  const id = relationId(source[field])
  if (!id) throw new APIError('انتخاب مورد پرداخت الزامی است.', 400)
  const collection: WorkflowCollection = consultation ? 'consultation-bookings' : 'service-requests'

  await lockWorkflowRecord(req, collection, id)
  const payable = (await req.payload.findByID({
    collection: collection as CollectionSlug,
    id,
    depth: 0,
    overrideAccess: true,
    req,
  })) as unknown as {
    customer: unknown
    amount?: number
    quotedAmount?: number
    status: string
  }
  const owner = relationId(payable.customer)
  if (!owner || (isCustomerAuthUser(req.user) && String(owner) !== String(req.user.id))) {
    throw new APIError('به این پرداخت دسترسی ندارید.', 403)
  }

  if (operation === 'create') {
    if (!isPayableStatus(payable.status)) {
      throw new APIError(
        'این مورد در مرحله دریافت رسید نیست. وضعیت پرداخت را دوباره بررسی کنید.',
        400,
      )
    }
    const amount = consultation ? payable.amount : payable.quotedAmount
    if (typeof amount !== 'number' || !Number.isSafeInteger(amount) || amount <= 0) {
      throw new APIError('مبلغ قابل پرداخت هنوز مشخص نشده است.', 400)
    }
    const existing = await req.payload.find({
      collection: 'payment-receipts' as CollectionSlug,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      req,
      where: { and: [{ [field]: { equals: id } }, { status: { in: ['pending', 'approved'] } }] },
    })
    if (existing.docs.length)
      throw new APIError(
        'برای این مورد رسید در انتظار بررسی یا تأییدشده وجود دارد؛ دوباره ارسال نکنید.',
        400,
      )

    if (isCustomerAuthUser(req.user)) {
      const settings = await req.payload.findGlobal({
        slug: 'payment-settings' as Parameters<typeof req.payload.findGlobal>[0]['slug'],
        overrideAccess: true,
        req,
      })
      if (
        !isPaymentAccountReady(
          settings as {
            active?: boolean
            cardholderName?: string
            cardNumber?: string
            iban?: string
          },
        )
      )
        throw new APIError('اطلاعات پرداخت هنوز آماده نیست؛ با پشتیبانی تماس بگیرید.', 400)
      next.status = 'pending'
      next.reviewerNote = null
    }
    next.amount = amount
    next.customer = owner
    next[field] = id
    next[consultation ? 'serviceRequest' : 'consultationBooking'] = null
  } else {
    const current = (await req.payload.findByID({
      collection: 'payment-receipts' as CollectionSlug,
      id: originalDoc.id,
      depth: 0,
      overrideAccess: true,
      req,
    })) as unknown as Record<string, unknown>
    if (current.status !== 'pending')
      throw new APIError('بررسی این رسید تمام شده است؛ برای اصلاح، رسید جدید ثبت کنید.', 400)
    if (req.file)
      throw new APIError('فایل رسید قابل جایگزینی نیست؛ رسید اصلاح‌شده را جداگانه ثبت کنید.', 400)
    for (const key of [
      'customer',
      'payableType',
      'serviceRequest',
      'consultationBooking',
      'amount',
      'paidAt',
      'note',
    ])
      next[key] = current[key]
    if (next.status && next.status !== current.status) {
      if (payable.status !== 'paymentReview')
        throw new APIError('وضعیت پرونده تغییر کرده است. صفحه را تازه کنید.', 400)
      const amount = consultation ? payable.amount : payable.quotedAmount
      if (current.amount !== amount)
        throw new APIError('مبلغ رسید با مبلغ پرونده یکسان نیست؛ ابتدا اختلاف را بررسی کنید.', 400)
    }
  }
  if (next.status === 'rejected' && !String(next.reviewerNote ?? '').trim()) {
    throw new APIError('دلیل رد رسید و روش اصلاح آن را برای مشتری بنویسید.', 400)
  }
  return next
}

export const syncReceiptDecision: CollectionAfterChangeHook = async ({
  doc,
  operation,
  previousDoc,
  req,
}) => {
  if (operation === 'update' && doc.status === previousDoc.status) return doc
  const consultation = doc.payableType === 'consultation'
  const id = relationId(consultation ? doc.consultationBooking : doc.serviceRequest)
  if (!id) throw new APIError('ارتباط رسید با پرونده معتبر نیست.', 400)
  const status =
    doc.status === 'approved'
      ? consultation
        ? 'confirmed'
        : 'inProgress'
      : doc.status === 'rejected'
        ? 'awaitingPayment'
        : 'paymentReview'
  const data: Record<string, unknown> = { status }
  // Reuse this request: the receipt, parent update and row lock share one transaction.
  await req.payload.update({
    collection: (consultation ? 'consultation-bookings' : 'service-requests') as CollectionSlug,
    id,
    data,
    overrideAccess: true,
    req,
    context: { paymentReceiptTransition: true },
  })
  return doc
}
