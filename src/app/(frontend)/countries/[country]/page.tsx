import type { Metadata } from 'next'
import { normalizeRequestDestination } from '@/modules/content/domain/pricing-destination'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CatalogBreadcrumbs, getCountryPage } from '@/modules/catalog'
import {
  getPricingEntries,
  getPublishedCountryQuestions,
} from '@/modules/content/application/get-public-content'
import { submitCountryQuestion } from '@/modules/content/application/submit-country-question'
import { buttonVariants, Card, Container } from '@/shared/ui'

type CountryPageProps = {
  params: Promise<{ country: string }>
  searchParams: Promise<{ question?: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: countrySlug } = await params
  const data = await getCountryPage(countrySlug)

  return data
    ? {
        title: `ویزاهای ${data.country.name}`,
        description: data.country.summary,
        alternates: { canonical: `/countries/${data.country.slug}` },
      }
    : { title: 'مقصد پیدا نشد' }
}

export default async function CountryPage({ params, searchParams }: CountryPageProps) {
  const { country: countrySlug } = await params
  const data = await getCountryPage(countrySlug)

  if (!data) {
    notFound()
  }

  const { country, visas } = data
  const [pricing, questions] = await Promise.all([
    getPricingEntries(country.code),
    getPublishedCountryQuestions(country.id),
  ])
  const questionState = (await searchParams).question

  return (
    <div className="bg-brand-50">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#140728_0%,#28104f_48%,#4b249e_100%)] py-14 text-white sm:py-18">
        <div className="pointer-events-none absolute -top-24 left-0 size-72 rounded-full bg-accent-300/20 blur-3xl" />
        <Container className="relative z-10">
          <CatalogBreadcrumbs
            inverse
            items={[
              { href: '/', label: 'خانه' },
              { href: '/countries', label: 'کشورها' },
              { label: country.name },
            ]}
          />
          <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <span className="text-sm font-extrabold text-accent-300">اطلاعات مقصد</span>
              <h1 className="mt-3 text-[clamp(2.7rem,7vw,4.8rem)] leading-tight font-black tracking-[-0.06em] text-white">
                ویزاهای {country.name}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-9 text-white/68 sm:text-lg">
                {country.summary}
              </p>
            </div>
            <div className="flex items-center gap-4 lg:flex-col">
              <span
                className="grid size-24 place-items-center rounded-panel border border-white bg-white text-5xl shadow-card sm:size-30 sm:text-6xl"
                aria-hidden="true"
              >
                {country.flag}
              </span>
              <span className="text-sm font-black text-white/55" dir="ltr">
                {country.code}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <div aria-hidden="true" className="h-24 bg-linear-to-b from-[#4b249e] to-[#faf8ff]" />

      <section className="-mt-px bg-linear-to-b from-[#faf8ff] to-white py-18 sm:py-22">
        <Container className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <span className="text-sm font-extrabold text-brand-600">پیش از انتخاب ویزا</span>
            <h2 className="mt-2 text-3xl leading-tight font-black text-brand-950">
              درباره مسیر {country.name}
            </h2>
          </div>
          <p className="m-0 whitespace-pre-line text-base leading-9 text-ink-700">
            {country.introduction}
          </p>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16" aria-labelledby="country-pricing-title">
        <Container>
          <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6 sm:p-9">
            <h2 id="country-pricing-title" className="text-2xl font-black text-brand-950">
              تعرفه خدمات {country.name}
            </h2>
            <p className="mt-2 text-sm leading-7 text-ink-700">
              هزینه خدمات و هزینه‌های رسمی جداگانه اعلام می‌شوند.
            </p>
            {pricing.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pricing.map((entry) => (
                  <div key={entry.id} className="rounded-2xl bg-white p-5 shadow-card">
                    <h3 className="font-black text-brand-950">
                      {entry.kind === 'visa'
                        ? 'هزینه خدمات ویزا'
                        : entry.kind === 'embassy'
                          ? 'هزینه وقت سفارت'
                          : entry.kind === 'appeal'
                            ? 'هزینه اعتراض به ریجکتی'
                            : entry.title}
                    </h3>
                    <p className="mt-2 text-sm">{entry.priceLabel || 'پس از بررسی اعلام می‌شود'}</p>
                    {entry.officialCostNote && (
                      <p className="mt-3 border-t border-border pt-3 text-xs">
                        هزینه‌های رسمی جداگانه: {entry.officialCostNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm">
                تعرفه این کشور هنوز منتشر نشده است؛ پیش از واریز هر مبلغ، جزئیات را از مدیریت دریافت
                کنید.
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={
                  normalizeRequestDestination(pricing.find((entry) => entry.kind === 'visa')?.actionHref) || '/assessment/apply'
                }
                className={buttonVariants({ variant: 'secondary' })}
              >
                درخواست این خدمت
              </Link>
              <Link href="/assessment/apply" className={buttonVariants()}>
                بررسی رایگان مدارک
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section
        className="-mt-px bg-linear-to-b from-white via-brand-50 to-[#f1ecff] py-20 sm:py-24"
        aria-labelledby="visa-list-title"
      >
        <Container>
          <div className="mb-9">
            <span className="text-sm font-extrabold text-brand-600">مسیرهای منتشرشده</span>
            <h2
              id="visa-list-title"
              className="mt-2 text-3xl font-black text-brand-950 sm:text-4xl"
            >
              انواع ویزای {country.name}
            </h2>
          </div>

          {visas.length ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {visas.map((visa) => (
                <Link
                  href={`/countries/${country.slug}/visas/${visa.slug}`}
                  className="group block rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
                  key={visa.id}
                >
                  <Card className="flex h-full min-h-64 flex-col transition duration-200 group-hover:-translate-y-1 group-hover:border-brand-100 group-hover:shadow-card">
                    <h3 className="text-2xl font-black text-brand-950">{visa.title}</h3>
                    <p className="mt-3 text-sm leading-8 text-ink-700">{visa.summary}</p>
                    {visa.processingTime ? (
                      <p className="mt-5 text-xs font-bold text-ink-500">
                        زمان تقریبی بررسی: {visa.processingTime}
                      </p>
                    ) : null}
                    <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-extrabold text-brand-700">
                      مشاهده شرایط و مدارک
                      <span
                        className="transition-transform group-hover:-translate-x-1"
                        aria-hidden="true"
                      >
                        ←
                      </span>
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <h3 className="text-lg font-black text-brand-950">ویزایی منتشر نشده است</h3>
              <p className="mt-2 text-sm leading-8 text-ink-700">
                جزئیات مسیرهای این کشور پس از بررسی منبع رسمی منتشر می‌شود.
              </p>
            </Card>
          )}
        </Container>
      </section>

      <section className="bg-white py-16" aria-labelledby="country-questions-title">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 id="country-questions-title" className="text-2xl font-black text-brand-950">
              سؤال خود را بپرسید
            </h2>
            <p className="mt-2 text-sm text-ink-700">
              اطلاعات تماس شما عمومی نمی‌شود. پرسش تنها پس از تأیید مدیریت منتشر خواهد شد.
            </p>
            {questionState === 'sent' && (
              <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-emerald-900">
                پرسش شما دریافت شد و در انتظار بررسی است.
              </p>
            )}
            {questionState === 'invalid' && (
              <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-3 text-amber-900">
                اطلاعات پرسش کامل نیست؛ لطفاً دوباره بررسی کنید.
              </p>
            )}
            {questionState === 'limited' && (
              <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-3 text-amber-900">
                تعداد پرسش‌های ارسالی زیاد است. فردا دوباره تلاش کنید.
              </p>
            )}
            <form action={submitCountryQuestion.bind(null, country.id)} className="mt-5 grid gap-3">
              <label className="grid gap-1">
                نام{' '}
                <input
                  name="firstName"
                  required
                  minLength={2}
                  maxLength={80}
                  className="rounded-xl border border-border p-3"
                />
              </label>
              <label className="grid gap-1">
                تلفن یا ایمیل{' '}
                <input
                  name="contact"
                  required
                  minLength={5}
                  maxLength={200}
                  dir="ltr"
                  className="rounded-xl border border-border p-3"
                />
              </label>
              <label className="grid gap-1">
                متن سؤال{' '}
                <textarea
                  name="question"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  className="rounded-xl border border-border p-3"
                />
              </label>
              <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              <label className="flex items-center gap-2 text-sm">
                <input name="consent" type="checkbox" required /> با{' '}
                <Link href="/privacy" className="text-brand-700 underline">
                  سیاست حریم خصوصی
                </Link>{' '}
                موافقم.
              </label>
              <button type="submit" className={buttonVariants({ className: 'justify-center' })}>
                ارسال سؤال درباره {country.name}
              </button>
            </form>
          </div>
          <div className="space-y-4">
            {questions.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-brand-100 bg-brand-50 p-5"
              >
                <p className="text-xs font-bold text-brand-700">{item.firstName}</p>
                <h3 className="mt-2 font-bold text-brand-950">{item.question}</h3>
                {item.answer && (
                  <p className="mt-3 border-t border-brand-100 pt-3 text-sm leading-8">
                    {item.answer}
                  </p>
                )}
                {item.answeredAt && (
                  <time className="mt-2 block text-xs text-ink-500" dateTime={item.answeredAt}>
                    {new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' }).format(
                      new Date(item.answeredAt),
                    )}
                  </time>
                )}
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="-mt-px bg-linear-to-b from-[#f1ecff] to-brand-50 py-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-7 rounded-panel bg-brand-950 p-8 text-white sm:p-10 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-black">برای انتخاب مسیر مطمئن نیستید؟</h2>
              <p className="mt-2 max-w-xl text-sm leading-8 text-white/65">
                ابتدا شرایط خود را در جلسه مشاوره بررسی کنید؛ هیچ مسیری تضمین صدور ویزا نیست.
              </p>
            </div>
            <Link
              href="/consultation/book"
              className={buttonVariants({ className: 'w-full shrink-0 sm:w-auto', size: 'large' })}
            >
              رزرو مشاوره
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
