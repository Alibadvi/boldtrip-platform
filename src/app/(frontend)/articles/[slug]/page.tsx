import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ContentPage } from '@/app/(frontend)/_components/content-page'
import { getPublishedArticle } from '@/modules/content/application/get-public-content'

type Props = { params: Promise<{ slug: string }> }
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) return { title: 'مقاله پیدا نشد', robots: { index: false } }
  return {
    title: (article.metaTitle || article.title).replace(/\s*\|\s*BoldTrip$/, ''),
    description: article.metaDescription || article.summary,
    alternates: { canonical: `/articles/${article.slug}` },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) notFound()
  return (
    <ContentPage eyebrow={article.category} title={article.title} description={article.summary}>
      {article.featuredImageUrl && (
        <Image src={article.featuredImageUrl} alt="" width={960} height={540} unoptimized className="w-full rounded-2xl object-cover" />
      )}
      <article className="whitespace-pre-line leading-9 text-ink-700">{article.body}</article>
      {article.lastReviewedAt && (
        <p className="text-sm">
          آخرین بازبینی:{' '}
          {new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' }).format(
            new Date(article.lastReviewedAt),
          )}
        </p>
      )}
      {article.officialSourceUrl && (
        <a
          href={article.officialSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-brand-700 underline"
        >
          منبع رسمی ↗
        </a>
      )}
    </ContentPage>
  )
}
