import type { Metadata } from 'next'

import {
  ContentPage,
  ContentSection,
} from '@/app/(frontend)/_components/content-page'

export const metadata: Metadata = {
  title: 'شرایط استفاده',
}

export default function TermsPage() {
  return (
    <ContentPage
      description="استفاده از سایت و ثبت درخواست به معنی پذیرش شرایط ارائه خدمت در این صفحه است."
      eyebrow="سیاست‌های سایت"
      title="شرایط استفاده"
    >
      <ContentSection title="ماهیت خدمات">
        <p>
          BoldTrip خدمات اطلاعاتی، مشاوره‌ای و اجرایی
          توافق‌شده را ارائه می‌کند. تصمیم نهایی ویزا
          یا وقت در اختیار سفارت و مراجع رسمی است.
        </p>
      </ContentSection>

      <ContentSection title="صحت اطلاعات">
        <p>
          مسئولیت صحت اطلاعات و اصالت مدارک
          ارسال‌شده با مشتری است. اطلاعات ناقص یا
          نادرست می‌تواند باعث توقف یا رد خدمت شود.
        </p>
      </ContentSection>

      <ContentSection title="هزینه خدمت">
        <p>
          مبلغ قابل پرداخت در صفحه همان درخواست یا
          رزرو نمایش داده می‌شود. پرداخت زمانی
          تأییدشده محسوب می‌شود که رسید توسط مدیریت
          بررسی و تأیید شده باشد.
        </p>
      </ContentSection>

      <ContentSection title="تغییر اطلاعات رسمی">
        <p>
          قوانین ویزا ممکن است تغییر کنند. تاریخ
          بازبینی و منبع رسمی هر مقصد باید مبنای
          مطالعه قرار گیرد و در صورت اختلاف، منبع
          رسمی اولویت دارد.
        </p>
      </ContentSection>
    </ContentPage>
  )
}
