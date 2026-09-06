import type { Metadata } from 'next'
import Link from 'next/link'

import {
  ContentPage,
  ContentSection,
} from '@/app/(frontend)/_components/content-page'
import { buttonVariants } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'درباره BoldTrip',
}

export default function AboutPage() {
  return (
    <ContentPage
      description="BoldTrip مسیر انتخاب خدمت، ارسال مدارک و پیگیری درخواست‌های ویزا را روشن و قابل مدیریت می‌کند."
      eyebrow="درباره ما"
      title="مسیر روشن‌تر برای خدمات ویزا"
    >
      <ContentSection title="کاری که انجام می‌دهیم">
        <p>
          اطلاعات هر مقصد و خدمت را منظم ارائه
          می‌کنیم و درخواست مشتری را از ثبت اولیه تا
          بررسی مدارک و پیگیری نتیجه در یک حساب
          کاربری نگه می‌داریم.
        </p>
      </ContentSection>

      <ContentSection title="اصل کاری ما">
        <p>
          تصمیم صدور ویزا فقط در اختیار سفارت یا
          مرجع رسمی است. ما نتیجه را تضمین نمی‌کنیم؛
          مسئولیت ما ارائه اطلاعات شفاف و اجرای دقیق
          خدمت توافق‌شده است.
        </p>
      </ContentSection>

      <ContentSection title="حفاظت از مدارک">
        <p>
          پاسپورت، مدارک هویتی و رسیدها تنها به
          درخواست مربوط متصل می‌شوند و دسترسی به
          آن‌ها برای مشتری مالک پرونده و کارکنان
          مجاز محدود است.
        </p>
      </ContentSection>

      <Link
        className={buttonVariants()}
        href="/services"
      >
        مشاهده خدمات
      </Link>
    </ContentPage>
  )
}
