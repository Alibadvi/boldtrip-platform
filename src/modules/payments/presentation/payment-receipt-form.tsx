'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/shared/ui'

type PaymentReceiptFormProps = {
  amount: number
  consultationBookingId?: number | string
  serviceRequestId?: number | string
}

export function PaymentReceiptForm({
  amount,
  consultationBookingId,
  serviceRequestId,
}: PaymentReceiptFormProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] =
    useState(false)

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const form = new FormData(event.currentTarget)
    const file = form.get('file')

    if (!(file instanceof File) || file.size === 0) {
      setError('تصویر یا فایل رسید را انتخاب کنید.')
      setIsSubmitting(false)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('حجم فایل باید کمتر از ۱۰ مگابایت باشد.')
      setIsSubmitting(false)
      return
    }

    const payload = {
      amount,
      consultationBooking: consultationBookingId,
      note: String(form.get('note') ?? ''),
      paidAt: new Date().toISOString(),
      payableType: consultationBookingId
        ? 'consultation'
        : 'serviceRequest',
      serviceRequest: serviceRequestId,
    }

    form.delete('note')
    form.set('_payload', JSON.stringify(payload))

    const response = await fetch('/api/customer/payment-receipts', {
      body: form,
      credentials: 'include',
      method: 'POST',
    })

    setIsSubmitting(false)

    if (!response.ok) {
      const result = (await response
        .json()
        .catch(() => null)) as
        | { errors?: Array<{ message?: string }> }
        | null

      setError(
        result?.errors?.[0]?.message ??
          'ارسال رسید انجام نشد. دوباره تلاش کنید.',
      )
      return
    }

    event.currentTarget.reset()
    router.refresh()
  }

  return (
    <form
      className="grid gap-4 rounded-3xl border border-border bg-white p-5"
      onSubmit={submit}
    >
      <div>
        <h3 className="text-lg font-black text-brand-950">
          ارسال رسید بانکی
        </h3>
        <p className="mt-1 text-sm leading-7 text-ink-500">
          فرمت PDF، JPG یا PNG تا سقف ۱۰ مگابایت
        </p>
      </div>

      <input
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className="block w-full rounded-2xl border border-dashed border-brand-200 bg-brand-50 px-4 py-5 text-sm text-ink-700 file:ml-4 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:font-bold file:text-white"
        name="file"
        required
        type="file"
      />

      <textarea
        className="min-h-24 rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-600"
        name="note"
        placeholder="توضیح اختیاری درباره واریز"
      />

      {error ? (
        <p className="text-sm font-bold text-red-600">
          {error}
        </p>
      ) : null}

      <Button disabled={isSubmitting} type="submit">
        {isSubmitting
          ? 'در حال ارسال...'
          : 'ثبت رسید برای بررسی'}
      </Button>
    </form>
  )
}
