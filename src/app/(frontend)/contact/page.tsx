import type { Metadata } from 'next'
import Link from 'next/link'

import {
  ContentPage,
  ContentSection,
} from '@/app/(frontend)/_components/content-page'
import { buttonVariants } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'تماس با ما',
}

export default function ContactPage() {
  return (
    <ContentPage
      description="برای انتخاب مسیر، یک جلسه مشاوره رزرو کنید؛ برای درخواست ثبت‌شده از داخل حساب خود پیگیری کنید."
      eyebrow="ارتباط با BoldTrip"
      title="از مسیر درست با ما در تماس باشید"
    >
      <ContentSection title="پیش از ثبت درخواست">
        <p>
          اگر درباره نوع ویزا یا خدمت مناسب مطمئن
          نیستید، زمان مشاوره را انتخاب کنید تا شرایط
          شما منظم بررسی شود.
        </p>
        <Link
          className={buttonVariants()}
          href="/consultation/book"
        >
          رزرو مشاوره
        </Link>
      </ContentSection>

      <ContentSection title="پس از ثبت درخواست">
        <p>
          شماره پیگیری، وضعیت پرونده، توضیح کارشناس،
          مدارک و پرداخت هر درخواست در حساب کاربری
          شما قرار می‌گیرد.
        </p>
        <Link
          className={buttonVariants({
            variant: 'secondary',
          })}
          href="/account/requests"
        >
          ورود به پیگیری درخواست
        </Link>
      </ContentSection>

      <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-950">
        شماره تماس، واتساپ و نشانی رسمی باید پیش از
        انتشار نهایی توسط مدیریت کسب‌وکار تأیید و در
        این صفحه درج شود.
      </p>
    </ContentPage>
  )
}
