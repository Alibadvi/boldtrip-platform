import type { Metadata } from 'next'
import Link from 'next/link'

import {
  consultationDeliveryMethodLabels,
  formatConsultationPrice,
  getConsultationPage,
} from '@/modules/scheduling'
import { buttonVariants } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Container } from '@/shared/ui/container'

export const metadata: Metadata = {
  title: 'رزرو مشاوره تخصصی',
  description:
    'رزرو جلسه مشاوره تخصصی برای بررسی شرایط، انتخاب نوع ویزا و مسیر مناسب اقدام.',
}

export const dynamic = 'force-dynamic'

const systemFlow = [
  {
    title: 'ورود یا ثبت‌نام',
    description:
      'برای نگهداری امن رزروها، پرداخت‌ها و مدارک، ابتدا باید وارد حساب خود شوید.',
  },
  {
    title: 'انتخاب زمان آزاد',
    description:
      'تقویم فقط زمان‌هایی را نمایش می‌دهد که ادمین برای مشاور فعال کرده است.',
  },
  {
    title: 'ثبت رزرو اولیه',
    description:
      'پس از انتخاب زمان، رزرو با وضعیت «در انتظار پرداخت» ایجاد می‌شود.',
  },
  {
    title: 'واریز و ارسال رسید',
    description:
      'اطلاعات کارت نمایش داده می‌شود و کاربر تصویر رسید را ارسال می‌کند.',
  },
  {
    title: 'تأیید نهایی',
    description:
      'ادمین رسید را بررسی می‌کند و رزرو پس از تأیید قطعی می‌شود.',
  },
]

export default async function ConsultationPageRoute() {
  const content = await getConsultationPage()

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-brand-50 to-canvas">
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 size-80 rounded-full bg-accent-300/25 blur-3xl" />

        <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1fr_24rem] lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-extrabold text-brand-700 shadow-sm">
              {content.hero.kicker}
            </span>

            <h1 className="mt-6 max-w-3xl text-[clamp(2.7rem,6vw,4.7rem)] leading-[1.2] font-black tracking-[-0.05em] text-brand-950">
              {content.hero.title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-9 text-ink-700 sm:text-lg">
              {content.hero.description}
            </p>

            <ul className="mt-8 flex list-none flex-wrap gap-3 p-0">
              <li className="rounded-full border border-border bg-white px-4 py-2 text-sm font-bold text-ink-700">
                مدت جلسه:{' '}
                {new Intl.NumberFormat('fa-IR').format(
                  content.durationMinutes,
                )}{' '}
                دقیقه
              </li>

              <li className="rounded-full border border-border bg-white px-4 py-2 text-sm font-bold text-ink-700">
                روش برگزاری:{' '}
                {
                  consultationDeliveryMethodLabels[
                    content.deliveryMethod
                  ]
                }
              </li>
            </ul>
          </div>

          <Card className="overflow-hidden border-brand-200 bg-white p-0 shadow-raised">
            <div className="bg-brand-950 p-7 text-white">
              <p className="text-sm font-bold text-white/60">
                هزینه جلسه
              </p>

              <p className="mt-2 text-2xl font-black">
                {formatConsultationPrice(content.priceAmount)}
              </p>
            </div>

            <div className="space-y-5 p-7">
              <div>
                <p className="text-sm text-ink-500">
                  مدت جلسه
                </p>
                <p className="mt-1 font-black text-brand-950">
                  {new Intl.NumberFormat('fa-IR').format(
                    content.durationMinutes,
                  )}{' '}
                  دقیقه
                </p>
              </div>

              <div>
                <p className="text-sm text-ink-500">
                  روش برگزاری
                </p>
                <p className="mt-1 font-black text-brand-950">
                  {
                    consultationDeliveryMethodLabels[
                      content.deliveryMethod
                    ]
                  }
                </p>
              </div>

              <Link
                href="/consultation/book"
                className={buttonVariants({
                  className: 'w-full',
                  size: 'large',
                })}
              >
                مشاهده زمان‌های آزاد
              </Link>

              <p className="text-center text-xs leading-6 text-ink-500">
                برای ثبت رزرو وارد حساب مشتری می‌شوید.
              </p>
            </div>
          </Card>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-extrabold text-brand-600">
              نتیجه جلسه
            </span>

            <h2 className="mt-3 text-3xl font-black text-brand-950 sm:text-4xl">
              در جلسه مشاوره چه چیزی دریافت می‌کنید؟
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {content.benefits.map((benefit, index) => (
              <Card
                key={`${benefit.title}-${index}`}
                className="border-border bg-canvas transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-100 font-black text-brand-700">
                  {new Intl.NumberFormat('fa-IR').format(
                    index + 1,
                  )}
                </span>

                <h3 className="mt-6 text-xl font-black text-brand-950">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-8 text-ink-600">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-canvas py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <span className="text-sm font-extrabold text-brand-600">
                مراحل رزرو
              </span>

              <h2 className="mt-3 text-3xl font-black leading-tight text-brand-950 sm:text-4xl">
                از انتخاب زمان تا تأیید جلسه
              </h2>

              <p className="mt-5 leading-8 text-ink-600">
                رزرو فقط زمانی قطعی است که رسید پرداخت توسط
                ادمین تأیید شده باشد.
              </p>
            </div>

            <ol className="space-y-4">
              {content.steps.map((step, index) => (
                <li
                  key={`${step.title}-${index}`}
                  className="flex gap-4 rounded-panel border border-border bg-white p-5"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 font-black text-white">
                    {new Intl.NumberFormat('fa-IR').format(
                      index + 1,
                    )}
                  </span>

                  <div>
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
          </div>
        </Container>
      </section>

      <section className="bg-brand-950 py-20 text-white sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-extrabold text-accent-300">
              مسیر داخل سیستم
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              کاربر دقیقاً چگونه ادامه می‌دهد؟
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {systemFlow.map((item, index) => (
              <article
                key={item.title}
                className="rounded-card border border-white/10 bg-white/5 p-5"
              >
                <span className="text-3xl font-black text-accent-300">
                  {new Intl.NumberFormat('fa-IR').format(
                    index + 1,
                  )}
                </span>

                <h3 className="mt-5 font-black text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/60">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container className="grid gap-6 lg:grid-cols-3">
          <Card className="border-blue-200 bg-blue-50">
            <h2 className="text-xl font-black text-blue-950">
              مدارک
            </h2>

            <p className="mt-4 leading-8 text-blue-950/70">
              {content.documentsNote}
            </p>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50">
            <h2 className="text-xl font-black text-emerald-950">
              پرداخت
            </h2>

            <p className="mt-4 leading-8 text-emerald-950/70">
              {content.paymentNote}
            </p>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <h2 className="text-xl font-black text-amber-950">
              لغو و جابه‌جایی
            </h2>

            <p className="mt-4 leading-8 text-amber-950/70">
              {content.cancellationPolicy}
            </p>
          </Card>
        </Container>
      </section>
    </>
  )
}