import Link from 'next/link'

import { Container } from '@/shared/ui'

import { BrandMark } from './brand-mark'

const footerGroups = [
  {
    title: 'مسیرهای اصلی',
    links: [
      { href: '/countries', label: 'کشورها و ویزاها' },
      { href: '/embassy-appointments', label: 'وقت سفارت' },
      { href: '/consultation', label: 'رزرو مشاوره' },
      { href: '/services', label: 'همه خدمات' },
    ],
  },
  {
    title: 'راهنما',
    links: [
      { href: '/faq', label: 'سوالات متداول' },
      { href: '/articles', label: 'مقالات ویزا' },
      { href: '/about', label: 'درباره بولدتریپ' },
      { href: '/contact', label: 'تماس با ما' },
    ],
  },
  {
    title: 'حساب کاربری',
    links: [
      { href: '/sign-in', label: 'ورود به حساب' },
      { href: '/account/requests', label: 'پیگیری درخواست' },
      { href: '/account/bookings', label: 'رزروهای من' },
      { href: '/account/documents', label: 'مدارک من' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#170b28] pt-16 pb-8 text-white before:absolute before:-bottom-64 before:-left-32 before:size-128 before:rounded-full before:border before:border-white/5">
      <Container className="relative z-10">
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-white/15 pb-10 sm:flex-row sm:items-end">
          <p className="max-w-xl text-2xl font-extrabold leading-relaxed text-white sm:text-3xl">
            یک تصمیم روشن،
            <br />
            <span className="text-accent-300">شروع یک مسیر تازه.</span>
          </p>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center gap-6 self-start rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:self-auto"
          >
            با ما در تماس باشید <span aria-hidden="true">↖</span>
          </Link>
        </div>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,0.7fr)] lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandMark inverse />
            <p className="mt-5 max-w-sm text-sm leading-8 text-white/60">
              اطلاعات ویزا، رزرو مشاوره و درخواست خدمات سفارت؛ در یک مسیر مشخص و قابل پیگیری.
            </p>
            <Link
              href="/consultation/book"
              className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-accent-300 hover:text-white"
            >
              برای شروع، مشاوره رزرو کنید <span aria-hidden="true">←</span>
            </Link>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 text-sm font-extrabold text-white">{group.title}</h2>
              <ul className="grid list-none gap-2 p-0">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="m-0 text-xs leading-7 text-white/65">
            بولدتریپ نتیجه صدور ویزا یا تصمیم سفارت را تضمین نمی‌کند؛ هدف ما ارائه اطلاعات روشن و
            اجرای دقیق خدمات درخواستی است.
          </p>
        </div>

        <div
          className="mt-6 flex flex-col-reverse items-start justify-between gap-4 text-xs text-white/60 sm:flex-row sm:items-center"
          dir="ltr"
        >
          <span>© {new Date().getFullYear()} BoldTrip</span>
          <div className="flex flex-wrap gap-5" dir="rtl">
            <Link href="/privacy" className="hover:text-white">
              حریم خصوصی
            </Link>
            <Link href="/terms" className="hover:text-white">
              شرایط استفاده
            </Link>
            <Link href="/cancellation-policy" className="hover:text-white">
              قوانین لغو
            </Link>
          </div>
        </div>
        <div
          aria-hidden="true"
          dir="ltr"
          className="pointer-events-none mt-10 overflow-hidden border-t border-white/10 pt-6 text-center text-[clamp(3rem,13vw,10rem)] leading-none font-black tracking-tight text-white/[0.06]"
        >
          BOLDTRIP.
        </div>
      </Container>
    </footer>
  )
}
