import type { Metadata } from 'next'
import Link from 'next/link'

import { buttonVariants, Container } from '@/shared/ui'

import { FaqList, type FaqItem } from '../_components/faq-list'

export const metadata: Metadata = {
  title: 'سوالات متداول',
  description: 'پاسخ سوالات متداول درباره ویزا، وقت سفارت، مشاوره، مدارک و پرداخت در بلدتریپ.',
}

const faqGroups: Array<{ id: string; items: FaqItem[]; title: string }> = [
  {
    id: 'visa-services',
    title: 'ویزا و خدمات سفارت',
    items: [
      {
        question: 'آیا بلدتریپ صدور ویزا را تضمین می‌کند؟',
        answer:
          'خیر. نتیجه نهایی همیشه توسط سفارت یا مرجع رسمی مهاجرت تعیین می‌شود. ما اطلاعات و مسیر خدمت را شفاف ارائه می‌کنیم و از وعده تضمینی استفاده نمی‌کنیم.',
      },
      {
        question: 'برای چه مقصدهایی اطلاعات و خدمات ارائه می‌شود؟',
        answer:
          'مقصدهای اولیه کانادا و حوزه شینگن هستند. برای شینگن باید کشور مقصد اصلی خود را هنگام ثبت درخواست مشخص کنید.',
      },
      {
        question: 'خدمت وقت سفارت دقیقا شامل چه کاری است؟',
        answer:
          'پس از انتخاب کشور، اطلاعات و مدارک موردنیاز را ارسال می‌کنید. تیم پرونده درخواست را بررسی و مراحل هماهنگی وقت را انجام می‌دهد. این سامانه به‌صورت خودکار وارد وب‌سایت سفارت نمی‌شود.',
      },
    ],
  },
  {
    id: 'documents',
    title: 'مدارک و پرونده',
    items: [
      {
        question: 'مدارک را کجا بارگذاری می‌کنم؟',
        answer:
          'مدارک اولیه در مرحله مدارکِ فرم درخواست بارگذاری می‌شوند. مدارک تکمیلی یا نسخه اصلاحی را بعدا در صفحه جزئیات همان پرونده ارسال می‌کنید.',
      },
      {
        question: 'اگر یکی از مدارک من تایید نشود چه اتفاقی می‌افتد؟',
        answer:
          'دلیل نیاز به اصلاح در پرونده نمایش داده می‌شود. نسخه جدید را در همان بخش بارگذاری می‌کنید تا دوباره بررسی شود.',
      },
      {
        question: 'چطور وضعیت درخواست را پیگیری کنم؟',
        answer:
          'پس از ورود به حساب کاربری، درخواست‌های فعال، وضعیت فعلی و اقدام بعدی را در بخش پرونده‌های من می‌بینید.',
      },
    ],
  },
  {
    id: 'consultation-payment',
    title: 'مشاوره و پرداخت',
    items: [
      {
        question: 'رزرو مشاوره چگونه انجام می‌شود؟',
        answer:
          'موضوع و نوع جلسه را انتخاب می‌کنید، زمان‌های آزاد را می‌بینید و پس از انتخاب روز و ساعت، اطلاعات خود را تکمیل می‌کنید.',
      },
      {
        question: 'پرداخت هزینه خدمات چگونه است؟',
        answer:
          'پس از ثبت درخواست یا انتخاب زمان مشاوره، مبلغ و اطلاعات انتقال نمایش داده می‌شود. رسید را بارگذاری می‌کنید و وضعیت آن پس از بررسی مالی اعلام می‌شود.',
      },
      {
        question: 'آیا می‌توانم زمان مشاوره را تغییر دهم؟',
        answer:
          'امکان تغییر یا لغو بر اساس قوانین رزرو و بازه زمانی اعلام‌شده برای جلسه خواهد بود. جزئیات پیش از نهایی‌کردن رزرو نمایش داده می‌شود.',
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-50 py-20 text-center sm:py-24">
        <div className="pointer-events-none absolute -top-24 right-1/4 size-80 rounded-full bg-accent-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/4 size-80 rounded-full bg-brand-300/20 blur-3xl" />
        <Container size="reading" className="relative z-10">
          <span className="mb-3 inline-block text-sm font-extrabold text-brand-600">
            راهنمای بلدتریپ
          </span>
          <h1 className="m-0 text-[clamp(2.6rem,7vw,4.5rem)] leading-tight font-black tracking-[-0.055em] text-brand-950">
            سوالات متداول
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-ink-700 sm:text-lg">
            پاسخ کوتاه و مستقیم درباره خدمات، مدارک، مشاوره و نحوه پرداخت.
          </p>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <Container size="reading">
          {faqGroups.map((group, index) => (
            <section
              className={index === 0 ? '' : 'mt-16'}
              key={group.id}
              aria-labelledby={group.id}
            >
              <h2 id={group.id} className="mb-5 text-2xl font-black text-brand-950">
                {group.title}
              </h2>
              <FaqList items={group.items} />
            </section>
          ))}

          <div className="mt-16 flex flex-col items-start justify-between gap-7 rounded-card bg-brand-50 p-7 sm:p-9 lg:flex-row lg:items-center">
            <div>
              <h2 className="m-0 text-xl font-black text-brand-950">
                پاسخ سوالتان را پیدا نکردید؟
              </h2>
              <p className="mt-2 text-sm leading-7 text-ink-700">
                برای سوال عمومی با ما در تماس باشید یا برای بررسی شرایط خود مشاوره رزرو کنید.
              </p>
            </div>
            <div className="grid w-full shrink-0 gap-3 sm:flex sm:w-auto">
              <Link href="/contact" className={buttonVariants({ variant: 'secondary' })}>
                تماس با ما
              </Link>
              <Link href="/consultation/book" className={buttonVariants()}>
                رزرو مشاوره
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
