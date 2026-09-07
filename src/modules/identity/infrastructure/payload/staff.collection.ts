import type { CollectionConfig, PayloadRequest } from 'payload'

import { can } from '../../application/can'
import {
  getStaffRoles,
  staffRoleLabels,
  staffRoles,
} from '../../domain/staff-role'

const isSignedIn = ({ req }: { req: PayloadRequest }) =>
  req.user?.collection === 'staff' && req.user.accountStatus === 'active'

const canCreateStaff = async ({ req }: { req: PayloadRequest }) => {
  if (can(getStaffRoles(req.user), 'staff.manage')) {
    return true
  }

  const { totalDocs } = await req.payload.count({
    collection: 'staff',
    overrideAccess: true,
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
    delete: canManageStaff,
    read: isSignedIn,
    update: canUpdateStaff,
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
      defaultValue: ['admin'],
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
