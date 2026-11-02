import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getPricingEntries(countryCode?: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pricing-entries',
    depth: 0,
    limit: 100,
    pagination: false,
    sort: 'sortOrder',
    overrideAccess: true,
    where: countryCode
      ? {
          and: [
            { published: { equals: true } },
            { countryCode: { equals: countryCode.toUpperCase() } },
          ],
        }
      : { published: { equals: true } },
  })
  return result.docs
}

export async function getPublishedArticles() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'articles',
    depth: 0,
    limit: 100,
    pagination: false,
    sort: '-lastReviewedAt',
    overrideAccess: true,
    where: { published: { equals: true } },
  })
  return result.docs
}

export async function getPublishedArticle(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'articles',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
  })
  return result.docs[0] ?? null
}

export async function getPublishedCountryQuestions(countryId: number | string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'country-questions',
    depth: 0,
    limit: 30,
    sort: '-answeredAt',
    overrideAccess: true,
    where: { and: [{ country: { equals: countryId } }, { status: { equals: 'published' } }] },
  })
  return result.docs.map((item) => ({
    id: item.id,
    firstName: item.firstName,
    question: item.question,
    answer: item.answer,
    answeredAt: item.answeredAt,
  }))
}
