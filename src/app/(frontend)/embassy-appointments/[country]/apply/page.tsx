import type { Metadata } from 'next'
import {
  notFound,
  redirect,
} from 'next/navigation'

import { ServiceRequestForm } from '@/modules/cases'
import { getEmbassyAppointmentPage } from '@/modules/catalog'
import { requireCurrentCustomer } from '@/modules/identity'
import { Container } from '@/shared/ui'

type EmbassyApplicationPageProps = {
  params: Promise<{
    country: string
  }>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ثبت درخواست وقت سفارت',
  description:
    'ثبت درخواست وقت سفارت و دریافت شماره پیگیری.',
}

export default async function EmbassyApplicationPage({
  params,
}: EmbassyApplicationPageProps) {
  const { country: slug } = await params
  const country =
    await getEmbassyAppointmentPage(slug)

  if (!country?.embassyAppointment) {
    notFound()
  }

  if (
    !country.embassyAppointment.acceptingRequests
  ) {
    redirect(`/embassy-appointments/${slug}`)
  }

  const customer = await requireCurrentCustomer(
    `/embassy-appointments/${slug}/apply`,
  )

  return (
    <section className="bg-linear-to-b from-brand-50 to-canvas py-12 sm:py-18">
      <Container size="narrow">
        <ServiceRequestForm
          customer={customer}
          source={{
            countryId: country.id,
            requestType: 'embassyAppointment',
            title:
              country.embassyAppointment.title ??
              `درخواست وقت سفارت ${country.name}`,
          }}
        />
      </Container>
    </section>
  )
}