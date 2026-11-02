'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import type { CurrentCustomer } from '@/modules/identity'
import { Button, Card, TextField } from '@/shared/ui'
import { assessmentLabels, assessmentSchema, maritalStatusLabels } from '../domain/assessment'

const inputClass =
  'min-h-12 min-w-0 w-full rounded-control border border-border bg-white px-4 py-3 text-base outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100'

export function AssessmentForm({ customer }: { customer: CurrentCustomer }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState<string | number | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const answers = assessmentSchema.safeParse({
      ...Object.fromEntries(
        [
          'whatsapp',
          'age',
          'maritalStatus',
          'education',
          'occupation',
          'travelHistory',
          'refusals',
          'destination',
          'visaType',
          'budget',
        ].map((key) => [key, form.get(key)]),
      ),
      consent: form.get('consent') === 'on',
    })
    if (!answers.success) {
      setError('همه فیلدهای الزامی را با اطلاعات معتبر تکمیل کنید.')
      return
    }
    const files = form
      .getAll('documents')
      .filter((file): file is File => file instanceof File && file.size > 0)
    if (
      files.length > 5 ||
      files.some(
        (file) =>
          file.size > 10 * 1024 * 1024 ||
          !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
      )
    ) {
      setError('حداکثر ۵ فایل PDF، JPG یا PNG، هرکدام تا ۱۰ مگابایت انتخاب کنید.')
      return
    }
    setLoading(true)
    setError('')
    let requestId = savedId
    try {
      if (!requestId) {
        const response = await fetch('/api/customer/service-requests', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestType: 'freeAssessment',
            assessment: answers.data,
            applicant: {
              fullName: form.get('fullName'),
              mobile: form.get('mobile'),
              email: form.get('email'),
              nationality: form.get('nationality'),
              applicantsCount: 1,
            },
            customerMessage: form.get('customerMessage'),
          }),
        })
        const result = await response.json().catch(() => null)
        if (!response.ok || !result?.doc?.id)
          throw new Error(
            result?.errors?.[0]?.message || 'ثبت ارزیابی انجام نشد. دوباره امتحان کنید.',
          )
        requestId = result.doc.id as string | number
        setSavedId(requestId)
      }
      for (const file of files) {
        const upload = new FormData()
        upload.set(
          '_payload',
          JSON.stringify({
            serviceRequest: requestId,
            label: file.name.slice(0, 120),
            kind: 'other',
          }),
        )
        upload.set('file', file)
        const response = await fetch('/api/customer/customer-documents', {
          method: 'POST',
          credentials: 'include',
          body: upload,
        })
        if (!response.ok) {
          // The case already exists. Continue in its documents screen instead of creating it again.
          setError(
            'ارزیابی شما ثبت شد، اما ارسال همه مدارک کامل نشد. از لینک زیر مدارک باقی‌مانده را ارسال کنید.',
          )
          return
        }
      }
      router.replace(`/account/requests/${requestId}`)
      router.refresh()
    } catch (caught) {
      setError(
        requestId
          ? 'ارزیابی ثبت شده است. برای بررسی مدارک و ادامه پیگیری، لینک زیر را باز کنید.'
          : caught instanceof Error
            ? caught.message
            : 'اتصال برقرار نشد. دوباره امتحان کنید.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="min-w-0 border-brand-100 bg-white p-5 shadow-card sm:p-9">
      <h1 className="text-2xl font-black text-brand-950 sm:text-3xl">
        ارزیابی رایگان شرایط و مدارک
      </h1>
      <p className="mt-3 leading-8 text-ink-700">
        فیلدها الزامی هستند؛ بارگذاری مدرک اختیاری است. پس از ثبت، شماره پیگیری و پاسخ کارشناس در
        حساب شما نمایش داده می‌شود. ارزیابی اولیه هزینه‌ای ندارد و تضمین صدور ویزا نیست.
      </p>
      <form className="mt-7 space-y-6" onSubmit={submit}>
        <fieldset
          disabled={loading || savedId !== null}
          className="min-w-0 space-y-6 disabled:opacity-70"
        >
          <legend className="mb-4 font-bold">اطلاعات تماس</legend>
          <div className="grid min-w-0 gap-5 sm:grid-cols-2">
            <TextField
              id="assessment-fullName"
              name="fullName"
              label="نام و نام خانوادگی"
              defaultValue={customer.name}
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
            />
            <TextField
              id="assessment-mobile"
              name="mobile"
              label="تلفن"
              defaultValue={customer.mobile}
              required
              type="tel"
              dir="ltr"
              autoComplete="tel"
            />
            <TextField
              id="assessment-whatsapp"
              name="whatsapp"
              label="واتس‌اپ"
              defaultValue={customer.mobile}
              required
              type="tel"
              dir="ltr"
            />
            <TextField
              id="assessment-email"
              name="email"
              label="ایمیل"
              defaultValue={customer.email}
              required
              type="email"
              dir="ltr"
              autoComplete="email"
            />
            <TextField
              id="assessment-nationality"
              name="nationality"
              label="تابعیت"
              required
              maxLength={80}
            />
            <TextField
              id="assessment-age"
              name="age"
              label="سن"
              required
              type="number"
              min={1}
              max={110}
            />
            <label className="block min-w-0">
              <span className="mb-2 block text-sm font-semibold">وضعیت تأهل</span>
              <select className={inputClass} name="maritalStatus" required defaultValue="">
                <option value="" disabled>
                  انتخاب کنید
                </option>
                {Object.entries(maritalStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {(['education', 'occupation', 'destination', 'visaType', 'budget'] as const).map(
              (key) => (
                <TextField
                  key={key}
                  id={`assessment-${key}`}
                  name={key}
                  label={assessmentLabels[key]}
                  required
                  minLength={key === 'budget' ? 1 : 2}
                  maxLength={key === 'education' || key === 'occupation' ? 160 : 120}
                />
              ),
            )}
          </div>
          {(['travelHistory', 'refusals'] as const).map((key) => (
            <label className="block" key={key}>
              <span className="mb-2 block text-sm font-semibold">{assessmentLabels[key]}</span>
              <textarea
                className={inputClass}
                name={key}
                required
                minLength={2}
                maxLength={2000}
                rows={3}
                placeholder="اگر سابقه‌ای ندارید بنویسید: ندارم"
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">توضیح شرایط</span>
            <textarea
              className={inputClass}
              name="customerMessage"
              required
              minLength={5}
              maxLength={2000}
              rows={4}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">مدارک اختیاری</span>
            <input
              className={`${inputClass} file:me-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-brand-800`}
              name="documents"
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              multiple
              aria-describedby="assessment-upload-help"
            />
            <span id="assessment-upload-help" className="mt-2 block text-sm text-ink-700">
              حداکثر ۵ فایل PDF، JPG یا PNG، هرکدام تا ۱۰ مگابایت. مدارک در بخش عمومی منتشر
              نمی‌شوند. فقط مدارک لازم را ارسال کنید.
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-7">
            <input className="mt-1.5 size-5 shrink-0" name="consent" type="checkbox" required />
            <span>
              <Link
                href="/privacy"
                className="font-bold text-brand-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                سیاست حریم خصوصی
              </Link>{' '}
              را خوانده‌ام و با بررسی اطلاعات و مدارکم برای این درخواست موافقم.
            </span>
          </label>
        </fieldset>
        {error && (
          <p role="alert" className="rounded-xl bg-danger-soft p-4 text-danger">
            {error}
          </p>
        )}
        {savedId ? (
          <Link
            className="block rounded-xl bg-brand-50 p-4 font-bold text-brand-800"
            href={`/account/requests/${savedId}/documents`}
          >
            ارزیابی ثبت شده است؛ مشاهده پرونده و مدیریت مدارک ←
          </Link>
        ) : (
          <Button type="submit" fullWidth loading={loading} size="large">
            ثبت ارزیابی رایگان و دریافت شماره پیگیری
          </Button>
        )}
      </form>
    </Card>
  )
}
