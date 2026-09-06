import type { CollectionConfig } from 'payload'

import { isCatalogSlug } from '../../domain/catalog'
import {
  serviceKindLabels,
  serviceKinds,
  servicePricingModeLabels,
  servicePricingModes,
} from '../../domain/service'
import {
  canManageCatalog,
  readPublishedCatalog,
} from './catalog-access'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'خدمت',
    plural: 'خدمات',
  },
  admin: {
    group: 'محتوا و خدمات',
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'kind',
      'pricingMode',
      '_status',
      'updatedAt',
    ],
    description:
      'خدمات قابل نمایش در سایت، مانند خدمات ویزا، وقت سفارت و مشاوره.',
  },
  access: {
    create: canManageCatalog,
    delete: canManageCatalog,
    read: readPublishedCatalog,
    update: canManageCatalog,
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'اطلاعات اصلی',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'عنوان خدمت',
              required: true,
            },
            {
              name: 'kind',
              type: 'select',
              label: 'نوع خدمت',
              required: true,
              options: serviceKinds.map((kind) => ({
                label: serviceKindLabels[kind],
                value: kind,
              })),
            },
            {
              name: 'summary',
              type: 'textarea',
              label: 'توضیح کوتاه',
              required: true,
              admin: {
                description:
                  'این متن در کارت خدمت در صفحه فهرست نمایش داده می‌شود.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'توضیحات کامل',
              required: true,
              admin: {
                description:
                  'توضیح کامل و ساده‌ای که مشتری در صفحه اختصاصی خدمت می‌خواند.',
              },
            },
          ],
        },
        {
          label: 'مزایا و مراحل',
          fields: [
            {
              name: 'benefits',
              type: 'array',
              label: 'مزایای خدمت',
              required: true,
              minRows: 1,
              labels: {
                singular: 'مزیت',
                plural: 'مزایا',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'عنوان',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'توضیح',
                },
              ],
            },
            {
              name: 'steps',
              type: 'array',
              label: 'مراحل انجام خدمت',
              required: true,
              minRows: 1,
              labels: {
                singular: 'مرحله',
                plural: 'مراحل',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'عنوان مرحله',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'توضیح مرحله',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'قیمت و انتشار',
          fields: [
            {
              name: 'pricingMode',
              type: 'select',
              label: 'روش قیمت‌گذاری',
              required: true,
              defaultValue: 'quotation',
              options: servicePricingModes.map((mode) => ({
                label: servicePricingModeLabels[mode],
                value: mode,
              })),
            },
            {
              name: 'priceAmount',
              type: 'number',
              label: 'مبلغ به تومان',
              min: 0,
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.pricingMode === 'fixed',
                description:
                  'فقط عدد وارد کنید؛ برای مثال 2500000.',
              },
            },
            {
              name: 'estimatedDuration',
              type: 'text',
              label: 'زمان تقریبی انجام',
              admin: {
                placeholder: 'مثلاً ۳ تا ۵ روز کاری',
              },
            },
            {
              name: 'slug',
              type: 'text',
              label: 'آدرس انگلیسی',
              required: true,
              unique: true,
              index: true,
              admin: {
                description:
                  'فقط حروف انگلیسی کوچک، عدد و خط تیره؛ مانند visa-services',
              },
              validate: (value: unknown) => {
                if (typeof value !== 'string' || !isCatalogSlug(value)) {
                  return 'آدرس فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد.'
                }

                return true
              },
            },
            {
              name: 'sortOrder',
              type: 'number',
              label: 'ترتیب نمایش',
              required: true,
              defaultValue: 10,
              min: 0,
            },
          ],
        },
      ],
    },
  ],
}