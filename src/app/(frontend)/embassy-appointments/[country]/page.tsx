import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  getEmbassyAppointmentPage,
  getEmbassyCountryTheme,
} from '@/modules/catalog'
import { cn } from '@/shared/lib/cn'
import { Card } from '@/shared/ui/card'
import { Container } from '@/shared/ui/container'

type EmbassyCountryPageProps = {
  params: Promise<{
    country: string
  }>
}

export const dynamic = 'force-dynamic'

function formatReviewDate(value?: string): string | null {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'long',
  }).format(date)
}

export async function generateMetadata({
  params,
}: EmbassyCountryPageProps): Promise<Metadata> {
  const { country: countrySlug } = await params
  const country = await getEmbassyAppointmentPage(countrySlug)

  if (!country?.embassyAppointment) {
    return {
      title: 'اطلاعات وقت سفارت پیدا نشد | BoldTrip',
    }
  }

  const guide = country.embassyAppointment

  return {
    title:
      guide.title ||
      `دریافت وقت سفارت ${country.name} | BoldTrip`,
    description:
      guide.summary ||
      `شرایط و مدارک دریافت وقت سفارت ${country.name}`,
  }
}

export default async function EmbassyCountryPage({
  params,
}: EmbassyCountryPageProps) {
  const { country: countrySlug } = await params
  const country = await getEmbassyAppointmentPage(countrySlug)

  if (!country?.embassyAppointment) {
    notFound()
  }

  const guide = country.embassyAppointment
  const theme = getEmbassyCountryTheme(country.code)
  const reviewDate = formatReviewDate(guide.lastReviewedAt)

  return (
    <main>
      <section
        className={cn(
          'relative overflow-hidden bg-gradient-to-l text-white',
          theme.heroGradient,
        )}
      >
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-white/10" />

        <Container className="relative py-14 sm:py-20">
          <nav aria-label="مسیر صفحه">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
              <li>
                <Link
                  href="/embassy-appointments"
                  className="font-bold transition hover:text-white"
                >
                  وقت سفارت
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{country.name}</li>
            </ol>
          </nav>

          <div className="mt-10 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                راهنمای وقت سفارت
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                {guide.title ??
                  `دریافت وقت سفارت ${country.name}`}
              </h1>

              <p className="mt-6 text-lg leading-9 text-white/80">
                {guide.summary ??
                  `شرایط، مدارک و مراحل دریافت وقت سفارت ${country.name}`}
              </p>
            </div>

            <span
              className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-7xl shadow-2xl backdrop-blur"
              role="img"
              aria-label={`پرچم ${country.name}`}
            >
              {country.flag}
            </span>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-16 sm:py-20">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-8">
              <Card className="border-border bg-white p-7 sm:p-9">
                <span className={cn('text-sm font-bold', theme.text)}>
                  معرفی خدمت
                </span>

                <h2 className="mt-3 text-3xl font-black text-brand-950">
                  شرایط دریافت وقت سفارت
                </h2>

                <p className="mt-6 whitespace-pre-line leading-9 text-ink-600">
                  {guide.introduction ||
                    `اطلاعات تکمیلی وقت سفارت ${country.name} هنوز ثبت نشده است.`}
                </p>
              </Card>

              {guide.requiredDocuments.length === 0 &&
              guide.steps.length === 0 &&
              guide.importantNotes.length === 0 ? (
                <Card className="border-amber-200 bg-amber-50 p-7 sm:p-9">
                  <h2 className="text-xl font-black text-amber-950">
                    محتوای این راهنما هنوز کامل نشده است
                  </h2>
                  <p className="mt-3 leading-8 text-amber-950/75">
                    مدیریت باید مدارک، مراحل و نکات مهم این
                    کشور را در Payload تکمیل و دوباره منتشر کند.
                  </p>
                </Card>
              ) : null}

              {guide.requiredDocuments.length > 0 ? (
                <Card className="border-border bg-white p-7 sm:p-9">
                  <span
                    className={cn('text-sm font-bold', theme.text)}
                  >
                    چک‌لیست اولیه
                  </span>

                  <h2 className="mt-3 text-3xl font-black text-brand-950">
                    مدارک موردنیاز
                  </h2>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {guide.requiredDocuments.map(
                      (document, index) => (
                        <div
                          key={`${document.title}-${index}`}
                          className={cn(
                            'rounded-panel border p-5',
                            theme.border,
                            theme.softBackground,
                          )}
                        >
                          <div className="flex gap-3">
                            <span
                              className={cn(
                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black',
                                theme.button,
                              )}
                            >
                              ✓
                            </span>

                            <div>
                              <h3 className="font-black text-brand-950">
                                {document.title}
                              </h3>

                              {document.description ? (
                                <p className="mt-2 leading-7 text-ink-600">
                                  {document.description}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </Card>
              ) : null}

              {guide.steps.length > 0 ? (
                <Card className="border-border bg-white p-7 sm:p-9">
                  <span
                    className={cn('text-sm font-bold', theme.text)}
                  >
                    فرایند اقدام
                  </span>

                  <h2 className="mt-3 text-3xl font-black text-brand-950">
                    مراحل دریافت وقت
                  </h2>

                  <ol className="mt-8 space-y-6">
                    {guide.steps.map((step, index) => (
                      <li
                        key={`${step.title}-${index}`}
                        className="flex gap-4"
                      >
                        <span
                          className={cn(
                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black',
                            theme.softBackground,
                            theme.text,
                          )}
                        >
                          {new Intl.NumberFormat('fa-IR').format(
                            index + 1,
                          )}
                        </span>

                        <div className="border-b border-border pb-6 last:border-0">
                          <h3 className="text-lg font-black text-brand-950">
                            {step.title}
                          </h3>

                          <p className="mt-2 leading-8 text-ink-600">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Card>
              ) : null}

              {guide.importantNotes.length > 0 ? (
                <Card className="border-amber-200 bg-amber-50 p-7 sm:p-9">
                  <h2 className="text-2xl font-black text-amber-950">
                    نکات مهم
                  </h2>

                  <ul className="mt-6 space-y-4">
                    {guide.importantNotes.map((note, index) => (
                      <li
                        key={`${note.text}-${index}`}
                        className="flex gap-3 leading-8 text-amber-950/80"
                      >
                        <span
                          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500"
                          aria-hidden="true"
                        />
                        <span>{note.text}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24">
              <Card
                className={cn(
                  'overflow-hidden border bg-white p-0 shadow-xl',
                  theme.border,
                )}
              >
                <div
                  className={cn(
                    'bg-gradient-to-l p-7 text-white',
                    theme.cardGradient,
                  )}
                >
                  <p className="text-sm font-bold text-white/70">
                    وضعیت خدمت
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {guide.acceptingRequests
                      ? 'پذیرش درخواست فعال است'
                      : 'فعلاً فقط مشاهده اطلاعات'}
                  </p>
                </div>

                <dl className="space-y-5 p-7">
                  <div>
                    <dt className="text-sm text-ink-500">
                      زمان تقریبی
                    </dt>
                    <dd className="mt-1 font-black text-brand-950">
                      {guide.estimatedTime ||
                        'وابسته به ظرفیت سفارت'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-ink-500">
                      هزینه خدمت
                    </dt>
                    <dd className="mt-1 font-black text-brand-950">
                      {guide.feeNote ||
                        'پس از بررسی اعلام می‌شود'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-ink-500">
                      نحوه پیگیری
                    </dt>
                    <dd className="mt-1 font-black text-brand-950">
                      از طریق حساب کاربری
                    </dd>
                  </div>

                  {guide.acceptingRequests ? (
  <Link
    href={`/embassy-appointments/${country.slug}/apply`}
    className={cn(
      'flex min-h-12 items-center justify-center rounded-control px-5 text-center text-sm font-bold transition',
      theme.button,
    )}
  >
    شروع درخواست وقت سفارت
  </Link>
) : (
  <div
    aria-disabled="true"
    className="flex min-h-12 cursor-not-allowed items-center justify-center rounded-control bg-ink-200 px-5 text-center text-sm font-bold text-ink-500"
  >
    پذیرش درخواست موقتاً متوقف است
  </div>
)}

<p className="text-center text-xs leading-6 text-ink-500">
  پس از ثبت درخواست، شماره پیگیری در حساب
  کاربری شما نمایش داده می‌شود.
</p>
                </dl>
              </Card>

              {(guide.officialSourceUrl || reviewDate) && (
                <Card className="border-border bg-white">
                  <h2 className="font-black text-brand-950">
                    اعتبار اطلاعات
                  </h2>

                  {reviewDate ? (
                    <p className="mt-3 text-sm leading-7 text-ink-600">
                      آخرین بررسی: {reviewDate}
                    </p>
                  ) : null}

                  {guide.officialSourceUrl ? (
                    <a
                      href={guide.officialSourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        'mt-4 inline-flex text-sm font-bold underline underline-offset-4',
                        theme.text,
                      )}
                    >
                      مشاهده منبع رسمی
                    </a>
                  ) : null}
                </Card>
              )}
            </aside>
          </div>
        </Container>
      </section>
    </main>
  )
}