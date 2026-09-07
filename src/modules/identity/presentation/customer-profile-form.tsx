'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/shared/ui'

export function CustomerProfileForm({
  customer,
}: {
  customer: {
    email: string
    id: number | string
    mobile: string
    name: string
  }
}) {
  const router = useRouter()
  const [name, setName] = useState(customer.name)
  const [mobile, setMobile] = useState(
    customer.mobile,
  )
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')
    setSaved(false)
    setLoading(true)

    const response = await fetch(
      `/api/customer/customers/${customer.id}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile.trim(),
          name: name.trim(),
        }),
      },
    )

    setLoading(false)

    if (!response.ok) {
      const result = (await response
        .json()
        .catch(() => null)) as
        | { errors?: Array<{ message?: string }> }
        | null
      setError(
        result?.errors?.[0]?.message ??
          'ذخیره اطلاعات انجام نشد.',
      )
      return
    }

    setSaved(true)
    router.refresh()
  }

  const fieldClass =
    'min-h-12 w-full rounded-2xl border border-border bg-white px-4 outline-none transition focus:border-brand-600'

  return (
    <form
      className="mt-7 grid gap-6 sm:grid-cols-2"
      onSubmit={submit}
    >
      <label className="grid gap-2">
        <span className="font-bold text-brand-950">
          نام و نام خانوادگی
        </span>
        <input
          className={fieldClass}
          maxLength={100}
          minLength={2}
          onChange={(event) =>
            setName(event.target.value)
          }
          required
          value={name}
        />
      </label>

      <label className="grid gap-2">
        <span className="font-bold text-brand-950">
          شماره موبایل
        </span>
        <input
          className={fieldClass}
          dir="ltr"
          onChange={(event) =>
            setMobile(event.target.value)
          }
          required
          type="tel"
          value={mobile}
        />
      </label>

      <label className="grid gap-2 sm:col-span-2">
        <span className="font-bold text-brand-950">
          ایمیل
        </span>
        <input
          className={fieldClass}
          dir="ltr"
          disabled
          value={customer.email}
        />
        <span className="text-xs text-ink-500">
          ایمیل شناسه ورود شماست و از این صفحه تغییر
          نمی‌کند.
        </span>
      </label>

      {error ? (
        <p className="text-sm font-bold text-red-600 sm:col-span-2">
          {error}
        </p>
      ) : null}

      {saved ? (
        <p className="text-sm font-bold text-emerald-700 sm:col-span-2">
          اطلاعات حساب ذخیره شد.
        </p>
      ) : null}

      <div>
        <Button
          disabled={loading}
          size="large"
          type="submit"
        >
          {loading
            ? 'در حال ذخیره...'
            : 'ذخیره تغییرات'}
        </Button>
      </div>
    </form>
  )
}
