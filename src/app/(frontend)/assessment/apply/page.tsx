import type { Metadata } from 'next'
import { requireCurrentCustomer } from '@/modules/identity'
import { AssessmentForm } from '@/modules/cases/presentation/assessment-form'
import { Container } from '@/shared/ui'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'ثبت ارزیابی رایگان',
  robots: { index: false, follow: false },
}
export default async function ApplyAssessmentPage() {
  const customer = await requireCurrentCustomer('/assessment/apply')
  return (
    <Container size="narrow" className="py-10 sm:py-16">
      <AssessmentForm customer={customer} />
    </Container>
  )
}
