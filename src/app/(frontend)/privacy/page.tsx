import type { Metadata } from 'next'

import {
  ContentPage,
  ContentSection,
} from '@/app/(frontend)/_components/content-page'

export const metadata: Metadata = {
  title: 'حریم خصوصی',
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
          مدارک فقط تا زمانی نگهداری می‌شوند که برای
          اجرای خدمت، الزامات قانونی یا رسیدگی به
          اختلاف ضروری باشند. مدت دقیق نگهداری باید
          در قرارداد نهایی کسب‌وکار تعیین شود.
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
