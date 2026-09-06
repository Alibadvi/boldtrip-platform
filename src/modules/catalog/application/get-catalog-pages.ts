import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

import type {
  Country,
  CountryPageData,
  EmbassyAppointmentGuide,
  VisaDetail,
  VisaPageData,
  VisaSummary,
} from '../domain/catalog'
import { isCatalogSlug } from '../domain/catalog'

type CountryRecord = Omit<Country, 'embassyAppointment'> & {
  embassyAppointment?: Partial<EmbassyAppointmentGuide> | null
  sortOrder?: number
}

type VisaRecord = VisaDetail & {
  country: number | string | { id: number | string }
  sortOrder?: number
}

const publishedOnly = {
  _status: {
    equals: 'published',
  },
} as const

function normalizeEmbassyAppointment(
  value?: Partial<EmbassyAppointmentGuide> | null,
): EmbassyAppointmentGuide | undefined {
  if (!value) {
    return undefined
  }

  return {
    enabled: Boolean(value.enabled),
    acceptingRequests: Boolean(value.acceptingRequests),
    title: value.title,
    summary: value.summary,
    introduction: value.introduction,
    estimatedTime: value.estimatedTime,
    feeNote: value.feeNote,
    officialSourceUrl: value.officialSourceUrl,
    lastReviewedAt: value.lastReviewedAt,
    requiredDocuments: value.requiredDocuments ?? [],
    steps: value.steps ?? [],
    importantNotes: value.importantNotes ?? [],
  }
}

function countryFromRecord(record: CountryRecord): Country {
  return {
    code: record.code,
    featuredOnHomepage: Boolean(record.featuredOnHomepage),
    flag: record.flag,
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
    processingTime: record.processingTime,
    slug: record.slug,
    summary: record.summary,
    title: record.title,
  }
}

function visaDetailFromRecord(record: VisaRecord): VisaDetail {
  return {
    ...visaSummaryFromRecord(record),
    disclaimer: record.disclaimer,
    feeNote: record.feeNote,
    lastReviewedAt: record.lastReviewedAt,
    officialSourceLabel: record.officialSourceLabel,
    officialSourceUrl: record.officialSourceUrl,
    requirements: record.requirements ?? [],
    stayLength: record.stayLength,
    steps: record.steps ?? [],
    suitableFor: record.suitableFor,
    validity: record.validity,
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

  const record = result.docs[0] as
    | unknown as CountryRecord
    | undefined

  return record ? countryFromRecord(record) : null
}

export const getCountries = cache(
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

    return (result.docs as unknown as CountryRecord[]).map(
      countryFromRecord,
    )
  },
)

export const getFeaturedCountries = cache(
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

    return (result.docs as unknown as CountryRecord[]).map(
      countryFromRecord,
    )
  },
)

export const getEmbassyAppointmentCountries = cache(
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

    return (result.docs as unknown as CountryRecord[])
      .map(countryFromRecord)
      .filter(
        (country) =>
          country.embassyAppointment?.enabled === true,
      )
  },
)

export const getEmbassyAppointmentPage = cache(
  async (countrySlug: string): Promise<Country | null> => {
    const country = await findCountry(countrySlug)

    if (!country?.embassyAppointment?.enabled) {
      return null
    }

    return country
  },
)

export const getCountryPage = cache(
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
        result.docs as unknown as VisaRecord[]
      ).map(visaSummaryFromRecord),
    }
  },
)

export const getVisaPage = cache(
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

    const record = result.docs[0] as
      | unknown as VisaRecord
      | undefined

    return record
      ? {
          country,
          visa: visaDetailFromRecord(record),
        }
      : null
  },
)