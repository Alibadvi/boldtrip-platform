import type { Metadata } from 'next'

import {
  ContentPage,
  ContentSection,
} from '@/app/(frontend)/_components/content-page'

export const metadata: Metadata = {
  title: 'قوانین لغو و استرداد',
}

export default function CancellationPolicyPage() {
  return (
    <ContentPage
      description="امکان لغو، جابه‌جایی یا استرداد به نوع خدمت و میزان کاری که انجام شده وابسته است."
      eyebrow="سیاست‌های سایت"
      title="لغو، جابه‌جایی و استرداد"
    >
      <ContentSection title="رزرو مشاوره">
        <p>
          درخواست لغو یا جابه‌جایی باید پیش از زمان
          جلسه و از مسیر ارتباطی رسمی اعلام شود.
          بازه دقیق مجاز باید پیش از انتشار نهایی توسط
          مدیریت تعیین شود.
        </p>
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
