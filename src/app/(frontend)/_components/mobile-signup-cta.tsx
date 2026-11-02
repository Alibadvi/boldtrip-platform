'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MobileSignupCta() {
  const path = usePathname()
  if (
    path.startsWith('/account') ||
    path.startsWith('/sign-') ||
    path.startsWith('/consultation/book') || path.startsWith('/assessment') || path.endsWith('/apply') || path.includes('password')
  )
    return null
  return (
    <Link
      href="/assessment/apply"
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl bg-accent-300 px-4 py-3 text-center text-sm font-black text-brand-950 shadow-raised sm:hidden"
    >
      ارزیابی رایگان شرایط و مدارک
    </Link>
  )
}
