import type { Metadata } from 'next'
import Link from 'next/link'
import { getPricingEntries } from '@/modules/content/application/get-public-content'
import { ContentPage } from '@/app/(frontend)/_components/content-page'
import { buttonVariants } from '@/shared/ui'
import { getPricingDestinations } from '@/modules/content/application/get-pricing-destinations'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'تعرفه خدمات بولدتریپ',
  description:
    'تعرفه خدمات ویزا، مشاوره و وقت سفارت بولدتریپ؛ هزینه‌های رسمی جدا از هزینه خدمات است.',
  alternates: { canonical: '/services/boldtrip-pricing' },
}

export default async function PricingPage() {
  const published = await getPricingEntries()
  const entries = await getPricingDestinations(published)
  return (
    <ContentPage
      eyebrow="تعرفه‌ها"
      title="تعرفه خدمات بولدتریپ"
      description="تعرفه‌های منتشرشده را بررسی کنید. هزینه‌های رسمی و هزینه خدمات از یکدیگر جدا هستند؛ پرداخت فقط با واریز بانکی و ارسال رسید انجام می‌شود."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="flex flex-col rounded-3xl border border-brand-100 bg-brand-50 p-5 sm:p-6"
          >
            <h2 className="text-xl font-black text-brand-950">{entry.title}</h2>
            {entry.description && (
              <p className="mt-3 whitespace-pre-line text-sm leading-7">{entry.description}</p>
            )}
            <p className="mt-5 font-extrabold text-brand-700">
              {entry.priceLabel || 'هزینه خدمات پس از بررسی اعلام می‌شود'}
            </p>
            {entry.officialCostNote && (
              <p className="mt-3 rounded-xl bg-white p-3 text-xs leading-7 text-ink-700">
                هزینه‌های رسمی جداگانه: {entry.officialCostNote}
              </p>
            )}
            {entry.actionHref ? <Link
              className={buttonVariants({ className: 'mt-auto w-full pt-3' })}
              href={entry.actionHref}
            >
              ثبت درخواست
            </Link> : <Link className={buttonVariants({ variant: 'secondary', className: 'mt-5 w-full' })} href="/contact">هماهنگی این خدمت با پشتیبانی</Link>}
          </article>
        ))}
      </div>
      <Link href="/assessment/apply" className={buttonVariants({ size: 'large' })}>ارزیابی رایگان شرایط و مدارک</Link>
      <p className="rounded-2xl bg-white p-4 text-sm leading-8">
        هزینه‌های سفارت، کارگزاری، ترجمه، بیومتریک، بیمه، دادگاه، وکیل و پیکاپ در صورت وجود جدا از
        دستمزد خدمات هستند؛ پیش از پرداخت، مبلغ قابل پرداخت در پرونده شما اعلام می‌شود. درگاه پرداخت
        آنلاین فعال نیست.
      </p>
    </ContentPage>
  )
}
