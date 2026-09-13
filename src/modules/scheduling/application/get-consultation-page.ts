import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

function cachePublicQuery<Args extends unknown[], Result>(
  query: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result> {
  return unstable_cache(query, [], {
    revalidate: 60,
    tags: ['consultation-page'],
  })
}

import {
  isConsultationDeliveryMethod,
  type ConsultationBenefit,
  type ConsultationPageData,
  type ConsultationStep,
} from '../domain/consultation'

type ConsultationPageRecord = {
  hero?: {
    kicker?: string | null
    title?: string | null
    description?: string | null
  } | null
  durationMinutes?: number | null
  priceAmount?: number | null
  deliveryMethod?: string | null
  benefits?: ConsultationBenefit[] | null
  steps?: ConsultationStep[] | null
  documentsNote?: string | null
  paymentNote?: string | null
  cancellationPolicy?: string | null
}

const fallbackContent: ConsultationPageData = {
  hero: {
    kicker: 'مشاوره تخصصی BoldTrip',
    title: 'با شناخت بهتر، مسیر درست‌تری انتخاب کنید',
    description:
      'در یک جلسه تخصصی، شرایط، هدف سفر و مسیرهای احتمالی شما بررسی می‌شود تا پیش از شروع پرونده تصمیم دقیق‌تری بگیرید.',
  },
  durationMinutes: 45,
  priceAmount: 0,
  deliveryMethod: 'video',
  benefits: [
    {
      title: 'بررسی شرایط شخصی',
      description:
        'سوابق، هدف سفر و وضعیت فعلی شما توسط مشاور بررسی می‌شود.',
    },
    {
      title: 'انتخاب مسیر مناسب',
      description:
        'کشور، نوع ویزا و روش مناسب اقدام بر اساس شرایط واقعی شما بررسی می‌شود.',
    },
    {
      title: 'پاسخ به پرسش‌ها',
      description:
        'ابهام‌های اصلی شما درباره مدارک، هزینه‌ها و مراحل اقدام پاسخ داده می‌شوند.',
    },
  ],
  steps: [
    {
      title: 'ایجاد حساب کاربری',
      description:
        'با ایمیل و رمز عبور ثبت‌نام می‌کنید یا وارد حساب خود می‌شوید.',
    },
    {
      title: 'انتخاب زمان',
      description:
        'یکی از روزها و ساعت‌های آزاد مشاور را انتخاب می‌کنید.',
    },
    {
      title: 'ثبت رزرو',
      description:
        'موضوع مشاوره و اطلاعات اولیه خود را ثبت می‌کنید.',
    },
    {
      title: 'واریز هزینه',
      description:
        'اطلاعات کارت را مشاهده کرده و تصویر رسید واریز را بارگذاری می‌کنید.',
    },
    {
      title: 'تأیید جلسه',
      description:
        'پس از تأیید رسید توسط ادمین، رزرو قطعی می‌شود.',
    },
  ],
  documentsNote:
    'برای جلسه مشاوره بارگذاری پاسپورت اجباری نیست. اگر بررسی مدرک خاصی لازم باشد، کاربر می‌تواند آن را بعد از ایجاد رزرو و از داخل حساب خود ارسال کند.',
  paymentNote:
    'پس از ثبت رزرو، شماره کارت و مبلغ دقیق نمایش داده می‌شود. رزرو فقط پس از بارگذاری و تأیید رسید قطعی خواهد شد.',
  cancellationPolicy:
    'قوانین لغو و جابه‌جایی جلسه باید پیش از فعال‌شدن رزرو توسط مدیریت BoldTrip مشخص شود.',
}

export const getConsultationPage = cachePublicQuery(
  async (): Promise<ConsultationPageData> => {
    const payload = await getPayload({
      config: configPromise,
    })

    const record = (await payload.findGlobal({
      slug: 'consultation-page',
      depth: 0,
      overrideAccess: true,
    })) as unknown as ConsultationPageRecord

    const deliveryMethod = isConsultationDeliveryMethod(
      record.deliveryMethod,
    )
      ? record.deliveryMethod
      : fallbackContent.deliveryMethod

    return {
      hero: {
        kicker:
          record.hero?.kicker ?? fallbackContent.hero.kicker,
        title: record.hero?.title ?? fallbackContent.hero.title,
        description:
          record.hero?.description ??
          fallbackContent.hero.description,
      },
      durationMinutes:
        typeof record.durationMinutes === 'number'
          ? record.durationMinutes
          : fallbackContent.durationMinutes,
      priceAmount:
        typeof record.priceAmount === 'number'
          ? record.priceAmount
          : fallbackContent.priceAmount,
      deliveryMethod,
      benefits:
        record.benefits?.length
          ? record.benefits
          : fallbackContent.benefits,
      steps:
        record.steps?.length
          ? record.steps
          : fallbackContent.steps,
      documentsNote:
        record.documentsNote ??
        fallbackContent.documentsNote,
      paymentNote:
        record.paymentNote ?? fallbackContent.paymentNote,
      cancellationPolicy:
        record.cancellationPolicy ??
        fallbackContent.cancellationPolicy,
    }
  },
)