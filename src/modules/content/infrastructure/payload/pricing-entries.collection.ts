import type { CollectionConfig } from 'payload'
import { canManageCatalog } from '@/modules/catalog/infrastructure/payload/catalog-access'

export const PricingEntries: CollectionConfig = {
  slug: 'pricing-entries',
  labels: { singular: 'تعرفه', plural: 'تعرفه‌ها' },
  admin: {
    group: 'محتوا و خدمات',
    useAsTitle: 'title',
    defaultColumns: ['title', 'countryCode', 'kind', 'published', 'sortOrder'],
  },
  access: {
    create: canManageCatalog,
    update: canManageCatalog,
    delete: canManageCatalog,
    read: ({ req }) => (canManageCatalog({ req }) ? true : { published: { equals: true } }),
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'عنوان کارت' },
    { name: 'description', type: 'textarea', label: 'شرح خدمت' },
    {
      name: 'priceLabel',
      type: 'text',
      label: 'هزینه خدمات (تومان یا توافقی)',
      admin: {
        description:
          'قیمت را فقط پس از تأیید مدیریت وارد کنید؛ برای بررسی اولیه می‌توانید «رایگان» بنویسید.',
      },
    },
    {
      name: 'officialCostNote',
      type: 'textarea',
      label: 'هزینه‌های رسمی جداگانه',
      admin: {
        description:
          'هزینه سفارت، کارگزاری، ترجمه، بیومتریک، بیمه، دادگاه، وکیل یا پیکاپ را جدا از دستمزد خدمات توضیح دهید.',
      },
    },
    {
      name: 'countryCode',
      type: 'text',
      label: 'کد کشور مرتبط',
      maxLength: 2,
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value)],
      },
      admin: {
        description:
          'برای نمایش در صفحه یک کشور، کد دوحرفی کشور مانند CA را وارد کنید. برای کارت عمومی خالی بگذارید.',
      },
      validate: (value: unknown) =>
        !value ||
        (typeof value === 'string' && /^[a-zA-Z]{2}$/.test(value)) ||
        'کد کشور باید دو حرف انگلیسی باشد.',
    },
    {
      name: 'kind',
      type: 'select',
      label: 'نوع تعرفه',
      required: true,
      defaultValue: 'other',
      options: [
        { label: 'ویزای کشور', value: 'visa' },
        { label: 'وقت سفارت', value: 'embassy' },
        { label: 'اعتراض به ریجکتی', value: 'appeal' },
        { label: 'سایر خدمات', value: 'other' },
      ],
    },
    {
      name: 'actionHref',
      type: 'text',
      label: 'مسیر ثبت درخواست',
      defaultValue: '/sign-up?next=/countries',
      validate: (value: unknown) =>
        !value ||
        (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) ||
        'مسیر باید داخلی و با / شروع شود.',
    },
    { name: 'sortOrder', type: 'number', label: 'ترتیب نمایش', defaultValue: 100 },
    { name: 'published', type: 'checkbox', label: 'نمایش عمومی', defaultValue: false },
  ],
}
