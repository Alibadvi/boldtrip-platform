import type { Metadata } from 'next'
import Link from 'next/link'

import {
  documentKindLabels,
  documentStatusLabels,
  documentStatusTones,
  getCustomerDocuments,
} from '@/modules/documents'
import { requireCurrentCustomer } from '@/modules/identity'
import {
  Card,
  StatusBadge,
} from '@/shared/ui'

import { EmptyAccountState } from '../_components/empty-account-state'

export const metadata: Metadata = {
  title: 'مدارک من',
}

export default async function AccountDocumentsPage() {
  const customer = await requireCurrentCustomer(
    '/account/documents',
  )
  const documents = await getCustomerDocuments(
    customer.id,
  )

  if (documents.length === 0) {
    return (
      <EmptyAccountState
        actionHref="/account/requests"
        actionLabel="مشاهده درخواست‌ها"
        description="مدارک باید برای یک درخواست مشخص بارگذاری شوند. ابتدا درخواست خود را باز کنید."
        title="مدرکی بارگذاری نشده است"
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-white p-7 shadow-card">
        <h1 className="text-2xl font-black text-brand-950">
          مدارک من
        </h1>
        <p className="mt-2 leading-8 text-ink-500">
          نتیجه بررسی مدارک ارسال‌شده برای همه
          درخواست‌ها را اینجا ببینید.
        </p>
      </Card>

      <div className="grid gap-4">
        {documents.map((document) => (
          <Link
            href={`/account/requests/${document.serviceRequestId}/documents`}
            key={document.id}
          >
            <Card className="border-border bg-white p-5 transition hover:border-brand-300 hover:shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-black text-brand-950">
                    {document.label}
                  </h2>
                  <p className="mt-2 text-sm text-ink-500">
                    {
                      documentKindLabels[
                        document.kind
                      ]
                    }{' '}
                    · درخواست{' '}
                    {document.serviceRequestReference ??
                      document.serviceRequestId}
                  </p>
                  {document.reviewerNote ? (
                    <p className="mt-2 text-sm leading-7 text-ink-500">
                      {document.reviewerNote}
                    </p>
                  ) : null}
                </div>
                <StatusBadge
                  tone={
                    documentStatusTones[
                      document.status
                    ]
                  }
                >
                  {
                    documentStatusLabels[
                      document.status
                    ]
                  }
                </StatusBadge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
