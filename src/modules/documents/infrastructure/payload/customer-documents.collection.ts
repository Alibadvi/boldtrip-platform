import path from 'node:path'
import type { CollectionConfig, PayloadRequest } from 'payload'

import {
  can,
  getStaffRoles,
  isCustomerAuthUser,
} from '@/modules/identity'

import {
  documentKinds,
  documentKindLabels,
  documentStatuses,
  documentStatusLabels,
} from '../../domain/customer-document'

function staffCanManageDocuments(req: PayloadRequest): boolean {
  return can(getStaffRoles(req.user), 'cases.manage')
}

const readDocuments: NonNullable<
  CollectionConfig['access']
>['read'] = ({ req }) => {
  if (staffCanManageDocuments(req)) {
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

const deleteDocuments: NonNullable<
  CollectionConfig['access']
>['delete'] = ({ req }) => {
  if (staffCanManageDocuments(req)) {
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

export const CustomerDocuments: CollectionConfig = {
  slug: 'customer-documents',
  labels: {
    singular: 'مدرک مشتری',
    plural: 'مدارک مشتریان',
  },
  admin: {
    group: 'عملیات',
    useAsTitle: 'label',
    defaultColumns: [
      'label',
      'kind',
      'customer',
      'serviceRequest',
      'status',
      'createdAt',
    ],
    description:
      'مدارک خصوصی مشتریان که به یک درخواست مشخص متصل هستند.',
  },
  access: {
    admin: ({ req }) => staffCanManageDocuments(req),
    create: ({ req }) =>
      staffCanManageDocuments(req) ||
      isCustomerAuthUser(req.user),
    read: readDocuments,
    update: ({ req }) => staffCanManageDocuments(req),
    delete: deleteDocuments,
  },
  upload: {
    staticDir: path.resolve(
      process.cwd(),
      'private-uploads/documents',
    ),
    filesRequiredOnCreate: true,
    mimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ],
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') {
          return data
        }

        const nextData = { ...(data ?? {}) }

        if (isCustomerAuthUser(req.user)) {
          nextData.customer = req.user.id
          nextData.status = 'pending'

          const relation = nextData.serviceRequest
          const requestId =
            relation && typeof relation === 'object'
              ? relation.id
              : relation

          if (!requestId) {
            throw new Error(
              'انتخاب درخواست مربوط به مدرک الزامی است.',
            )
          }

          await req.payload.findByID({
            collection: 'service-requests',
            id: requestId,
            overrideAccess: false,
            req,
          })
        }

        return nextData
      },
    ],
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: 'مشتری',
      required: true,
      index: true,
    },
    {
      name: 'serviceRequest',
      type: 'relationship',
      relationTo: 'service-requests',
      label: 'درخواست مرتبط',
      required: true,
      index: true,
    },
    {
      name: 'label',
      type: 'text',
      label: 'عنوان مدرک',
      required: true,
      maxLength: 120,
    },
    {
      name: 'kind',
      type: 'select',
      label: 'نوع مدرک',
      required: true,
      defaultValue: 'other',
      options: documentKinds.map((kind) => ({
        label: documentKindLabels[kind],
        value: kind,
      })),
    },
    {
      name: 'status',
      type: 'select',
      label: 'وضعیت بررسی',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: documentStatuses.map((status) => ({
        label: documentStatusLabels[status],
        value: status,
      })),
    },
    {
      name: 'reviewerNote',
      type: 'textarea',
      label: 'توضیح کارشناس',
      maxLength: 2000,
      admin: {
        description:
          'در صورت رد مدرک، دلیل و روش اصلاح را برای مشتری بنویسید.',
      },
    },
  ],
}
