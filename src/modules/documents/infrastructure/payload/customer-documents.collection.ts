import path from 'node:path'
import { APIError, type CollectionConfig, type PayloadRequest } from 'payload'
import { lockWorkflowRecord } from '@/shared/infrastructure/lock-workflow-record'
import { validatePrivateUpload } from '@/shared/infrastructure/validate-private-upload'

import { can, getStaffRoles, isCustomerAuthUser } from '@/modules/identity'

import {
  documentKinds,
  documentKindLabels,
  documentStatuses,
  documentStatusLabels,
} from '../../domain/customer-document'

function staffCanManageDocuments(req: PayloadRequest): boolean {
  return can(getStaffRoles(req.user), 'cases.manage')
}

const readDocuments: NonNullable<CollectionConfig['access']>['read'] = ({ req }) => {
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
    defaultColumns: ['label', 'kind', 'customer', 'serviceRequest', 'status', 'createdAt'],
    description: 'مدارک خصوصی مشتریان که به یک درخواست مشخص متصل هستند.',
  },
  access: {
    admin: ({ req }) => staffCanManageDocuments(req),
    create: ({ req }) => staffCanManageDocuments(req) || isCustomerAuthUser(req.user),
    read: readDocuments,
    update: ({ req }) => staffCanManageDocuments(req),
    delete: ({ req }) => staffCanManageDocuments(req),
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'private-uploads/documents'),
    filesRequiredOnCreate: true,
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  hooks: {
    beforeOperation: [validatePrivateUpload],
    beforeValidate: [
      async ({ data, operation, originalDoc, req }) => {
        const next = { ...data }
        const relation = operation === 'create' ? next.serviceRequest : originalDoc.serviceRequest
        const requestId = relation && typeof relation === 'object' ? relation.id : relation
        if (!requestId) throw new APIError('انتخاب درخواست مربوط به مدرک الزامی است.', 400)
        await lockWorkflowRecord(req, 'service-requests', requestId)
        const request = await req.payload.findByID({
          collection: 'service-requests',
          id: requestId,
          depth: 0,
          overrideAccess: true,
          req,
        })
        const owner = typeof request.customer === 'object' ? request.customer?.id : request.customer
        if (!owner || (isCustomerAuthUser(req.user) && String(owner) !== String(req.user.id))) {
          throw new APIError('به این درخواست دسترسی ندارید.', 403)
        }
        if (
          (operation === 'create' || req.file) &&
          ['completed', 'cancelled', 'rejected'].includes(request.status)
        ) {
          throw new APIError('پرونده بسته شده است و مدرک جدید نمی‌پذیرد.', 400)
        }
        next.customer = owner
        next.serviceRequest = requestId
        if (isCustomerAuthUser(req.user)) {
          next.status = 'pending'
          next.reviewerNote = null
        }
        if (operation === 'update' && req.file) {
          throw new APIError('برای حفظ سابقه، فایل اصلاح‌شده را به‌عنوان مدرک جدید ثبت کنید.', 400)
        }
        if (
          (next.status ?? originalDoc?.status) === 'rejected' &&
          !String(next.reviewerNote ?? originalDoc?.reviewerNote ?? '').trim()
        ) {
          throw new APIError('دلیل رد و روش اصلاح مدرک را برای مشتری بنویسید.', 400)
        }
        return next
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
        description: 'در صورت رد مدرک، دلیل و روش اصلاح را برای مشتری بنویسید.',
      },
    },
  ],
}
