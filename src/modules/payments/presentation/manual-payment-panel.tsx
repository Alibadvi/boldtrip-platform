import {
  paymentReceiptStatusLabels,
  type ManualPaymentSettings,
  type PaymentReceiptSummary,
} from '../domain/manual-payment'
import { PaymentReceiptForm } from './payment-receipt-form'

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount)
}

export function ManualPaymentPanel({
  amount,
  consultationBookingId,
  receipts,
  serviceRequestId,
  settings,
}: {
  amount?: number
  consultationBookingId?: number | string
  receipts: PaymentReceiptSummary[]
  serviceRequestId?: number | string
  settings: ManualPaymentSettings
}) {
  if (!amount || amount <= 0) {
    return (
      <div className="rounded-3xl border border-border bg-white p-6">
        <h2 className="text-xl font-black text-brand-950">
          پرداخت
        </h2>
        <p className="mt-3 leading-8 text-ink-500">
          مبلغ این مورد هنوز توسط کارشناس اعلام نشده است.
        </p>
      </div>
    )
  }

  const approved = receipts.some(
    (receipt) => receipt.status === 'approved',
  )

  return (
    <div className="grid gap-5">
      <section className="rounded-3xl bg-brand-950 p-6 text-white">
        <p className="text-sm text-white/65">
          مبلغ قابل پرداخت
        </p>
        <p className="mt-2 text-3xl font-black">
          {formatAmount(amount)} تومان
        </p>

        {settings.active ? (
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            {settings.cardNumber ? (
              <div>
                <dt className="text-white/60">
                  شماره کارت
                </dt>
                <dd
                  className="mt-1 font-bold tracking-wider"
                  dir="ltr"
                >
                  {settings.cardNumber}
                </dd>
              </div>
            ) : null}
            {settings.cardholderName ? (
              <div>
                <dt className="text-white/60">
                  نام صاحب کارت
                </dt>
                <dd className="mt-1 font-bold">
                  {settings.cardholderName}
                </dd>
              </div>
            ) : null}
            {settings.bankName ? (
              <div>
                <dt className="text-white/60">بانک</dt>
                <dd className="mt-1 font-bold">
                  {settings.bankName}
                </dd>
              </div>
            ) : null}
            {settings.iban ? (
              <div>
                <dt className="text-white/60">شماره شبا</dt>
                <dd
                  className="mt-1 break-all font-bold"
                  dir="ltr"
                >
                  {settings.iban}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-7">
            اطلاعات حساب هنوز توسط مدیریت فعال نشده است.
          </p>
        )}

        {settings.instructions ? (
          <p className="mt-5 text-sm leading-7 text-white/75">
            {settings.instructions}
          </p>
        ) : null}
      </section>

      {receipts.length ? (
        <section className="rounded-3xl border border-border bg-white p-6">
          <h2 className="text-lg font-black text-brand-950">
            رسیدهای ارسال‌شده
          </h2>
          <div className="mt-4 grid gap-3">
            {receipts.map((receipt) => (
              <div
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-canvas p-4"
                key={receipt.id}
              >
                <div>
                  <p className="font-bold text-brand-950">
                    {formatAmount(receipt.amount)} تومان
                  </p>
                  {receipt.reviewerNote ? (
                    <p className="mt-1 text-sm text-ink-500">
                      {receipt.reviewerNote}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                  {
                    paymentReceiptStatusLabels[
                      receipt.status
                    ]
                  }
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {!approved && settings.active ? (
        <PaymentReceiptForm
          amount={amount}
          consultationBookingId={consultationBookingId}
          serviceRequestId={serviceRequestId}
        />
      ) : null}
    </div>
  )
}
