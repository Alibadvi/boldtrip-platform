import Link from 'next/link'
import type { Metadata } from 'next'

import { getCustomerServiceRequests } from '@/modules/cases'
import { getCustomerDocuments } from '@/modules/documents'
import { requireCurrentCustomer } from '@/modules/identity'
import { getCustomerConsultationBookings } from '@/modules/scheduling'
import {
  buttonVariants,
  Card,
} from '@/shared/ui'

export const metadata: Metadata = {
  title: 'حساب کاربری',
  description:
    'مدیریت درخواست‌ها و رزروهای BoldTrip.',
}

export default async function AccountPage() {
  const customer =
    await requireCurrentCustomer('/account')

  const [requests, bookings, documents] =
    await Promise.all([
      getCustomerServiceRequests(customer.id),
      getCustomerConsultationBookings(customer.id),
      getCustomerDocuments(customer.id),
    ])

  const summaries = [
    {
      description: 'درخواست ثبت‌شده',
      href: '/account/requests',
      label: 'درخواست‌ها',
      value: new Intl.NumberFormat('fa-IR').format(
        requests.length,
      ),
    },
    {
      description: 'رزرو ثبت‌شده',
      href: '/account/bookings',
      label: 'رزرو مشاوره',
      value: new Intl.NumberFormat('fa-IR').format(
        bookings.length,
      ),
    },
    {
      description: 'مدرک بارگذاری‌شده',
      href: '/account/documents',
      label: 'مدارک',
      value: new Intl.NumberFormat('fa-IR').format(
        documents.length,
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-brand-100 bg-brand-950 p-7 text-white shadow-raised sm:p-9">
        <p className="text-sm font-bold text-brand-200">
          حساب مشتری
        </p>

        <h1 className="mt-2 text-3xl font-black">
          سلام {customer.name}
        </h1>

        <p className="mt-3 max-w-2xl leading-8 text-brand-100">
          از این بخش می‌توانید وضعیت درخواست‌ها،
          رزروها، مدارک و پرداخت‌های خود را پیگیری
          کنید.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {summaries.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="h-full border-border bg-white p-6 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
              <p className="text-sm font-bold text-ink-500">
                {item.label}
              </p>
              <p className="mt-3 text-4xl font-black text-brand-950">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-ink-700">
                {item.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-border bg-white p-7 shadow-card">
        <h2 className="text-xl font-black text-brand-950">
          شروع یک مسیر جدید
        </h2>
        <p className="mt-2 leading-8 text-ink-700">
          خدمت موردنظر را انتخاب کنید. پس از تکمیل
          فرم، درخواست در همین حساب نمایش داده خواهد
          شد.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/services"
            className={buttonVariants()}
          >
            مشاهده خدمات
          </Link>
          <Link
            href="/embassy-appointments"
            className={buttonVariants({
              variant: 'secondary',
            })}
          >
            درخواست وقت سفارت
          </Link>
          <Link
            href="/consultation/book"
            className={buttonVariants({
              variant: 'quiet',
            })}
          >
            رزرو مشاوره
          </Link>
        </div>
      </Card>
    </div>
  )
}
