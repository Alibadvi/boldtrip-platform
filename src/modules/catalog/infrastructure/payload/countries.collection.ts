import type { CollectionConfig } from 'payload'

import { isCatalogSlug } from '../../domain/catalog'
import { canManageCatalog, readPublishedCatalog } from './catalog-access'

export const Countries: CollectionConfig = {
  slug: 'countries',
  labels: {
    singular: 'کشور',
    plural: 'کشورها',
  },
  admin: {
    defaultColumns: ['name', 'code', 'featuredOnHomepage', '_status', 'updatedAt'],
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
                    description: 'فقط حروف کوچک انگلیسی، عدد و خط تیره؛ مانند canada',
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
                  name: 'code',
                  type: 'text',
                  label: 'کد دوحرفی کشور',
                  required: true,
                  unique: true,
                  maxLength: 2,
                  minLength: 2,
                  admin: { description: 'مانند CA یا DE' },
                  hooks: {
                    beforeValidate: [
                      ({ value }) =>
                        typeof value === 'string' ? value.trim().toUpperCase() : value,
                    ],
                  },
                  validate: (value: unknown) =>
                    typeof value === 'string' && /^[A-Z]{2}$/.test(value)
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
