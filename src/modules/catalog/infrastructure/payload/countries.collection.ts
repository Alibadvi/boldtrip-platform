import type { CollectionConfig } from 'payload'

import {
  isCatalogSlug,
  isHttpsUrl,
} from '../../domain/catalog'
import {
  canManageCatalog,
  readPublishedCatalog,
} from './catalog-access'

export const Countries: CollectionConfig = {
  slug: 'countries',
  labels: {
    singular: 'کشور',
    plural: 'کشورها',
  },
  admin: {
    defaultColumns: [
      'name',
      'code',
      'featuredOnHomepage',
      '_status',
      'updatedAt',
    ],
    group: 'محتوا',
    useAsTitle: 'name',
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
          label: 'محتوای صفحه',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'نام کشور',
                  required: true,
                },
                {
                  name: 'flag',
                  type: 'text',
                  label: 'پرچم (ایموجی)',
                  required: true,
                  maxLength: 8,
                },
              ],
            },
            {
              name: 'summary',
              type: 'textarea',
              label: 'خلاصه کارت و صفحه',
              required: true,
              maxLength: 240,
            },
            {
              name: 'introduction',
              type: 'textarea',
              label: 'معرفی کامل',
              required: true,
            },
          ],
        },
        {
          label: 'وقت سفارت',
          fields: [
            {
              name: 'embassyAppointment',
              type: 'group',
              label: 'اطلاعات وقت سفارت',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'نمایش این کشور در بخش وقت سفارت',
                  defaultValue: false,
                },
                {
                  name: 'acceptingRequests',
                  type: 'checkbox',
                  label: 'پذیرش درخواست جدید',
                  defaultValue: false,
                  admin: {
                    condition: (_, siblingData) =>
                      Boolean(siblingData?.enabled),
                    description:
                      'تا زمان ساخت فرم ثبت درخواست، این گزینه را خاموش نگه دارید.',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'عنوان صفحه',
                  admin: {
                    condition: (_, siblingData) =>
                      Boolean(siblingData?.enabled),
                    placeholder: 'مثلاً دریافت وقت سفارت کانادا',
                  },
                },
                {
                  name: 'summary',
                  type: 'textarea',
                  label: 'توضیح کوتاه',
                  maxLength: 280,
                  admin: {
                    condition: (_, siblingData) =>
                      Boolean(siblingData?.enabled),
                    description:
                      'این متن روی کارت کشور در صفحه وقت سفارت نمایش داده می‌شود.',
                  },
                },
                {
                  name: 'introduction',
                  type: 'textarea',
                  label: 'توضیحات کامل',
                  admin: {
                    condition: (_, siblingData) =>
                      Boolean(siblingData?.enabled),
                  },
                },
                {
                  name: 'requiredDocuments',
                  type: 'array',
                  label: 'مدارک موردنیاز',
                  labels: {
                    singular: 'مدرک',
                    plural: 'مدارک',
                  },
                  admin: {
                    condition: (_, siblingData) =>
                      Boolean(siblingData?.enabled),
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: 'نام مدرک',
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
                  label: 'مراحل دریافت وقت',
                  labels: {
                    singular: 'مرحله',
                    plural: 'مراحل',
                  },
                  admin: {
                    condition: (_, siblingData) =>
                      Boolean(siblingData?.enabled),
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
                {
                  name: 'importantNotes',
                  type: 'array',
                  label: 'نکات مهم',
                  labels: {
                    singular: 'نکته',
                    plural: 'نکات',
                  },
                  admin: {
                    condition: (_, siblingData) =>
                      Boolean(siblingData?.enabled),
                  },
                  fields: [
                    {
                      name: 'text',
                      type: 'textarea',
                      label: 'متن نکته',
                      required: true,
                    },
                  ],
                },
                {
                  type: 'row',
                  admin: {
                    condition: (_, siblingData) =>
                      Boolean(siblingData?.enabled),
                  },
                  fields: [
                    {
                      name: 'estimatedTime',
                      type: 'text',
                      label: 'زمان تقریبی',
                      admin: {
                        placeholder: 'وابسته به ظرفیت سفارت',
                      },
                    },
                    {
                      name: 'feeNote',
                      type: 'text',
                      label: 'توضیح هزینه',
                      admin: {
                        placeholder: 'پس از بررسی اعلام می‌شود',
                      },
                    },
                  ],
                },
                {
                  name: 'officialSourceUrl',
                  type: 'text',
                  label: 'لینک منبع رسمی',
                  admin: {
                    condition: (_, siblingData) =>
                      Boolean(siblingData?.enabled),
                    description:
                      'لینک رسمی سفارت، کارگزاری یا سامانه رزرو وقت.',
                  },
                  validate: (value: unknown) => {
                    if (!value) {
                      return true
                    }

                    return typeof value === 'string' &&
                      isHttpsUrl(value)
                      ? true
                      : 'لینک منبع رسمی باید با https شروع شود.'
                  },
                },
                {
                  name: 'lastReviewedAt',
                  type: 'date',
                  label: 'تاریخ آخرین بررسی اطلاعات',
                  admin: {
                    condition: (_, siblingData) =>
                      Boolean(siblingData?.enabled),
                    date: {
                      displayFormat: 'yyyy/MM/dd',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'آدرس و نمایش',
          fields: [
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
                    description:
                      'فقط حروف کوچک انگلیسی، عدد و خط تیره؛ مانند canada',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ value }) =>
                        typeof value === 'string'
                          ? value.trim().toLowerCase()
                          : value,
                    ],
                  },
                  validate: (value: unknown) =>
                    typeof value === 'string' &&
                    isCatalogSlug(value)
                      ? true
                      : 'آدرس باید فقط شامل حروف کوچک انگلیسی، عدد و خط تیره باشد.',
                },
                {
                  name: 'code',
                  type: 'text',
                  label: 'کد دوحرفی کشور',
                  required: true,
                  unique: true,
                  maxLength: 2,
                  minLength: 2,
                  admin: {
                    description: 'مانند CA یا DE',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ value }) =>
                        typeof value === 'string'
                          ? value.trim().toUpperCase()
                          : value,
                    ],
                  },
                  validate: (value: unknown) =>
                    typeof value === 'string' &&
                    /^[A-Z]{2}$/.test(value)
                      ? true
                      : 'کد کشور باید دقیقاً دو حرف انگلیسی باشد.',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'featuredOnHomepage',
                  type: 'checkbox',
                  label: 'نمایش در صفحه اصلی',
                  defaultValue: false,
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