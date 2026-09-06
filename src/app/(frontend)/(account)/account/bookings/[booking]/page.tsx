import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { requireCurrentCustomer } from '@/modules/identity'
import {
  getManualPaymentSettings,
  getPaymentReceipts,
  ManualPaymentPanel,
} from '@/modules/payments'
import {
  consultationBookingStatusLabels,
  consultationBookingStatusTones,
  consultationDeliveryMethodLabels,
  getCustomerConsultationBooking,
} from '@/modules/scheduling'
import {
  buttonVariants,
  Card,
  StatusBadge,
} from '@/shared/ui'

type PageProps = {
  params: Promise<{ booking: string }>
}

export const metadata: Metadata = {
  title: 'جزئیات رزرو مشاوره',
}

export const dynamic = 'force-dynamic'

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function BookingDetailPage({
  params,
}: PageProps) {
  const customer = await requireCurrentCustomer(
    '/account/bookings',
  )
  const { booking: bookingId } = await params

  const booking =
    await getCustomerConsultationBooking(
      customer.id,
      bookingId,
    )

  if (!booking) {
    notFound()
  }

  const [settings, receipts] = await Promise.all([
    getManualPaymentSettings(),
    getPaymentReceipts({
      consultationBookingId: booking.id,
      customerId: customer.id,
    }),
  ])

  return (
    <div className="space-y-6">
      <Card className="border-brand-100 bg-brand-950 p-7 text-white shadow-raised">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-white/65" dir="ltr">
              {booking.reference}
            </p>
            <h1 className="mt-3 text-2xl font-black">
              {booking.topic}
            </h1>
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

      <Card className="border-border bg-white p-6">
        <dl className="grid gap-5 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-ink-500">
              زمان جلسه
            </dt>
            <dd className="mt-1 font-black text-brand-950">
              {formatDate(booking.startsAt)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-500">
              روش برگزاری
            </dt>
            <dd className="mt-1 font-black text-brand-950">
              {
                consultationDeliveryMethodLabels[
                  booking.deliveryMethod
                ]
              }
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-500">
              مدت جلسه
            </dt>
            <dd className="mt-1 font-black text-brand-950">
              {booking.durationMinutes} دقیقه
            </dd>
          </div>
        </dl>
      </Card>

      <ManualPaymentPanel
        amount={booking.amount}
        consultationBookingId={booking.id}
        receipts={receipts}
        settings={settings}
      />

      <Link
        className={buttonVariants({
          variant: 'secondary',
        })}
        href="/account/bookings"
      >
        بازگشت به رزروها
      </Link>
    </div>
  )
}
