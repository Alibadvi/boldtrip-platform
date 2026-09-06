export {
  getAvailableConsultationSlots,
  getCustomerConsultationBooking,
  getCustomerConsultationBookings,
} from './application/get-consultation-bookings'
export { getConsultationPage } from './application/get-consultation-page'

export {
  consultationBookingStatuses,
  consultationBookingStatusLabels,
  consultationBookingStatusTones,
} from './domain/booking'

export type {
  ConsultationBooking,
  ConsultationBookingStatus,
  ConsultationSlot,
} from './domain/booking'

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

export { ConsultationBookingForm } from './presentation/consultation-booking-form'
export { ConsultationBookings } from './infrastructure/payload/consultation-bookings.collection'
export { ConsultationPage } from './infrastructure/payload/consultation-page.global'
export { ConsultationSlots } from './infrastructure/payload/consultation-slots.collection'
