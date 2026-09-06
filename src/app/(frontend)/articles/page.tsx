import type { Metadata } from 'next'
import Link from 'next/link'

import { ContentPage } from '@/app/(frontend)/_components/content-page'
import { buttonVariants } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'مقالات ویزا',
  description:
    'راهنماهای بازبینی‌شده درباره ویزا و خدمات سفارت.',
}

export default function ArticlesPage() {
  return (
    <ContentPage
      description="این بخش فقط میزبان مطالبی خواهد بود که منبع رسمی و تاریخ بازبینی مشخص دارند."
      eyebrow="مرکز راهنما"
      title="مقالات ویزا"
    >
      <div className="rounded-3xl border border-dashed border-border bg-canvas p-8 text-center">
        <h2 className="text-xl font-black text-ink">
          مقاله‌ای منتشر نشده است
        </h2>
        <p className="mx-auto mt-3 max-w-xl leading-8 text-muted">
          تا آماده‌شدن مقالات تخصصی، اطلاعات
          بازبینی‌شده هر مقصد و نوع ویزا را در بخش
          کشورها مطالعه کنید.
        </p>
        <Link
          className={buttonVariants({
            className: 'mt-6',
          })}
          href="/countries"
        >
          مشاهده کشورها و ویزاها
        </Link>
      </div>
    </ContentPage>
  )
}
