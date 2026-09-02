import Image from 'next/image'
import Link from 'next/link'

import { buttonVariants, Container } from '@/shared/ui'

import { FaqList, type FaqItem } from './_components/faq-list'

const services = [
  {
    eyebrow: 'برای یک تصمیم دقیق',
    href: '/consultation',
    index: '01',
    title: 'مشاوره تخصصی',
    description:
      'زمان‌های آزاد را ببینید، موضوع جلسه را مشخص کنید و مشاوره خود را آنلاین رزرو کنید.',
    action: 'مشاهده زمان‌های مشاوره',
  },
  {
    eyebrow: 'برای شروع پرونده',
    href: '/services/visa',
    index: '02',
    title: 'خدمات ویزا',
    description:
      'شرایط مقصد را بخوانید، مدارک لازم را بشناسید و درخواست خود را مرحله‌به‌مرحله ثبت کنید.',
    action: 'بررسی خدمات ویزا',
  },
  {
    eyebrow: 'برای هماهنگی سفارت',
    href: '/embassy-appointments',
    index: '03',
    title: 'وقت سفارت',
    description:
      'کشور مقصد را انتخاب کنید، اطلاعات و مدارک را ارسال کنید و وضعیت درخواست را پیگیری کنید.',
    action: 'درخواست وقت سفارت',
  },
]

const steps = [
  {
    number: '۱',
    title: 'مقصد یا خدمت را انتخاب کنید',
    description: 'اطلاعات بازبینی‌شده و شرایط هر مسیر را قبل از شروع بخوانید.',
  },
  {
    number: '۲',
    title: 'فرم و مدارک را کامل کنید',
    description: 'فقط اطلاعات موردنیاز همان خدمت را در یک مسیر مرحله‌ای ارسال کنید.',
  },
  {
    number: '۳',
    title: 'هزینه را انتقال دهید',
    description: 'مبلغ و اطلاعات پرداخت را ببینید و تصویر رسید را در پرونده بارگذاری کنید.',
  },
  {
    number: '۴',
    title: 'وضعیت را پیگیری کنید',
    description: 'اقدام بعدی، درخواست اصلاح مدرک و تغییر وضعیت پرونده را یک‌جا ببینید.',
  },
]

const homepageFaqs: FaqItem[] = [
  {
    question: 'آیا بلدتریپ صدور ویزا را تضمین می‌کند؟',
    answer:
      'خیر. تصمیم نهایی همیشه با سفارت یا مرجع رسمی مهاجرت است. بلدتریپ اطلاعات، آماده‌سازی پرونده و خدمات درخواستی را با مسیر مشخص انجام می‌دهد و هیچ تضمین غیرواقعی ارائه نمی‌کند.',
  },
  {
    question: 'در نسخه فعلی برای چه مقصدهایی خدمات ارائه می‌شود؟',
    answer:
      'محتوای اولیه سایت برای کانادا و حوزه شینگن طراحی شده است. در خدمات شینگن، کشور مقصد اصلی باید هنگام ثبت درخواست مشخص شود.',
  },
  {
    question: 'مدارک را در کدام بخش بارگذاری می‌کنم؟',
    answer:
      'مدارک اولیه داخل فرم مرحله‌ای همان درخواست ارسال می‌شوند. اگر بعدا اصلاح یا مدرک دیگری لازم باشد، آن را در صفحه جزئیات پرونده خود بارگذاری می‌کنید.',
  },
  {
    question: 'پرداخت هزینه خدمات چگونه انجام می‌شود؟',
    answer:
      'پس از ثبت درخواست یا رزرو، مبلغ و اطلاعات انتقال نمایش داده می‌شود. رسید پرداخت را بارگذاری می‌کنید و پس از بررسی مالی، وضعیت آن در حساب کاربری اعلام می‌شود.',
  },
  {
    question: 'چطور برای مشاوره وقت رزرو کنم؟',
    answer:
      'موضوع مشاوره را انتخاب می‌کنید، زمان‌های آزاد را می‌بینید و پس از انتخاب روز و ساعت، اطلاعات خود را تکمیل می‌کنید.',
  },
]

const sectionTitle =
  'm-0 text-[clamp(2rem,4vw,2.75rem)] leading-[1.35] font-black tracking-[-0.035em] text-brand-950'
const sectionKicker = 'mb-3 inline-block text-sm font-extrabold text-brand-600'

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-brand-50 to-canvas py-14 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -top-20 -right-28 size-96 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-24 size-80 rounded-full bg-accent-300/25 blur-3xl" />

        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="py-4">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand-700">
              <span className="h-2 w-8 rounded-full bg-accent-500" aria-hidden="true" />
              مسیر روشن خدمات ویزا
            </div>
            <h1 className="m-0 max-w-2xl text-[clamp(2.65rem,5.6vw,4.55rem)] leading-[1.24] font-black tracking-[-0.06em] text-brand-950">
              برای ویزا و وقت سفارت،
              <span className="relative text-brand-600 after:absolute after:inset-x-0 after:bottom-1 after:-z-10 after:h-3 after:rounded-full after:bg-accent-100">
                {' '}سردرگم شروع نکنید.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-9 text-ink-700 sm:text-lg">
              شرایط کانادا و شینگن را بررسی کنید، خدمت مناسب را انتخاب کنید و ادامه مسیر را
              مرحله‌به‌مرحله در حساب خود پیگیری کنید.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/visas" className={buttonVariants({ size: 'large' })}>
                مشاهده ویزاها <span aria-hidden="true">←</span>
              </Link>
              <Link
                href="/consultation/book"
                className={buttonVariants({ size: 'large', variant: 'secondary' })}
              >
                رزرو مشاوره
              </Link>
            </div>
            <ul className="mt-7 grid list-none gap-2 p-0 text-sm font-bold text-ink-700 sm:flex sm:flex-wrap sm:gap-5">
              {['اطلاعات بازبینی‌شده', 'ارسال خصوصی مدارک', 'پیگیری شفاف پرونده'].map(
                (item) => (
                  <li className="inline-flex items-center gap-2" key={item}>
                    <span className="grid size-5 place-items-center rounded-full bg-success-soft text-xs text-success" aria-hidden="true">
                      ✓
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-2xl px-1 pb-8 sm:px-6">
            <div className="relative grid min-h-[23rem] place-items-center overflow-hidden rounded-[2rem_2rem_2rem_0.75rem] border border-white/60 bg-linear-to-br from-[#e8ddff] via-[#7250cf] to-brand-800 shadow-raised sm:min-h-[30rem] lg:min-h-[32rem]">
              <div className="pointer-events-none absolute inset-5 rounded-3xl border border-white/20" />
              <div className="pointer-events-none absolute top-0 left-0 size-56 rounded-full bg-accent-300/30 blur-3xl" />
              <Image
                src="/assets/boldtrip-hero.webp"
                alt="چمدان، گذرنامه و مسیر سفر در رنگ‌های بنفش و طلایی"
                width={1536}
                height={1024}
                priority
                className="relative z-10 w-[125%] max-w-none translate-y-2 drop-shadow-2xl sm:w-[116%]"
              />
            </div>

            <div className="absolute top-0 left-0 z-20 flex min-w-40 items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_18px_35px_rgba(36,19,63,0.16)] backdrop-blur-xl">
              <span className="grid size-10 place-items-center rounded-xl bg-canada-soft text-xl" aria-hidden="true">
                🇨🇦
              </span>
              <span className="flex flex-col leading-5">
                <small className="text-[0.68rem] text-ink-500">مقصد منتخب</small>
                <strong className="text-sm text-brand-950">کانادا</strong>
              </span>
            </div>

            <div className="absolute right-0 bottom-0 z-20 flex min-w-44 items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_18px_35px_rgba(36,19,63,0.16)] backdrop-blur-xl">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-100" aria-hidden="true">
                <i className="size-5 rounded-full border-[3px] border-brand-300 border-r-brand-700 not-italic" />
              </span>
              <span className="flex flex-col leading-5">
                <small className="text-[0.68rem] text-ink-500">مسیر پرونده</small>
                <strong className="text-sm text-brand-950">مرحله‌به‌مرحله</strong>
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24 lg:py-28" aria-labelledby="destination-title">
        <Container>
          <div className="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className={sectionKicker}>مقصدهای شروع</span>
              <h2 id="destination-title" className={sectionTitle}>
                شرایط مقصد را قبل از اقدام بشناسید
              </h2>
            </div>
            <p className="m-0 max-w-lg text-base leading-8 text-ink-700">
              توضیحات هر مقصد، مدارک پایه، مراحل اقدام و خدمات مرتبط را در یک صفحه ببینید.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Link
              href="/visas/canada"
              className="group relative flex min-h-88 items-end overflow-hidden rounded-panel border border-[#ffd9de] bg-linear-to-br from-white via-white to-canada-soft p-7 text-canada transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(214,39,60,0.13)] sm:p-9"
            >
              <div className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full border border-current opacity-10" />
              <span className="absolute top-7 left-7 grid size-22 place-items-center rounded-[1.5rem_1.5rem_1.5rem_0.6rem] border border-white/80 bg-white/75 text-4xl shadow-card sm:size-26 sm:text-5xl" aria-hidden="true">
                🇨🇦
              </span>
              <div className="relative z-10 max-w-sm">
                <span className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold">
                  ویزای کانادا
                </span>
                <h3 className="m-0 text-4xl font-black tracking-[-0.05em] text-ink-950 sm:text-5xl">
                  کانادا
                </h3>
                <p className="mt-3 text-sm leading-8 text-ink-700">
                  شرایط، مدارک و مسیر درخواست انواع خدمات ویزای کانادا.
                </p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold">
                  مشاهده اطلاعات کانادا
                  <i className="not-italic transition-transform group-hover:-translate-x-1" aria-hidden="true">←</i>
                </span>
              </div>
            </Link>

            <Link
              href="/visas/schengen"
              className="group relative flex min-h-88 items-end overflow-hidden rounded-panel border border-[#d9e4ff] bg-linear-to-br from-white via-white to-europe-soft p-7 text-europe transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(20,62,159,0.13)] sm:p-9"
            >
              <div className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full border border-current opacity-10" />
              <span className="absolute top-7 left-7 grid size-22 place-items-center rounded-[1.5rem_1.5rem_1.5rem_0.6rem] border border-white/80 bg-white/75 text-4xl shadow-[inset_0_-0.35rem_0_#f6c744,0_16px_35px_rgba(20,62,159,0.09)] sm:size-26 sm:text-5xl" aria-hidden="true">
                🇪🇺
              </span>
              <div className="relative z-10 max-w-sm">
                <span className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold">
                  ویزای کوتاه‌مدت اروپا
                </span>
                <h3 className="m-0 text-4xl font-black tracking-[-0.05em] text-ink-950 sm:text-5xl">
                  حوزه شینگن
                </h3>
                <p className="mt-3 text-sm leading-8 text-ink-700">
                  آشنایی با مسیر شینگن و انتخاب کشور مقصد اصلی برای درخواست.
                </p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold">
                  مشاهده اطلاعات شینگن
                  <i className="not-italic transition-transform group-hover:-translate-x-1" aria-hidden="true">←</i>
                </span>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-canvas py-20 sm:py-24 lg:py-28" aria-labelledby="services-title">
        <div className="pointer-events-none absolute top-0 right-0 size-80 rounded-full bg-brand-100/50 blur-3xl" />
        <Container className="relative z-10">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className={sectionKicker}>چه کاری برای شما انجام می‌دهیم؟</span>
            <h2 id="services-title" className={sectionTitle}>از اطلاعات اولیه تا اقدام واقعی</h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-8 text-ink-700">
              هر خدمت، مسیر مشخص خودش را دارد؛ بدون فرم‌های پراکنده و پیگیری نامعلوم.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {services.map((service) => (
              <article
                className="group relative flex min-h-80 flex-col overflow-hidden rounded-card border border-border bg-white p-7 shadow-[0_12px_35px_rgba(36,19,63,0.04)] transition hover:-translate-y-1 hover:border-brand-100 hover:shadow-card lg:min-h-92"
                key={service.title}
              >
                <div className="absolute -top-14 -right-8 size-32 rounded-full bg-brand-50" />
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <span className="text-xs font-extrabold text-brand-600">{service.eyebrow}</span>
                  <i className="text-4xl leading-none font-black tracking-[-0.08em] text-brand-100 not-italic" dir="ltr">
                    {service.index}
                  </i>
                </div>
                <h3 className="mt-14 text-2xl font-black tracking-[-0.025em] text-brand-950">
                  {service.title}
                </h3>
                <p className="mt-3 text-[0.94rem] leading-8 text-ink-700">{service.description}</p>
                <Link
                  href={service.href}
                  className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-extrabold text-brand-700"
                >
                  {service.action}
                  <span className="transition-transform group-hover:-translate-x-1" aria-hidden="true">←</span>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-brand-950 py-20 text-white sm:py-24 lg:py-28" aria-labelledby="process-title">
        <div className="pointer-events-none absolute -top-20 right-0 size-80 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-0 size-96 rounded-full bg-brand-300/15 blur-3xl" />
        <Container className="relative z-10">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="mb-3 inline-block text-sm font-extrabold text-accent-300">روند کار</span>
              <h2 id="process-title" className="m-0 max-w-2xl text-[clamp(2rem,4vw,2.75rem)] leading-[1.35] font-black tracking-[-0.035em] text-white">
                بدانید الان کجای مسیر هستید
              </h2>
            </div>
            <p className="m-0 max-w-lg text-base leading-8 text-white/60">
              از اولین بررسی تا پایان خدمت، وضعیت پرونده و اقدام بعدی برای شما مشخص می‌ماند.
            </p>
          </div>

          <ol className="grid list-none overflow-hidden rounded-panel border border-white/10 bg-white/10 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li className="min-h-64 border-b border-white/10 bg-brand-900/90 p-6 last:border-b-0 sm:min-h-72 sm:border-l sm:[&:nth-child(2)]:border-l-0 lg:border-b-0 lg:[&:nth-child(2)]:border-l lg:last:border-l-0" key={step.number}>
                <span className="grid size-12 place-items-center rounded-[1rem_1rem_1rem_0.3rem] border border-white/15 bg-white/5 font-black text-accent-300">
                  {step.number}
                </span>
                <h3 className="mt-10 text-lg leading-7 font-extrabold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-8 text-white/55">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24 lg:py-28" aria-labelledby="trust-title">
        <Container className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <span className={sectionKicker}>اطلاعات حساس، مسیر مسئولانه</span>
            <h2 id="trust-title" className={sectionTitle}>
              قبل از ارسال مدرک، دلیل نیاز به آن را می‌بینید
            </h2>
            <p className="mt-5 max-w-xl text-base leading-9 text-ink-700">
              گذرنامه و مدارک مالی فایل عادی نیستند. در هر درخواست، فهرست مدارک همان خدمت
              نمایش داده می‌شود و فایل‌های اصلاحی نیز داخل همان پرونده باقی می‌مانند.
            </p>
            <Link href="/privacy" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-brand-700">
              سیاست حریم خصوصی و مدارک <span aria-hidden="true">←</span>
            </Link>
          </div>

          <div className="relative rounded-panel border border-border bg-canvas p-4 shadow-raised before:absolute before:-bottom-6 before:-right-6 before:-z-10 before:size-32 before:rounded-full before:bg-accent-100">
            <div className="flex items-center gap-3 border-b border-border px-1 pb-4">
              <span className="grid size-11 place-items-center rounded-xl bg-brand-600 text-xs font-black text-white" dir="ltr" aria-hidden="true">BT</span>
              <div className="flex flex-1 flex-col leading-5">
                <small className="text-xs text-ink-500">درخواست وقت سفارت</small>
                <strong className="text-sm text-ink-950">فهرست مدارک شما</strong>
              </div>
              <i className="rounded-full bg-brand-100 px-3 py-1 text-xs font-extrabold text-brand-700 not-italic">۳ از ۴</i>
            </div>
            <ul className="mt-4 grid list-none gap-3 p-0">
              {[
                ['✓', 'اسکن صفحه اول گذرنامه', 'بارگذاری شده', true],
                ['✓', 'عکس پرسنلی', 'بارگذاری شده', true],
                ['✓', 'فرم اطلاعات متقاضی', 'تکمیل شده', true],
                ['↑', 'مدرک تکمیلی', 'نیاز به اقدام شما', false],
              ].map(([icon, title, status, complete]) => (
                <li className="flex items-center gap-3 rounded-xl border border-border bg-white p-3" key={String(title)}>
                  <span
                    className={
                      complete
                        ? 'grid size-9 shrink-0 place-items-center rounded-lg bg-success-soft font-black text-success'
                        : 'grid size-9 shrink-0 place-items-center rounded-lg bg-warning-soft font-black text-warning'
                    }
                    aria-hidden="true"
                  >
                    {String(icon)}
                  </span>
                  <span className="flex flex-col leading-6">
                    <strong className="text-sm text-ink-950">{String(title)}</strong>
                    <small className="text-xs text-ink-500">{String(status)}</small>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-white pb-8">
        <Container>
          <div className="relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-panel bg-linear-to-br from-accent-100 via-[#fff7de] to-brand-100 p-8 sm:p-12 lg:min-h-72 lg:flex-row lg:items-center">
            <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full border border-brand-600/10" />
            <div className="relative z-10 max-w-2xl">
              <span className={sectionKicker}>اگر هنوز مطمئن نیستید</span>
              <h2 className={sectionTitle}>قبل از شروع پرونده، مسیر مناسب را مشخص کنید.</h2>
              <p className="mt-3 text-base leading-8 text-ink-700">
                موضوع جلسه را انتخاب کنید و یکی از زمان‌های آزاد مشاوره را رزرو کنید.
              </p>
            </div>
            <Link
              href="/consultation/book"
              className={buttonVariants({
                className: 'relative z-10 w-full shrink-0 sm:w-auto',
                size: 'large',
              })}
            >
              مشاهده زمان‌های آزاد <span aria-hidden="true">←</span>
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-20 sm:py-24 lg:py-28" aria-labelledby="faq-title">
        <Container className="grid items-start gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <span className={sectionKicker}>پاسخ‌های کوتاه و روشن</span>
            <h2 id="faq-title" className={sectionTitle}>سوالات متداول</h2>
            <p className="mt-3 text-base leading-8 text-ink-700">
              پیش از ثبت درخواست، پاسخ مهم‌ترین سوال‌ها را اینجا بخوانید.
            </p>
            <Link href="/faq" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-brand-700">
              مشاهده همه سوالات <span aria-hidden="true">←</span>
            </Link>
          </div>
          <FaqList items={homepageFaqs} />
        </Container>
      </section>
    </>
  )
}
