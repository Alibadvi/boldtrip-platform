export const consultationDeliveryMethods = [
  'video',
  'phone',
  'inPerson',
] as const

export type ConsultationDeliveryMethod =
  (typeof consultationDeliveryMethods)[number]

export const consultationDeliveryMethodLabels: Record<
  ConsultationDeliveryMethod,
  string
> = {
  video: 'تماس تصویری',
  phone: 'تماس تلفنی',
  inPerson: 'جلسه حضوری',
}

export type ConsultationBenefit = {
  title: string
  description: string
}

export type ConsultationStep = {
  title: string
  description: string
}

export type ConsultationPageData = {
  hero: {
    kicker: string
    title: string
    description: string
  }
  durationMinutes: number
  priceAmount: number
  deliveryMethod: ConsultationDeliveryMethod
  benefits: ConsultationBenefit[]
  steps: ConsultationStep[]
  documentsNote: string
  paymentNote: string
  cancellationPolicy: string
}

export function isConsultationDeliveryMethod(
  value: unknown,
): value is ConsultationDeliveryMethod {
  return (
    typeof value === 'string' &&
    consultationDeliveryMethods.includes(
      value as ConsultationDeliveryMethod,
    )
  )
}

export function formatConsultationPrice(
  priceAmount: number,
): string {
  if (priceAmount <= 0) {
    return 'پس از بررسی اعلام می‌شود'
  }

  return `${new Intl.NumberFormat('fa-IR').format(
    priceAmount,
  )} تومان`
}