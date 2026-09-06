import Link from 'next/link'

import { buttonVariants } from '@/shared/ui'

import { BrandMark } from './brand-mark'

const navigation = [
  { href: '/countries', label: 'کشورها و ویزاها' },
  { href: '/embassy-appointments', label: 'وقت سفارت' },
  { href: '/services', label: 'خدمات' },
  { href: '/consultation', label: 'مشاوره' },
  { href: '/faq', label: 'سوالات متداول' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-19 w-full max-w-[75rem] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <BrandMark />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="منوی اصلی">
          {navigation.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className="relative text-sm font-bold text-ink-700 transition-colors after:absolute after:-bottom-3 after:right-1/2 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-600 after:transition-all hover:text-brand-700 hover:after:right-0 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/account"
            className="text-sm font-bold text-ink-700 hover:text-brand-700"
          >
            ورود و پیگیری
          </Link>
          <Link href="/consultation/book" className={buttonVariants({ size: 'small' })}>
            رزرو مشاوره
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-xl border border-border bg-white text-2xl font-light text-brand-950 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden" aria-hidden="true">
              ☰
            </span>
            <span className="hidden group-open:block" aria-hidden="true">
              ×
            </span>
            <span className="sr-only">باز کردن منوی اصلی</span>
          </summary>
          <div className="fixed inset-x-0 top-[4.7rem] border-b border-border bg-white p-4 shadow-card">
            <nav className="grid" aria-label="منوی موبایل">
              {navigation.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  className="flex min-h-13 items-center justify-between border-b border-border text-base font-bold text-ink-800"
                >
                  {item.label}
                  <span aria-hidden="true">←</span>
                </Link>
              ))}
            </nav>
            <div className="mt-5 grid gap-3">
              <Link href="/consultation/book" className={buttonVariants({ fullWidth: true })}>
                رزرو مشاوره
              </Link>
              <Link
                href="/account"
                className={buttonVariants({ fullWidth: true, variant: 'secondary' })}
              >
                ورود و پیگیری پرونده
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  )
}
