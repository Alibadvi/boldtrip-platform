export { getConsultationPage } from './application/get-consultation-page'

export {
  consultationDeliveryMethodLabels,
  consultationDeliveryMethods,
  formatConsultationPrice,
  isConsultationDeliveryMethod,
} from './domain/consultation'

export type {
  ConsultationBenefit,
  ConsultationDeliveryMethod,
  ConsultationPageData,
  ConsultationStep,
} from './domain/consultation'

export { ConsultationPage } from './infrastructure/payload/consultation-page.global'