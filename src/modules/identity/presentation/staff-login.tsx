'use client'
import { useState, type FormEvent } from 'react'

export function StaffLogin() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/staff/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.errors?.[0]?.message ?? 'ورود انجام نشد.')
      window.location.assign('/admin')
    } catch (error) { setError(error instanceof Error ? error.message : 'اتصال برقرار نشد.') }
    finally { setBusy(false) }
  }
  return <main className="bt:mx-auto bt:my-16 bt:w-full bt:max-w-md bt:rounded-3xl bt:bg-white bt:p-8 bt:shadow-lg" dir="rtl">
    <h1 className="bt:mb-3 bt:text-2xl bt:font-bold">ورود همکاران BoldTrip</h1>
    <p className="bt:mb-6 bt:leading-7">ایمیل، رمز عبور و کد برنامه احراز هویت را وارد کنید. کد بازیابی یک‌بارمصرف نیز پذیرفته می‌شود.</p>
    <form className="bt:grid bt:gap-4" onSubmit={submit}>
      <label>ایمیل<input className="bt:mt-2 bt:w-full bt:rounded-xl bt:border bt:p-3" name="email" type="email" autoComplete="username" dir="ltr" required /></label>
      <label>رمز عبور<input className="bt:mt-2 bt:w-full bt:rounded-xl bt:border bt:p-3" name="password" type="password" autoComplete="current-password" dir="ltr" required /></label>
      <label>کد احراز هویت<input className="bt:mt-2 bt:w-full bt:rounded-xl bt:border bt:p-3" name="mfaCode" autoComplete="one-time-code" dir="ltr" maxLength={32} /></label>
      <p className="bt:text-sm bt:text-slate-600">اگر ورود دومرحله‌ای هنوز فعال نشده، با مدیر سرور تماس بگیرید.</p>
      {error ? <p role="alert" className="bt:text-red-700">{error}</p> : null}
      <button type="submit" disabled={busy} className="bt:rounded-xl bt:bg-violet-700 bt:p-3 bt:font-bold bt:text-white bt:disabled:opacity-50">{busy ? 'در حال ورود…' : 'ورود به مدیریت'}</button>
    </form>
  </main>
}
