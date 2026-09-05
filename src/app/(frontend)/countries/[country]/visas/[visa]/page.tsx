import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  CatalogBreadcrumbs,
  getVisaPage,
  groupVisaRequirements,
  visaCategoryLabels,
  visaRequirementKindLabels,
} from '@/modules/catalog'
import { buttonVariants, Card, Container } from '@/shared/ui'

type VisaPageProps = {
  params: Promise<{ country: string; visa: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: VisaPageProps): Promise<Metadata> {
  const { country, visa } = await params
  const data = await getVisaPage(country, visa)

  return data
    ? {
        title: `${data.visa.title} ${data.country.name}`,
        description: data.visa.summary,
      }
    : { title: 'ویزای موردنظر پیدا نشد' }
}

export default async function VisaPage({ params }: VisaPageProps) {
  const { country: countrySlug, visa: visaSlug } = await params
  const data = await getVisaPage(countrySlug, visaSlug)

  if (!data) {
    notFound()
  }

  const { country, visa } = data
  const facts = [
    { label: 'مناسب برای', value: visa.suitableFor },
    { label: 'زمان تقریبی بررسی', value: visa.processingTime },
    { label: 'اعتبار احتمالی', value: visa.validity },
    { label: 'مدت اقامت', value: visa.stayLength },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value))
  const requirementGroups = groupVisaRequirements(visa.requirements).filter(
    (group) => group.requirements.length,
  )
  const reviewedDate = new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(visa.lastReviewedAt))

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-brand-50 to-white py-14 sm:py-18">
        <div className="pointer-events-none absolute -top-24 left-0 size-80 rounded-full bg-brand-300/20 blur-3xl" />
        <Container className="relative z-10">
          <CatalogBreadcrumbs
            items={[
              { href: '/', label: 'خانه' },
              { href: '/countries', label: 'کشورها' },
              { href: `/countries/${country.slug}`, label: country.name },
              { label: visa.title },
            ]}
          />
          <div className="mt-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-extrabold text-brand-700">
                {visaCategoryLabels[visa.category]}
              </span>
              <span className="text-sm text-ink-500">
                آخرین بازبینی: <time dateTime={visa.lastReviewedAt}>{reviewedDate}</time>
              </span>
            </div>
            <h1 className="mt-4 text-[clamp(2.6rem,7vw,4.6rem)] leading-tight font-black tracking-[-0.055em] text-brand-950">
              {visa.title} {country.name}
            </h1>
            <p className="mt-5 text-base leading-9 text-ink-700 sm:text-lg">{visa.summary}</p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          {facts.length ? (
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((fact) => (
                <div className="rounded-card border border-border bg-canvas p-5" key={fact.label}>
                  <dt className="text-xs font-bold text-ink-500">{fact.label}</dt>
                  <dd className="mt-2 text-base font-black text-brand-950">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-14 grid gap-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
            <div>
              <section aria-labelledby="requirements-title">
                <span className="text-sm font-extrabold text-brand-600">آنچه نیاز دارید</span>
                <h2 id="requirements-title" className="mt-2 text-3xl font-black text-brand-950">
                  شرایط و مدارک
                </h2>
                <div className="mt-7 grid gap-8">
                  {requirementGroups.map((group) => (
                    <div key={group.kind}>
                      <h3 className="text-base font-black text-brand-800">
                        {visaRequirementKindLabels[group.kind]}
                      </h3>
                      <ul className="mt-3 grid list-none gap-3 p-0">
                        {group.requirements.map((requirement) => (
                          <li
                            className="rounded-card border border-border bg-canvas p-5"
                            key={`${group.kind}-${requirement.title}`}
                          >
                            <strong className="text-sm text-ink-950">{requirement.title}</strong>
                            {requirement.description ? (
                              <p className="mt-2 text-sm leading-8 text-ink-700">
                                {requirement.description}
                              </p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-16" aria-labelledby="steps-title">
                <span className="text-sm font-extrabold text-brand-600">روند کلی</span>
                <h2 id="steps-title" className="mt-2 text-3xl font-black text-brand-950">
                  مراحل اقدام
                </h2>
                <ol className="mt-7 grid list-none gap-4 p-0">
                  {visa.steps.map((step, index) => (
                    <li className="grid grid-cols-[auto_1fr] gap-4" key={`${step.title}-${index}`}>
                      <span className="grid size-11 place-items-center rounded-xl bg-brand-600 font-black text-white">
                        {new Intl.NumberFormat('fa-IR').format(index + 1)}
                      </span>
                      <div className="border-b border-border pb-6">
                        <h3 className="text-base font-black text-brand-950">{step.title}</h3>
                        <p className="mt-2 text-sm leading-8 text-ink-700">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <Card>
                <h2 className="text-lg font-black text-brand-950">منبع و اعتبار اطلاعات</h2>
                <p className="mt-3 text-sm leading-8 text-ink-700">
                  این صفحه در تاریخ {reviewedDate} بازبینی شده است.
                </p>
                <a
                  href={visa.officialSourceUrl}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-brand-700 underline decoration-brand-100 decoration-2 underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  {visa.officialSourceLabel}
                  <span aria-hidden="true">↗</span>
                </a>
              </Card>

              {visa.feeNote ? (
                <Card>
                  <h2 className="text-lg font-black text-brand-950">هزینه‌ها</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-8 text-ink-700">
                    {visa.feeNote}
                  </p>
                </Card>
              ) : null}

              <Card className="border-brand-100 bg-brand-50">
                <h2 className="text-lg font-black text-brand-950">بررسی شرایط شما</h2>
                <p className="mt-3 text-sm leading-8 text-ink-700">
                  اطلاعات عمومی جایگزین بررسی پرونده و شرایط شخصی نیست.
                </p>
                <Link
                  href="/consultation/book"
                  className={buttonVariants({ className: 'mt-5', fullWidth: true })}
                >
                  رزرو مشاوره
                </Link>
              </Card>
            </aside>
          </div>

          {visa.disclaimer ? (
            <div className="mt-14 rounded-card border border-warning/20 bg-warning-soft p-5 text-sm leading-8 text-ink-700">
              <strong className="text-warning">توجه: </strong>
              {visa.disclaimer}
            </div>
          ) : null}
        </Container>
      </section>
    </>
  )
}
