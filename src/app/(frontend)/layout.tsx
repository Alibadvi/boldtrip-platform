import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'BoldTrip',
    template: '%s | BoldTrip',
  },
  description: 'خدمات ویزا، وقت سفارت و رزرو مشاوره در یک مسیر شفاف.',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
