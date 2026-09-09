import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CatalogBreadcrumbs, getCountryPage } from '@/modules/catalog'
import { buttonVariants, Card, Container } from '@/shared/ui'

type CountryPageProps = {
  params: Promise<{ country: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: countrySlug } = await params
  const data = await getCountryPage(countrySlug)

  return data
    ? {
        title: `ویزاهای ${data.country.name}`,
        description: data.country.summary,
      }
    : { title: 'مقصد پیدا نشد' }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country: countrySlug } = await params
  const data = await getCountryPage(countrySlug)

  if (!data) {
    notFound()
  }

  const { country, visas } = data

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

      <section className="-mt-px bg-linear-to-b from-white via-brand-50 to-[#f1ecff] py-20 sm:py-24" aria-labelledby="visa-list-title">
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
