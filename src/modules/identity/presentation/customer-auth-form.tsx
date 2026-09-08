'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'

import { Button } from '@/shared/ui'

type CustomerAuthFormProps = {
  mode: 'sign-in' | 'sign-up'
  nextPath: string
}

type FormState = {
  confirmPassword: string
  email: string
  mobile: string
  name: string
  password: string
}

type ErrorResponse = {
  errors?: Array<{ message?: string }>
  message?: string
}

const initialState: FormState = {
  confirmPassword: '',
  email: '',
  mobile: '',
  name: '',
  password: '',
}

async function responseError(response: Response): Promise<string> {
  const result = (await response.json().catch(() => null)) as ErrorResponse | null

  return result?.errors?.[0]?.message ?? result?.message ?? 'انجام عملیات با خطا مواجه شد.'
}

export function CustomerAuthForm({ mode, nextPath }: CustomerAuthFormProps) {
  const router = useRouter()
  const isSignUp = mode === 'sign-up'
  const [form, setForm] = useState(initialState)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const login = async () => {
    const response = await fetch('/api/customer/customers/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      }),
    })

    if (!response.ok) {
      throw new Error(await responseError(response))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (isSignUp && form.password.length < 12) {
      setError('رمز عبور باید حداقل ۱۲ کاراکتر داشته باشد.')
      return
    }

    if (isSignUp && form.password !== form.confirmPassword) {
      setError('تکرار رمز عبور مطابقت ندارد.')
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        const response = await fetch('/api/customer/customers', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email.trim().toLowerCase(),
            mobile: form.mobile.trim(),
            name: form.name.trim(),
            password: form.password,
          }),
        })

        if (!response.ok) {
          throw new Error(await responseError(response))
        }
      }

      await login()
      router.replace(nextPath)
      router.refresh()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'انجام عملیات با خطا مواجه شد.',
      )
    } finally {
      setLoading(false)
    }
  }

  const alternateHref =
    (isSignUp ? '/sign-in?next=' : '/sign-up?next=') +
    encodeURIComponent(nextPath)

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {isSignUp ? (
        <>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink-700">
              نام و نام خانوادگی
            </span>
            <input
              autoComplete="name"
              className="min-h-12 w-full rounded-control border border-border bg-white px-4 text-ink-950 outline-none transition placeholder:text-ink-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              maxLength={100}
              minLength={2}
              name="name"
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="مثلاً علی محمدی"
              required
              type="text"
              value={form.name}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink-700">
              شماره موبایل
            </span>
            <input
              autoComplete="tel"
              className="min-h-12 w-full rounded-control border border-border bg-white px-4 text-left text-ink-950 outline-none transition placeholder:text-ink-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              dir="ltr"
              name="mobile"
              onChange={(event) => updateField('mobile', event.target.value)}
              placeholder="+989121234567"
              required
              type="tel"
              value={form.mobile}
            />
          </label>
        </>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-ink-700">ایمیل</span>
        <input
          autoComplete="email"
          className="min-h-12 w-full rounded-control border border-border bg-white px-4 text-left text-ink-950 outline-none transition placeholder:text-ink-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          dir="ltr"
          name="email"
          onChange={(event) => updateField('email', event.target.value)}
          placeholder="name@example.com"
          required
          type="email"
          value={form.email}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-ink-700">رمز عبور</span>
        <input
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          className="min-h-12 w-full rounded-control border border-border bg-white px-4 text-left text-ink-950 outline-none transition placeholder:text-ink-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          dir="ltr"
          minLength={isSignUp ? 12 : 1}
          name="password"
          onChange={(event) => updateField('password', event.target.value)}
          placeholder="حداقل ۱۲ کاراکتر"
          required
          type="password"
          value={form.password}
        />
      </label>

      {!isSignUp ? (
        <div className="-mt-2 text-left">
          <Link
            className="text-sm font-bold text-brand-700 hover:text-brand-800"
            href="/forgot-password"
          >
            رمز عبور را فراموش کرده‌اید؟
          </Link>
        </div>
      ) : null}

      {isSignUp ? (
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink-700">
            تکرار رمز عبور
          </span>
          <input
            autoComplete="new-password"
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 text-left text-ink-950 outline-none transition placeholder:text-ink-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            dir="ltr"
            minLength={isSignUp ? 12 : 1}
            name="confirmPassword"
            onChange={(event) => updateField('confirmPassword', event.target.value)}
            placeholder="رمز عبور را دوباره وارد کنید"
            required
            type="password"
            value={form.confirmPassword}
          />
        </label>
      ) : null}

      {error ? (
        <div
          className="rounded-control border border-danger/20 bg-danger-soft px-4 py-3 text-sm leading-7 text-danger"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <Button fullWidth loading={loading} size="large" type="submit">
        {isSignUp ? 'ایجاد حساب' : 'ورود به حساب'}
      </Button>

      <p className="text-center text-sm text-ink-700">
        {isSignUp ? 'قبلاً حساب ساخته‌اید؟' : 'حساب کاربری ندارید؟'}{' '}
        <Link className="font-extrabold text-brand-700 hover:text-brand-800" href={alternateHref}>
          {isSignUp ? 'وارد شوید' : 'ثبت‌نام کنید'}
        </Link>
      </p>
    </form>
  )
}
