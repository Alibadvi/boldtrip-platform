import type { CatalogId } from './catalog'

export const serviceKinds = [
  'visa',
  'embassyAppointment',
  'consultation',
  'documentReview',
] as const

export type ServiceKind = (typeof serviceKinds)[number]

export const serviceKindLabels: Record<ServiceKind, string> = {
  visa: 'خدمات ویزا',
  embassyAppointment: 'وقت سفارت',
  consultation: 'مشاوره',
  documentReview: 'بررسی مدارک',
}

export const servicePricingModes = ['fixed', 'quotation'] as const

export type ServicePricingMode = (typeof servicePricingModes)[number]

export const servicePricingModeLabels: Record<ServicePricingMode, string> = {
  fixed: 'قیمت ثابت',
  quotation: 'اعلام قیمت پس از بررسی',
}

export type ServiceBenefit = {
  title: string
  description?: string
}

export type ServiceStep = {
  title: string
  description: string
}

export type ServiceSummary = {
  id: CatalogId
  title: string
  slug: string
  summary: string
  kind: ServiceKind
  pricingMode: ServicePricingMode
  priceAmount?: number
  estimatedDuration?: string
}

export type ServiceDetail = ServiceSummary & {
  description: string
  benefits: ServiceBenefit[]
  steps: ServiceStep[]
}

export function getServicePriceLabel(
  service: Pick<ServiceSummary, 'pricingMode' | 'priceAmount'>,
): string {
  if (service.pricingMode === 'quotation') {
    return 'پس از بررسی اعلام می‌شود'
  }

  if (typeof service.priceAmount !== 'number') {
    return 'قیمت ثبت نشده'
  }

  return `${new Intl.NumberFormat('fa-IR').format(service.priceAmount)} تومان`
}