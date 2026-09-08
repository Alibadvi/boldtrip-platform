import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

import type { CustomerId } from '@/modules/identity'

import type {
  ServiceRequestApplicant,
  ServiceRequestDetail,
  ServiceRequestStatus,
  ServiceRequestSummary,
  ServiceRequestType,
} from '../domain/service-request'

import type { ServiceRequest as ServiceRequestRecord } from '@/payload-types'

function relationId(
  value:
    | CustomerId
    | {
        id: CustomerId
      },
): CustomerId {
  return typeof value === 'object' ? value.id : value
}

function toSummary(record: ServiceRequestRecord): ServiceRequestSummary {
  const serviceTitle =
    record.service && typeof record.service === 'object' ? record.service.title : undefined

  const countryName =
    record.country && typeof record.country === 'object' ? record.country.name : undefined

  return {
    countryName,
    createdAt: record.createdAt,
    customerId: relationId(record.customer),
    id: record.id,
    reference: record.reference,
    requestType: record.requestType,
    serviceTitle,
    status: record.status,
    submittedAt: record.submittedAt ?? undefined,
  }
}

function toDetail(record: ServiceRequestRecord): ServiceRequestDetail {
  return {
    ...toSummary(record),

    applicant: {
      applicantsCount: record.applicant?.applicantsCount ?? 1,
      email: record.applicant?.email ?? '',
      fullName: record.applicant?.fullName ?? '',
      mobile: record.applicant?.mobile ?? '',
      nationality: record.applicant?.nationality ?? '',
      passportNumber: record.applicant?.passportNumber ?? undefined,
    },

    customerMessage: record.customerMessage ?? undefined,

    quotedAmount: record.quotedAmount ?? undefined,
  }
}

export const getCustomerServiceRequests = cache(
  async (customerId: CustomerId): Promise<ServiceRequestSummary[]> => {
    const payload = await getPayload({
      config: configPromise,
    })

    const result = await payload.find({
      collection: 'service-requests',
      depth: 1,
      limit: 100,
      overrideAccess: true,
      pagination: false,
      sort: '-createdAt',
      where: {
        customer: {
          equals: customerId,
        },
      },
    })

    return (result.docs).map(toSummary)
  },
)

export const getCustomerServiceRequest = cache(
  async (customerId: CustomerId, requestId: string): Promise<ServiceRequestDetail | null> => {
    if (!requestId) {
      return null
    }

    const payload = await getPayload({
      config: configPromise,
    })

    const result = await payload.find({
      collection: 'service-requests',
      depth: 1,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [
          {
            id: {
              equals: requestId,
            },
          },
          {
            customer: {
              equals: customerId,
            },
          },
        ],
      },
    })

    const request = result.docs[0]

    return request ? toDetail(request) : null
  },
)
