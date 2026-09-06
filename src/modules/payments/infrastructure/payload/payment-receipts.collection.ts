import path from 'node:path'

import type {
  CollectionConfig,
  PayloadRequest,
} from 'payload'

import {
  can,
  getStaffRoles,
  isCustomerAuthUser,
} from '@/modules/identity'

import {
  paymentReceiptStatuses,
  paymentReceiptStatusLabels,
} from '../../domain/manual-payment'

function staffCanReview(req: PayloadRequest): boolean {
  return can(getStaffRoles(req.user), 'payments.review')
}

const readReceipts: NonNullable<
  CollectionConfig['access']
>['read'] = ({ req }) => {
  if (staffCanReview(req)) {
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

export const PaymentReceipts: CollectionConfig = {
  slug: 'payment-receipts',
  labels: {
    singular: 'رسید پرداخت',
    plural: 'رسیدهای پرداخت',
  },
  admin: {
    group: 'عملیات',
    useAsTitle: 'filename',
    defaultColumns: [
      'filename',
      'customer',
      'amount',
      'status',
      'createdAt',
    ],
    description:
      'رسیدهای بانکی مشتریان را بررسی و تأیید یا رد کنید.',
  },
  upload: {
    staticDir: path.resolve(
      process.cwd(),
      'private-uploads/receipts',
    ),
    mimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ],
  },
  access: {
    admin: ({ req }) => staffCanReview(req),
    create: ({ req }) =>
      staffCanReview(req) || isCustomerAuthUser(req.user),
    read: readReceipts,
    update: ({ req }) => staffCanReview(req),
    delete: ({ req }) => staffCanReview(req),
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') {
          return data
        }

        const nextData = { ...(data ?? {}) }
        const uploadedFile = req.file as
          | { size?: number }
          | undefined

        if (
          uploadedFile?.size &&
          uploadedFile.size > 10 * 1024 * 1024
        ) {
          throw new Error(
            'حجم فایل نباید بیشتر از ۱۰ مگابایت باشد.',
          )
        }

        if (isCustomerAuthUser(req.user)) {
          nextData.customer = req.user.id
          nextData.status = 'pending'

          const payableType = nextData.payableType
          const relation =
            payableType === 'consultation'
              ? nextData.consultationBooking
              : nextData.serviceRequest
          const relationId =
            relation && typeof relation === 'object'
              ? relation.id
              : relation

          if (!relationId) {
            throw new Error('انتخاب مورد پرداخت الزامی است.')
          }

          const collection =
            payableType === 'consultation'
              ? 'consultation-bookings'
              : 'service-requests'

          const payable = await req.payload.findByID({
            collection: collection as 'service-requests',
            id: relationId,
            overrideAccess: false,
            req,
          }) as unknown as {
            amount?: number
            quotedAmount?: number
          }

          const payableAmount =
            payableType === 'consultation'
              ? payable.amount
              : payable.quotedAmount

          if (
            typeof payableAmount !== 'number' ||
            payableAmount <= 0
          ) {
            throw new Error(
              'مبلغ این مورد هنوز قابل پرداخت نیست.',
            )
          }

          nextData.amount = payableAmount
        }

        return nextData
      },
    ],
    afterChange: [
      async ({ doc, operation, previousDoc, req }) => {
        if (
          !['create', 'update'].includes(operation) ||
          (operation === 'update' &&
            doc.status === previousDoc?.status)
        ) {
          return doc
        }

        const status =
          doc.status === 'approved'
            ? 'confirmed'
            : doc.status === 'rejected'
              ? 'awaitingPayment'
              : 'paymentReview'

        const relation =
          doc.payableType === 'consultation'
            ? doc.consultationBooking
            : doc.serviceRequest
        const relationId =
          relation && typeof relation === 'object'
            ? relation.id
            : relation

        if (!relationId) {
          return doc
        }

        if (doc.payableType === 'consultation') {
          await req.payload.update({
            collection:
              'consultation-bookings' as 'service-requests',
            id: relationId,
            data: { status },
            overrideAccess: true,
          })
        } else {
          await req.payload.update({
            collection: 'service-requests',
            id: relationId,
            data: {
              status:
                doc.status === 'approved'
                  ? 'inProgress'
                  : doc.status === 'rejected'
                    ? 'awaitingPayment'
                    : 'paymentReview',
            },
            overrideAccess: true,
          })
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      index: true,
      label: 'مشتری',
    },
    {
      name: 'payableType',
      type: 'select',
      required: true,
      label: 'بابت',
      options: [
        { label: 'درخواست خدمت', value: 'serviceRequest' },
        { label: 'رزرو مشاوره', value: 'consultation' },
      ],
    },
    {
      name: 'serviceRequest',
      type: 'relationship',
      relationTo: 'service-requests',
      label: 'درخواست خدمت',
      admin: {
        condition: (_, data) =>
          data?.payableType === 'serviceRequest',
      },
    },
    {
      name: 'consultationBooking',
      type: 'relationship',
      relationTo:
        'consultation-bookings' as 'service-requests',
      label: 'رزرو مشاوره',
      admin: {
        condition: (_, data) =>
          data?.payableType === 'consultation',
      },
    },
    {
      name: 'amount',
      type: 'number',
      label: 'مبلغ واریزی به تومان',
      required: true,
      min: 0,
    },
    {
      name: 'paidAt',
      type: 'date',
      label: 'زمان تقریبی واریز',
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'توضیح مشتری',
      maxLength: 1000,
    },
    {
      name: 'status',
      type: 'select',
      label: 'وضعیت بررسی',
      required: true,
      defaultValue: 'pending',
      options: paymentReceiptStatuses.map((status) => ({
        label: paymentReceiptStatusLabels[status],
        value: status,
      })),
    },
    {
      name: 'reviewerNote',
      type: 'textarea',
      label: 'توضیح کارشناس برای مشتری',
      maxLength: 1000,
    },
  ],
}
