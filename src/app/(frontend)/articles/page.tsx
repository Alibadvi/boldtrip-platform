import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ContentPage } from '@/app/(frontend)/_components/content-page'
import { getPublishedArticles } from '@/modules/content/application/get-public-content'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'مقالات ویزا',
  description: 'مقالات بازبینی‌شده درباره مدارک ویزا و خدمات سفارت.',
  alternates: { canonical: '/articles' },
}

export default async function ArticlesPage() {
  const articles = await getPublishedArticles()
  return (
    <ContentPage
      eyebrow="مرکز راهنما"
      title="مقالات ویزا"
      description="راهنماهای منتشرشده را بخوانید و تاریخ آخرین بازبینی و منبع رسمی را در هر مقاله بررسی کنید."
    >
      {articles.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="overflow-hidden rounded-2xl border border-brand-100 bg-brand-50 transition hover:border-brand-400"
            >
              {article.featuredImageUrl && (
                <Image
                  src={article.featuredImageUrl}
                  alt=""
                  width={960}
                  height={540}
                  unoptimized
                  className="aspect-video w-full object-cover"
                />
              )}
              <div className="p-5">
                <span className="text-xs font-bold text-brand-600">{article.category}</span>
                <h2 className="mt-2 text-xl font-black text-brand-950">{article.title}</h2>
                <p className="mt-3 text-sm leading-7">{article.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-brand-200 p-6">
          مقاله‌ای هنوز منتشر نشده است.
        </p>
      )}
    </ContentPage>
  )
}
