import type {
  CollectionConfig,
  PayloadRequest,
} from 'payload'

import { can, getStaffRoles } from '@/modules/identity'

import {
  consultationDeliveryMethodLabels,
  consultationDeliveryMethods,
} from '../../domain/consultation'

function staffCanSchedule(req: PayloadRequest): boolean {
  return can(
    getStaffRoles(req.user),
    'scheduling.manage',
  )
}

export const ConsultationSlots: CollectionConfig = {
  slug: 'consultation-slots',
  labels: {
    singular: 'زمان مشاوره',
    plural: 'زمان‌های مشاوره',
  },
  admin: {
    group: 'رزرو مشاوره',
    useAsTitle: 'startsAt',
    defaultColumns: [
      'startsAt',
      'durationMinutes',
      'deliveryMethod',
      'priceAmount',
      'active',
    ],
    description:
      'روز و ساعت‌های قابل رزرو را از این قسمت تعریف کنید.',
  },
  access: {
    admin: ({ req }) => staffCanSchedule(req),
    create: ({ req }) => staffCanSchedule(req),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => staffCanSchedule(req),
    delete: ({ req }) => staffCanSchedule(req),
  },
  fields: [
    {
      name: 'startsAt',
      type: 'date',
      label: 'تاریخ و ساعت شروع',
      required: true,
      unique: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'yyyy/MM/dd HH:mm',
        },
      },
    },
    {
      name: 'durationMinutes',
      type: 'number',
      label: 'مدت جلسه به دقیقه',
      required: true,
      defaultValue: 45,
      min: 15,
      max: 240,
    },
    {
      name: 'deliveryMethod',
      type: 'select',
      label: 'روش برگزاری',
      required: true,
      defaultValue: 'video',
      options: consultationDeliveryMethods.map(
        (method) => ({
          label:
            consultationDeliveryMethodLabels[method],
          value: method,
        }),
      ),
    },
    {
      name: 'priceAmount',
      type: 'number',
      label: 'هزینه به تومان',
      required: true,
      min: 0,
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'قابل رزرو',
      defaultValue: true,
      index: true,
    },
  ],
}
