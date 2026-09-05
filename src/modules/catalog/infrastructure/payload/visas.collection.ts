import type { CollectionConfig } from 'payload'

import {
  isCatalogSlug,
  isHttpsUrl,
  visaCategories,
  visaCategoryLabels,
  visaRequirementKindLabels,
  visaRequirementKinds,
} from '../../domain/catalog'
import { canManageCatalog, readPublishedCatalog } from './catalog-access'

export const Visas: CollectionConfig = {
  slug: 'visas',
  labels: {
    singular: 'نوع ویزا',
    plural: 'انواع ویزا',
  },
  admin: {
    defaultColumns: ['title', 'country', 'category', '_status', 'lastReviewedAt'],
    group: 'محتوا',
    useAsTitle: 'title',
  },
  access: {
    create: canManageCatalog,
    delete: canManageCatalog,
    read: readPublishedCatalog,
    update: canManageCatalog,
  },
  defaultSort: 'sortOrder',
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
              name: 'country',
              type: 'relationship',
              relationTo: 'countries',
              label: 'کشور',
              required: true,
              index: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'عنوان ویزا',
                  required: true,
                },
                {
                  name: 'category',
                  type: 'select',
                  label: 'دسته ویزا',
                  required: true,
                  options: visaCategories.map((value) => ({
                    label: visaCategoryLabels[value],
                    value,
                  })),
                },
              ],
            },
            {
              name: 'summary',
              type: 'textarea',
              label: 'خلاصه',
              required: true,
              maxLength: 280,
            },
            {
              type: 'row',
              fields: [
                { name: 'suitableFor', type: 'text', label: 'مناسب برای' },
                { name: 'processingTime', type: 'text', label: 'زمان تقریبی بررسی' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'validity', type: 'text', label: 'اعتبار احتمالی' },
                { name: 'stayLength', type: 'text', label: 'مدت اقامت' },
              ],
            },
            {
              name: 'feeNote',
              type: 'textarea',
              label: 'توضیح هزینه‌ها',
            },
          ],
        },
        {
          label: 'مدارک و مراحل',
          fields: [
            {
              name: 'requirements',
              type: 'array',
              label: 'شرایط و مدارک',
              labels: { singular: 'مورد', plural: 'موارد' },
              minRows: 1,
              required: true,
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'kind',
                  type: 'select',
                  label: 'نوع',
                  required: true,
                  defaultValue: 'required',
                  options: visaRequirementKinds.map((value) => ({
                    label: visaRequirementKindLabels[value],
                    value,
                  })),
                },
                { name: 'title', type: 'text', label: 'عنوان', required: true },
                { name: 'description', type: 'textarea', label: 'توضیح' },
              ],
            },
            {
              name: 'steps',
              type: 'array',
              label: 'مراحل اقدام',
              labels: { singular: 'مرحله', plural: 'مراحل' },
              minRows: 1,
              required: true,
              admin: { initCollapsed: true },
              fields: [
                { name: 'title', type: 'text', label: 'عنوان مرحله', required: true },
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
          label: 'منبع و انتشار',
          fields: [
            {
              name: 'officialSourceLabel',
              type: 'text',
              label: 'عنوان منبع رسمی',
              required: true,
              defaultValue: 'وب‌سایت رسمی دولت یا سفارت',
            },
            {
              name: 'officialSourceUrl',
              type: 'text',
              label: 'لینک منبع رسمی',
              required: true,
              admin: { description: 'لینک باید با https:// شروع شود.' },
              validate: (value: unknown) =>
                typeof value === 'string' && isHttpsUrl(value)
                  ? true
                  : 'یک لینک معتبر با https:// وارد کنید.',
            },
            {
              name: 'lastReviewedAt',
              type: 'date',
              label: 'تاریخ آخرین بازبینی',
              required: true,
            },
            {
              name: 'disclaimer',
              type: 'textarea',
              label: 'توضیح حقوقی یا محدودیت',
              defaultValue:
                'شرایط ممکن است تغییر کند و تصمیم نهایی درباره صدور ویزا با مرجع رسمی است.',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'slug',
                  type: 'text',
                  label: 'آدرس انگلیسی',
                  required: true,
                  unique: true,
                  index: true,
                  admin: {
                    description: 'فقط حروف کوچک انگلیسی، عدد و خط تیره؛ مانند visitor',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ value }) =>
                        typeof value === 'string' ? value.trim().toLowerCase() : value,
                    ],
                  },
                  validate: (value: unknown) =>
                    typeof value === 'string' && isCatalogSlug(value)
                      ? true
                      : 'آدرس باید فقط شامل حروف کوچک انگلیسی، عدد و خط تیره باشد.',
                },
                {
                  name: 'sortOrder',
                  type: 'number',
                  label: 'ترتیب نمایش',
                  required: true,
                  defaultValue: 100,
                  min: 0,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
