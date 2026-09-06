'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/shared/lib/cn'

const accountLinks = [
  {
    href: '/account',
    label: 'نمای کلی',
  },
  {
    href: '/account/requests',
    label: 'درخواست‌های من',
  },
  {
    href: '/account/bookings',
    label: 'رزروهای مشاوره',
  },
  {
    href: '/account/documents',
    label: 'مدارک من',
  },
  {
    href: '/account/profile',
    label: 'اطلاعات حساب',
  },
]

export function AccountNavigation() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2" aria-label="منوی حساب کاربری">
      {accountLinks.map((item) => {
        const isActive =
          item.href === '/account'
            ? pathname === item.href
            : pathname.startsWith(item.href)

        return (
          <Link
            className={cn(
              'flex min-h-11 items-center justify-between rounded-xl px-4 text-sm font-bold transition',
              isActive
                ? 'bg-brand-600 text-white'
                : 'text-ink-700 hover:bg-brand-50 hover:text-brand-700',
            )}
            href={item.href}
            key={item.href}
          >
            {item.label}

            <span aria-hidden="true">←</span>
          </Link>
        )
      })}
    </nav>
  )
}