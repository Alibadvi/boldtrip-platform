import type { Metadata } from 'next'
import Link from 'next/link'

import {
  getCustomerServiceRequests,
  getServiceRequestTitle,
  serviceRequestStatusLabels,
  serviceRequestStatusTones,
} from '@/modules/cases'
import { requireCurrentCustomer } from '@/modules/identity'
import {
  Card,
  StatusBadge,
} from '@/shared/ui'

import { EmptyAccountState } from '../_components/empty-account-state'

export const metadata: Metadata = {
  title: 'درخواست‌های من',
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
  }).format(new Date(value))
}

export default async function AccountRequestsPage() {
  const customer = await requireCurrentCustomer(
    '/account/requests',
  )

  const requests =
    await getCustomerServiceRequests(customer.id)

  if (requests.length === 0) {
    return (
      <EmptyAccountState
        actionHref="/services"
        actionLabel="مشاهده خدمات"
        description="پس از ثبت اولین درخواست ویزا یا وقت سفارت، وضعیت آن در این قسمت نمایش داده می‌شود."
        title="هنوز درخواستی ثبت نکرده‌اید"
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-white p-7 shadow-card">
        <h1 className="text-2xl font-black text-brand-950">
          درخواست‌های من
        </h1>

        <p className="mt-2 leading-8 text-ink-700">
          وضعیت پرونده‌ها و درخواست‌های ثبت‌شده را
          از این قسمت پیگیری کنید.
        </p>
      </Card>

      <div className="grid gap-4">
        {requests.map((request) => (
          <Link
            href={`/account/requests/${request.id}`}
            key={request.id}
          >
            <Card className="border-border bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-black text-brand-950">
                      {getServiceRequestTitle(request)}
                    </h2>

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
                  </div>

                  <p
                    className="mt-3 font-mono text-sm text-ink-700"
                    dir="ltr"
                  >
                    {request.reference}
                  </p>

                  <p className="mt-2 text-sm text-ink-500">
                    ثبت در {formatDate(request.createdAt)}
                  </p>
                </div>

                <span className="font-bold text-brand-700">
                  مشاهده درخواست ←
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}