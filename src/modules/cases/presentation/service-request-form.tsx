'use client'

import { useRouter } from 'next/navigation'
import {
  type FormEvent,
  useState,
} from 'react'

import type { CurrentCustomer } from '@/modules/identity'
import {
  Button,
  Card,
  TextField,
} from '@/shared/ui'

type RequestSource =
  | {
      countryId: number | string
      requestType: 'embassyAppointment'
      title: string
    }
  | {
      requestType: 'service'
      serviceId: number | string
      title: string
    }

type ServiceRequestFormProps = {
  customer: CurrentCustomer
  source: RequestSource
}

type FormState = {
  applicantsCount: string
  customerMessage: string
  email: string
  fullName: string
  mobile: string
  nationality: string
  passportNumber: string
}

type PayloadErrorResponse = {
  doc?: {
    id?: number | string
  }
  errors?: Array<{
    message?: string
  }>
  message?: string
}

async function readResponse(
  response: Response,
): Promise<PayloadErrorResponse | null> {
  return response
    .json()
    .catch(() => null) as Promise<PayloadErrorResponse | null>
}

export function ServiceRequestForm({
  customer,
  source,
}: ServiceRequestFormProps) {
  const router = useRouter()

  const [form, setForm] = useState<FormState>({
    applicantsCount: '1',
    customerMessage: '',
    email: customer.email,
    fullName: customer.name,
    mobile: customer.mobile,
    nationality: '',
    passportNumber: '',
  })

  const [error, setError] = useState<string | null>(
    null,
  )

  const [loading, setLoading] = useState(false)

  const updateField = (
    field: keyof FormState,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const body = {
        applicant: {
          applicantsCount: Number(
            form.applicantsCount,
          ),
          email: form.email.trim().toLowerCase(),
          fullName: form.fullName.trim(),
          mobile: form.mobile.trim(),
          nationality: form.nationality.trim(),
          passportNumber:
            form.passportNumber.trim() || undefined,
        },

        customerMessage:
          form.customerMessage.trim() || undefined,

        requestType: source.requestType,

        ...(source.requestType === 'service'
          ? {
              service: source.serviceId,
            }
          : {
              country: source.countryId,
            }),
      }

      const response = await fetch(
        '/api/service-requests',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      )

      const result = await readResponse(response)

      if (!response.ok) {
        throw new Error(
          result?.errors?.[0]?.message ??
            result?.message ??
            'ثبت درخواست انجام نشد.',
        )
      }

      const requestId = result?.doc?.id

      if (!requestId) {
        throw new Error(
          'درخواست ثبت شد اما شناسه آن دریافت نشد.',
        )
      }

      router.replace(
        `/account/requests/${requestId}`,
      )
      router.refresh()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'ثبت درخواست انجام نشد.',
      )
      setLoading(false)
    }
  }

  return (
    <Card className="border-brand-100 bg-white p-7 shadow-raised sm:p-9">
      <div className="border-b border-border pb-6">
        <p className="text-sm font-bold text-brand-600">
          خدمت انتخاب‌شده
        </p>

        <h1 className="mt-2 text-2xl font-black text-brand-950 sm:text-3xl">
          {source.title}
        </h1>

        <p className="mt-3 leading-8 text-ink-700">
          اطلاعات اولیه متقاضی را وارد کنید. پس از ثبت،
          شماره پیگیری برای شما ساخته می‌شود.
        </p>
      </div>

      <form
        className="mt-7 space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="fullName"
            label="نام و نام خانوادگی"
            maxLength={100}
            onChange={(event) =>
              updateField(
                'fullName',
                event.target.value,
              )
            }
            required
            value={form.fullName}
          />

          <TextField
            id="nationality"
            label="تابعیت"
            maxLength={80}
            onChange={(event) =>
              updateField(
                'nationality',
                event.target.value,
              )
            }
            placeholder="مثلاً ایرانی"
            required
            value={form.nationality}
          />

          <TextField
            className="text-left"
            dir="ltr"
            id="mobile"
            label="شماره موبایل"
            onChange={(event) =>
              updateField(
                'mobile',
                event.target.value,
              )
            }
            required
            type="tel"
            value={form.mobile}
          />

          <TextField
            className="text-left"
            dir="ltr"
            id="email"
            label="ایمیل"
            onChange={(event) =>
              updateField(
                'email',
                event.target.value,
              )
            }
            required
            type="email"
            value={form.email}
          />

          <TextField
            className="text-left"
            dir="ltr"
            id="passportNumber"
            label="شماره پاسپورت"
            onChange={(event) =>
              updateField(
                'passportNumber',
                event.target.value,
              )
            }
            placeholder="در صورت آماده بودن"
            value={form.passportNumber}
          />

          <TextField
            id="applicantsCount"
            label="تعداد متقاضیان"
            max={20}
            min={1}
            onChange={(event) =>
              updateField(
                'applicantsCount',
                event.target.value,
              )
            }
            required
            type="number"
            value={form.applicantsCount}
          />
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink-950">
            توضیحات تکمیلی
          </span>

          <textarea
            className="min-h-36 w-full rounded-control border border-border bg-white px-4 py-3 text-ink-950 outline-none transition placeholder:text-ink-500 focus:border-brand-600"
            maxLength={2000}
            onChange={(event) =>
              updateField(
                'customerMessage',
                event.target.value,
              )
            }
            placeholder="اگر شرایط یا سؤال خاصی دارید، اینجا بنویسید."
            value={form.customerMessage}
          />
        </label>

        {error ? (
          <div
            className="rounded-control border border-danger/20 bg-danger-soft px-4 py-3 text-sm leading-7 text-danger"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <div className="rounded-control bg-brand-50 px-4 py-3 text-sm leading-7 text-brand-800">
          ثبت درخواست به‌معنی تأیید نهایی یا تضمین
          دریافت ویزا و وقت سفارت نیست.
        </div>

        <Button
          fullWidth
          loading={loading}
          size="large"
          type="submit"
        >
          ثبت درخواست و دریافت شماره پیگیری
        </Button>
      </form>
    </Card>
  )
}