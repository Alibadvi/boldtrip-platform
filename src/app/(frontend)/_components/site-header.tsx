'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { buttonVariants } from '@/shared/ui'

import { BrandMark } from './brand-mark'
import { TravelIcon } from './travel-icon'

const navigation = [
  { href: '/countries', label: 'کشورها و ویزاها' },
  { href: '/embassy-appointments', label: 'وقت سفارت' },
  { href: '/services', label: 'خدمات' },
  { href: '/consultation', label: 'مشاوره' },
  { href: '/faq', label: 'سوالات متداول' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const dialog = useRef<HTMLDialogElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => {
    dialog.current?.close()
    setMenuOpen(false)
  }

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => {
      if (desktop.matches) {
        dialog.current?.close()
        setMenuOpen(false)
      }
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.body.style.overflow = previous
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [menuOpen])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 pb-2 sm:px-5">
      <div className="mx-auto flex min-h-22 max-w-7xl items-center justify-between gap-5 rounded-[1.6rem] border border-white/90 bg-white/95 px-4 py-2 shadow-[0_8px_40px_#24133f0d] backdrop-blur-xl sm:px-5">
        <BrandMark />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="منوی اصلی">
          {navigation.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${isActive(item.href) ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-brand-50 hover:text-brand-700'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/account"
            className="rounded-lg text-sm font-bold text-ink-700 hover:text-brand-700"
          >
            حساب و پیگیری
          </Link>
          <Link
            href="/consultation/book"
            className={buttonVariants({ size: 'small', className: 'gap-2 rounded-xl' })}
          >
            رزرو مشاوره <TravelIcon name="arrow" className="size-4" />
          </Link>
        </div>
        <button
          type="button"
          aria-label="باز کردن منو"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => {
            dialog.current?.showModal()
            setMenuOpen(true)
          }}
          className="grid size-12 shrink-0 place-items-center rounded-2xl border border-border bg-brand-50 text-brand-700 lg:hidden"
        >
          <TravelIcon name="menu" />
        </button>
      </div>

      <dialog
        ref={dialog}
        id="mobile-menu"
        aria-labelledby="mobile-menu-title"
        onClose={() => setMenuOpen(false)}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-brand-950 p-5 text-white open:flex open:flex-col backdrop:bg-brand-950/70 motion-safe:open:animate-page-enter sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <BrandMark inverse onNavigate={closeMenu} />
          <button
            type="button"
            onClick={closeMenu}
            aria-label="بستن منو"
            className="grid size-12 place-items-center rounded-full border border-white/20"
          >
            <TravelIcon name="close" />
          </button>
        </div>
        <h2 id="mobile-menu-title" className="mt-10 text-sm font-medium text-accent-300">
          قدم بعدی شما کجاست؟
        </h2>
        <nav aria-label="منوی موبایل" className="my-4 overflow-y-auto">
          {navigation.map((item, index) => (
            <Link
              href={item.href}
              key={item.href}
              onClick={closeMenu}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`flex min-h-18 items-center gap-5 border-b border-white/10 py-4 text-xl font-bold ${isActive(item.href) ? 'text-accent-300' : 'text-white'}`}
            >
              <span className="text-xs font-normal text-white/40">
                {new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2 }).format(index + 1)}
              </span>
              {item.label}
              <TravelIcon name="arrow" className="ms-auto size-5" />
            </Link>
          ))}
        </nav>
        <div className="mt-auto grid gap-3 pt-6">
          <Link
            href="/consultation/book"
            onClick={closeMenu}
            className="flex min-h-13 items-center justify-center rounded-xl bg-accent-300 px-5 font-bold text-brand-950"
          >
            رزرو مشاوره
          </Link>
          <Link
            href="/account"
            onClick={closeMenu}
            className="flex min-h-13 items-center justify-center rounded-xl border border-white/25 px-5 font-semibold"
          >
            ورود و پیگیری پرونده
          </Link>
        </div>
      </dialog>
    </header>
  )
}
