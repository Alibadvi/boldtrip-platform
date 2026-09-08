import { APIError, type CollectionConfig, type PayloadRequest } from 'payload'

import { can } from '../../application/can'
import { getStaffRoles, staffRoleLabels, staffRoles } from '../../domain/staff-role'

const isSignedIn = ({ req }: { req: PayloadRequest }) =>
  req.user?.collection === 'staff' && req.user.accountStatus === 'active'

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
    beforeValidate: [
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
