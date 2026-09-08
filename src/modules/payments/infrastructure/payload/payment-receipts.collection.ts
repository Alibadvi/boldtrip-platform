import path from 'node:path'
import { validatePrivateUpload } from '@/shared/infrastructure/validate-private-upload'
import {
  preparePaymentReceipt,
  syncReceiptDecision,
} from '../../application/review-payment-receipt'

import type { CollectionConfig, PayloadRequest } from 'payload'

import { can, getStaffRoles, isCustomerAuthUser } from '@/modules/identity'

import { paymentReceiptStatuses, paymentReceiptStatusLabels } from '../../domain/manual-payment'

function staffCanReview(req: PayloadRequest): boolean {
  return can(getStaffRoles(req.user), 'payments.review')
}

const readReceipts: NonNullable<CollectionConfig['access']>['read'] = ({ req }) => {
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
    defaultColumns: ['filename', 'customer', 'amount', 'status', 'createdAt'],
    description:
      'رسید را باز کنید، با گردش حساب تطبیق دهید و سپس تأیید یا رد کنید. هنگام رد، دلیل را بنویسید؛ نتیجه به مشتری نمایش داده می‌شود. رسیدهای بررسی‌شده قابل تغییر یا حذف نیستند.',
  },
  upload: {
    filesRequiredOnCreate: true,
    staticDir: path.resolve(process.cwd(), 'private-uploads/receipts'),
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  access: {
    admin: ({ req }) => staffCanReview(req),
    create: ({ req }) => staffCanReview(req) || isCustomerAuthUser(req.user),
    read: readReceipts,
    update: ({ req }) => staffCanReview(req),
    delete: () => false,
  },
  hooks: {
    beforeOperation: [validatePrivateUpload],
    beforeValidate: [preparePaymentReceipt],
    afterChange: [syncReceiptDecision],
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
        condition: (_, data) => data?.payableType === 'serviceRequest',
      },
    },
    {
      name: 'consultationBooking',
      type: 'relationship',
      relationTo: 'consultation-bookings',
      label: 'رزرو مشاوره',
      admin: {
        condition: (_, data) => data?.payableType === 'consultation',
      },
    },
    {
      name: 'amount',
      type: 'number',
      label: 'مبلغ واریزی به تومان',
      required: true,
      min: 1,
      admin: { readOnly: true, description: 'مبلغ از پرونده یا رزرو گرفته می‌شود.' },
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
