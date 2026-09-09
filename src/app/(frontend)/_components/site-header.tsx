'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'motion/react'

import { buttonVariants } from '@/shared/ui'

import { BrandMark } from './brand-mark'
import { TravelIcon } from './travel-icon'

const navigation = [
  {
    href: '/countries',
    label: 'کشورها و ویزاها',
  },
  {
    href: '/embassy-appointments',
    label: 'وقت سفارت',
  },
  {
    href: '/services',
    label: 'خدمات',
  },
  {
    href: '/consultation',
    label: 'مشاوره',
  },
  {
    href: '/faq',
    label: 'سوالات متداول',
  },
]

const persianNumbers = ['۰۱', '۰۲', '۰۳', '۰۴', '۰۵']

const menuContentVariants: Variants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.12,
      when: 'afterChildren',
      staggerChildren: 0.025,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.2,
      delayChildren: 0.16,
      staggerChildren: 0.055,
    },
  },
}

const menuItemVariants: Variants = {
  closed: {
    opacity: 0,
    y: 18,
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const firstLineVariants: Variants = {
  closed: {
    y: -6,
    rotate: 0,
  },
  open: {
    y: 0,
    rotate: 45,
  },
}

const middleLineVariants: Variants = {
  closed: {
    opacity: 1,
    scaleX: 1,
  },
  open: {
    opacity: 0,
    scaleX: 0,
  },
}

const lastLineVariants: Variants = {
  closed: {
    y: 6,
    rotate: 0,
  },
  open: {
    y: 0,
    rotate: -45,
  },
}

type MenuIconProps = {
  staticState?: 'closed'
}

function MenuIcon({ staticState }: MenuIconProps) {
  return (
    <motion.span
      initial={false}
      animate={staticState}
      aria-hidden="true"
      className="relative block size-6"
    >
      <motion.span
        variants={firstLineVariants}
        className="absolute top-1/2 left-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 30,
        }}
      />

      <motion.span
        variants={middleLineVariants}
        className="absolute top-1/2 left-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
        transition={{
          duration: 0.18,
        }}
      />

      <motion.span
        variants={lastLineVariants}
        className="absolute top-1/2 left-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 30,
        }}
      />
    </motion.span>
  )
}

type MenuCircle = {
  x: number
  y: number
  radius: number
}

export function SiteHeader() {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()

  const dialogRef = useRef<HTMLDialogElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousOverflowRef = useRef('')

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const [menuCircle, setMenuCircle] = useState<MenuCircle>({
    x: 48,
    y: 52,
    radius: 1600,
  })

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  const finishClosingMenu = useCallback(() => {
    if (dialogRef.current?.open) {
      dialogRef.current.close()
    }

    document.body.style.overflow = previousOverflowRef.current
    menuButtonRef.current?.focus()
  }, [])

  const openMenu = () => {
    const dialog = dialogRef.current
    const trigger = menuButtonRef.current

    if (!dialog || !trigger || dialog.open) return

    const rect = trigger.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const farthestX = Math.max(x, window.innerWidth - x)
    const farthestY = Math.max(y, window.innerHeight - y)
    const radius = Math.hypot(farthestX, farthestY) + 80

    setMenuCircle({
      x,
      y,
      radius,
    })

    previousOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    dialog.showModal()
    setMenuOpen(true)
  }

  useEffect(() => {
    const updateHeader = () => {
      setScrolled(window.scrollY > 24)
    }

    updateHeader()

    window.addEventListener('scroll', updateHeader, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', updateHeader)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [menuOpen])

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  useEffect(() => {
    if (!menuOpen) return

    const desktopQuery = window.matchMedia('(min-width: 1024px)')

    const handleDesktop = () => {
      if (desktopQuery.matches) {
        closeMenu()
      }
    }

    desktopQuery.addEventListener('change', handleDesktop)

    return () => {
      desktopQuery.removeEventListener('change', handleDesktop)
    }
  }, [menuOpen, closeMenu])

  useEffect(() => {
    return () => {
      document.body.style.overflow = previousOverflowRef.current
    }
  }, [])

  const closedClip = `circle(0px at ${menuCircle.x}px ${menuCircle.y}px)`
  const openClip =
    `circle(${menuCircle.radius}px at ${menuCircle.x}px ${menuCircle.y}px)`

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 motion-safe:animate-navbar-enter sm:px-5">
        <div
          className={`mx-auto flex min-h-20 max-w-[78rem] items-center justify-between gap-4 px-3 backdrop-blur-2xl transition-[background-color,box-shadow,border-radius] duration-300 sm:px-4 ${
            scrolled
              ? 'rounded-2xl bg-white/94 shadow-[0_16px_48px_rgb(36_19_63/14%)]'
              : 'rounded-[1.6rem] bg-white/80 shadow-[0_10px_35px_rgb(36_19_63/9%)]'
          }`}
        >
          {/*
           * Keep compact false. Removing this text changes the width
           * of the header and causes the navigation links to jump.
           */}
          <BrandMark compact={false} />

          <nav
            aria-label="منوی اصلی"
            className="hidden items-center gap-1 lg:flex"
          >
            {navigation.map((item) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative px-3.5 py-3 text-sm font-bold transition-[color,transform] duration-300 after:absolute after:right-3 after:bottom-1 after:left-3 after:h-0.5 after:origin-center after:rounded-full after:bg-linear-to-l after:from-brand-700 after:via-brand-500 after:to-accent-500 after:content-[''] after:transition-transform after:duration-300 xl:px-4 ${
                    active
                      ? 'text-brand-700 after:scale-x-100'
                      : 'text-ink-700 after:scale-x-0 hover:-translate-y-0.5 hover:text-brand-700 hover:after:scale-x-100'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/account"
              className={`group relative inline-flex min-h-11 items-center gap-2 px-3 text-sm font-bold transition-[color,transform] duration-300 after:absolute after:right-3 after:bottom-0 after:left-3 after:h-0.5 after:origin-center after:rounded-full after:bg-brand-500 after:content-[''] after:transition-transform after:duration-300 hover:-translate-y-0.5 hover:text-brand-700 ${
                isActive('/account')
                  ? 'text-brand-700 after:scale-x-100'
                  : 'text-ink-700 after:scale-x-0 hover:after:scale-x-100'
              }`}
            >
              <TravelIcon
                name="document"
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5"
              />

              حساب من
            </Link>

            <Link
              href="/consultation/book"
              className={buttonVariants({
                size: 'small',
                className:
                  'group gap-2 rounded-xl bg-linear-to-l from-brand-700 to-brand-500 shadow-[0_10px_25px_rgb(91_52_196/25%)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgb(91_52_196/32%)]',
              })}
            >
              رزرو مشاوره

              <TravelIcon
                name="arrow"
                className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={openMenu}
            aria-label="باز کردن منوی اصلی"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700 shadow-[0_8px_22px_rgb(75_36_158/12%)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-brand-100 hover:shadow-[0_12px_28px_rgb(75_36_158/18%)] active:translate-y-0 active:scale-95 lg:hidden"
          >
            <MenuIcon staticState="closed" />
          </button>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        aria-labelledby="mobile-navigation-title"
        onCancel={(event) => {
          event.preventDefault()
          closeMenu()
        }}
        onClose={() => {
          setMenuOpen(false)
          document.body.style.overflow = previousOverflowRef.current
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 backdrop:bg-transparent"
      >
        <AnimatePresence onExitComplete={finishClosingMenu}>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={shouldReduceMotion ? 'open' : 'closed'}
              animate="open"
              exit="closed"
              variants={{
                closed: {
                  clipPath: closedClip,
                  transition: {
                    duration: shouldReduceMotion ? 0.01 : 0.38,
                    ease: [0.65, 0, 0.35, 1],
                  },
                },
                open: {
                  clipPath: openClip,
                  transition: {
                    duration: shouldReduceMotion ? 0.01 : 0.58,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              className="fixed inset-0 isolate overflow-hidden bg-[radial-gradient(circle_at_15%_10%,#7549e5_0%,#421c87_38%,#28104f_70%,#1b0b35_100%)] text-white"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 -left-32 size-80 rounded-full bg-accent-300/10 blur-3xl"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-[-10rem] bottom-[-12rem] size-[28rem] rounded-full bg-brand-400/15 blur-3xl"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgb(255_255_255/4%)_45%,transparent_100%)]"
              />

              <motion.div
                variants={menuContentVariants}
                className="relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-5"
              >
                <motion.div
                  variants={menuItemVariants}
                  className="flex min-h-20 items-center justify-between gap-4"
                >
                  <BrandMark
                    inverse
                    compact={false}
                    onNavigate={closeMenu}
                  />

                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={closeMenu}
                    aria-label="بستن منو"
                    className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-white shadow-[0_12px_30px_rgb(0_0_0/18%)] transition-[transform,background-color] duration-300 hover:scale-105 hover:bg-white/16 active:scale-95"
                  >
                    <MenuIcon />
                  </button>
                </motion.div>

                <motion.div
                  variants={menuItemVariants}
                  className="pt-5 sm:pt-8"
                >
                  <span className="text-xs font-bold text-accent-300">
                    منوی دسترسی سریع
                  </span>

                  <h2
                    id="mobile-navigation-title"
                    className="mt-2 max-w-lg text-2xl font-black leading-10 sm:text-3xl sm:leading-12"
                  >
                    قدم بعدی مسیرتان را انتخاب کنید
                  </h2>
                </motion.div>

                <motion.nav
                  variants={menuContentVariants}
                  aria-label="منوی موبایل"
                  className="my-5 flex-1 space-y-1 overflow-y-auto overscroll-contain py-1 sm:my-7"
                >
                  {navigation.map((item, index) => {
                    const active = isActive(item.href)

                    return (
                      <motion.div
                        key={item.href}
                        variants={menuItemVariants}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          aria-current={active ? 'page' : undefined}
                          className={`group relative flex min-h-15 items-center gap-4 overflow-hidden rounded-2xl px-3 py-3 text-base font-bold transition-[color,background-color,transform] duration-300 sm:min-h-17 sm:px-4 sm:text-lg before:absolute before:top-1/2 before:right-0 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-accent-300 before:transition-transform before:duration-300 ${
                            active
                              ? 'bg-white/11 text-accent-300 before:scale-y-100'
                              : 'text-white before:scale-y-0 hover:-translate-x-1 hover:bg-white/7 hover:text-accent-200 hover:before:scale-y-100'
                          }`}
                        >
                          <span className="w-7 shrink-0 text-xs font-normal text-white/35">
                            {persianNumbers[index]}
                          </span>

                          <span>{item.label}</span>

                          <TravelIcon
                            name="arrow"
                            className="mr-auto size-5 transition-transform duration-300 group-hover:-translate-x-1.5"
                          />
                        </Link>
                      </motion.div>
                    )
                  })}
                </motion.nav>

                <motion.div
                  variants={menuItemVariants}
                  className="grid shrink-0 gap-3 sm:grid-cols-2"
                >
                  <Link
                    href="/consultation/book"
                    onClick={closeMenu}
                    className="group flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-accent-300 px-5 font-black text-brand-950 shadow-[0_12px_30px_rgb(255_215_111/18%)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgb(255_215_111/25%)] active:translate-y-0 active:scale-[0.98]"
                  >
                    رزرو مشاوره

                    <TravelIcon
                      name="arrow"
                      className="size-5 transition-transform duration-300 group-hover:-translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/account"
                    onClick={closeMenu}
                    className="flex min-h-13 items-center justify-center rounded-2xl bg-white/10 px-5 font-bold text-white transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/16 active:translate-y-0 active:scale-[0.98]"
                  >
                    ورود و پیگیری پرونده
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  )
}