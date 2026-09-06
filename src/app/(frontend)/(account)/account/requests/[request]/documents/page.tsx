import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getCustomerServiceRequest } from '@/modules/cases'
import {
  documentKindLabels,
  documentStatusLabels,
  documentStatusTones,
  DocumentUploadForm,
  getCustomerDocuments,
} from '@/modules/documents'
import { requireCurrentCustomer } from '@/modules/identity'
import {
  buttonVariants,
  Card,
  StatusBadge,
} from '@/shared/ui'

type PageProps = {
  params: Promise<{ request: string }>
}

export const metadata: Metadata = {
  title: 'مدارک درخواست',
}

export const dynamic = 'force-dynamic'

export default async function RequestDocumentsPage({
  params,
}: PageProps) {
  const customer = await requireCurrentCustomer(
    '/account/requests',
  )
  const { request: requestId } = await params

  const request = await getCustomerServiceRequest(
    customer.id,
    requestId,
  )

  if (!request) {
    notFound()
  }

  const documents = await getCustomerDocuments(
    customer.id,
    request.id,
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-5">
        <Card className="border-border bg-white p-7 shadow-card">
          <p className="text-sm font-bold text-ink-500">
            درخواست {request.reference}
          </p>
          <h1 className="mt-2 text-2xl font-black text-brand-950">
            مدارک این درخواست
          </h1>
          <p className="mt-3 leading-8 text-ink-500">
            فقط مدارک مربوط به همین درخواست را
            بارگذاری کنید. فایل‌ها در صفحه عمومی
            قابل مشاهده نیستند.
          </p>
        </Card>

        {documents.length ? (
          <div className="grid gap-3">
            {documents.map((document) => (
              <Card
                className="border-border bg-white p-5"
                key={document.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-black text-brand-950">
                      {document.label}
                    </h2>
                    <p className="mt-1 text-sm text-ink-500">
                      {
                        documentKindLabels[
                          document.kind
                        ]
                      }{' '}
                      · {document.filename}
                    </p>
                    {document.reviewerNote ? (
                      <p className="mt-3 text-sm leading-7 text-ink-500">
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
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-border bg-canvas p-6 text-center text-ink-500">
            هنوز مدرکی برای این درخواست ارسال نشده
            است.
          </Card>
        )}

        <Link
          className={buttonVariants({
            variant: 'secondary',
          })}
          href={`/account/requests/${request.id}`}
        >
          بازگشت به درخواست
        </Link>
      </div>

      <Card className="h-fit border-border bg-white p-6 shadow-card">
        <h2 className="mb-5 text-lg font-black text-brand-950">
          بارگذاری مدرک جدید
        </h2>
        <DocumentUploadForm
          serviceRequestId={request.id}
        />
      </Card>
    </div>
  )
}
