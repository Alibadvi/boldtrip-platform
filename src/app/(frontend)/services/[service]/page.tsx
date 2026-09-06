import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  CatalogBreadcrumbs,
  getServicePage,
  getServicePriceLabel,
  serviceKindLabels,
  type ServiceDetail,
} from '@/modules/catalog'
import { buttonVariants } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Container } from '@/shared/ui/container'

type ServicePageProps = {
  params: Promise<{
    service: string
  }>
}

export const dynamic = 'force-dynamic'

function getServiceAction(service: ServiceDetail) {
  switch (service.kind) {
    case 'consultation':
      return {
        label: 'رزرو مشاوره',
        href: '/consultation',
      }

    case 'embassyAppointment':
      return {
        label: 'شروع درخواست وقت سفارت',
        href: '/embassy-appointments',
      }

    default:
  return {
    label: 'شروع درخواست خدمت',
    href: `/services/${service.slug}/apply`,
  }
  }
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { service: slug } = await params
  const service = await getServicePage(slug)

  if (!service) {
    return {
      title: 'خدمت پیدا نشد | BoldTrip',
    }
  }

  return {
    title: `${service.title} | BoldTrip`,
    description: service.summary,
  }
}

export default async function ServicePage({
  params,
}: ServicePageProps) {
  const { service: slug } = await params
  const service = await getServicePage(slug)

  if (!service) {
    notFound()
  }

  const action = getServiceAction(service)

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border bg-brand-50">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-accent-200/60 blur-3xl" />

        <Container className="relative py-14 sm:py-20">
          <CatalogBreadcrumbs
            items={[
              {
                label: 'خدمات',
                href: '/services',
              },
              {
                label: service.title,
              },
            ]}
          />

          <div className="mt-10 max-w-3xl">
            <span className="inline-flex rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-bold text-brand-700">
              {serviceKindLabels[service.kind]}
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight text-brand-950 sm:text-5xl lg:text-6xl">
              {service.title}
            </h1>

            <p className="mt-6 text-lg leading-9 text-ink-600">
              {service.summary}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-16 sm:py-20">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-8">
              <Card className="border-border bg-white p-7 sm:p-9">
                <span className="text-sm font-bold text-brand-600">
                  معرفی خدمت
                </span>

                <h2 className="mt-3 text-3xl font-black text-brand-950">
                  درباره این خدمت
                </h2>

                <p className="mt-6 whitespace-pre-line leading-9 text-ink-600">
                  {service.description}
                </p>
              </Card>

              {service.benefits.length > 0 ? (
                <Card className="border-border bg-white p-7 sm:p-9">
                  <span className="text-sm font-bold text-brand-600">
                    مزایای همکاری
                  </span>

                  <h2 className="mt-3 text-3xl font-black text-brand-950">
                    چه چیزی دریافت می‌کنید؟
                  </h2>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {service.benefits.map((benefit, index) => (
                      <div
                        key={`${benefit.title}-${index}`}
                        className="rounded-panel border border-border bg-canvas p-5"
                      >
                        <div className="flex gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white">
                            ✓
                          </span>

                          <div>
                            <h3 className="font-black text-brand-950">
                              {benefit.title}
                            </h3>

                            {benefit.description ? (
                              <p className="mt-2 leading-7 text-ink-600">
                                {benefit.description}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}

              {service.steps.length > 0 ? (
                <Card className="border-border bg-white p-7 sm:p-9">
                  <span className="text-sm font-bold text-brand-600">
                    مراحل انجام
                  </span>

                  <h2 className="mt-3 text-3xl font-black text-brand-950">
                    فرایند این خدمت چگونه است؟
                  </h2>

                  <ol className="mt-8 space-y-6">
                    {service.steps.map((step, index) => (
                      <li
                        key={`${step.title}-${index}`}
                        className="flex gap-4"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 font-black text-brand-700">
                          {new Intl.NumberFormat('fa-IR').format(index + 1)}
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
            </div>

            <aside className="lg:sticky lg:top-24">
              <Card className="overflow-hidden border-brand-200 bg-white p-0 shadow-xl">
                <div className="bg-brand-950 p-7 text-white">
                  <p className="text-sm font-bold text-white/60">
                    هزینه خدمت
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {getServicePriceLabel(service)}
                  </p>
                </div>

                <div className="space-y-5 p-7">
                  {service.estimatedDuration ? (
                    <div>
                      <p className="text-sm text-ink-500">
                        زمان تقریبی انجام
                      </p>
                      <p className="mt-1 font-black text-brand-950">
                        {service.estimatedDuration}
                      </p>
                    </div>
                  ) : null}

                  <div>
                    <p className="text-sm text-ink-500">نحوه پیگیری</p>
                    <p className="mt-1 font-black text-brand-950">
                      از طریق حساب کاربری
                    </p>
                  </div>

                  <Link
                    href={action.href}
                    className={buttonVariants({
                      className: 'w-full',
                    })}
                  >
                    {action.label}
                  </Link>

                  <p className="text-center text-xs leading-6 text-ink-500">
                    ثبت درخواست به‌معنی تأیید نهایی یا تضمین نتیجه ویزا
                    نیست.
                  </p>
                </div>
              </Card>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  )
}