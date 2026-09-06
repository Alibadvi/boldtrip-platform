'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'

import { Button, TextField } from '@/shared/ui'

import {
  documentKinds,
  documentKindLabels,
  type DocumentKind,
} from '../domain/customer-document'

type DocumentUploadFormProps = {
  serviceRequestId: number | string
}

type ErrorResponse = {
  errors?: Array<{ message?: string }>
  message?: string
}

const maximumFileSize = 10 * 1024 * 1024

export function DocumentUploadForm({
  serviceRequestId,
}: DocumentUploadFormProps) {
  const router = useRouter()
  const [kind, setKind] = useState<DocumentKind>('passport')
  const [label, setLabel] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    const formElement = event.currentTarget
    setError(null)

    if (!file) {
      setError('یک فایل انتخاب کنید.')
      return
    }

    if (file.size > maximumFileSize) {
      setError('حجم فایل نباید بیشتر از ۱۰ مگابایت باشد.')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append(
        '_payload',
        JSON.stringify({
          kind,
          label: label.trim(),
          serviceRequest: serviceRequestId,
        }),
      )

      const response = await fetch('/api/customer-documents', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const result = (await response
        .json()
        .catch(() => null)) as ErrorResponse | null

      if (!response.ok) {
        throw new Error(
          result?.errors?.[0]?.message ??
            result?.message ??
            'بارگذاری مدرک انجام نشد.',
        )
      }

      formElement.reset()
      setFile(null)
      setLabel('')
      setKind('passport')
      router.refresh()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'بارگذاری مدرک انجام نشد.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="documentLabel"
          label="عنوان مدرک"
          maxLength={120}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="مثلاً صفحه اول پاسپورت"
          required
          value={label}
        />

        <label className="block space-y-2">
          <span className="block text-sm font-semibold text-ink-950">
            نوع مدرک
          </span>
          <select
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 text-ink-950 outline-none focus:border-brand-600"
            onChange={(event) =>
              setKind(event.target.value as DocumentKind)
            }
            value={kind}
          >
            {documentKinds.map((item) => (
              <option key={item} value={item}>
                {documentKindLabels[item]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="block text-sm font-semibold text-ink-950">
          فایل
        </span>
        <input
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="block w-full rounded-control border border-dashed border-brand-200 bg-brand-50 px-4 py-5 text-sm text-ink-700 file:ml-4 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:font-bold file:text-white"
          onChange={(event) =>
            setFile(event.target.files?.[0] ?? null)
          }
          required
          type="file"
        />
        <p className="text-xs leading-6 text-ink-500">
          PDF، JPG یا PNG — حداکثر ۱۰ مگابایت
        </p>
      </label>

      {error ? (
        <p
          className="rounded-control bg-danger-soft px-4 py-3 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <Button loading={loading} type="submit">
        بارگذاری مدرک
      </Button>
    </form>
  )
}
