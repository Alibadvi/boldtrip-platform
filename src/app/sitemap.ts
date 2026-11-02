import type { MetadataRoute } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://boldtrip.ir'
  const payload = await getPayload({ config })
  const [countries, services, visas, articles] = await Promise.all([
    payload.find({
      collection: 'countries',
      where: { _status: { equals: 'published' } },
      depth: 0,
      limit: 0,
      pagination: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'services',
      where: { _status: { equals: 'published' } },
      depth: 0,
      limit: 0,
      pagination: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'visas',
      where: { _status: { equals: 'published' } },
      depth: 0,
      limit: 0,
      pagination: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'articles',
      where: { published: { equals: true } },
      depth: 0,
      limit: 0,
      pagination: false,
      overrideAccess: true,
    }),
  ])
  const paths: MetadataRoute.Sitemap = [
    '/',
    '/assessment',
    '/countries',
    '/services',
    '/services/boldtrip-pricing',
    '/embassy-appointments',
    '/consultation',
    '/faq',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/cancellation-policy',
  ].map((path) => ({ url: `${origin}${path}` }))
  const countrySlugs = new Map(
    countries.docs
      .filter((country) => country.code !== 'AE' && country.slug !== 'united-arab-emirates')
      .map((country) => [country.id, country.slug]),
  )
  for (const country of countries.docs) {
    if (!countrySlugs.has(country.id)) continue
    paths.push({ url: `${origin}/countries/${country.slug}`, lastModified: country.updatedAt })
    if (country.embassyAppointment?.enabled)
      paths.push({
        url: `${origin}/embassy-appointments/${country.slug}`,
        lastModified: country.updatedAt,
      })
  }
  for (const service of services.docs)
    paths.push({ url: `${origin}/services/${service.slug}`, lastModified: service.updatedAt })
  for (const visa of visas.docs) {
    const country = countrySlugs.get(
      typeof visa.country === 'object' ? visa.country.id : visa.country,
    )
    if (country)
      paths.push({
        url: `${origin}/countries/${country}/visas/${visa.slug}`,
        lastModified: visa.updatedAt,
      })
  }
  if (articles.docs.length) paths.push({ url: `${origin}/articles` })
  for (const article of articles.docs)
    paths.push({ url: `${origin}/articles/${article.slug}`, lastModified: article.updatedAt })
  return paths
}
