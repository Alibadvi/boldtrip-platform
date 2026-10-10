import type { Metadata } from 'next'

import {
  ContentPage,
  ContentSection,
} from '@/app/(frontend)/_components/content-page'
import { consultationCancellationPolicy } from '@/modules/content/domain/cancellation-policy'

export const metadata: Metadata = {
  title: 'قوانین لغو و استرداد',
  description: 'قانون لغو و جابه‌جایی جلسه مشاوره و شرایط استرداد در بولدتریپ.',
  alternates: { canonical: '/cancellation-policy' },
}

export default function CancellationPolicyPage() {
  return (
    <ContentPage
      description="امکان لغو، جابه‌جایی یا استرداد به نوع خدمت و میزان کاری که انجام شده وابسته است."
      eyebrow="سیاست‌های سایت"
      title="لغو، جابه‌جایی و استرداد"
    >
      <ContentSection title="رزرو مشاوره">
        <p>{consultationCancellationPolicy}</p>
      </ContentSection>

      <ContentSection title="خدمات پرونده">
        <p>
          پس از شروع بررسی یا اقدام اجرایی، هزینه
          بخش انجام‌شده قابل استرداد نیست. مبلغ قابل
          استرداد بر اساس مرحله فعلی پرونده محاسبه
          می‌شود.
        </p>
      </ContentSection>

      <ContentSection title="هزینه‌های اشخاص ثالث">
        <p>
          هزینه سفارت، کارگزاری، ترجمه، پست یا هر
          شخص ثالث تابع مقررات همان ارائه‌دهنده است
          و لزوماً قابل استرداد نیست.
        </p>
      </ContentSection>

      <ContentSection title="ثبت درخواست">
        <p>
          درخواست لغو با شماره پیگیری ثبت می‌شود و
          نتیجه بررسی از طریق حساب مشتری اعلام خواهد
          شد.
        </p>
      </ContentSection>
    </ContentPage>
  )
}
