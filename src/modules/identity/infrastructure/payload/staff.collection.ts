import { limitAuthAttempts, verifyStaffMfa } from './auth-security'
import { validatePassword } from './password-policy'
import { APIError, type CollectionConfig, type PayloadRequest } from 'payload'

import { can } from '../../application/can'
import { getStaffRoles, staffRoleLabels, staffRoles } from '../../domain/staff-role'

const isSignedIn = ({ req }: { req: PayloadRequest }) =>
  can(getStaffRoles(req.user), 'admin.access')

const canCreateStaff = async ({ req }: { req: PayloadRequest }) => {
  if (can(getStaffRoles(req.user), 'staff.manage')) {
    return true
  }

  const { totalDocs } = await req.payload.count({
    collection: 'staff',
    overrideAccess: true,
    req,
  })

  return totalDocs === 0
}

const canManageStaff = ({ req }: { req: PayloadRequest }) =>
  can(getStaffRoles(req.user), 'staff.manage')

const canUpdateStaff: NonNullable<CollectionConfig['access']>['update'] = ({ req }) => {
  if (can(getStaffRoles(req.user), 'staff.manage')) {
    return true
  }

  if (!isSignedIn({ req }) || !req.user) {
    return false
  }

  return {
    id: {
      equals: req.user.id,
    },
  }
}

export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: {
    singular: 'همکار',
    plural: 'همکاران',
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles', 'accountStatus'],
    group: 'مدیریت',
    useAsTitle: 'name',
  },
  auth: {
    useSessions: true,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
    removeTokenFromResponses: true,
    lockTime: 15 * 60 * 1000,
    maxLoginAttempts: 5,
  },
  access: {
    admin: isSignedIn,
    create: canCreateStaff,
    delete: ({ req }) =>
      canManageStaff({ req }) && req.user ? { id: { not_equals: req.user.id } } : false,
    read: isSignedIn,
    update: canUpdateStaff,
  },
  hooks: {
    beforeOperation: [limitAuthAttempts],
    beforeLogin: [verifyStaffMfa],
    beforeValidate: [validatePassword,
      async ({ data, operation, originalDoc, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({
            collection: 'staff',
            overrideAccess: true,
            req,
          })
          if (totalDocs === 0) return { ...data, roles: ['admin'], accountStatus: 'active' }
        }
        if (
          operation === 'update' &&
          req.user?.collection === 'staff' &&
          String(req.user.id) === String(originalDoc.id)
        ) {
          if (
            data?.accountStatus === 'suspended' ||
            (originalDoc.roles?.includes('admin') && data?.roles && !data.roles.includes('admin'))
          ) {
            throw new APIError(
              'نمی‌توانید دسترسی مدیریت خودتان را حذف یا حساب خودتان را معلق کنید. این کار باید توسط مدیر دیگری انجام شود.',
              400,
            )
          }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'mfaEnabled', type: 'checkbox', defaultValue: false, saveToJWT: true, admin: { readOnly: true, description: 'فعال‌سازی و بازیابی از طریق دستور staff:mfa در سرور انجام می‌شود.' }, access: { create: () => false, update: () => false } },
    { name: 'mfaSecret', type: 'text', hidden: true, access: { read: () => false, create: () => false, update: () => false } },
    { name: 'mfaLastStep', type: 'number', hidden: true, access: { read: () => false, create: () => false, update: () => false } },
    { name: 'mfaRecoveryHashes', type: 'json', hidden: true, access: { read: () => false, create: () => false, update: () => false } },
    {
      name: 'name',
      type: 'text',
      label: 'نام و نام خانوادگی',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      label: 'نقش‌ها',
      hasMany: true,
      required: true,
      defaultValue: ['contentEditor'],
      admin: {
        description:
          'فقط نقش‌های مورد نیاز همکار را انتخاب کنید. مدیر سیستم به همه بخش‌ها دسترسی دارد.',
      },
      options: staffRoles.map((value) => ({
        label: staffRoleLabels[value],
        value,
      })),
      access: {
        update: canManageStaff,
      },
    },
    {
      name: 'accountStatus',
      type: 'select',
      label: 'وضعیت حساب',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'فعال', value: 'active' },
        { label: 'معلق', value: 'suspended' },
      ],
      access: {
        update: canManageStaff,
      },
    },
  ],
}
