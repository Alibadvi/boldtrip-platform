import Link from 'next/link'
import Image from 'next/image'

import { getFeaturedCountries } from '@/modules/catalog'
import { getHomepageContent } from '@/modules/content'
import { buttonVariants, Container } from '@/shared/ui'

import { FaqList } from './_components/faq-list'
import { FlightScrollSection } from './_components/flight-scroll-section'
import { Parallax, Reveal } from './_components/scroll-motion'
import { TravelIcon } from './_components/travel-icon'
import { HomeHero } from './_components/home-hero'

export const dynamic = 'force-dynamic'

const fallbackCountryTheme = {
  accent: 'bg-brand-600',
  glow: 'bg-brand-200/60',
  surface: 'from-brand-50 via-white to-brand-100/40',
  text: 'text-brand-700',
}

const countryThemes: Record<string, typeof fallbackCountryTheme> = {
  CA: {
    accent: 'bg-canada',
    glow: 'bg-red-200/60',
    surface: 'from-canada-soft via-white to-red-50',
    text: 'text-canada',
  },
  EU: {
    accent: 'bg-europe',
    glow: 'bg-blue-200/60',
    surface: 'from-europe-soft via-white to-blue-50',
    text: 'text-europe',
  },
  DE: {
    accent: 'bg-ink-950',
    glow: 'bg-yellow-200/60',
    surface: 'from-yellow-50 via-white to-red-50',
    text: 'text-ink-950',
  },
  FR: {
    accent: 'bg-blue-700',
    glow: 'bg-blue-200/60',
    surface: 'from-blue-50 via-white to-red-50',
    text: 'text-blue-700',
  },
  IT: {
    accent: 'bg-green-700',
    glow: 'bg-green-200/60',
    surface: 'from-green-50 via-white to-red-50',
    text: 'text-green-700',
  },
  ES: {
    accent: 'bg-red-600',
    glow: 'bg-yellow-200/60',
    surface: 'from-red-50 via-white to-yellow-50',
    text: 'text-red-700',
  },
  NL: {
    accent: 'bg-blue-700',
    glow: 'bg-blue-200/60',
    surface: 'from-red-50 via-white to-blue-50',
    text: 'text-blue-700',
  },
}

function getCountryTheme(code: string) {
  return countryThemes[code.toUpperCase()] ?? fallbackCountryTheme
}

function getServiceIcon(
  href: string,
): 'calendar' | 'globe' | 'document' {
  if (href.includes('consultation')) return 'calendar'
  if (href.includes('embassy')) return 'globe'

  return 'document'
}

function getServiceStyle(index: number) {
  if (index % 3 === 0) {
    return {
      card: 'border-brand-800 bg-[linear-gradient(145deg,#24133f,#4b249e)] text-white',
      icon: 'bg-white/10 text-accent-300 ring-white/10',
      eyebrow: 'text-accent-300',
      description: 'text-white/70',
      button: 'bg-accent-300 text-brand-950 hover:bg-accent-200',
      decoration: 'bg-brand-500/40',
    }
  }

  if (index % 3 === 1) {
    return {
      card: 'border-brand-200 bg-[linear-gradient(145deg,#ffffff,#f1ecff)] text-brand-950',
      icon: 'bg-brand-600 text-white ring-brand-200',
      eyebrow: 'text-brand-600',
      description: 'text-ink-700',
      button: 'bg-brand-600 text-white hover:bg-brand-700',
      decoration: 'bg-brand-200/70',
    }
  }

  return {
    card: 'border-accent-200 bg-[linear-gradient(145deg,#ffffff,#fff5d8)] text-brand-950',
    icon: 'bg-accent-300 text-brand-950 ring-accent-200',
    eyebrow: 'text-warning',
    description: 'text-ink-700',
    button: 'bg-brand-950 text-white hover:bg-brand-800',
    decoration: 'bg-accent-200/70',
  }
}

function SectionHeading({
  description,
  id,
  kicker,
  title,
  tone = 'light',
}: {
  description?: string
  id?: string
  kicker: string
  title: string
  tone?: 'light' | 'dark'
}) {
  const dark = tone === 'dark'

  return (
    <div className="max-w-3xl">
      <span
        className={`mb-4 inline-flex items-center gap-3 text-sm font-black before:h-px before:w-9 before:bg-current ${
          dark ? 'text-accent-300' : 'text-brand-600'
        }`}
      >
        {kicker}
      </span>

      <h2
        id={id}
        className={`text-3xl font-black leading-[1.45] sm:text-4xl lg:text-[2.65rem] ${
          dark ? 'text-white' : 'text-brand-950'
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 max-w-2xl text-base leading-8 ${
            dark ? 'text-white/68' : 'text-ink-700'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default async function HomePage() {
  const [content, countries] = await Promise.all([
    getHomepageContent(),
    getFeaturedCountries(),
  ])

  const faqs = content.faqs
    .filter((faq) => faq.showOnHomepage)
    .slice(0, 5)

  return (
    <div className="bg-brand-50">
      <HomeHero content={content.hero} />
      <section
        aria-labelledby="destinations-title"
        className="relative -mt-px overflow-hidden bg-[radial-gradient(circle_at_12%_18%,rgb(117_73_229/20%),transparent_34%),linear-gradient(180deg,#1b0b35_0%,#28104f_100%)] py-18 text-white sm:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 -left-28 size-96 rounded-full bg-accent-300/8 blur-3xl"
        />
        <Container className="relative z-10">
          <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              id="destinations-title"
              kicker={content.destinationIntro.kicker}
              title={content.destinationIntro.title}
              description={content.destinationIntro.description}
              tone="dark"
            />

            <Link
              href="/countries"
              className="group inline-flex shrink-0 items-center gap-3 text-sm font-black text-accent-300"
            >
              مشاهده همه مقصدها

              <TravelIcon
                name="arrow"
                className="size-5 transition-transform group-hover:-translate-x-1"
              />
            </Link>
          </Reveal>

          {countries.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {countries.map((country) => {
                const theme = getCountryTheme(country.code)

                return (
                  <Reveal key={country.id} className="h-full">
                    <Link
                      href={`/countries/${country.slug}`}
                      className={`group relative flex h-full min-h-80 flex-col overflow-hidden rounded-[1.75rem] border border-white bg-linear-to-br p-7 shadow-[0_10px_35px_rgb(36_19_63/7%)] transition-all duration-500 hover:border-brand-200 hover:shadow-raised motion-safe:hover:-translate-y-2 ${theme.surface}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute -top-16 -left-16 size-48 rounded-full blur-3xl transition-transform duration-700 motion-safe:group-hover:scale-125 ${theme.glow}`}
                      />

                      <span
                        aria-hidden="true"
                        className={`absolute top-0 right-0 h-1.5 w-full ${theme.accent}`}
                      />

                      <div className="relative flex items-start justify-between">
                        <span
                          aria-hidden="true"
                          className="grid size-17 place-items-center rounded-[1.35rem] border border-white/80 bg-white/70 text-5xl shadow-sm backdrop-blur"
                        >
                          {country.flag}
                        </span>

                        <span
                          dir="ltr"
                          className={`rounded-full border border-current/10 bg-white/60 px-3 py-1 text-xs font-black tracking-[0.18em] ${theme.text}`}
                        >
                          {country.code.toUpperCase()}
                        </span>
                      </div>

                      <div className="relative mt-auto pt-12">
                        <h3 className="text-2xl font-black text-brand-950">
                          {country.name}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-8 text-ink-700">
                          {country.summary}
                        </p>

                        <span
                          className={`mt-5 inline-flex items-center gap-2 text-sm font-black ${theme.text}`}
                        >
                          کشف مسیرهای ویزا

                          <TravelIcon
                            name="arrow"
                            className="size-5 transition-transform group-hover:-translate-x-1"
                          />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-brand-200 bg-white p-8 text-ink-700">
              راهنمای مقصدها در حال تکمیل است.
            </div>
          )}
        </Container>
      </section>

      <section
        aria-labelledby="services-title"
        className="relative -mt-px overflow-hidden bg-[radial-gradient(circle_at_88%_28%,rgb(99_54_209/22%),transparent_30%),linear-gradient(180deg,#28104f_0%,#17082f_100%)] py-18 text-white sm:py-24"
      >
        <Container className="relative z-10">
          <Reveal>
            <SectionHeading
              id="services-title"
              kicker={content.serviceIntro.kicker}
              title={content.serviceIntro.title}
              description={content.serviceIntro.description}
              tone="dark"
            />
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {content.services.map((service, index) => {
              const style = getServiceStyle(index)

              return (
                <Reveal
                  key={`${service.href}-${service.title}`}
                  className="h-full"
                >
                  <article
                    className={`group relative flex h-full min-h-105 flex-col overflow-hidden rounded-[2rem] border p-7 shadow-[0_15px_45px_rgb(36_19_63/8%)] transition-all duration-500 hover:shadow-raised sm:p-8 motion-safe:hover:-translate-y-2 ${style.card}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute -top-24 -left-24 size-64 rounded-full blur-3xl transition-transform duration-700 motion-safe:group-hover:scale-125 ${style.decoration}`}
                    />

                    <div className="relative flex items-center justify-between">
                      <span
                        className={`grid size-15 place-items-center rounded-2xl ring-1 ${style.icon}`}
                      >
                        <TravelIcon
                          name={getServiceIcon(service.href)}
                          className="size-7"
                        />
                      </span>

                      <span
                        dir="ltr"
                        className="text-sm font-black opacity-45"
                      >
                        {service.index}
                      </span>
                    </div>

                    <div className="relative mt-10 pb-8">
                      <p className={`text-xs font-black ${style.eyebrow}`}>
                        {service.eyebrow}
                      </p>

                      <h3 className="mt-3 text-2xl font-black">
                        {service.title}
                      </h3>

                      <p
                        className={`mt-4 text-sm leading-8 ${style.description}`}
                      >
                        {service.description}
                      </p>
                    </div>

                    <Link
                      href={service.href}
                      className={`relative mt-auto flex min-h-13 items-center justify-between gap-3 rounded-2xl px-5 py-3 text-sm font-black transition-all duration-300 ${style.button}`}
                    >
                      {service.actionLabel}

                      <TravelIcon
                        name="arrow"
                        className="size-5 shrink-0 transition-transform group-hover:-translate-x-1"
                      />
                    </Link>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      <FlightScrollSection>
        <section
          aria-labelledby="process-title"
          className="relative isolate overflow-hidden bg-[linear-gradient(140deg,#17082f_0%,#2d1158_50%,#4b249e_100%)] py-20 text-white before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-24 before:bg-linear-to-b before:from-[#17082f] before:to-transparent sm:py-28"
        >
          <div
            aria-hidden="true"
            className="absolute -top-52 -right-36 -z-10 size-[34rem] rounded-full border border-white/10"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-64 -left-44 -z-10 size-[38rem] rounded-full bg-brand-500/30 blur-3xl"
          />

          <Container className="grid items-start gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <div>
              <span className="text-sm font-black text-accent-300">
                {content.process.kicker}
              </span>

              <h2
                id="process-title"
                className="mt-4 text-3xl font-black leading-[1.5] sm:text-4xl"
              >
                {content.process.title}
              </h2>

              <p className="mt-5 text-base leading-9 text-white/75">
                {content.process.description}
              </p>

              <div
                aria-hidden="true"
                className="mt-10 hidden items-center gap-2 lg:flex"
              >
                <span className="w-36 border-t border-dashed border-white/25" />

                <TravelIcon
                  name="plane"
                  className="size-11 -rotate-12 text-accent-300"
                />
              </div>
            </div>

            <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
              {content.process.steps.map((step, index) => (
                <li key={`${step.number}-${step.title}`}>
                  <div className="group relative h-full min-h-57 overflow-hidden rounded-[1.6rem] border border-white/15 bg-white/6 p-6 transition-all duration-300 hover:border-accent-300/40 hover:bg-white/10 sm:p-7 motion-safe:hover:-translate-y-1">
                    <span className="grid size-12 place-items-center rounded-2xl border border-accent-300/25 bg-accent-300/10 text-lg font-black text-accent-300">
                      {step.number}
                    </span>

                    <h3 className="mt-6 text-lg font-black leading-8">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-8 text-white/75">
                      {step.description}
                    </p>

                    <span
                      aria-hidden="true"
                      className="absolute top-5 left-5 text-6xl font-black text-white/[0.035]"
                    >
                      0{index + 1}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      </FlightScrollSection>

      <div
        aria-hidden="true"
        className="-mt-px h-32 bg-linear-to-b from-[#4b249e] via-brand-100 to-canvas sm:h-40"
      />

      <section
        aria-labelledby="trust-title"
        className="relative -mt-px overflow-hidden bg-canvas py-18 sm:py-28"
      >
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading
              id="trust-title"
              kicker={content.trust.kicker}
              title={content.trust.title}
              description={content.trust.description}
            />

            <Link
              href={content.trust.actionHref}
              className="group mt-7 inline-flex items-center gap-3 text-sm font-black text-brand-700"
            >
              {content.trust.actionLabel}

              <TravelIcon
                name="arrow"
                className="size-5 transition-transform group-hover:-translate-x-1"
              />
            </Link>
          </Reveal>

          <Reveal className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-8 rounded-full bg-brand-300/25 blur-3xl"
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-5 shadow-raised sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-brand-600 text-white">
                    <TravelIcon name="shield" className="size-5" />
                  </span>

                  <span>
                    <strong className="block text-sm font-black text-brand-950">
                      پرونده ویزای شما
                    </strong>

                    <small className="text-xs text-ink-500">
                      نمونه حساب کاربری
                    </small>
                  </span>
                </div>

                <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">
                  در حال بررسی
                </span>
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  {
                    icon: 'document' as const,
                    title: 'اطلاعات و مدارک',
                    detail: '۴ مدرک با موفقیت بارگذاری شده',
                    tone: 'bg-brand-100 text-brand-700',
                    progress: 'w-full',
                  },
                  {
                    icon: 'shield' as const,
                    title: 'بررسی کارشناسی',
                    detail: 'بررسی اولیه پرونده در حال انجام',
                    tone: 'bg-success-soft text-success',
                    progress: 'w-2/3',
                  },
                  {
                    icon: 'calendar' as const,
                    title: 'اقدام بعدی',
                    detail: 'نتیجه بررسی در حساب شما نمایش داده می‌شود',
                    tone: 'bg-accent-100 text-warning',
                    progress: 'w-1/3',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-canvas/60 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-xl ${item.tone}`}
                      >
                        <TravelIcon
                          name={item.icon}
                          className="size-5"
                        />
                      </span>

                      <span className="min-w-0">
                        <strong className="block text-sm font-black text-brand-950">
                          {item.title}
                        </strong>

                        <small className="mt-1 block text-xs text-ink-500">
                          {item.detail}
                        </small>
                      </span>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-brand-100">
                      <span
                        className={`block h-full rounded-full bg-linear-to-l from-brand-600 to-brand-400 ${item.progress}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="-mt-px bg-linear-to-b from-canvas to-brand-50 py-10">
        <Container>
          <Reveal className="relative isolate overflow-hidden rounded-[2.2rem] bg-[linear-gradient(120deg,#fff2c9_0%,#ffe39b_45%,#f7f4ff_100%)] p-7 shadow-[0_18px_55px_rgb(36_19_63/9%)] sm:p-12">
            <span
              aria-hidden="true"
              className="absolute -top-32 -left-20 -z-10 size-80 rounded-full border-[45px] border-brand-600/5"
            />

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <SectionHeading
                kicker={content.consultation.kicker}
                title={content.consultation.title}
                description={content.consultation.description}
              />

              <Link
                href={content.consultation.actionHref}
                className={buttonVariants({
                  size: 'large',
                  className:
                    'group shrink-0 rounded-2xl bg-brand-950 shadow-[0_18px_40px_rgb(36_19_63/22%)] hover:bg-brand-800',
                })}
              >
                {content.consultation.actionLabel}

                <TravelIcon
                  name="arrow"
                  className="size-5 transition-transform group-hover:-translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <section
        aria-labelledby="faq-title"
        className="-mt-px bg-linear-to-b from-brand-50 via-[#f5f1ff] to-[#eee8ff] py-18 sm:py-28"
      >
        <Container className="grid items-start gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-18">
          <Reveal className="lg:sticky lg:top-28">
            <SectionHeading
              id="faq-title"
              kicker={content.faqIntro.kicker}
              title={content.faqIntro.title}
              description={content.faqIntro.description}
            />

            <Link
              href="/faq"
              className="group mt-7 inline-flex items-center gap-3 text-sm font-black text-brand-700"
            >
              مشاهده همه سوالات

              <TravelIcon
                name="arrow"
                className="size-5 transition-transform group-hover:-translate-x-1"
              />
            </Link>
          </Reveal>

          <Reveal>
            {faqs.length > 0 ? (
              <FaqList items={faqs} />
            ) : (
              <Link
                href="/contact"
                className="block rounded-3xl border border-border bg-white p-7 font-bold text-brand-700 shadow-card"
              >
                سوالی دارید؟ با ما در تماس باشید
              </Link>
            )}
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
