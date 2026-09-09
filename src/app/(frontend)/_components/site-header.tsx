'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { buttonVariants } from '@/shared/ui'

import { BrandMark } from './brand-mark'
import { TravelIcon } from './travel-icon'

const navigation = [
  {
    href: '/countries',
    label: 'کشورها و ویزاها',
    shortLabel: 'ویزاها',
  },
  {
    href: '/embassy-appointments',
    label: 'وقت سفارت',
    shortLabel: 'وقت سفارت',
  },
  {
    href: '/services',
    label: 'خدمات',
    shortLabel: 'خدمات',
  },
  {
    href: '/consultation',
    label: 'مشاوره',
    shortLabel: 'مشاوره',
  },
  {
    href: '/faq',
    label: 'سوالات متداول',
    shortLabel: 'سوالات',
  },
]

const persianNumbers = ['۰۱', '۰۲', '۰۳', '۰۴', '۰۵']

export function SiteHeader() {
  const pathname = usePathname()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const closeMenu = () => {
    if (dialogRef.current?.open) {
      dialogRef.current.close()
    }

    setMenuOpen(false)
  }

  const openMenu = () => {
    dialogRef.current?.showModal()
    setMenuOpen(true)
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24)

    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })

    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  useEffect(() => {
    closeMenu()
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    const desktopQuery = window.matchMedia('(min-width: 1024px)')

    document.body.style.overflow = 'hidden'

    const handleDesktop = () => {
      if (desktopQuery.matches) closeMenu()
    }

    desktopQuery.addEventListener('change', handleDesktop)

    return () => {
      document.body.style.overflow = previousOverflow
      desktopQuery.removeEventListener('change', handleDesktop)
    }
  }, [menuOpen])

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
        <div
          className={`mx-auto flex max-w-[78rem] items-center justify-between gap-4 border px-3 transition-all duration-300 sm:px-4 ${
            scrolled
              ? 'min-h-17 rounded-2xl border-white/80 bg-white/90 shadow-[0_18px_55px_rgb(36_19_63/14%)] backdrop-blur-2xl'
              : 'min-h-20 rounded-[1.6rem] border-brand-100/70 bg-white/75 shadow-[0_10px_35px_rgb(36_19_63/8%)] backdrop-blur-xl'
          }`}
        >
          <BrandMark compact={scrolled} />

          <nav
            aria-label="منوی اصلی"
            className="hidden items-center gap-1 rounded-2xl border border-brand-100/70 bg-brand-50/65 p-1.5 lg:flex"
          >
            {navigation.map((item) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all duration-300 xl:px-4 ${
                    active
                      ? 'bg-white text-brand-700 shadow-[0_6px_18px_rgb(36_19_63/9%)]'
                      : 'text-ink-700 hover:bg-white/75 hover:text-brand-700'
                  }`}
                >
                  {item.label}

                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute right-1/2 -bottom-1 h-1 w-5 translate-x-1/2 rounded-full bg-accent-500"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/account"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              <TravelIcon name="document" className="size-4" />
              حساب من
            </Link>

            <Link
              href="/consultation/book"
              className={buttonVariants({
                size: 'small',
                className:
                  'group gap-2 rounded-xl bg-linear-to-l from-brand-700 to-brand-500 shadow-[0_10px_25px_rgb(91_52_196/25%)]',
              })}
            >
              رزرو مشاوره
              <TravelIcon
                name="arrow"
                className="size-4 transition-transform group-hover:-translate-x-1"
              />
            </Link>
          </div>

          <button
            type="button"
            onClick={openMenu}
            aria-label="باز کردن منوی اصلی"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="grid size-12 shrink-0 place-items-center rounded-2xl border border-brand-100 bg-brand-50 text-brand-700 transition-all hover:border-brand-300 hover:bg-brand-100 active:scale-95 lg:hidden"
          >
            <TravelIcon name="menu" />
          </button>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        aria-labelledby="mobile-navigation-title"
        onClose={() => setMenuOpen(false)}
        onCancel={(event) => {
          event.preventDefault()
          closeMenu()
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-brand-950/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col overflow-hidden bg-[linear-gradient(145deg,#24133f_0%,#351967_55%,#5b34c4_100%)] p-5 text-white motion-safe:animate-page-enter sm:mr-auto sm:max-w-md sm:p-7">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <BrandMark inverse onNavigate={closeMenu} />

            <button
              type="button"
              onClick={closeMenu}
              aria-label="بستن منو"
              className="grid size-12 place-items-center rounded-full border border-white/15 bg-white/5 transition-colors hover:bg-white/10"
            >
              <TravelIcon name="close" />
            </button>
          </div>

          <div className="pt-7">
            <span className="text-xs font-bold text-accent-300">
              منوی دسترسی سریع
            </span>

            <h2
              id="mobile-navigation-title"
              className="mt-2 text-2xl font-black leading-10"
            >
              قدم بعدی مسیرتان را انتخاب کنید
            </h2>
          </div>

          <nav
            aria-label="منوی موبایل"
            className="my-6 flex-1 overflow-y-auto"
          >
            {navigation.map((item, index) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={active ? 'page' : undefined}
                  className={`group flex min-h-16 items-center gap-4 border-b border-white/10 py-3 text-lg font-bold transition-colors ${
                    active
                      ? 'text-accent-300'
                      : 'text-white hover:text-accent-200'
                  }`}
                >
                  <span className="text-xs font-normal text-white/35">
                    {persianNumbers[index]}
                  </span>

                  {item.label}

                  <TravelIcon
                    name="arrow"
                    className="mr-auto size-5 transition-transform group-hover:-translate-x-1"
                  />
                </Link>
              )
            })}
          </nav>

          <div className="grid gap-3 border-t border-white/10 pt-5">
            <Link
              href="/consultation/book"
              onClick={closeMenu}
              className="flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-accent-300 px-5 font-black text-brand-950 transition-transform active:scale-[0.98]"
            >
              رزرو مشاوره
              <TravelIcon name="arrow" className="size-5" />
            </Link>

            <Link
              href="/account"
              onClick={closeMenu}
              className="flex min-h-13 items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-5 font-bold transition-colors hover:bg-white/10"
            >
              ورود و پیگیری پرونده
            </Link>
          </div>
        </div>
      </dialog>
    </>
  )
}