import type { Metadata } from 'next'
import {
  notFound,
  redirect,
} from 'next/navigation'

import { ServiceRequestForm } from '@/modules/cases'
import { getCountryPage, getServicePage } from '@/modules/catalog'
import { requireCurrentCustomer } from '@/modules/identity'
import { Container } from '@/shared/ui'

type ServiceApplicationPageProps = {
  searchParams: Promise<{ country?: string }>
  params: Promise<{
    service: string
  }>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ثبت درخواست خدمت',
  robots: { index: false, follow: false },
  description:
    'ثبت درخواست جدید و دریافت شماره پیگیری.',
}

export default async function ServiceApplicationPage({
  params, searchParams,
}: ServiceApplicationPageProps) {
  const { service: slug } = await params
  const service = await getServicePage(slug)

  if (!service) {
    notFound()
  }

  const query = await searchParams
  const countryPage = query.country ? await getCountryPage(query.country) : null
  if (query.country && !countryPage) notFound()
  const country = countryPage?.country
  if (service.kind === 'consultation') {
    const selection = new URLSearchParams({ topic: service.title })
    if (country) selection.set('country', country.slug)
    redirect(`/consultation/book?${selection}`)
  }

  if (service.kind === 'embassyAppointment') {
    redirect(country ? `/embassy-appointments/${country.slug}/apply` : '/embassy-appointments')
  }

  const customer = await requireCurrentCustomer(
    `/services/${slug}/apply${country ? `?country=${country.slug}` : ''}`,
  )

  return (
    <section className="bg-linear-to-b from-brand-50 to-canvas py-12 sm:py-18">
      <Container size="narrow">
        <ServiceRequestForm
          customer={customer}
          source={{
            requestType: 'service',
            serviceId: service.id,
            countryId: country?.id,
            title: `${service.title}${country ? ` — ${country.name}` : ''}`,
          }}
        />
      </Container>
    </section>
  )
}