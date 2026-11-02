import type { Metadata } from 'next'

import {
  ContentPage,
  ContentSection,
} from '@/app/(frontend)/_components/content-page'

export const metadata: Metadata = {
  title: 'حریم خصوصی',
  description: 'سیاست حریم خصوصی، دسترسی و نگهداری مدارک در بولدتریپ.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <ContentPage
      description="این صفحه نوع اطلاعات دریافتی، دلیل استفاده و نحوه دسترسی به مدارک مشتری را توضیح می‌دهد."
      eyebrow="سیاست‌های سایت"
      title="حریم خصوصی و مدارک"
    >
      <ContentSection title="اطلاعاتی که دریافت می‌شود">
        <p>
          اطلاعات حساب، مشخصات متقاضی، اطلاعات
          درخواست، مدارک بارگذاری‌شده و رسید پرداخت
          برای ارائه و پیگیری خدمت دریافت می‌شوند.
        </p>
      </ContentSection>

      <ContentSection title="دسترسی به اطلاعات">
        <p>
          مشتری فقط اطلاعات حساب و پرونده‌های خودش
          را می‌بیند. دسترسی کارکنان بر اساس وظیفه
          آن‌ها محدود می‌شود.
        </p>
      </ContentSection>

      <ContentSection title="نگهداری مدارک">
        <p>
          مدارک و اطلاعات پرونده حداکثر تا ۱۲ ماه پس از پایان یا بسته‌شدن خدمت نگهداری می‌شوند و سپس به‌صورت امن حذف یا ناشناس‌سازی خواهند شد؛ مگر اینکه الزام قانونی یا اختلاف در حال رسیدگی، نگهداری طولانی‌تری را ضروری کند. مشتری می‌تواند درخواست حذف اطلاعات غیرضروری خود را ثبت کند.
        </p>
      </ContentSection>

      <ContentSection title="مسئولیت مشتری">
        <p>
          مشتری باید اطلاعات صحیح و مدارک متعلق به
          خود یا اشخاصی را ارسال کند که اجازه قانونی
          اقدام از طرف آن‌ها را دارد.
        </p>
      </ContentSection>
    </ContentPage>
  )
}
