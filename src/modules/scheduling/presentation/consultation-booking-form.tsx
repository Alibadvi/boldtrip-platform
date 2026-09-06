'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/shared/ui'

import {
  consultationDeliveryMethodLabels,
  formatConsultationPrice,
} from '../domain/consultation'
import type { ConsultationSlot } from '../domain/booking'

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function ConsultationBookingForm({
  slots,
}: {
  slots: ConsultationSlot[]
}) {
  const router = useRouter()
  const [slotId, setSlotId] = useState(
    slots[0] ? String(slots[0].id) : '',
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(event.currentTarget)

    const response = await fetch(
      '/api/consultation-bookings',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerNote: String(
            form.get('customerNote') ?? '',
          ),
          slot: slotId,
          topic: String(form.get('topic') ?? ''),
        }),
      },
    )

    const result = (await response
      .json()
      .catch(() => null)) as
      | {
          doc?: { id?: number | string }
          errors?: Array<{ message?: string }>
        }
      | null

    setLoading(false)

    if (!response.ok || !result?.doc?.id) {
      setError(
        result?.errors?.[0]?.message ??
          'ثبت رزرو انجام نشد. ممکن است این زمان رزرو شده باشد.',
      )
      router.refresh()
      return
    }

    router.push(
      `/account/bookings/${result.doc.id}`,
    )
    router.refresh()
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-white p-7 text-center shadow-card">
        <h2 className="text-xl font-black text-brand-950">
          زمان آزادی وجود ندارد
        </h2>
        <p className="mt-3 leading-8 text-ink-500">
          زمان‌های جدید توسط مدیریت ثبت می‌شوند. کمی
          بعد دوباره بررسی کنید.
        </p>
      </div>
    )
  }

  return (
    <form
      className="grid gap-6"
      onSubmit={submit}
    >
      <fieldset>
        <legend className="text-lg font-black text-brand-950">
          زمان مناسب را انتخاب کنید
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {slots.map((slot) => (
            <label
              className={
                slotId === String(slot.id)
                  ? 'cursor-pointer rounded-2xl border-2 border-brand-600 bg-brand-50 p-4'
                  : 'cursor-pointer rounded-2xl border border-border bg-white p-4 transition hover:border-brand-300'
              }
              key={slot.id}
            >
              <input
                checked={
                  slotId === String(slot.id)
                }
                className="sr-only"
                name="slot"
                onChange={() =>
                  setSlotId(String(slot.id))
                }
                type="radio"
                value={slot.id}
              />
              <span className="block font-black text-brand-950">
                {formatDate(slot.startsAt)}
              </span>
              <span className="mt-2 block text-sm text-ink-500">
                {
                  consultationDeliveryMethodLabels[
                    slot.deliveryMethod
                  ]
                }{' '}
                · {slot.durationMinutes} دقیقه
              </span>
              <span className="mt-2 block font-bold text-brand-700">
                {formatConsultationPrice(
                  slot.priceAmount,
                )}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-2">
        <span className="font-bold text-brand-950">
          موضوع مشاوره
        </span>
        <input
          className="min-h-12 rounded-2xl border border-border px-4 outline-none transition focus:border-brand-600"
          maxLength={200}
          name="topic"
          placeholder="مثلاً بررسی مسیر ویزای تحصیلی کانادا"
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="font-bold text-brand-950">
          توضیحات تکمیلی
        </span>
        <textarea
          className="min-h-28 rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-brand-600"
          maxLength={2000}
          name="customerNote"
          placeholder="شرایط یا پرسش‌های اصلی خود را کوتاه بنویسید."
        />
      </label>

      {error ? (
        <p className="text-sm font-bold text-red-600">
          {error}
        </p>
      ) : null}

      <Button disabled={loading} size="large" type="submit">
        {loading
          ? 'در حال ثبت...'
          : 'ثبت رزرو و ادامه به پرداخت'}
      </Button>
    </form>
  )
}
