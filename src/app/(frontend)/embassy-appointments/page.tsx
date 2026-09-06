import type { Metadata } from 'next'
import Link from 'next/link'

import {
  getEmbassyAppointmentCountries,
  getEmbassyCountryTheme,
} from '@/modules/catalog'
import { cn } from '@/shared/lib/cn'
import { Card } from '@/shared/ui/card'
import { Container } from '@/shared/ui/container'

export const metadata: Metadata = {
  title: 'وقت سفارت | BoldTrip',
  description:
    'شرایط دریافت وقت سفارت کشورهای مختلف، مدارک موردنیاز و مراحل ثبت درخواست.',
}

export const dynamic = 'force-dynamic'

const processSteps = [
  {
    number: '۱',
    title: 'انتخاب کشور',
    description:
      'کشور مقصد را انتخاب کرده و شرایط دریافت وقت را مطالعه کنید.',
  },
  {
    number: '۲',
    title: 'ثبت اطلاعات',
    description:
      'اطلاعات متقاضی و نوع ویزای موردنظر را وارد کنید.',
  },
  {
    number: '۳',
    title: 'ارسال مدارک',
    description:
      'پاسپورت و مدارک لازم را از طریق حساب کاربری ارسال کنید.',
  },
  {
    number: '۴',
    title: 'بررسی و پیگیری',
    description:
      'پس از بررسی و تأیید هزینه، درخواست توسط کارشناس پیگیری می‌شود.',
  },
]

export default async function EmbassyAppointmentsPage() {
  const countries = await getEmbassyAppointmentCountries()

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border bg-brand-50">
        <div className="absolute -right-24 top-12 h-72 w-72 rounded-full bg-brand-200/60 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-accent-200/60 blur-3xl" />

        <Container className="relative py-20 text-center sm:py-24">
          <span className="inline-flex rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-bold text-brand-700 shadow-sm">
            خدمات وقت سفارت
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight text-brand-950 sm:text-5xl lg:text-6xl">
            دریافت وقت سفارت کشورهای مختلف
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-ink-600 sm:text-lg">
            کشور مقصد را انتخاب کنید تا شرایط، مدارک موردنیاز،
            مراحل اقدام و آخرین اطلاعات منتشرشده را مشاهده کنید.
          </p>
        </Container>
      </section>

      <section className="bg-canvas py-16 sm:py-20">
        <Container>
          <div className="mb-10">
            <span className="text-sm font-bold text-brand-600">
              انتخاب مقصد
            </span>

            <h2 className="mt-3 text-3xl font-black text-brand-950 sm:text-4xl">
              برای کدام کشور وقت سفارت می‌خواهید؟
            </h2>

            <p className="mt-4 max-w-2xl leading-8 text-ink-600">
              فقط کشورهایی که خدمات وقت سفارت آن‌ها فعال شده
              باشند در این قسمت نمایش داده می‌شوند.
            </p>
          </div>

          {countries.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {countries.map((country) => {
                const guide = country.embassyAppointment
                const theme = getEmbassyCountryTheme(country.code)

                if (!guide) {
                  return null
                }

                return (
                  <Card
                    key={country.id}
                    className={cn(
                      'group overflow-hidden border bg-white p-0 transition duration-300 hover:-translate-y-1 hover:shadow-xl',
                      theme.border,
                    )}
                  >
                    <div
                      className={cn(
                        'relative overflow-hidden bg-gradient-to-l p-7 text-white',
                        theme.cardGradient,
                      )}
                    >
                      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

                      <div className="relative flex items-center justify-between gap-5">
                        <div>
                          <p className="text-sm font-bold text-white/70">
                            خدمات وقت سفارت
                          </p>

                          <h2 className="mt-2 text-3xl font-black">
                            {guide.title ??
                              `وقت سفارت ${country.name}`}
                          </h2>
                        </div>

                        <span
                          className="text-6xl"
                          role="img"
                          aria-label={`پرچم ${country.name}`}
                        >
                          {country.flag}
                        </span>
                      </div>
                    </div>

                    <div className="p-7">
                      <p className="min-h-16 leading-8 text-ink-600">
                        {guide.summary ??
                          `اطلاعات و شرایط دریافت وقت سفارت ${country.name}`}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <span
                          className={cn(
                            'rounded-full px-3 py-1.5 text-xs font-bold',
                            theme.softBackground,
                            theme.text,
                          )}
                        >
                          {guide.estimatedTime ??
                            'زمان وابسته به ظرفیت سفارت'}
                        </span>

                        <span
                          className={cn(
                            'rounded-full px-3 py-1.5 text-xs font-bold',
                            guide.acceptingRequests
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700',
                          )}
                        >
                          {guide.acceptingRequests
                            ? 'پذیرش درخواست فعال'
                            : 'فعلاً فقط مشاهده اطلاعات'}
                        </span>
                      </div>

                      <Link
                        href={`/embassy-appointments/${country.slug}`}
                        className={cn(
                          'mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-control px-6 text-sm font-bold transition hover:brightness-110',
                          theme.button,
                        )}
                      >
                        مشاهده شرایط و مدارک
                      </Link>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="mx-auto max-w-2xl border-border bg-white p-8 text-center">
              <h2 className="text-xl font-black text-brand-950">
                هنوز کشوری برای وقت سفارت فعال نشده است
              </h2>

              <p className="mt-3 leading-8 text-ink-600">
                در پنل مدیریت، کشور موردنظر را ویرایش کنید و در
                تب «وقت سفارت»، گزینه نمایش این کشور را فعال کنید.
              </p>
            </Card>
          )}
        </Container>
      </section>

      <section className="border-y border-border bg-white py-16 sm:py-20">
        <Container>
          <div className="text-center">
            <span className="text-sm font-bold text-brand-600">
              مسیر درخواست
            </span>

            <h2 className="mt-3 text-3xl font-black text-brand-950 sm:text-4xl">
              فرایند دریافت وقت سفارت
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-panel border border-border bg-canvas p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 font-black text-white">
                  {step.number}
                </span>

                <h3 className="mt-5 text-lg font-black text-brand-950">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-ink-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  )
}