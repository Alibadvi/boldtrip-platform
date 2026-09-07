'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/shared/ui'

function fieldClass(): string {
  return 'min-h-12 w-full rounded-2xl border border-border bg-white px-4 text-left outline-none transition focus:border-brand-600'
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const response = await fetch(
      '/api/customer/customers/forgot-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      },
    )

    setLoading(false)

    if (!response.ok) {
      setError(
        'ارسال لینک انجام نشد. ایمیل را بررسی کنید.',
      )
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
        <h2 className="font-black">
          ایمیل بازیابی ارسال شد
        </h2>
        <p className="mt-2 text-sm leading-7">
          اگر حسابی با این ایمیل وجود داشته باشد،
          لینک تغییر رمز برای آن ارسال می‌شود.
        </p>
      </div>
    )
  }

  return (
    <form className="grid gap-5" onSubmit={submit}>
      <label className="grid gap-2">
        <span className="font-bold text-brand-950">
          ایمیل حساب
        </span>
        <input
          autoComplete="email"
          className={fieldClass()}
          dir="ltr"
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
          type="email"
          value={email}
        />
      </label>

      {error ? (
        <p className="text-sm font-bold text-red-600">
          {error}
        </p>
      ) : null}

      <Button
        disabled={loading}
        size="large"
        type="submit"
      >
        {loading
          ? 'در حال ارسال...'
          : 'ارسال لینک بازیابی'}
      </Button>
    </form>
  )
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] =
    useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')

    if (!token) {
      setError('لینک بازیابی معتبر نیست.')
      return
    }

    if (password.length < 8) {
      setError(
        'رمز عبور باید حداقل ۸ کاراکتر داشته باشد.',
      )
      return
    }

    if (password !== confirmation) {
      setError('تکرار رمز عبور مطابقت ندارد.')
      return
    }

    setLoading(true)

    const response = await fetch(
      '/api/customer/customers/reset-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }),
      },
    )

    setLoading(false)

    if (!response.ok) {
      setError(
        'لینک منقضی یا نامعتبر است. دوباره درخواست بازیابی بدهید.',
      )
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="grid gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-black text-emerald-950">
          رمز عبور با موفقیت تغییر کرد.
        </p>
        <Link
          className="font-bold text-brand-700"
          href="/sign-in"
        >
          ورود با رمز جدید
        </Link>
      </div>
    )
  }

  return (
    <form className="grid gap-5" onSubmit={submit}>
      <label className="grid gap-2">
        <span className="font-bold text-brand-950">
          رمز عبور جدید
        </span>
        <input
          autoComplete="new-password"
          className={fieldClass()}
          dir="ltr"
          minLength={8}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
          type="password"
          value={password}
        />
      </label>

      <label className="grid gap-2">
        <span className="font-bold text-brand-950">
          تکرار رمز عبور
        </span>
        <input
          autoComplete="new-password"
          className={fieldClass()}
          dir="ltr"
          minLength={8}
          onChange={(event) =>
            setConfirmation(event.target.value)
          }
          required
          type="password"
          value={confirmation}
        />
      </label>

      {error ? (
        <p className="text-sm font-bold text-red-600">
          {error}
        </p>
      ) : null}

      <Button
        disabled={loading}
        size="large"
        type="submit"
      >
        {loading
          ? 'در حال ثبت...'
          : 'ثبت رمز عبور جدید'}
      </Button>
    </form>
  )
}
