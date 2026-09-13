import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

function cachePublicQuery<Args extends unknown[], Result>(
  query: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result> {
  return unstable_cache(query, [], {
    revalidate: 60,
    tags: ['public-catalog'],
  })
}

import type {
  Country,
  CountryPageData,
  EmbassyAppointmentGuide,
  VisaDetail,
  VisaPageData,
  VisaSummary,
} from '../domain/catalog'
import { isCatalogSlug } from '../domain/catalog'

import type { Country as CountryRecord, Visa as VisaRecord } from '@/payload-types'

const publishedOnly = {
  _status: {
    equals: 'published',
  },
} as const

function normalizeEmbassyAppointment(
  value?: CountryRecord['embassyAppointment'],
): EmbassyAppointmentGuide | undefined {
  if (!value) {
    return undefined
  }

  return {
    enabled: Boolean(value.enabled),
    acceptingRequests: Boolean(value.acceptingRequests),
    title: value.title ?? undefined,
    summary: value.summary ?? undefined,
    introduction: value.introduction ?? undefined,
    estimatedTime: value.estimatedTime ?? undefined,
    feeNote: value.feeNote ?? undefined,
    officialSourceUrl: value.officialSourceUrl ?? undefined,
    lastReviewedAt: value.lastReviewedAt ?? undefined,
    requiredDocuments: (value.requiredDocuments ?? []).map((item) => ({ ...item, description: item.description ?? undefined })),
    steps: value.steps ?? [],
    importantNotes: value.importantNotes ?? [],
  }
}

function countryFromRecord(record: CountryRecord): Country {
  return {
    code: record.code,
    featuredOnHomepage: Boolean(record.featuredOnHomepage),
    flag: record.flag ?? undefined,
    id: record.id,
    introduction: record.introduction,
    name: record.name,
    slug: record.slug,
    summary: record.summary,
    embassyAppointment: normalizeEmbassyAppointment(
      record.embassyAppointment,
    ),
  }
}

function visaSummaryFromRecord(record: VisaRecord): VisaSummary {
  return {
    category: record.category,
    id: record.id,
    processingTime: record.processingTime ?? undefined,
    slug: record.slug,
    summary: record.summary,
    title: record.title,
  }
}

function visaDetailFromRecord(record: VisaRecord): VisaDetail {
  return {
    ...visaSummaryFromRecord(record),
    disclaimer: record.disclaimer ?? undefined,
    feeNote: record.feeNote ?? undefined,
    lastReviewedAt: record.lastReviewedAt,
    officialSourceLabel: record.officialSourceLabel ?? undefined,
    officialSourceUrl: record.officialSourceUrl,
    requirements: (record.requirements ?? []).map((item) => ({ ...item, description: item.description ?? undefined })),
    stayLength: record.stayLength ?? undefined,
    steps: record.steps ?? [],
    suitableFor: record.suitableFor ?? undefined,
    validity: record.validity ?? undefined,
  }
}

async function findCountry(slug: string): Promise<Country | null> {
  if (!isCatalogSlug(slug)) {
    return null
  }

  const payload = await getPayload({
    config: configPromise,
  })

  const result = await payload.find({
    collection: 'countries',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        publishedOnly,
      ],
    },
  })

  const record = result.docs[0]

  return record ? countryFromRecord(record) : null
}

export const getCountries = cachePublicQuery(
  async (): Promise<Country[]> => {
    const payload = await getPayload({
      config: configPromise,
    })

    const result = await payload.find({
      collection: 'countries',
      depth: 0,
      draft: false,
      limit: 100,
      overrideAccess: true,
      pagination: false,
      sort: 'sortOrder',
      where: publishedOnly,
    })

    return (result.docs).map(
      countryFromRecord,
    )
  },
)

export const getFeaturedCountries = cachePublicQuery(
  async (): Promise<Country[]> => {
    const payload = await getPayload({
      config: configPromise,
    })

    const result = await payload.find({
      collection: 'countries',
      depth: 0,
      draft: false,
      limit: 4,
      overrideAccess: true,
      pagination: false,
      sort: 'sortOrder',
      where: {
        and: [
          {
            featuredOnHomepage: {
              equals: true,
            },
          },
          publishedOnly,
        ],
      },
    })

    return (result.docs).map(
      countryFromRecord,
    )
  },
)

export const getEmbassyAppointmentCountries = cachePublicQuery(
  async (): Promise<Country[]> => {
    const payload = await getPayload({
      config: configPromise,
    })

    const result = await payload.find({
      collection: 'countries',
      depth: 0,
      draft: false,
      limit: 100,
      overrideAccess: true,
      pagination: false,
      sort: 'sortOrder',
      where: {
        and: [
          {
            'embassyAppointment.enabled': {
              equals: true,
            },
          },
          publishedOnly,
        ],
      },
    })

    return (result.docs)
      .map(countryFromRecord)
      .filter(
        (country) =>
          country.embassyAppointment?.enabled === true,
      )
  },
)

export const getEmbassyAppointmentPage = cachePublicQuery(
  async (countrySlug: string): Promise<Country | null> => {
    const country = await findCountry(countrySlug)

    if (!country?.embassyAppointment?.enabled) {
      return null
    }

    return country
  },
)

export const getCountryPage = cachePublicQuery(
  async (
    slug: string,
  ): Promise<CountryPageData | null> => {
    const country = await findCountry(slug)

    if (!country) {
      return null
    }

    const payload = await getPayload({
      config: configPromise,
    })

    const result = await payload.find({
      collection: 'visas',
      depth: 0,
      draft: false,
      limit: 100,
      overrideAccess: true,
      pagination: false,
      sort: 'sortOrder',
      where: {
        and: [
          {
            country: {
              equals: country.id,
            },
          },
          publishedOnly,
        ],
      },
    })

    return {
      country,
      visas: (
        result.docs
      ).map(visaSummaryFromRecord),
    }
  },
)

export const getVisaPage = cachePublicQuery(
  async (
    countrySlug: string,
    visaSlug: string,
  ): Promise<VisaPageData | null> => {
    if (!isCatalogSlug(visaSlug)) {
      return null
    }

    const country = await findCountry(countrySlug)

    if (!country) {
      return null
    }

    const payload = await getPayload({
      config: configPromise,
    })

    const result = await payload.find({
      collection: 'visas',
      depth: 0,
      draft: false,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [
          {
            country: {
              equals: country.id,
            },
          },
          {
            slug: {
              equals: visaSlug,
            },
          },
          publishedOnly,
        ],
      },
    })

    const record = result.docs[0]

    return record
      ? {
          country,
          visa: visaDetailFromRecord(record),
        }
      : null
  },
)
