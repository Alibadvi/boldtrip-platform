import type { Metadata } from 'next'
import Link from 'next/link'

import { getCountries } from '@/modules/catalog'
import { Card, Container } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'کشورها و مسیرهای ویزا',
  description:
    'کشور مقصد را انتخاب کنید و اطلاعات بازبینی‌شده انواع ویزا، مدارک و مراحل اقدام را ببینید.',
}

export const dynamic = 'force-dynamic'

export default async function CountriesPage() {
  const countries = await getCountries()

  return (
    <div className="bg-brand-50">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#140728_0%,#28104f_48%,#4b249e_100%)] py-20 text-white sm:py-24">
        <div className="pointer-events-none absolute -top-24 right-1/4 size-80 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/4 size-80 rounded-full bg-accent-300/20 blur-3xl" />
        <Container size="reading" className="relative z-10 text-center">
          <span className="mb-3 inline-block text-sm font-extrabold text-accent-300">
            انتخاب مقصد
          </span>
          <h1 className="m-0 text-[clamp(2.6rem,7vw,4.5rem)] leading-tight font-black tracking-[-0.055em] text-white">
            کشورها و مسیرهای ویزا
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-9 text-white/68 sm:text-lg">
            مقصد را انتخاب کنید تا فقط اطلاعات منتشرشده، منبع رسمی و تاریخ آخرین بازبینی هر مسیر را
            ببینید.
          </p>
        </Container>
      </section>

      <div aria-hidden="true" className="h-24 bg-linear-to-b from-[#4b249e] to-[#faf8ff]" />

      <section className="-mt-px bg-linear-to-b from-[#faf8ff] via-white to-brand-50 py-20 sm:py-24 lg:py-28">
        <Container>
          {countries.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {countries.map((country) => (
                <Link
                  href={`/countries/${country.slug}`}
                  className="group block rounded-panel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
                  key={country.id}
                >
                  <Card className="flex h-full min-h-80 flex-col p-7 transition duration-200 group-hover:-translate-y-1 group-hover:border-brand-100 group-hover:shadow-card sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className="grid size-18 place-items-center rounded-2xl bg-brand-50 text-4xl"
                        aria-hidden="true"
                      >
                        {country.flag}
                      </span>
                      <span
                        className="rounded-full bg-canvas px-3 py-1 text-xs font-black text-ink-500"
                        dir="ltr"
                      >
                        {country.code}
                      </span>
                    </div>
                    <h2 className="mt-8 text-3xl font-black tracking-[-0.04em] text-brand-950">
                      {country.name}
                    </h2>
                    <p className="mt-3 text-sm leading-8 text-ink-700">{country.summary}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-extrabold text-brand-700">
                      مشاهده ویزاهای این کشور
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
            <Card className="mx-auto max-w-2xl py-12 text-center">
              <h2 className="text-xl font-black text-brand-950">مقصدی منتشر نشده است</h2>
              <p className="mt-3 text-sm leading-8 text-ink-700">
                اطلاعات مقصدها پس از بررسی منابع رسمی در این صفحه قرار می‌گیرد.
              </p>
            </Card>
          )}
        </Container>
      </section>
    </div>
  )
}
