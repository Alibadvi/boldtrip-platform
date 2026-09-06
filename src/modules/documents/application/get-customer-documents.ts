import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

import type { CustomerId } from '@/modules/identity'

import type {
  CustomerDocument,
  DocumentKind,
  DocumentStatus,
} from '../domain/customer-document'

type Relation =
  | number
  | string
  | {
      id: number | string
      reference?: string
    }

type DocumentRecord = {
  createdAt: string
  customer: Relation
  filename?: null | string
  id: number | string
  kind: DocumentKind
  label: string
  mimeType?: null | string
  reviewerNote?: null | string
  serviceRequest: Relation
  status: DocumentStatus
  url?: null | string
}

type FindResult = {
  docs: DocumentRecord[]
}

function relationId(value: Relation): number | string {
  return typeof value === 'object' ? value.id : value
}

function toDocument(record: DocumentRecord): CustomerDocument {
  return {
    createdAt: record.createdAt,
    customerId: relationId(record.customer),
    filename: record.filename ?? record.label,
    id: record.id,
    kind: record.kind,
    label: record.label,
    mimeType: record.mimeType ?? undefined,
    reviewerNote: record.reviewerNote ?? undefined,
    serviceRequestId: relationId(record.serviceRequest),
    serviceRequestReference:
      typeof record.serviceRequest === 'object'
        ? record.serviceRequest.reference
        : undefined,
    status: record.status,
    url: record.url ?? undefined,
  }
}

export const getCustomerDocuments = cache(
  async (
    customerId: CustomerId,
    serviceRequestId?: number | string,
  ): Promise<CustomerDocument[]> => {
    const payload = await getPayload({ config: configPromise })
    const find = payload.find.bind(payload) as unknown as (
      args: Record<string, unknown>,
    ) => Promise<FindResult>

    const conditions: Record<string, unknown>[] = [
      {
        customer: {
          equals: customerId,
        },
      },
    ]

    if (serviceRequestId !== undefined) {
      conditions.push({
        serviceRequest: {
          equals: serviceRequestId,
        },
      })
    }

    const result = await find({
      collection: 'customer-documents',
      depth: 1,
      limit: 100,
      overrideAccess: true,
      pagination: false,
      sort: '-createdAt',
      where: {
        and: conditions,
      },
    })

    return result.docs.map(toDocument)
  },
)
