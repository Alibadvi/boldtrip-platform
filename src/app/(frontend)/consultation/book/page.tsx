import type { Metadata } from 'next'
import Link from 'next/link'

import { requireCurrentCustomer } from '@/modules/identity'
import {
  ConsultationBookingForm,
  getAvailableConsultationSlots,
} from '@/modules/scheduling'
import {
  buttonVariants,
  Card,
  Container,
} from '@/shared/ui'

export const metadata: Metadata = {
  title: 'انتخاب زمان مشاوره',
}

export const dynamic = 'force-dynamic'

export default async function ConsultationBookPage() {
  await requireCurrentCustomer('/consultation/book')
  const slots = await getAvailableConsultationSlots()

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          className={buttonVariants({
            variant: 'quiet',
          })}
          href="/consultation"
        >
          بازگشت به معرفی مشاوره
        </Link>

        <Card className="mt-5 border-border bg-white p-7 shadow-card sm:p-9">
          <p className="text-sm font-extrabold text-brand-700">
            رزرو آنلاین
          </p>
          <h1 className="mt-2 text-3xl font-black text-brand-950">
            انتخاب زمان مشاوره
          </h1>
          <p className="mt-3 leading-8 text-ink-500">
            پس از ثبت رزرو، اطلاعات پرداخت نمایش
            داده می‌شود. رزرو با تأیید رسید قطعی خواهد
            شد.
          </p>

          <div className="mt-8">
            <ConsultationBookingForm
              slots={slots}
            />
          </div>
        </Card>
      </div>
    </Container>
  )
}
