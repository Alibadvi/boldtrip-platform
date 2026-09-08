import { APIError, type GlobalConfig } from 'payload'
import { isPaymentAccountReady } from '../../domain/payment-policy'

import { can, getStaffRoles, isCustomerAuthUser } from '@/modules/identity'

export const PaymentSettings: GlobalConfig = {
  slug: 'payment-settings',
  label: 'اطلاعات پرداخت دستی',
  admin: {
    group: 'عملیات',
    description: 'اطلاعات کارت و حسابی که پس از اعلام هزینه به مشتری نمایش داده می‌شود.',
  },
  access: {
    read: ({ req }) => isCustomerAuthUser(req.user) || can(getStaffRoles(req.user), 'admin.access'),
    update: ({ req }) => can(getStaffRoles(req.user), 'payments.review'),
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const next = { ...originalDoc, ...data }
        if (next.active && !isPaymentAccountReady(next)) {
          throw new APIError(
            'برای فعال‌کردن پرداخت، نام صاحب حساب و شماره کارت یا شبا را کامل کنید.',
            400,
          )
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'active',
      type: 'checkbox',
      label: 'نمایش اطلاعات پرداخت',
      defaultValue: false,
    },
    {
      name: 'cardNumber',
      type: 'text',
      label: 'شماره کارت',
      admin: {
        description: 'فقط اعداد شماره کارت را وارد کنید.',
      },
    },
    {
      name: 'cardholderName',
      type: 'text',
      label: 'نام صاحب کارت',
    },
    {
      name: 'bankName',
      type: 'text',
      label: 'نام بانک',
    },
    {
      name: 'iban',
      type: 'text',
      label: 'شماره شبا',
      admin: {
        description: 'با IR وارد شود.',
      },
    },
    {
      name: 'instructions',
      type: 'textarea',
      label: 'توضیحات پرداخت',
      maxLength: 1000,
    },
  ],
}
