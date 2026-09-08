import { isClosedStatus, isPayableStatus, isPaymentAccountReady } from '../domain/payment-policy'
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
  status,
}: {
  amount?: number
  consultationBookingId?: number | string
  receipts: PaymentReceiptSummary[]
  serviceRequestId?: number | string
  settings: ManualPaymentSettings
  status: string
}) {
  const closed = isClosedStatus(status)
  const approved = receipts.some((receipt) => receipt.status === 'approved')
  const pending =
    status === 'paymentReview' || receipts.some((receipt) => receipt.status === 'pending')
  const accountReady = isPaymentAccountReady(settings)
  const canPay =
    !closed &&
    !approved &&
    !pending &&
    isPayableStatus(status) &&
    typeof amount === 'number' &&
    amount > 0 &&
    accountReady
  const message = closed
    ? 'این مورد بسته شده است. پرداخت جدید انجام ندهید. برای پیگیری پرداخت قبلی با پشتیبانی تماس بگیرید.'
    : approved
      ? 'پرداخت شما تأیید شده است. نیازی به واریز یا ارسال رسید دوباره نیست.'
      : pending
        ? 'رسید دریافت شد و منتظر بررسی است. دوباره وجه واریز نکنید و رسید تکراری نفرستید.'
        : !isPayableStatus(status) || !amount
          ? 'این مورد هنوز در مرحله پرداخت نیست. پس از بررسی کارشناس، مبلغ و اقدام بعدی اعلام می‌شود.'
          : !accountReady
            ? 'اطلاعات حساب هنوز آماده نیست. فعلاً وجهی واریز نکنید و با پشتیبانی تماس بگیرید.'
            : 'مبلغ زیر را به حساب اعلام‌شده واریز کنید، سپس رسید را یک‌بار بفرستید. ثبت رسید به‌معنی تأیید پرداخت نیست.'

  return (
    <div className="grid gap-5">
      <section
        className="rounded-3xl border border-brand-100 bg-brand-50 p-6"
        aria-label="راهنمای پرداخت"
      >
        <h2 className="text-lg font-black text-brand-950">
          {closed
            ? 'پرونده بسته‌شده'
            : approved
              ? 'پرداخت تأییدشده'
              : pending
                ? 'در انتظار بررسی رسید'
                : 'وضعیت پرداخت'}
        </h2>
        <p className="mt-2 leading-8 text-brand-900">{message}</p>
      </section>
      <section className="rounded-3xl bg-brand-950 p-6 text-white">
        <p className="text-sm text-white/65">{canPay ? 'مبلغ قابل پرداخت' : 'مبلغ ثبت‌شده'}</p>
        <p className="mt-2 text-3xl font-black">
          {typeof amount === 'number' ? `${formatAmount(amount)} تومان` : 'هنوز اعلام نشده'}
        </p>

        {canPay ? (
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            {settings.cardNumber ? (
              <div>
                <dt className="text-white/60">شماره کارت</dt>
                <dd className="mt-1 font-bold tracking-wider" dir="ltr">
                  {settings.cardNumber}
                </dd>
              </div>
            ) : null}
            {settings.cardholderName ? (
              <div>
                <dt className="text-white/60">نام صاحب کارت</dt>
                <dd className="mt-1 font-bold">{settings.cardholderName}</dd>
              </div>
            ) : null}
            {settings.bankName ? (
              <div>
                <dt className="text-white/60">بانک</dt>
                <dd className="mt-1 font-bold">{settings.bankName}</dd>
              </div>
            ) : null}
            {settings.iban ? (
              <div>
                <dt className="text-white/60">شماره شبا</dt>
                <dd className="mt-1 break-all font-bold" dir="ltr">
                  {settings.iban}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {canPay && settings.instructions ? (
          <p className="mt-5 text-sm leading-7 text-white/75">{settings.instructions}</p>
        ) : null}
      </section>

      {receipts.length ? (
        <section className="rounded-3xl border border-border bg-white p-6">
          <h2 className="text-lg font-black text-brand-950">رسیدهای ارسال‌شده</h2>
          <div className="mt-4 grid gap-3">
            {receipts.map((receipt) => (
              <div
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-canvas p-4"
                key={receipt.id}
              >
                <div>
                  <p className="font-bold text-brand-950">{formatAmount(receipt.amount)} تومان</p>
                  {receipt.reviewerNote ? (
                    <p className="mt-1 text-sm text-ink-500">{receipt.reviewerNote}</p>
                  ) : null}
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                  {paymentReceiptStatusLabels[receipt.status]}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {canPay && typeof amount === 'number' ? (
        <PaymentReceiptForm
          amount={amount}
          consultationBookingId={consultationBookingId}
          serviceRequestId={serviceRequestId}
        />
      ) : null}
    </div>
  )
}
