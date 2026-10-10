import type { CollectionConfig } from 'payload'
import { canManageCatalog } from '@/modules/catalog/infrastructure/payload/catalog-access'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'مقاله', plural: 'مقالات' },
  admin: {
    group: 'محتوا',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'published', 'lastReviewedAt'],
  },
  access: {
    create: canManageCatalog,
    update: canManageCatalog,
    delete: canManageCatalog,
    read: ({ req }) => (canManageCatalog({ req }) ? true : { published: { equals: true } }),
  },
  fields: [
    { name: 'title', type: 'text', label: 'عنوان', required: true },
    {
      name: 'slug',
      type: 'text',
      label: 'آدرس مقاله',
      unique: true,
      index: true,
      required: true,
      validate: (value: unknown) =>
        (typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
        'آدرس فقط با حروف کوچک انگلیسی، عدد و خط تیره باشد.',
    },
    { name: 'summary', type: 'textarea', label: 'خلاصه', required: true, maxLength: 300 },
    {
      name: 'featuredImageUrl',
      type: 'text',
      label: 'آدرس تصویر شاخص',
      admin: { description: 'لینک HTTPS تصویر تأییدشده را وارد کنید.' },
      validate: (value: unknown) =>
        !value ||
        (typeof value === 'string' && /^https:\/\//.test(value)) ||
        'لینک تصویر باید HTTPS باشد.',
    },
    { name: 'body', type: 'textarea', label: 'متن کامل', required: true },
    { name: 'category', type: 'text', label: 'دسته‌بندی', required: true },
    { name: 'relatedCountry', type: 'relationship', relationTo: 'countries', label: 'کشور مرتبط' },
    {
      name: 'officialSourceUrl',
      type: 'text',
      label: 'لینک منبع رسمی',
      validate: (value: unknown) =>
        !value ||
        (typeof value === 'string' && /^https:\/\//.test(value)) ||
        'لینک منبع باید HTTPS باشد.',
    },
    { name: 'lastReviewedAt', type: 'date', label: 'تاریخ آخرین بازبینی' },
    { name: 'metaTitle', type: 'text', label: 'عنوان SEO' },
    { name: 'metaDescription', type: 'textarea', label: 'توضیحات SEO', maxLength: 180 },
    { name: 'published', type: 'checkbox', label: 'منتشرشده', defaultValue: false },
  ],
}
