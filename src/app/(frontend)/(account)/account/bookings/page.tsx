import type { Metadata } from 'next'
import Link from 'next/link'

import { requireCurrentCustomer } from '@/modules/identity'
import {
  consultationBookingStatusLabels,
  consultationBookingStatusTones,
  getCustomerConsultationBookings,
} from '@/modules/scheduling'
import { Card, StatusBadge } from '@/shared/ui'

import { EmptyAccountState } from '../_components/empty-account-state'

export const metadata: Metadata = {
  title: 'رزروهای مشاوره',
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function AccountBookingsPage() {
  const customer = await requireCurrentCustomer(
    '/account/bookings',
  )
  const bookings =
    await getCustomerConsultationBookings(customer.id)

  if (bookings.length === 0) {
    return (
      <EmptyAccountState
        actionHref="/consultation/book"
        actionLabel="رزرو مشاوره"
        description="زمان مشاوره، وضعیت پرداخت و تأیید نهایی رزروهای شما در این قسمت نمایش داده می‌شود."
        title="هنوز رزروی ندارید"
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-white p-7 shadow-card">
        <h1 className="text-2xl font-black text-ink">
          رزروهای مشاوره
        </h1>
        <p className="mt-2 leading-8 text-muted">
          زمان جلسه و وضعیت پرداخت هر رزرو را از
          اینجا پیگیری کنید.
        </p>
      </Card>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Link
            href={`/account/bookings/${booking.id}`}
            key={booking.id}
          >
            <Card className="border-border bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-black text-ink">
                    {booking.topic}
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    {formatDate(booking.startsAt)}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted" dir="ltr">
                    {booking.reference}
                  </p>
                </div>
                <StatusBadge
                  tone={
                    consultationBookingStatusTones[
                      booking.status
                    ]
                  }
                >
                  {
                    consultationBookingStatusLabels[
                      booking.status
                    ]
                  }
                </StatusBadge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
