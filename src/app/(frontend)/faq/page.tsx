import type { Metadata } from 'next'
import Link from 'next/link'

import {
  faqCategories,
  getHomepageContent,
  type FaqCategory,
} from '@/modules/content'
import { buttonVariants, Container } from '@/shared/ui'

import { FaqList } from '../_components/faq-list'

export const metadata: Metadata = {
  title: 'سوالات متداول',
  description: 'پاسخ سوالات متداول درباره ویزا، وقت سفارت، مشاوره، مدارک و پرداخت در بلدتریپ.',
}

export const dynamic = 'force-dynamic'

const faqGroupTitles: Record<FaqCategory, string> = {
  'visa-services': 'ویزا و خدمات سفارت',
  documents: 'مدارک و پرونده',
  'consultation-payment': 'مشاوره و پرداخت',
}

export default async function FaqPage() {
  const content = await getHomepageContent()
  const faqGroups = faqCategories.map((category) => ({
    id: category,
    title: faqGroupTitles[category],
    items: content.faqs.filter((faq) => faq.category === category),
  }))

  return (
    <div className="bg-brand-50">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#140728_0%,#28104f_48%,#4b249e_100%)] py-20 text-center text-white sm:py-24">
        <div className="pointer-events-none absolute -top-24 right-1/4 size-80 rounded-full bg-accent-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/4 size-80 rounded-full bg-brand-300/20 blur-3xl" />
        <Container size="reading" className="relative z-10">
          <span className="mb-3 inline-block text-sm font-extrabold text-accent-300">
            راهنمای بلدتریپ
          </span>
          <h1 className="m-0 text-[clamp(2.6rem,7vw,4.5rem)] leading-tight font-black tracking-[-0.055em] text-white">
            سوالات متداول
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
            پاسخ کوتاه و مستقیم درباره خدمات، مدارک، مشاوره و نحوه پرداخت.
          </p>
        </Container>
      </section>

      <div aria-hidden="true" className="h-24 bg-linear-to-b from-[#4b249e] to-[#faf8ff]" />

      <section className="-mt-px bg-linear-to-b from-[#faf8ff] via-white to-brand-50 py-20 sm:py-24 lg:py-28">
        <Container size="reading">
          {faqGroups.map((group, index) => (
            <section
              className={index === 0 ? '' : 'mt-16'}
              key={group.id}
              aria-labelledby={group.id}
            >
              <h2 id={group.id} className="mb-5 text-2xl font-black text-brand-950">
                {group.title}
              </h2>
              <FaqList items={group.items} />
            </section>
          ))}

          <div className="mt-16 flex flex-col items-start justify-between gap-7 rounded-card bg-brand-50 p-7 sm:p-9 lg:flex-row lg:items-center">
            <div>
              <h2 className="m-0 text-xl font-black text-brand-950">
                پاسخ سوالتان را پیدا نکردید؟
              </h2>
              <p className="mt-2 text-sm leading-7 text-ink-700">
                برای سوال عمومی با ما در تماس باشید یا برای بررسی شرایط خود مشاوره رزرو کنید.
              </p>
            </div>
            <div className="grid w-full shrink-0 gap-3 sm:flex sm:w-auto">
              <Link href="/contact" className={buttonVariants({ variant: 'secondary' })}>
                تماس با ما
              </Link>
              <Link href="/consultation/book" className={buttonVariants()}>
                رزرو مشاوره
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
