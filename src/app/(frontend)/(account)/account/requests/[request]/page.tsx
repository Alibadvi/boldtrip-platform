import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  getCustomerServiceRequest,
  getServiceRequestTitle,
  serviceRequestStatusLabels,
  serviceRequestStatusTones,
} from '@/modules/cases'
import { requireCurrentCustomer } from '@/modules/identity'
import {
  buttonVariants,
  Card,
  StatusBadge,
} from '@/shared/ui'

type AccountRequestPageProps = {
  params: Promise<{
    request: string
  }>
}

export const metadata: Metadata = {
  title: 'جزئیات درخواست',
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function AccountRequestPage({
  params,
}: AccountRequestPageProps) {
  const customer = await requireCurrentCustomer(
    '/account/requests',
  )

  const { request: requestId } = await params

  const request =
    await getCustomerServiceRequest(
      customer.id,
      requestId,
    )

  if (!request) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Card className="border-brand-100 bg-brand-950 p-7 text-white shadow-raised sm:p-9">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-bold text-brand-200">
              شماره پیگیری
            </p>

            <p
              className="mt-2 font-mono text-lg font-black"
              dir="ltr"
            >
              {request.reference}
            </p>

            <h1 className="mt-5 text-3xl font-black">
              {getServiceRequestTitle(request)}
            </h1>
          </div>

          <StatusBadge
            className="self-start"
            tone={
              serviceRequestStatusTones[
                request.status
              ]
            }
          >
            {
              serviceRequestStatusLabels[
                request.status
              ]
            }
          </StatusBadge>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-white p-7 shadow-card">
          <h2 className="text-xl font-black text-brand-950">
            اطلاعات متقاضی
          </h2>

          <dl className="mt-6 space-y-4">
            <div>
              <dt className="text-sm text-ink-500">
                نام و نام خانوادگی
              </dt>
              <dd className="mt-1 font-bold text-ink-950">
                {request.applicant.fullName}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-ink-500">
                تابعیت
              </dt>
              <dd className="mt-1 font-bold text-ink-950">
                {request.applicant.nationality}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-ink-500">
                تعداد متقاضیان
              </dt>
              <dd className="mt-1 font-bold text-ink-950">
                {new Intl.NumberFormat('fa-IR').format(
                  request.applicant.applicantsCount,
                )}
              </dd>
            </div>

            {request.applicant.passportNumber ? (
              <div>
                <dt className="text-sm text-ink-500">
                  شماره پاسپورت
                </dt>
                <dd
                  className="mt-1 font-bold text-ink-950"
                  dir="ltr"
                >
                  {request.applicant.passportNumber}
                </dd>
              </div>
            ) : null}
          </dl>
        </Card>

        <Card className="border-border bg-white p-7 shadow-card">
          <h2 className="text-xl font-black text-brand-950">
            وضعیت درخواست
          </h2>

          <dl className="mt-6 space-y-4">
            <div>
              <dt className="text-sm text-ink-500">
                وضعیت فعلی
              </dt>
              <dd className="mt-2">
                <StatusBadge
                  tone={
                    serviceRequestStatusTones[
                      request.status
                    ]
                  }
                >
                  {
                    serviceRequestStatusLabels[
                      request.status
                    ]
                  }
                </StatusBadge>
              </dd>
            </div>

            <div>
              <dt className="text-sm text-ink-500">
                تاریخ ثبت
              </dt>
              <dd className="mt-1 font-bold text-ink-950">
                {formatDate(
                  request.submittedAt ??
                    request.createdAt,
                )}
              </dd>
            </div>

            {typeof request.quotedAmount ===
            'number' ? (
              <div>
                <dt className="text-sm text-ink-500">
                  مبلغ اعلام‌شده
                </dt>
                <dd className="mt-1 font-bold text-ink-950">
                  {new Intl.NumberFormat('fa-IR').format(
                    request.quotedAmount,
                  )}{' '}
                  تومان
                </dd>
              </div>
            ) : null}
          </dl>
        </Card>
      </div>

      {request.customerMessage ? (
        <Card className="border-border bg-white p-7 shadow-card">
          <h2 className="text-xl font-black text-brand-950">
            توضیحات ثبت‌شده
          </h2>

          <p className="mt-4 whitespace-pre-line leading-8 text-ink-700">
            {request.customerMessage}
          </p>
        </Card>
      ) : null}

      {request.staffNote ? (
        <Card className="border-blue-200 bg-blue-50 p-7 shadow-card">
          <h2 className="text-xl font-black text-blue-950">
            پیام کارشناس
          </h2>

          <p className="mt-4 whitespace-pre-line leading-8 text-blue-950/75">
            {request.staffNote}
          </p>
        </Card>
      ) : null}

      <Card className="border-brand-100 bg-brand-50 p-6">
        <h2 className="font-black text-brand-950">
          ادامه این درخواست
        </h2>

        <p className="mt-2 leading-8 text-brand-800">
          مدارک را فقط در پرونده همین درخواست
          بارگذاری کنید. پس از اعلام مبلغ نیز رسید
          پرداخت از همین حساب ارسال می‌شود.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/account/requests/${request.id}/documents`}
            className={buttonVariants()}
          >
            مدیریت مدارک
          </Link>
          <Link
            href={`/account/requests/${request.id}/payment`}
            className={buttonVariants({
              variant: 'secondary',
            })}
          >
            پرداخت و ارسال رسید
          </Link>
        </div>
      </Card>

      <Link
        href="/account/requests"
        className={buttonVariants({
          variant: 'secondary',
        })}
      >
        بازگشت به درخواست‌ها
      </Link>
    </div>
  )
}