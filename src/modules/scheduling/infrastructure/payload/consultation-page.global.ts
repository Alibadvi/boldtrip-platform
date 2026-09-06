import type {
  GlobalConfig,
  PayloadRequest,
} from 'payload'

import { can, getStaffRoles } from '@/modules/identity'

import {
  consultationDeliveryMethodLabels,
  consultationDeliveryMethods,
} from '../../domain/consultation'

const canManageConsultation = ({
  req,
}: {
  req: PayloadRequest
}) =>
  can(getStaffRoles(req.user), 'scheduling.manage') ||
  can(getStaffRoles(req.user), 'content.manage')

export const ConsultationPage: GlobalConfig = {
  slug: 'consultation-page',
  label: 'صفحه مشاوره',
  admin: {
    group: 'محتوا و خدمات',
    description:
      'متن، قیمت، مدت و اطلاعات صفحه مشاوره را از این قسمت مدیریت کنید.',
  },
  access: {
    read: () => true,
    update: canManageConsultation,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'معرفی صفحه',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: 'بخش اصلی',
              fields: [
                {
                  name: 'kicker',
                  type: 'text',
                  label: 'عنوان کوچک',
                  required: true,
                  defaultValue: 'مشاوره تخصصی BoldTrip',
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'عنوان اصلی',
                  required: true,
                  defaultValue:
                    'با شناخت بهتر، مسیر درست‌تری انتخاب کنید',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'توضیحات',
                  required: true,
                  defaultValue:
                    'در یک جلسه تخصصی، شرایط، هدف سفر و مسیرهای احتمالی شما بررسی می‌شود تا پیش از شروع پرونده تصمیم دقیق‌تری بگیرید.',
                },
              ],
            },
          ],
        },
        {
          label: 'تنظیمات جلسه',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'durationMinutes',
                  type: 'number',
                  label: 'مدت جلسه به دقیقه',
                  required: true,
                  min: 15,
                  defaultValue: 45,
                },
                {
                  name: 'priceAmount',
                  type: 'number',
                  label: 'هزینه به تومان',
                  required: true,
                  min: 0,
                  defaultValue: 0,
                  admin: {
                    description:
                      'اگر هنوز قیمت مشخص نیست، عدد صفر وارد کنید.',
                  },
                },
              ],
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
              name: 'documentsNote',
              type: 'textarea',
              label: 'توضیح مدارک',
              required: true,
              defaultValue:
                'برای جلسه مشاوره بارگذاری پاسپورت اجباری نیست. در صورت نیاز، مدارک بعد از ایجاد رزرو و از داخل حساب کاربری ارسال می‌شوند.',
            },
            {
              name: 'paymentNote',
              type: 'textarea',
              label: 'توضیح پرداخت',
              required: true,
              defaultValue:
                'پس از ثبت رزرو، شماره کارت و مبلغ دقیق نمایش داده می‌شود. رزرو فقط پس از بارگذاری و تأیید رسید قطعی خواهد شد.',
            },
            {
              name: 'cancellationPolicy',
              type: 'textarea',
              label: 'قوانین لغو و جابه‌جایی',
              required: true,
              defaultValue:
                'قوانین لغو و جابه‌جایی جلسه باید پیش از فعال‌شدن رزرو توسط مدیریت BoldTrip مشخص شود.',
            },
          ],
        },
        {
          label: 'مزایا و مراحل',
          fields: [
            {
              name: 'benefits',
              type: 'array',
              label: 'مزایای مشاوره',
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
                  required: true,
                },
              ],
            },
            {
              name: 'steps',
              type: 'array',
              label: 'مراحل رزرو',
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
                  label: 'عنوان',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'توضیح',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}