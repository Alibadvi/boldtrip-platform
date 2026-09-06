import type { Metadata } from 'next'
import {
  notFound,
  redirect,
} from 'next/navigation'

import { ServiceRequestForm } from '@/modules/cases'
import { getServicePage } from '@/modules/catalog'
import { requireCurrentCustomer } from '@/modules/identity'
import { Container } from '@/shared/ui'

type ServiceApplicationPageProps = {
  params: Promise<{
    service: string
  }>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ثبت درخواست خدمت',
  description:
    'ثبت درخواست جدید و دریافت شماره پیگیری.',
}

export default async function ServiceApplicationPage({
  params,
}: ServiceApplicationPageProps) {
  const { service: slug } = await params
  const service = await getServicePage(slug)

  if (!service) {
    notFound()
  }

  if (service.kind === 'consultation') {
    redirect('/consultation')
  }

  if (service.kind === 'embassyAppointment') {
    redirect('/embassy-appointments')
  }

  const customer = await requireCurrentCustomer(
    `/services/${slug}/apply`,
  )

  return (
    <section className="bg-linear-to-b from-brand-50 to-canvas py-12 sm:py-18">
      <Container size="narrow">
        <ServiceRequestForm
          customer={customer}
          source={{
            requestType: 'service',
            serviceId: service.id,
            title: service.title,
          }}
        />
      </Container>
    </section>
  )
}