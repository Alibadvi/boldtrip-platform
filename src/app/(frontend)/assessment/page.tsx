import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '../_components/content-page'
import { buttonVariants } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'ارزیابی رایگان شرایط و مدارک',
  description:
    'ارزیابی اولیه رایگان شرایط سفر و مدارک ویزا در بولدتریپ؛ ثبت اطلاعات، ارسال اختیاری مدارک و پیگیری پاسخ کارشناس.',
  alternates: { canonical: '/assessment' },
}

export default function AssessmentPage() {
  return (
    <ContentPage
      eyebrow="ارزیابی اولیه رایگان"
      title="ارزیابی رایگان شرایط و مدارک"
      description="شرایط سفر، سوابق و مدارک خود را ثبت کنید تا کارشناس بولدتریپ آن‌ها را بررسی کند."
    >
      <ol className="list-inside list-decimal space-y-3 leading-8">
        <li>برای حفظ حریم خصوصی و پیگیری پاسخ، وارد حساب شوید یا حساب بسازید.</li>
        <li>اطلاعات تماس، کشور و نوع ویزا، بودجه و سوابق خود را تکمیل کنید.</li>
        <li>در صورت تمایل مدارک لازم را ارسال کنید؛ سپس شماره پیگیری دریافت می‌کنید.</li>
        <li>وضعیت بررسی و پاسخ کارشناس را در حساب خود ببینید.</li>
      </ol>
      <p className="rounded-2xl bg-brand-50 p-5 leading-8">
        ارزیابی اولیه رایگان است. خدمات پولی بعدی فقط با درخواست جداگانه و اعلام هزینه انجام
        می‌شوند. ارزیابی به‌معنی تضمین صدور ویزا نیست.
      </p>
      <Link
        href="/assessment/apply"
        className={buttonVariants({ size: 'large', className: 'w-full sm:w-auto' })}
      >
        شروع ارزیابی رایگان شرایط و مدارک
      </Link>
    </ContentPage>
  )
}
