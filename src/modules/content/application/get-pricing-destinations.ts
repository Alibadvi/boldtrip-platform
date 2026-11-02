import config from '@payload-config'
import { getPayload } from 'payload'
import type { PricingEntry } from '@/payload-types'
import { normalizeRequestDestination } from '../domain/pricing-destination'

export async function getPricingDestinations(entries: PricingEntry[]) {
  const payload = await getPayload({ config })
  const [services, countries] = await Promise.all([
    payload.find({
      collection: 'services',
      where: { _status: { equals: 'published' } },
      depth: 0,
      pagination: false,
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'countries',
      where: { _status: { equals: 'published' } },
      depth: 0,
      pagination: false,
      limit: 0,
      overrideAccess: true,
    }),
  ])
  return entries.map((entry) => {
    const serviceId =
      typeof entry.targetService === 'object' ? entry.targetService?.id : entry.targetService
    const countryId =
      typeof entry.targetCountry === 'object' ? entry.targetCountry?.id : entry.targetCountry
    const service = services.docs.find((item) => item.id === serviceId)
    const country = countries.docs.find(
      (item) =>
        item.id === countryId ||
        (!countryId && entry.countryCode && item.code === entry.countryCode),
    )
    let actionHref: string | null = null
    if (entry.actionType === 'assessment') actionHref = '/assessment/apply'
    else if (entry.actionType === 'consultation' || service?.kind === 'consultation') {
      const query = new URLSearchParams({ topic: entry.title.slice(0, 120) })
      if (country) query.set('country', country.slug)
      actionHref = `/consultation/book?${query}`
    } else if (
      (entry.actionType === 'embassy' ||
        entry.kind === 'embassy' ||
        service?.kind === 'embassyAppointment') &&
      country?.embassyAppointment?.enabled &&
      country.embassyAppointment.acceptingRequests
    ) {
      actionHref = `/embassy-appointments/${country.slug}/apply`
    } else if (service && service.kind !== 'embassyAppointment') {
      actionHref = `/services/${service.slug}/apply${country ? `?country=${country.slug}` : ''}`
    } else if (!entry.actionType || entry.actionType === 'legacy') {
      actionHref = normalizeRequestDestination(entry.actionHref)
    }
    return { ...entry, actionHref }
  })
}
