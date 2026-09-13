import Image from 'next/image'
import Link from 'next/link'

import type { HomepageContent } from '@/modules/content/domain/homepage-content'
import { buttonVariants, Container } from '@/shared/ui'

import { TravelIcon } from './travel-icon'

type HomeHeroProps = {
  content: HomepageContent['hero']
}

const quickActions = [
  {
    href: '/countries',
    icon: 'globe' as const,
    title: 'بررسی مقصدها',
    description: 'شرایط و مسیرهای ویزا',
    number: '۰۱',
  },
  {
    href: '/consultation/book',
    icon: 'calendar' as const,
    title: 'رزرو مشاوره',
    description: 'انتخاب روز و ساعت مناسب',
    number: '۰۲',
  },
  {
    href: '/account',
    icon: 'document' as const,
    title: 'پیگیری پرونده',
    description: 'مشاهده وضعیت و مدارک',
    number: '۰۳',
  },
]

export function HomeHero({ content }: HomeHeroProps) {
  return (
    <section
      aria-labelledby="homepage-hero-title"
      className="relative isolate -mt-24 overflow-hidden bg-brand-950 pt-28 text-white sm:pt-36 lg:min-h-[900px] lg:pt-44"
    >
      {/* Main background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 bg-[linear-gradient(135deg,#140728_0%,#28104f_42%,#4b249e_100%)]"
      />

      {/* Purple spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 -z-20 size-[38rem] rounded-full bg-brand-500/30 blur-[110px]"
      />

      {/* Golden horizon light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-44 -left-32 -z-20 size-[35rem] rounded-full bg-accent-300/20 blur-[120px]"
      />

      {/* Subtle center light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] left-[38%] -z-20 size-[30rem] rounded-full bg-white/6 blur-[100px]"
      />

      {/* Grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
      />

      {/* Background typography */}
      <span
        aria-hidden="true"
        dir="ltr"
        className="pointer-events-none absolute top-[20%] left-1/2 -z-10 hidden -translate-x-1/2 text-[12vw] font-black tracking-[-0.08em] whitespace-nowrap text-white/[0.025] select-none lg:block"
      >
        BOLDTRIP
      </span>

      <Container className="relative grid items-center gap-1 pb-10 sm:gap-4 sm:pb-16 lg:min-h-[610px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-4 lg:pb-10">
        {/* Hero content */}
        <div className="relative z-20 order-2 -mt-3 max-w-3xl motion-safe:animate-page-enter sm:mt-0 lg:order-1">
          <h1
            id="homepage-hero-title"
            className="text-[clamp(2.3rem,11vw,5.6rem)] font-black leading-[1.3] tracking-[-0.04em] text-white"
          >
            <span className="block">
              {content.title}
            </span>

            <span className="mt-1 block bg-linear-to-l from-accent-200 via-accent-300 to-accent-500 bg-clip-text text-transparent">
              {content.accent}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-8 text-white/68 sm:mt-7 sm:text-lg sm:leading-10">
            {content.description}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link
              href={content.primaryActionHref}
              className={buttonVariants({
                size: 'large',
                className:
                  'group rounded-full bg-accent-300 px-7 font-black text-brand-950 shadow-[0_18px_45px_rgb(255_196_61/20%)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:bg-accent-200 hover:shadow-[0_22px_55px_rgb(255_196_61/28%)]',
              })}
            >
              {content.primaryActionLabel}

              <TravelIcon
                name="arrow"
                className="size-5 transition-transform duration-300 group-hover:-translate-x-1.5"
              />
            </Link>

            <Link
              href={content.secondaryActionHref}
              className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-white/9 px-7 text-sm font-black text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/10%)] backdrop-blur-xl transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-[inset_0_0_0_1px_rgb(255_255_255/18%)] sm:text-base"
            >
              <TravelIcon
                name="calendar"
                className="size-5 text-accent-300 transition-transform duration-300 group-hover:rotate-6"
              />

              {content.secondaryActionLabel}
            </Link>
          </div>

          {content.highlights.length > 0 && (
            <div className="mt-8 hidden max-w-2xl gap-3 border-y border-white/10 py-5 sm:grid sm:grid-cols-3 sm:gap-5">
              {content.highlights.slice(0, 3).map((highlight) => (
                <div
                  key={highlight.label}
                  className="flex items-center gap-3 text-sm font-bold text-white/70"
                >
                  <span className="relative grid size-5 shrink-0 place-items-center">
                    <span className="absolute size-2 rounded-full bg-accent-300 shadow-[0_0_16px_rgb(255_215_111/70%)]" />
                    <span className="absolute size-4 rounded-full border border-accent-300/25" />
                  </span>

                  {highlight.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hero artwork */}
        <div className="relative order-1 mx-auto h-[300px] w-full max-w-[28rem] sm:h-[460px] sm:max-w-[620px] lg:order-2 lg:h-[650px] lg:max-w-none">
          {/* Artwork spotlight */}
          <div
            aria-hidden="true"
            className="absolute top-[13%] left-1/2 h-[65%] w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(145_108_240/35%)_0%,rgb(117_73_229/14%)_42%,transparent_72%)] blur-2xl"
          />

          {/* Outer orbit */}
          <div
            aria-hidden="true"
            className="absolute top-[11%] left-1/2 h-[76%] w-[76%] -translate-x-1/2 rounded-full border border-white/8"
          />

          {/* Animated dashed orbit */}
          <div
            aria-hidden="true"
            className="absolute top-[18%] left-1/2 h-[62%] w-[62%] -translate-x-1/2 rounded-full border border-dashed border-accent-300/18 motion-safe:animate-orbit"
          />

          {/* Route */}
          <svg
            aria-hidden="true"
            viewBox="0 0 700 600"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
          >
            <path
              d="M92 450C185 380 142 190 300 160C447 132 502 286 623 196"
              stroke="url(#hero-route-gradient)"
              strokeWidth="2"
              strokeDasharray="5 12"
              strokeLinecap="round"
            />

            <circle
              cx="92"
              cy="450"
              r="5"
              fill="#FFD76F"
            />

            <circle
              cx="623"
              cy="196"
              r="5"
              fill="#FFFFFF"
            />

            <defs>
              <linearGradient
                id="hero-route-gradient"
                x1="92"
                y1="450"
                x2="623"
                y2="196"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFD76F" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Main artwork entrance */}
          <div className="absolute inset-0 motion-safe:animate-plane-arrive">
            {/* Separate wrapper prevents entrance and floating transforms conflicting */}
            <div className="relative h-full w-full motion-safe:animate-float-soft">
              <Image
                src="/assets/boldtrip-hero-v2.png"
                alt="سفر و خدمات ویزای بولدتریپ"
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-contain object-center drop-shadow-[0_38px_48px_rgb(7_2_17/45%)]"
              />
            </div>
          </div>

          {/* Ground reflection */}
          <div
            aria-hidden="true"
            className="absolute right-[12%] bottom-[5%] left-[12%] h-10 rounded-[50%] bg-brand-400/25 blur-2xl"
          />
        </div>
      </Container>

      {/* Integrated quick actions */}
      <Container className="relative z-20 pb-8 sm:pb-10">
        <div className="grid grid-cols-3 border-y border-white/12">
          {quickActions.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex min-h-24 flex-col items-center justify-center gap-2 px-1 py-4 text-center transition-colors duration-300 hover:bg-white/5 sm:px-3 md:flex-row md:justify-start md:gap-4 md:px-5 md:py-5 md:text-right ${
                index < quickActions.length - 1
                  ? 'border-l border-white/10'
                  : ''
              }`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/8 text-accent-300 transition-[transform,background-color] duration-300 group-hover:-translate-y-1 group-hover:bg-white/13 md:size-12 md:rounded-2xl">
                <TravelIcon
                  name={item.icon}
                  className="size-5 md:size-6"
                />
              </span>

              <span className="min-w-0">
                <span className="block text-xs leading-5 font-black text-white sm:text-sm">
                  {item.title}
                </span>

                <span className="mt-1 hidden text-xs text-white/48 md:block">
                  {item.description}
                </span>
              </span>

              <span
                dir="ltr"
                className="mr-auto hidden text-xs font-bold tracking-[0.18em] text-white/25 transition-colors duration-300 group-hover:text-accent-300 md:block"
              >
                {item.number}
              </span>

              <TravelIcon
                name="arrow"
                className="hidden size-5 shrink-0 text-white/35 transition-[transform,color] duration-300 group-hover:-translate-x-1 group-hover:text-accent-300 md:block"
              />
            </Link>
          ))}
        </div>
      </Container>

      {/* Transition into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#1b0b35] to-transparent"
      />
    </section>
  )
}