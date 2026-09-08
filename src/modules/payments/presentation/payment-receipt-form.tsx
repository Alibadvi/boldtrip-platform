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
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)
    const formElement = event.currentTarget

    const form = new FormData(formElement)
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
      payableType: consultationBookingId ? 'consultation' : 'serviceRequest',
      serviceRequest: serviceRequestId,
    }

    form.delete('note')
    form.set('_payload', JSON.stringify(payload))

    try {
      const response = await fetch('/api/customer/payment-receipts', {
        body: form,
        credentials: 'include',
        method: 'POST',
      })
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          errors?: Array<{ message?: string }>
        } | null
        setError(
          response.status === 401
            ? 'نشست شما پایان یافته است. دوباره وارد حساب شوید.'
            : (result?.errors?.[0]?.message ?? 'ارسال رسید انجام نشد. دوباره تلاش کنید.'),
        )
        return
      }
      formElement.reset()
      setSuccess('رسید دریافت شد. منتظر بررسی کارشناس بمانید؛ دوباره واریز نکنید.')
      router.refresh()
    } catch {
      setError(
        'ارتباط قطع شد. پیش از ارسال مجدد، صفحه را تازه کنید و بخش رسیدها را بررسی کنید؛ ممکن است رسید ثبت شده باشد.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-4 rounded-3xl border border-border bg-white p-5" onSubmit={submit}>
      <div>
        <h3 className="text-lg font-black text-brand-950">ارسال رسید بانکی</h3>
        <p className="mt-1 text-sm leading-7 text-ink-500">
          فرمت PDF، JPG یا PNG تا سقف ۱۰ مگابایت
        </p>
      </div>

      <label htmlFor="receipt-file" className="text-sm font-bold text-brand-950">
        فایل رسید
      </label>
      <input
        id="receipt-file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className="block w-full rounded-2xl border border-dashed border-brand-200 bg-brand-50 px-4 py-5 text-sm text-ink-700 file:ml-4 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:font-bold file:text-white"
        name="file"
        required
        type="file"
      />

      <label htmlFor="receipt-note" className="text-sm font-bold text-brand-950">
        توضیح واریز (اختیاری)
      </label>
      <textarea
        id="receipt-note"
        maxLength={1000}
        className="min-h-24 rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-600"
        name="note"
        placeholder="توضیح اختیاری درباره واریز"
      />

      {error ? (
        <p role="alert" className="text-sm font-bold text-red-600">
          {error}
        </p>
      ) : null}

      {success ? (
        <p role="status" className="text-sm font-bold text-emerald-700">
          {success}
        </p>
      ) : null}

      <Button disabled={isSubmitting || Boolean(success)} type="submit">
        {isSubmitting ? 'در حال ارسال...' : 'ثبت رسید برای بررسی'}
      </Button>
    </form>
  )
}
