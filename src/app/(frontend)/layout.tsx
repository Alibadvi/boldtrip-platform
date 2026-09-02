import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteFooter } from './_components/site-footer'
import { SiteHeader } from './_components/site-header'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'BoldTrip | خدمات ویزا، وقت سفارت و مشاوره',
    template: '%s | BoldTrip',
  },
  description:
    'شرایط ویزای کانادا و شینگن، خدمات وقت سفارت و رزرو مشاوره در یک مسیر روشن و قابل پیگیری.',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="scroll-smooth bg-canvas">
      <body className="min-h-screen overflow-x-hidden bg-canvas font-sans leading-8 text-ink-950 antialiased selection:bg-brand-100 selection:text-brand-950">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
