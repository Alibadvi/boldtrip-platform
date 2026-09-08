import { randomUUID } from 'node:crypto'
import { APIError } from 'payload'
import { lockWorkflowRecord } from '@/shared/infrastructure/lock-workflow-record'
import type { CollectionConfig, PayloadRequest } from 'payload'

import { can, getStaffRoles, isCustomerAuthUser } from '@/modules/identity'

import {
  serviceRequestStatuses,
  serviceRequestStatusLabels,
  serviceRequestTypes,
  serviceRequestTypeLabels,
} from '../../domain/service-request'

function staffCanManageCases(req: PayloadRequest): boolean {
  return can(getStaffRoles(req.user), 'cases.manage')
}

function customerCanCreate(req: PayloadRequest): boolean {
  return isCustomerAuthUser(req.user)
}

function createReference(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')

  const randomPart = randomUUID().slice(0, 6).toUpperCase()

  return `BT-${date}-${randomPart}`
}

const readRequests: NonNullable<CollectionConfig['access']>['read'] = ({ req }) => {
  if (staffCanManageCases(req)) {
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

export const ServiceRequests: CollectionConfig = {
  slug: 'service-requests',

  labels: {
    singular: 'درخواست خدمت',
    plural: 'درخواست‌های خدمات',
  },

  admin: {
    group: 'عملیات',
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'requestType', 'customer', 'status', 'submittedAt'],
    description: 'درخواست‌های خدمات و وقت سفارت ثبت‌شده توسط مشتریان.',
  },

  access: {
    admin: ({ req }) => staffCanManageCases(req),

    create: ({ req }) => staffCanManageCases(req) || customerCanCreate(req),

    read: readRequests,

    update: ({ req }) => staffCanManageCases(req),

    delete: () => false,
  },

  hooks: {
    beforeValidate: [
      async ({ data, operation, originalDoc, req }) => {
        if (operation === 'update') {
          await lockWorkflowRecord(req, 'service-requests', originalDoc.id)
          const current = await req.payload.findByID({
            collection: 'service-requests',
            id: originalDoc.id,
            depth: 0,
            overrideAccess: true,
            req,
          })
          const next = { ...data }
          if (
            next.status &&
            next.status !== current.status &&
            ['cancelled', 'rejected', 'completed'].includes(current.status)
          ) {
            throw new APIError('پرونده بسته‌شده قابل بازگشایی نیست؛ درخواست جدید ثبت کنید.', 400)
          }
          if (
            next.quotedAmount !== undefined &&
            next.quotedAmount !== current.quotedAmount &&
            ['paymentReview', 'inProgress', 'completed'].includes(current.status)
          ) {
            throw new APIError('مبلغ پرونده پس از ارسال رسید قابل تغییر نیست.', 400)
          }
          if (next.status === 'inProgress' && current.status !== 'inProgress' && !req.context.paymentReceiptTransition) throw new APIError('شروع کار نیازمند تأیید رسید پرداخت است.', 400)
          if (next.status === 'completed' && !['inProgress', 'completed'].includes(current.status)) throw new APIError('پرونده ابتدا باید در حال انجام باشد.', 400)
          const status = next.status ?? current.status
          const amount = next.quotedAmount === undefined ? current.quotedAmount : next.quotedAmount
          if (
            ['quoted', 'awaitingPayment'].includes(status) &&
            !(typeof amount === 'number' && Number.isSafeInteger(amount) && amount > 0)
          ) {
            throw new APIError('ابتدا مبلغ قابل پرداخت را به تومان وارد کنید.', 400)
          }
          if (
            current.status === 'paymentReview' &&
            next.status &&
            next.status !== current.status &&
            !req.context.paymentReceiptTransition
          ) {
            throw new APIError(
              'ابتدا رسید مرتبط را تأیید یا رد کنید؛ وضعیت پرداخت از همان‌جا به‌روزرسانی می‌شود.',
              400,
            )
          }
          return {
            ...next,
            customer: current.customer,
            reference: current.reference,
            requestType: current.requestType,
            service: current.service,
            country: current.country,
            submittedAt: current.submittedAt,
          }
        }

        const nextData = {
          ...(data ?? {}),
        }

        if (isCustomerAuthUser(req.user)) {
          nextData.customer = req.user.id
          nextData.reference = createReference()
          nextData.status = 'submitted'
          nextData.quotedAmount = null
          nextData.staffNote = null
          nextData.submittedAt = new Date().toISOString()
          if (nextData.requestType === 'embassyAppointment') {
            const country = await req.payload.findByID({
              collection: 'countries',
              id: nextData.country,
              depth: 0,
              overrideAccess: false,
              req,
            })
            if (
              country._status !== 'published' ||
              !country.embassyAppointment?.enabled ||
              !country.embassyAppointment.acceptingRequests
            ) {
              throw new APIError('پذیرش درخواست این مقصد فعلاً فعال نیست.', 400)
            }
            nextData.service = null
          } else if (nextData.requestType === 'service') {
            const service = await req.payload.findByID({
              collection: 'services',
              id: nextData.service,
              depth: 0,
              overrideAccess: false,
              req,
            })
            if (service._status !== 'published')
              throw new APIError('این خدمت در حال حاضر قابل درخواست نیست.', 400)
          } else {
            throw new APIError('نوع درخواست معتبر نیست.', 400)
          }
        } else if (!nextData.reference) {
          nextData.reference = createReference()
        }

        if (!nextData.submittedAt) {
          nextData.submittedAt = new Date().toISOString()
        }

        return nextData
      },
    ],
  },

  fields: [
    {
      name: 'relatedRecords',
      type: 'ui',
      admin: {
        components: { Field: '/modules/cases/presentation/request-admin-links#RequestAdminLinks' },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'درخواست',
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
              name: 'requestType',
              type: 'select',
              label: 'نوع درخواست',
              required: true,
              options: serviceRequestTypes.map((type) => ({
                label: serviceRequestTypeLabels[type],
                value: type,
              })),
            },
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              label: 'خدمت',
              admin: {
                condition: (_, siblingData) => siblingData?.requestType === 'service',
              },
              validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
                const data = siblingData as {
                  requestType?: string
                }

                if (data.requestType === 'service' && !value) {
                  return 'انتخاب خدمت الزامی است.'
                }

                return true
              },
            },
            {
              name: 'country',
              type: 'relationship',
              relationTo: 'countries',
              label: 'کشور مقصد',
              admin: {
                condition: (_, siblingData) => siblingData?.requestType === 'embassyAppointment',
              },
              validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
                const data = siblingData as {
                  requestType?: string
                }

                if (data.requestType === 'embassyAppointment' && !value) {
                  return 'انتخاب کشور الزامی است.'
                }

                return true
              },
            },
            {
              name: 'status',
              type: 'select',
              label: 'وضعیت درخواست',
              required: true,
              defaultValue: 'submitted',
              index: true,
              options: serviceRequestStatuses.map((status) => ({
                label: serviceRequestStatusLabels[status],
                value: status,
              })),
            },
            {
              name: 'submittedAt',
              type: 'date',
              label: 'تاریخ ثبت',
              required: true,
              admin: {
                readOnly: true,
                date: {
                  displayFormat: 'yyyy/MM/dd HH:mm',
                },
              },
            },
          ],
        },
        {
          label: 'اطلاعات متقاضی',
          fields: [
            {
              name: 'applicant',
              type: 'group',
              label: 'متقاضی',
              fields: [
                {
                  name: 'fullName',
                  type: 'text',
                  label: 'نام و نام خانوادگی',
                  required: true,
                  maxLength: 100,
                },
                {
                  name: 'mobile',
                  type: 'text',
                  label: 'شماره موبایل',
                  required: true,
                },
                {
                  name: 'email',
                  type: 'email',
                  label: 'ایمیل',
                  required: true,
                },
                {
                  name: 'nationality',
                  type: 'text',
                  label: 'تابعیت',
                  required: true,
                },
                {
                  name: 'passportNumber',
                  type: 'text',
                  label: 'شماره پاسپورت',
                  admin: {
                    description: 'در صورت آماده بودن پاسپورت وارد شود.',
                  },
                },
                {
                  name: 'applicantsCount',
                  type: 'number',
                  label: 'تعداد متقاضیان',
                  required: true,
                  defaultValue: 1,
                  min: 1,
                  max: 20,
                },
              ],
            },
            {
              name: 'customerMessage',
              type: 'textarea',
              label: 'توضیحات مشتری',
              maxLength: 2000,
            },
          ],
        },
        {
          label: 'بررسی کارشناس',
          fields: [
            {
              name: 'quotedAmount',
              access: {
                create: ({ req }) => staffCanManageCases(req),
                update: ({ req }) => staffCanManageCases(req),
              },
              type: 'number',
              label: 'مبلغ اعلام‌شده به تومان',
              min: 0,
              admin: {
                description: 'برای خدماتی که قیمت آن‌ها پس از بررسی اعلام می‌شود.',
              },
            },
            {
              name: 'staffNote',
              access: {
                read: ({ req }) => staffCanManageCases(req),
                create: ({ req }) => staffCanManageCases(req),
                update: ({ req }) => staffCanManageCases(req),
              },
              type: 'textarea',
              label: 'یادداشت داخلی — فقط کارکنان',
              maxLength: 4000,
              admin: {
                description: 'این متن فعلاً فقط در پنل مدیریت نمایش داده می‌شود.',
              },
            },
          ],
        },
      ],
    },
  ],
}
