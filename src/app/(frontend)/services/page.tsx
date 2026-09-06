import type { Metadata } from 'next'
import Link from 'next/link'

import {
  getServicePriceLabel,
  getServices,
  serviceKindLabels,
} from '@/modules/catalog'
import { buttonVariants } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Container } from '@/shared/ui/container'

export const metadata: Metadata = {
  title: 'خدمات مهاجرتی و ویزا | BoldTrip',
  description:
    'خدمات ویزا، وقت سفارت، بررسی مدارک و مشاوره تخصصی BoldTrip.',
}

export const dynamic = 'force-dynamic'

const processSteps = [
  {
    number: '۱',
    title: 'انتخاب خدمت',
    description: 'خدمت موردنیاز خود را انتخاب کنید و شرایط آن را بخوانید.',
  },
  {
    number: '۲',
    title: 'ثبت درخواست',
    description: 'اطلاعات اولیه را وارد کرده و درخواست خود را ثبت کنید.',
  },
  {
    number: '۳',
    title: 'پیگیری پرونده',
    description: 'مراحل بررسی، مدارک و وضعیت درخواست را در حساب خود ببینید.',
  },
]

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border bg-brand-50">
        <div className="absolute -right-24 top-8 h-64 w-64 rounded-full bg-brand-200/50 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-accent-200/60 blur-3xl" />

        <Container className="relative py-20 text-center sm:py-24">
          <span className="inline-flex rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-bold text-brand-700 shadow-sm">
            خدمات BoldTrip
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight text-brand-950 sm:text-5xl lg:text-6xl">
            مسیر مهاجرت، از تصمیم تا اقدام
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-ink-600 sm:text-lg">
            شرایط هر خدمت را شفاف بررسی کنید، درخواست خود را ثبت کنید و
            تمام مراحل پرونده را از یک حساب کاربری پیگیری کنید.
          </p>
        </Container>
      </section>

      <section className="bg-canvas py-16 sm:py-20">
        <Container>
          <div className="mb-10 flex flex-col gap-3 text-right sm:mb-12">
            <span className="text-sm font-bold text-brand-600">
              خدمات قابل ارائه
            </span>

            <h2 className="text-3xl font-black text-brand-950 sm:text-4xl">
              چه کمکی از ما می‌خواهید؟
            </h2>

            <p className="max-w-2xl leading-8 text-ink-600">
              برای مشاهده جزئیات، مدارک موردنیاز، زمان تقریبی و مراحل هر
              خدمت، یکی از گزینه‌های زیر را انتخاب کنید.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="group flex h-full flex-col overflow-hidden border-border bg-white p-0 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl"
                >
                  <div className="h-2 bg-gradient-to-l from-brand-600 via-brand-400 to-accent-400" />

                  <div className="flex flex-1 flex-col p-7">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
                        {serviceKindLabels[service.kind]}
                      </span>

                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-lg font-black text-white shadow-lg shadow-brand-600/20">
                        {service.title.slice(0, 1)}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-brand-950">
                      {service.title}
                    </h2>

                    <p className="mt-4 flex-1 leading-8 text-ink-600">
                      {service.summary}
                    </p>

                    <dl className="mt-7 space-y-3 border-y border-border py-5 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-ink-500">هزینه خدمت</dt>
                        <dd className="font-bold text-brand-950">
                          {getServicePriceLabel(service)}
                        </dd>
                      </div>

                      {service.estimatedDuration ? (
                        <div className="flex items-center justify-between gap-4">
                          <dt className="text-ink-500">زمان تقریبی</dt>
                          <dd className="font-bold text-brand-950">
                            {service.estimatedDuration}
                          </dd>
                        </div>
                      ) : null}
                    </dl>

                    <Link
                      href={`/services/${service.slug}`}
                      className={buttonVariants({
                        className: 'mt-6 w-full',
                      })}
                    >
                      مشاهده جزئیات خدمت
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="mx-auto max-w-2xl border-border bg-white p-8 text-center">
              <h2 className="text-xl font-black text-brand-950">
                هنوز خدمتی منتشر نشده است
              </h2>

              <p className="mt-3 leading-7 text-ink-600">
                خدمات پس از ایجاد و انتشار در پنل مدیریت، اینجا نمایش
                داده می‌شوند.
              </p>
            </Card>
          )}
        </Container>
      </section>

      <section className="border-y border-border bg-white py-16 sm:py-20">
        <Container>
          <div className="text-center">
            <span className="text-sm font-bold text-brand-600">
              فرایند ساده و شفاف
            </span>

            <h2 className="mt-3 text-3xl font-black text-brand-950 sm:text-4xl">
              شروع همکاری در سه مرحله
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-panel border border-border bg-canvas p-7 text-center"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-lg font-black text-white">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-black text-brand-950">
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

      <section className="bg-brand-950 py-16 text-white sm:py-20">
        <Container>
          <div className="flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-right">
            <div>
              <h2 className="text-3xl font-black sm:text-4xl">
                نمی‌دانید کدام خدمت مناسب شماست؟
              </h2>

              <p className="mt-4 max-w-2xl leading-8 text-white/70">
                با رزرو مشاوره، شرایط شما بررسی می‌شود و مسیر مناسب را
                پیش از ثبت درخواست انتخاب می‌کنید.
              </p>
            </div>

            <Link
              href="/consultation"
              className={buttonVariants({
                variant: 'secondary',
                className: 'shrink-0',
              })}
            >
              رزرو مشاوره
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}