import type { CollectionConfig, PayloadRequest } from 'payload'

import { can } from '../../application/can'
import {
  isCustomerAuthUser,
  isValidPhoneNumber,
  normalizePhoneNumber,
} from '../../domain/customer'
import { getStaffRoles } from '../../domain/staff-role'

const canAccessCustomerAdmin = ({ req }: { req: PayloadRequest }) =>
  can(getStaffRoles(req.user), 'admin.access')

const canReadAllCustomers = (req: PayloadRequest) => {
  const roles = getStaffRoles(req.user)

  return (
    can(roles, 'staff.manage') ||
    can(roles, 'cases.manage') ||
    can(roles, 'scheduling.manage') ||
    can(roles, 'payments.review')
  )
}

const readCustomers: NonNullable<CollectionConfig['access']>['read'] = ({ req }) => {
  if (canReadAllCustomers(req)) {
    return true
  }

  if (!isCustomerAuthUser(req.user)) {
    return false
  }

  return {
    id: {
      equals: req.user.id,
    },
  }
}

const updateCustomer: NonNullable<CollectionConfig['access']>['update'] = ({ req }) => {
  if (can(getStaffRoles(req.user), 'staff.manage')) {
    return true
  }

  if (!isCustomerAuthUser(req.user)) {
    return false
  }

  return {
    id: {
      equals: req.user.id,
    },
  }
}

const deleteCustomer: NonNullable<CollectionConfig['access']>['delete'] = ({ req }) =>
  can(getStaffRoles(req.user), 'staff.manage')

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'مشتری',
    plural: 'مشتریان',
  },
  admin: {
    defaultColumns: ['name', 'email', 'mobile', 'createdAt'],
    group: 'مدیریت',
    useAsTitle: 'name',
    description: 'حساب مشتریان سایت برای رزرو و پیگیری خدمات.',
  },
  auth: {
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
    lockTime: 15 * 60 * 1000,
    maxLoginAttempts: 5,
    minPasswordLength: 8,
    tokenExpiration: 60 * 60 * 24 * 7,
    forgotPassword: {
      generateEmailSubject: () =>
        'بازیابی رمز عبور BoldTrip',
      generateEmailHTML: ({ token }) => {
        const siteURL =
          process.env.NEXT_PUBLIC_SITE_URL ??
          'http://localhost:3000'
        const resetURL =
          `${siteURL}/reset-password?token=${token}`

        return `<p dir="rtl">برای انتخاب رمز عبور جدید روی لینک زیر کلیک کنید:</p><p><a href="${resetURL}">${resetURL}</a></p>`
      },
    },
  },
  access: {
    admin: canAccessCustomerAdmin,
    create: () => true,
    delete: deleteCustomer,
    read: readCustomers,
    update: updateCustomer,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'نام و نام خانوادگی',
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      name: 'mobile',
      type: 'text',
      label: 'شماره موبایل',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'مانند 09121234567 یا +989121234567',
      },
      hooks: {
        beforeValidate: [
          ({ value }) =>
            typeof value === 'string' ? normalizePhoneNumber(value) : value,
        ],
      },
      validate: (value: unknown) =>
        typeof value === 'string' && isValidPhoneNumber(value)
          ? true
          : 'شماره موبایل معتبر نیست.',
    },
  ],
}
