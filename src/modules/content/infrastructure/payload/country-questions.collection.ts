import { APIError, type CollectionConfig } from 'payload'
import { canManageCatalog } from '@/modules/catalog/infrastructure/payload/catalog-access'

export const CountryQuestions: CollectionConfig = {
  slug: 'country-questions',
  labels: { singular: 'پرسش کشور', plural: 'پرسش‌های کشورها' },
  admin: {
    group: 'محتوا',
    useAsTitle: 'question',
    defaultColumns: ['firstName', 'country', 'status', 'createdAt'],
  },
  access: {
    create: () => false,
    update: canManageCatalog,
    delete: canManageCatalog,
    read: ({ req }) => (canManageCatalog({ req }) ? true : { status: { equals: 'published' } }),
  },
  fields: [
    { name: 'firstName', type: 'text', label: 'نام کوچک', required: true },
    {
      name: 'contact',
      type: 'text',
      label: 'تلفن یا ایمیل (محرمانه)',
      required: true,
      access: { read: canManageCatalog },
    },
    { name: 'question', type: 'textarea', label: 'سؤال', required: true },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      label: 'کشور',
      required: true,
    },
    { name: 'consent', type: 'checkbox', label: 'رضایت با سیاست حریم خصوصی', required: true },
    {
      name: 'status',
      type: 'select',
      label: 'وضعیت',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'در انتظار بررسی', value: 'pending' },
        { label: 'پاسخ داده شده', value: 'answered' },
        { label: 'منتشر شده', value: 'published' },
        { label: 'رد شده', value: 'rejected' },
      ],
    },
    { name: 'answer', type: 'textarea', label: 'پاسخ کارشناس' },
    { name: 'answeredAt', type: 'date', label: 'تاریخ پاسخ' },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req, originalDoc }) => {
        if (operation === 'create' && !canManageCatalog({ req }))
          return { ...data, status: 'pending', answer: null, answeredAt: null }
        if (data?.status === 'published' && !(data.answer || originalDoc?.answer)?.trim())
          throw new APIError('پرسش بدون پاسخ کارشناس منتشر نمی‌شود.', 400)
        if (
          (data?.status === 'answered' || data?.status === 'published') &&
          (data.answer || originalDoc?.answer) &&
          !data.answeredAt &&
          !originalDoc?.answeredAt
        )
          return { ...data, answeredAt: new Date().toISOString() }
        return data
      },
    ],
  },
}
