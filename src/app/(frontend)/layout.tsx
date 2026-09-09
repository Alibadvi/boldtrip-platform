import type { Metadata } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'

import { SiteFooter } from './_components/site-footer'
import { SiteHeader } from './_components/site-header'

import './globals.css'

const vazirmatn = localFont({
  src: '../../../public/fonts/vazirmatn-variable.woff2',
  variable: '--font-vazirmatn',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  preload: true,
  fallback: ['Tahoma', 'Arial', 'sans-serif'],
})

export const metadata: Metadata = {
  icons: {
    icon: {
      url: '/brand-icon.svg',
      type: 'image/svg+xml',
    },
    shortcut: '/brand-icon.svg',
  },
  title: {
    default: 'BoldTrip | خدمات ویزا، وقت سفارت و مشاوره',
    template: '%s | BoldTrip',
  },
  description:
    'شرایط ویزای کانادا و شینگن، خدمات وقت سفارت و رزرو مشاوره در یک مسیر روشن و قابل پیگیری.',
}

export default function FrontendLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${vazirmatn.variable} bg-canvas motion-safe:scroll-smooth`}
    >
      <body className="min-h-screen overflow-x-clip bg-canvas font-sans leading-8 text-ink-950 antialiased selection:bg-brand-100 selection:text-brand-950">
        <a
          href="#main-content"
          className="sr-only fixed top-3 right-3 z-[100] rounded-xl bg-brand-950 px-5 py-3 font-bold text-white focus:not-sr-only"
        >
          رفتن به محتوای اصلی
        </a>

        <SiteHeader />

        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  )
}