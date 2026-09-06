import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getCustomerServiceRequest } from '@/modules/cases'
import { requireCurrentCustomer } from '@/modules/identity'
import {
  getManualPaymentSettings,
  getPaymentReceipts,
  ManualPaymentPanel,
} from '@/modules/payments'
import { buttonVariants, Card } from '@/shared/ui'

type PageProps = {
  params: Promise<{ request: string }>
}

export const metadata: Metadata = {
  title: 'پرداخت درخواست',
}

export const dynamic = 'force-dynamic'

export default async function RequestPaymentPage({
  params,
}: PageProps) {
  const customer = await requireCurrentCustomer(
    '/account/requests',
  )
  const { request: requestId } = await params

  const request = await getCustomerServiceRequest(
    customer.id,
    requestId,
  )

  if (!request) {
    notFound()
  }

  const [settings, receipts] = await Promise.all([
    getManualPaymentSettings(),
    getPaymentReceipts({
      customerId: customer.id,
      serviceRequestId: request.id,
    }),
  ])

  return (
    <div className="space-y-6">
      <Card className="border-border bg-white p-7 shadow-card">
        <p className="text-sm font-bold text-muted">
          درخواست {request.reference}
        </p>
        <h1 className="mt-2 text-2xl font-black text-ink">
          پرداخت و ارسال رسید
        </h1>
        <p className="mt-3 leading-8 text-muted">
          مبلغ اعلام‌شده را به اطلاعات حساب زیر
          واریز کنید و رسید را برای بررسی بفرستید.
        </p>
      </Card>

      <ManualPaymentPanel
        amount={request.quotedAmount}
        receipts={receipts}
        serviceRequestId={request.id}
        settings={settings}
      />

      <Link
        className={buttonVariants({
          variant: 'secondary',
        })}
        href={`/account/requests/${request.id}`}
      >
        بازگشت به درخواست
      </Link>
    </div>
  )
}
