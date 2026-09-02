import type { GlobalConfig, PayloadRequest } from 'payload'

import { can, getStaffRoles } from '@/modules/identity'

import {
  defaultHomepageContent,
  destinationThemes,
  faqCategories,
} from '../../domain/homepage-content'

const canManageContent = ({ req }: { req: PayloadRequest }) =>
  can(getStaffRoles(req.user), 'content.manage')

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'صفحه اصلی',
  admin: {
    group: 'محتوا',
  },
  access: {
    read: () => true,
    update: canManageContent,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'معرفی اصلی',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          label: 'پیش‌عنوان',
          required: true,
          defaultValue: defaultHomepageContent.hero.kicker,
        },
        {
          name: 'title',
          type: 'text',
          label: 'عنوان',
          required: true,
          defaultValue: defaultHomepageContent.hero.title,
        },
        {
          name: 'accent',
          type: 'text',
          label: 'بخش رنگی عنوان',
          required: true,
          defaultValue: defaultHomepageContent.hero.accent,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'توضیح',
          required: true,
          defaultValue: defaultHomepageContent.hero.description,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'primaryActionLabel',
              type: 'text',
              label: 'متن دکمه اصلی',
              required: true,
              defaultValue: defaultHomepageContent.hero.primaryActionLabel,
            },
            {
              name: 'primaryActionHref',
              type: 'text',
              label: 'لینک دکمه اصلی',
              required: true,
              defaultValue: defaultHomepageContent.hero.primaryActionHref,
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'secondaryActionLabel',
              type: 'text',
              label: 'متن دکمه دوم',
              required: true,
              defaultValue: defaultHomepageContent.hero.secondaryActionLabel,
            },
            {
              name: 'secondaryActionHref',
              type: 'text',
              label: 'لینک دکمه دوم',
              required: true,
              defaultValue: defaultHomepageContent.hero.secondaryActionHref,
            },
          ],
        },
        {
          name: 'highlights',
          type: 'array',
          label: 'ویژگی‌های کوتاه',
          minRows: 1,
          maxRows: 4,
          defaultValue: defaultHomepageContent.hero.highlights,
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'متن',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'destinationIntro',
      type: 'group',
      label: 'معرفی مقصدها',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          label: 'پیش‌عنوان',
          required: true,
          defaultValue: defaultHomepageContent.destinationIntro.kicker,
        },
        {
          name: 'title',
          type: 'text',
          label: 'عنوان',
          required: true,
          defaultValue: defaultHomepageContent.destinationIntro.title,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'توضیح',
          required: true,
          defaultValue: defaultHomepageContent.destinationIntro.description,
        },
      ],
    },
    {
      name: 'destinations',
      type: 'array',
      label: 'کارت‌های مقصد',
      minRows: 1,
      maxRows: 4,
      defaultValue: defaultHomepageContent.destinations,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', label: 'نام مقصد', required: true },
            { name: 'eyebrow', type: 'text', label: 'نوع ویزا', required: true },
          ],
        },
        { name: 'description', type: 'textarea', label: 'توضیح', required: true },
        {
          type: 'row',
          fields: [
            { name: 'actionLabel', type: 'text', label: 'متن لینک', required: true },
            { name: 'href', type: 'text', label: 'آدرس صفحه', required: true },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'flag', type: 'text', label: 'پرچم', required: true },
            {
              name: 'theme',
              type: 'select',
              label: 'تم رنگی',
              required: true,
              options: destinationThemes.map((value) => ({
                label: value === 'canada' ? 'کانادا' : 'اروپا',
                value,
              })),
            },
          ],
        },
      ],
    },
    {
      name: 'serviceIntro',
      type: 'group',
      label: 'معرفی خدمات',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          label: 'پیش‌عنوان',
          required: true,
          defaultValue: defaultHomepageContent.serviceIntro.kicker,
        },
        {
          name: 'title',
          type: 'text',
          label: 'عنوان',
          required: true,
          defaultValue: defaultHomepageContent.serviceIntro.title,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'توضیح',
          required: true,
          defaultValue: defaultHomepageContent.serviceIntro.description,
        },
      ],
    },
    {
      name: 'services',
      type: 'array',
      label: 'کارت‌های خدمات',
      minRows: 1,
      maxRows: 6,
      defaultValue: defaultHomepageContent.services,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'index', type: 'text', label: 'شماره', required: true },
            { name: 'eyebrow', type: 'text', label: 'پیش‌عنوان', required: true },
            { name: 'title', type: 'text', label: 'عنوان', required: true },
          ],
        },
        { name: 'description', type: 'textarea', label: 'توضیح', required: true },
        {
          type: 'row',
          fields: [
            { name: 'actionLabel', type: 'text', label: 'متن لینک', required: true },
            { name: 'href', type: 'text', label: 'آدرس صفحه', required: true },
          ],
        },
      ],
    },
    {
      name: 'process',
      type: 'group',
      label: 'روند کار',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          label: 'پیش‌عنوان',
          required: true,
          defaultValue: defaultHomepageContent.process.kicker,
        },
        {
          name: 'title',
          type: 'text',
          label: 'عنوان',
          required: true,
          defaultValue: defaultHomepageContent.process.title,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'توضیح',
          required: true,
          defaultValue: defaultHomepageContent.process.description,
        },
        {
          name: 'steps',
          type: 'array',
          label: 'مراحل',
          minRows: 1,
          maxRows: 6,
          defaultValue: defaultHomepageContent.process.steps,
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'number', type: 'text', label: 'شماره', required: true },
                { name: 'title', type: 'text', label: 'عنوان', required: true },
              ],
            },
            { name: 'description', type: 'textarea', label: 'توضیح', required: true },
          ],
        },
      ],
    },
    {
      name: 'trust',
      type: 'group',
      label: 'بخش امنیت مدارک',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          label: 'پیش‌عنوان',
          required: true,
          defaultValue: defaultHomepageContent.trust.kicker,
        },
        {
          name: 'title',
          type: 'text',
          label: 'عنوان',
          required: true,
          defaultValue: defaultHomepageContent.trust.title,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'توضیح',
          required: true,
          defaultValue: defaultHomepageContent.trust.description,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'actionLabel',
              type: 'text',
              label: 'متن لینک',
              required: true,
              defaultValue: defaultHomepageContent.trust.actionLabel,
            },
            {
              name: 'actionHref',
              type: 'text',
              label: 'آدرس صفحه',
              required: true,
              defaultValue: defaultHomepageContent.trust.actionHref,
            },
          ],
        },
      ],
    },
    {
      name: 'consultation',
      type: 'group',
      label: 'دعوت به مشاوره',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          label: 'پیش‌عنوان',
          required: true,
          defaultValue: defaultHomepageContent.consultation.kicker,
        },
        {
          name: 'title',
          type: 'text',
          label: 'عنوان',
          required: true,
          defaultValue: defaultHomepageContent.consultation.title,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'توضیح',
          required: true,
          defaultValue: defaultHomepageContent.consultation.description,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'actionLabel',
              type: 'text',
              label: 'متن دکمه',
              required: true,
              defaultValue: defaultHomepageContent.consultation.actionLabel,
            },
            {
              name: 'actionHref',
              type: 'text',
              label: 'آدرس صفحه',
              required: true,
              defaultValue: defaultHomepageContent.consultation.actionHref,
            },
          ],
        },
      ],
    },
    {
      name: 'faqIntro',
      type: 'group',
      label: 'معرفی سوالات متداول',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          label: 'پیش‌عنوان',
          required: true,
          defaultValue: defaultHomepageContent.faqIntro.kicker,
        },
        {
          name: 'title',
          type: 'text',
          label: 'عنوان',
          required: true,
          defaultValue: defaultHomepageContent.faqIntro.title,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'توضیح',
          required: true,
          defaultValue: defaultHomepageContent.faqIntro.description,
        },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      label: 'سوالات متداول',
      minRows: 1,
      defaultValue: defaultHomepageContent.faqs,
      fields: [
        { name: 'question', type: 'text', label: 'سوال', required: true },
        { name: 'answer', type: 'textarea', label: 'پاسخ', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'category',
              type: 'select',
              label: 'دسته‌بندی',
              required: true,
              options: faqCategories.map((value) => ({
                label:
                  value === 'visa-services'
                    ? 'ویزا و خدمات سفارت'
                    : value === 'documents'
                      ? 'مدارک و پرونده'
                      : 'مشاوره و پرداخت',
                value,
              })),
            },
            {
              name: 'showOnHomepage',
              type: 'checkbox',
              label: 'نمایش در صفحه اصلی',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
}
