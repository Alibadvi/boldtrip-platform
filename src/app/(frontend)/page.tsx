import Image from 'next/image'
import Link from 'next/link'

import { getFeaturedCountries } from '@/modules/catalog'
import { getHomepageContent } from '@/modules/content'
import { buttonVariants, Container } from '@/shared/ui'

import { FaqList } from './_components/faq-list'
import { Parallax, Reveal } from './_components/scroll-motion'
import { TravelIcon } from './_components/travel-icon'

export const dynamic = 'force-dynamic'

const sectionTitle = 'text-balance text-3xl font-extrabold leading-[1.5] text-brand-950 sm:text-4xl'
const kicker =
  'mb-4 flex items-center gap-3 text-sm font-bold text-brand-600 before:h-px before:w-8 before:bg-current'
const countryStripes: Record<string, string> = {
  CA: 'bg-linear-to-r from-red-600 from-30% via-white via-30% to-red-600 to-70%',
  DE: 'bg-linear-to-b from-black from-33% via-red-600 via-33% to-yellow-400 to-66%',
  FR: 'bg-linear-to-r from-blue-700 from-33% via-white via-33% to-red-600 to-66%',
  IT: 'bg-linear-to-r from-green-700 from-33% via-white via-33% to-red-600 to-66%',
  ES: 'bg-linear-to-b from-red-700 from-25% via-yellow-400 via-25% to-red-700 to-75%',
  NL: 'bg-linear-to-b from-red-600 from-33% via-white via-33% to-blue-800 to-66%',
  EU: 'bg-europe',
}

export default async function HomePage() {
  const [content, countries] = await Promise.all([getHomepageContent(), getFeaturedCountries()])
  const destination = countries[0]
  const faqs = content.faqs.filter((faq) => faq.showOnHomepage).slice(0, 5)

  return (
    <>
      <section className="relative isolate overflow-hidden pt-7 pb-20 sm:pt-12 lg:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[85%] bg-linear-to-b from-[#f0e9ff] via-[#f9f6ff] to-canvas"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 -right-24 -z-10 size-96 rounded-full bg-brand-100/60 blur-3xl"
        />
        <Container className="grid items-center gap-10 lg:grid-cols-[1.04fr_1fr] lg:gap-14">
          <div className="relative z-10 py-5">
            <span className="mb-7 inline-flex items-center gap-3 rounded-full border border-brand-200 bg-white/75 px-4 py-2 text-xs font-bold text-brand-700 sm:text-sm">
              <TravelIcon name="plane" className="size-4" />
              {content.hero.kicker}
            </span>
            <h1 className="max-w-2xl text-[clamp(2.4rem,4.6vw,4.3rem)] font-black leading-[1.45] text-brand-950">
              {content.hero.title}
              <span className="mt-1 block text-brand-600">{content.hero.accent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-9 text-ink-700 sm:text-lg">
              {content.hero.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={content.hero.primaryActionHref}
                className={buttonVariants({
                  size: 'large',
                  className:
                    'gap-4 rounded-2xl shadow-[0_10px_25px_#5b34c426] motion-safe:transition-transform motion-safe:hover:-translate-y-1',
                })}
              >
                {content.hero.primaryActionLabel}
                <TravelIcon name="arrow" className="size-5" />
              </Link>
              <Link
                href={content.hero.secondaryActionHref}
                className={buttonVariants({
                  size: 'large',
                  variant: 'secondary',
                  className: 'rounded-2xl bg-white/70',
                })}
              >
                {content.hero.secondaryActionLabel}
              </Link>
            </div>
            <ul className="mt-8 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
              {content.hero.highlights.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-xs font-medium text-ink-700"
                >
                  <span aria-hidden="true" className="text-brand-600">
                    ✦
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <Parallax className="relative mx-auto w-full max-w-xl px-3 pb-6 sm:px-5">
            <div className="group relative isolate aspect-square rounded-[2.5rem] border border-brand-300/40 bg-[#170b28] shadow-[0_24px_80px_#7048d733] sm:rounded-[3rem]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-6 rounded-full border border-white/10"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-14 rotate-[-20deg] rounded-[50%] border border-dashed border-brand-300/30"
              />
              <Image
                src="/assets/boldtrip-logo.jpg"
                alt="لوگوی اصلی بولدتریپ؛ کره زمین بنفش، هواپیما و نشان مقصد"
                width={1024}
                height={1024}
                sizes="(min-width: 1024px) 560px, 90vw"
                priority
                className="relative z-10 h-full w-full rounded-[inherit] object-contain mix-blend-screen motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.025]"
              />
              <span
                className="absolute top-6 right-7 z-20 text-[0.6rem] font-semibold tracking-[0.18em] text-white/60 sm:text-xs"
                dir="ltr"
              >
                VISA & IMMIGRATION
              </span>
              <span
                aria-hidden="true"
                className="absolute -top-4 left-9 z-20 grid size-12 rotate-12 place-items-center rounded-2xl bg-accent-300 text-brand-950 shadow-card motion-safe:animate-plane-arrive"
              >
                <TravelIcon name="plane" />
              </span>
              <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-brand-950/80 px-4 py-2 text-xs text-white backdrop-blur-md">
                <TravelIcon name="globe" className="size-4 text-accent-300" />
                یک شروع روشن، یک مسیر تازه
              </div>
            </div>
            {destination && (
              <Link
                href={`/countries/${destination.slug}`}
                className="group absolute -right-1 -bottom-4 z-20 flex w-[78%] items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-card sm:p-5"
              >
                <span
                  aria-hidden="true"
                  className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-3xl"
                >
                  {destination.flag}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-ink-500">از این مقصد شروع کنید</span>
                  <strong className="mt-1 block truncate text-base font-bold text-brand-950">
                    {destination.name}
                  </strong>
                </span>
                <TravelIcon
                  name="arrow"
                  className="ms-auto size-5 shrink-0 text-brand-600 motion-safe:transition-transform motion-safe:group-hover:-translate-x-1"
                />
              </Link>
            )}
          </Parallax>
        </Container>
      </section>

      <section aria-label="انتخاب مسیر" className="relative z-10 pb-10">
        <Container>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-[0_8px_24px_#24133f06] md:grid-cols-3">
            {[
              {
                href: '/countries',
                icon: 'globe' as const,
                title: 'مقصدتان مشخص است؟',
                detail: 'شرایط کشورها و مسیرهای ویزا',
              },
              {
                href: '/consultation',
                icon: 'calendar' as const,
                title: 'برای انتخاب مسیر کمک می‌خواهید؟',
                detail: 'مشاوره و زمان‌های قابل رزرو',
              },
              {
                href: '/account',
                icon: 'document' as const,
                title: 'قبلاً درخواست ثبت کرده‌اید؟',
                detail: 'ورود و پیگیری پرونده',
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-4 bg-white px-6 py-6 transition-colors hover:bg-brand-50"
              >
                <TravelIcon name={item.icon} className="size-6 shrink-0 text-brand-500" />
                <span>
                  <strong className="block text-sm font-bold text-brand-950">{item.title}</strong>
                  <span className="mt-1 block text-xs text-ink-500">{item.detail}</span>
                </span>
                <TravelIcon name="arrow" className="ms-auto size-4 shrink-0 text-brand-600" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-22" aria-labelledby="destination-title">
        <Container>
          <Reveal className="mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <span className={kicker}>{content.destinationIntro.kicker}</span>
              <h2 id="destination-title" className={sectionTitle}>
                {content.destinationIntro.title}
              </h2>
            </div>
            <Link
              href="/countries"
              className="inline-flex shrink-0 items-center gap-3 rounded-xl py-2 text-sm font-bold text-brand-700"
            >
              همه مقصدها
              <TravelIcon name="arrow" className="size-5" />
            </Link>
          </Reveal>
          <p className="mb-8 max-w-2xl text-base leading-8 text-ink-700">
            {content.destinationIntro.description}
          </p>
          {countries.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {countries.map((country) => (
                <Reveal key={country.id} className="h-full">
                  <Link
                    href={`/countries/${country.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_5px_20px_#24133f04] motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-2 hover:border-brand-200 hover:shadow-card"
                  >
                    <div
                      aria-hidden="true"
                      className={`h-2 ${countryStripes[country.code.toUpperCase()] ?? 'bg-brand-500'}`}
                    />
                    <div className="relative flex-1 p-7">
                      <div className="mb-10 flex items-center justify-between">
                        <span aria-hidden="true" className="text-5xl">
                          {country.flag}
                        </span>
                        <span
                          dir="ltr"
                          className="rounded-full border border-border px-3 py-1 text-xs font-semibold tracking-widest text-ink-500"
                        >
                          {country.code}
                        </span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-brand-950">{country.name}</h3>
                      <p className="mt-3 text-sm leading-8 text-ink-700">{country.summary}</p>
                    </div>
                    <div className="relative flex items-center justify-between border-t border-dashed border-border bg-brand-50/50 px-7 py-5 text-sm font-bold text-brand-700 before:absolute before:top-0 before:-right-2 before:size-4 before:-translate-y-1/2 before:rounded-full before:border before:border-border before:bg-canvas after:absolute after:top-0 after:-left-2 after:size-4 after:-translate-y-1/2 after:rounded-full after:border after:border-border after:bg-canvas">
                      کشف مسیرهای ویزا
                      <TravelIcon
                        name="arrow"
                        className="size-5 motion-safe:transition-transform motion-safe:group-hover:-translate-x-1"
                      />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-8">
              <p className="text-ink-700">راهنمای مقصدها در حال تکمیل است.</p>
              <Link
                href="/consultation"
                className="mt-3 inline-flex text-sm font-bold text-brand-700"
              >
                برای انتخاب مقصد، مشاوره بگیرید ←
              </Link>
            </div>
          )}
        </Container>
      </section>

      <section className="py-14 sm:py-22" aria-labelledby="services-title">
        <Container>
          <Reveal className="mb-10 max-w-2xl">
            <span className={kicker}>{content.serviceIntro.kicker}</span>
            <h2 id="services-title" className={sectionTitle}>
              {content.serviceIntro.title}
            </h2>
            <p className="mt-4 text-ink-700">{content.serviceIntro.description}</p>
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            {content.services.map((service, index) => (
              <Reveal key={service.href + service.title} className="h-full">
                <article
                  className={`group relative flex h-full min-h-90 flex-col overflow-hidden rounded-[1.75rem] border p-7 sm:p-8 ${index === 0 ? 'border-brand-800 bg-brand-950 text-white' : 'border-border bg-white text-brand-950'}`}
                >
                  <div
                    aria-hidden="true"
                    className={`absolute -top-18 -left-18 size-52 rounded-full border ${index === 0 ? 'border-white/10' : 'border-brand-100'}`}
                  />
                  <div className="relative flex items-center justify-between">
                    <span
                      className={`grid size-14 place-items-center rounded-2xl ${index === 0 ? 'bg-white/10 text-accent-300' : 'bg-brand-50 text-brand-600'}`}
                    >
                      <TravelIcon
                        name={
                          service.href.includes('consultation')
                            ? 'calendar'
                            : service.href.includes('embassy')
                              ? 'globe'
                              : 'document'
                        }
                        className="size-7"
                      />
                    </span>
                    <span
                      dir="ltr"
                      className={`text-sm ${index === 0 ? 'text-white/50' : 'text-ink-500'}`}
                    >
                      {service.index}
                    </span>
                  </div>
                  <p
                    className={`mt-8 text-xs font-semibold ${index === 0 ? 'text-accent-300' : 'text-brand-600'}`}
                  >
                    {service.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-extrabold">{service.title}</h3>
                  <p
                    className={`mt-4 mb-8 text-sm leading-8 ${index === 0 ? 'text-white/75' : 'text-ink-700'}`}
                  >
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className={`mt-auto flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${index === 0 ? 'bg-accent-300 text-brand-950 hover:bg-accent-100' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}
                  >
                    {service.actionLabel}
                    <TravelIcon name="arrow" className="size-5 shrink-0" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="process-title"
        className="my-10 overflow-hidden bg-[#201035] py-20 text-white sm:py-26"
      >
        <Container className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-36">
            <span className="mb-5 block text-sm font-bold text-accent-300">
              {content.process.kicker}
            </span>
            <h2 id="process-title" className="text-3xl font-extrabold leading-[1.5] sm:text-4xl">
              {content.process.title}
            </h2>
            <p className="mt-5 text-base leading-9 text-white/70">{content.process.description}</p>
            <div aria-hidden="true" className="relative mt-10 hidden h-28 items-center lg:flex">
              <span className="w-2/3 rotate-[-12deg] border-t border-dashed border-white/30" />
              <TravelIcon name="plane" className="size-12 -rotate-12 text-accent-300" />
            </div>
          </div>
          <ol className="m-0 grid list-none gap-5 p-0">
            {content.process.steps.map((step) => (
              <li key={step.number}>
                <Reveal className="group flex gap-5 rounded-2xl border border-white/15 bg-white/5 p-6 transition-colors hover:bg-white/10 sm:p-7">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-accent-300/25 bg-accent-300/10 text-lg font-bold text-accent-300">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold leading-8">{step.title}</h3>
                    <p className="mt-2 text-sm leading-8 text-white/70">{step.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 sm:py-24" aria-labelledby="trust-title">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <span className={kicker}>{content.trust.kicker}</span>
            <h2 id="trust-title" className={sectionTitle}>
              {content.trust.title}
            </h2>
            <p className="mt-5 leading-9 text-ink-700">{content.trust.description}</p>
            <Link
              href={content.trust.actionHref}
              className="mt-7 inline-flex items-center gap-3 rounded-lg text-sm font-bold text-brand-700"
            >
              {content.trust.actionLabel}
              <TravelIcon name="arrow" className="size-5" />
            </Link>
          </Reveal>
          <Reveal className="relative rounded-[2rem] border border-brand-100 bg-linear-to-br from-white to-brand-50 p-6 sm:p-9">
            <div className="mb-6 flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-600 text-white">
                <TravelIcon name="shield" />
              </span>
              <div>
                <strong className="block text-base font-bold text-brand-950">
                  هر مرحله، یک اقدام روشن
                </strong>
                <span className="text-xs text-ink-500">نمونه نمایش روند پیگیری در حساب کاربری</span>
              </div>
            </div>
            {[
              {
                icon: 'document' as const,
                title: 'اطلاعات و مدارک درخواست',
                detail: 'فایل‌ها در کنار پرونده مرتبط',
                tone: 'bg-brand-50 text-brand-600',
              },
              {
                icon: 'shield' as const,
                title: 'بررسی و اعلام نتیجه',
                detail: 'وضعیت مدرک و توضیح کارشناس',
                tone: 'bg-success-soft text-success',
              },
              {
                icon: 'calendar' as const,
                title: 'قدم بعدی شما',
                detail: 'پیگیری درخواست و رزرو از یک حساب',
                tone: 'bg-accent-100 text-warning',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="mt-3 flex items-center gap-4 rounded-2xl border border-border bg-white p-4"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl ${item.tone}`}
                >
                  <TravelIcon name={item.icon} className="size-5" />
                </span>
                <div>
                  <strong className="block text-sm font-bold text-brand-950">{item.title}</strong>
                  <p className="mt-1 text-xs text-ink-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-accent-300/50 bg-[#fff4d7] p-8 sm:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -left-10 size-96 rounded-full border border-brand-600/10"
            />
            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <span className={kicker}>{content.consultation.kicker}</span>
                <h2 className={sectionTitle}>{content.consultation.title}</h2>
                <p className="mt-4 text-ink-700">{content.consultation.description}</p>
              </div>
              <Link
                href={content.consultation.actionHref}
                className={buttonVariants({
                  size: 'large',
                  className: 'shrink-0 gap-4 rounded-2xl',
                })}
              >
                {content.consultation.actionLabel}
                <TravelIcon name="arrow" className="size-5" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-18 sm:py-26" aria-labelledby="faq-title">
        <Container className="grid items-start gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-36">
            <span className={kicker}>{content.faqIntro.kicker}</span>
            <h2 id="faq-title" className={sectionTitle}>
              {content.faqIntro.title}
            </h2>
            <p className="mt-4 text-ink-700">{content.faqIntro.description}</p>
            <Link
              href="/faq"
              className="mt-6 inline-flex items-center gap-3 rounded-lg text-sm font-bold text-brand-700"
            >
              همه پرسش‌ها و پاسخ‌ها
              <TravelIcon name="arrow" className="size-5" />
            </Link>
          </div>
          <Reveal>
            {faqs.length ? (
              <FaqList items={faqs} />
            ) : (
              <Link
                href="/contact"
                className="block rounded-2xl border border-border bg-white p-7 text-brand-700"
              >
                سوالی دارید؟ با ما در تماس باشید ←
              </Link>
            )}
          </Reveal>
        </Container>
      </section>
    </>
  )
}
