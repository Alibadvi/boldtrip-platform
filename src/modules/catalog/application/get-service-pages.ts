import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

import { isCatalogSlug } from '../domain/catalog'
import type {
  ServiceBenefit,
  ServiceDetail,
  ServiceStep,
  ServiceSummary,
} from '../domain/service'

type ServiceRecord = Omit<
  ServiceDetail,
  'benefits' | 'steps' | 'priceAmount'
> & {
  benefits?: ServiceBenefit[]
  steps?: ServiceStep[]
  priceAmount?: number | null
  sortOrder?: number
}

const publishedOnly = {
  _status: {
    equals: 'published',
  },
} as const

function toServiceSummary(record: ServiceRecord): ServiceSummary {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    summary: record.summary,
    kind: record.kind,
    pricingMode: record.pricingMode,
    estimatedDuration: record.estimatedDuration,
    ...(typeof record.priceAmount === 'number'
      ? { priceAmount: record.priceAmount }
      : {}),
  }
}

function toServiceDetail(record: ServiceRecord): ServiceDetail {
  return {
    ...toServiceSummary(record),
    description: record.description,
    benefits: record.benefits ?? [],
    steps: record.steps ?? [],
  }
}

export const getServices = cache(async (): Promise<ServiceSummary[]> => {
  const payload = await getPayload({
    config: configPromise,
  })

  const result = await payload.find({
    collection: 'services',
    depth: 0,
    draft: false,
    limit: 100,
    overrideAccess: true,
    pagination: false,
    sort: 'sortOrder',
    where: publishedOnly,
  })

  return (result.docs as unknown as ServiceRecord[]).map(toServiceSummary)
})

export const getServicePage = cache(
  async (slug: string): Promise<ServiceDetail | null> => {
    if (!isCatalogSlug(slug)) {
      return null
    }

    const payload = await getPayload({
      config: configPromise,
    })

    const result = await payload.find({
      collection: 'services',
      depth: 0,
      draft: false,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [
          publishedOnly,
          {
            slug: {
              equals: slug,
            },
          },
        ],
      },
    })

    const service = result.docs[0] as unknown as ServiceRecord | undefined

    return service ? toServiceDetail(service) : null
  },
)