import { randomUUID } from 'node:crypto'
import { APIError, type CollectionSlug } from 'payload'
import { lockWorkflowRecord } from '@/shared/infrastructure/lock-workflow-record'

import type { CollectionConfig, PayloadRequest } from 'payload'

import { can, getStaffRoles, isCustomerAuthUser } from '@/modules/identity'

import { consultationBookingStatuses, consultationBookingStatusLabels } from '../../domain/booking'

function staffCanSchedule(req: PayloadRequest): boolean {
  return can(getStaffRoles(req.user), 'scheduling.manage')
}

const readBookings: NonNullable<CollectionConfig['access']>['read'] = ({ req }) => {
  if (staffCanSchedule(req)) {
    return true
  }

  if (!isCustomerAuthUser(req.user)) {
    return false
  }

  return {
    customer: {
      equals: req.user.id,
    },
  }
}

function createReference(): string {
  return `BC-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID()
    .slice(0, 6)
    .toUpperCase()}`
}

export const ConsultationBookings: CollectionConfig = {
  slug: 'consultation-bookings',
  labels: {
    singular: 'رزرو مشاوره',
    plural: 'رزروهای مشاوره',
  },
  admin: {
    group: 'رزرو مشاوره',
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'customer', 'slot', 'status', 'amount'],
    description: 'رزروهای ثبت‌شده و وضعیت تأیید پرداخت آن‌ها.',
  },
  access: {
    admin: ({ req }) => staffCanSchedule(req),
    create: ({ req }) => staffCanSchedule(req) || isCustomerAuthUser(req.user),
    read: readBookings,
    update: ({ req }) => staffCanSchedule(req),
    delete: () => false,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, originalDoc, req }) => {
        if (operation === 'update') {
          await lockWorkflowRecord(req, 'consultation-bookings', originalDoc.id)
          const current = (await req.payload.findByID({
            collection: 'consultation-bookings' as CollectionSlug,
            id: originalDoc.id,
            depth: 0,
            overrideAccess: true,
            req,
          })) as unknown as Record<string, unknown>
          const next = { ...data }
          if (
            next.status &&
            next.status !== current.status &&
            ['cancelled', 'completed'].includes(String(current.status))
          ) {
            throw new APIError('رزرو بسته‌شده قابل بازگشایی نیست؛ زمان جدید رزرو کنید.', 400)
          }
          if (
            current.status === 'paymentReview' &&
            next.status &&
            next.status !== current.status &&
            !req.context.paymentReceiptTransition
          ) {
            throw new APIError('ابتدا رسید این رزرو را تأیید یا رد کنید.', 400)
          }
          if (
            next.status === 'completed' &&
            current.status !== 'confirmed' &&
            current.status !== 'completed'
          ) {
            throw new APIError('فقط جلسه تأییدشده را می‌توان برگزارشده ثبت کرد.', 400)
          }
          for (const field of [
            'reference',
            'customer',
            'slot',
            'amount',
            'startsAt',
            'durationMinutes',
            'deliveryMethod',
          ])
            next[field] = current[field]
          next.reservationKey =
            (next.status ?? current.status) === 'cancelled' ? null : current.reservationKey
          return next
        }

        const nextData = { ...(data ?? {}) }
        const relation = nextData.slot
        const slotId = relation && typeof relation === 'object' ? relation.id : relation

        if (!slotId) {
          throw new Error('انتخاب زمان مشاوره الزامی است.')
        }

        const slot = (await req.payload.findByID({
          collection: 'consultation-slots' as 'service-requests',
          id: slotId,
          overrideAccess: true,
          req,
        })) as unknown as {
          active?: boolean
          deliveryMethod?: string
          durationMinutes?: number
          priceAmount?: number
          startsAt?: string
        }

        if (!slot.active || !slot.startsAt || new Date(slot.startsAt).getTime() <= Date.now()) {
          throw new Error('این زمان دیگر قابل رزرو نیست.')
        }

        if (isCustomerAuthUser(req.user)) {
          nextData.customer = req.user.id
          nextData.status = 'awaitingPayment'
          nextData.reference = createReference()
        }

        nextData.reference = nextData.reference || createReference()
        nextData.amount = slot.priceAmount ?? 0
        nextData.deliveryMethod = slot.deliveryMethod ?? 'video'
        nextData.durationMinutes = slot.durationMinutes ?? 45
        nextData.startsAt = slot.startsAt
        nextData.reservationKey = String(slotId)

        return nextData
      },
    ],
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      label: 'شماره پیگیری',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: 'مشتری',
      required: true,
      index: true,
    },
    {
      name: 'slot',
      type: 'relationship',
      relationTo: 'consultation-slots' as 'service-requests',
      label: 'زمان انتخاب‌شده',
      required: true,
      index: true,
    },
    {
      name: 'reservationKey',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'startsAt',
      type: 'date',
      label: 'زمان جلسه',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'durationMinutes',
      type: 'number',
      label: 'مدت جلسه',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'deliveryMethod',
      type: 'text',
      label: 'روش برگزاری',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'amount',
      type: 'number',
      label: 'مبلغ به تومان',
      required: true,
      min: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'topic',
      type: 'text',
      label: 'موضوع مشاوره',
      required: true,
      maxLength: 200,
    },
    {
      name: 'customerNote',
      type: 'textarea',
      label: 'توضیحات مشتری',
      maxLength: 2000,
    },
    {
      name: 'status',
      type: 'select',
      label: 'وضعیت رزرو',
      required: true,
      defaultValue: 'awaitingPayment',
      options: consultationBookingStatuses.map((status) => ({
        label: consultationBookingStatusLabels[status],
        value: status,
      })),
    },
  ],
}
