import type { ConsultationDeliveryMethod } from './consultation'

export const consultationBookingStatuses = [
  'awaitingPayment',
  'paymentReview',
  'confirmed',
  'cancelled',
  'completed',
] as const

export type ConsultationBookingStatus =
  (typeof consultationBookingStatuses)[number]

export const consultationBookingStatusLabels: Record<
  ConsultationBookingStatus,
  string
> = {
  awaitingPayment: 'در انتظار پرداخت',
  paymentReview: 'در حال بررسی رسید',
  confirmed: 'تأیید شده',
  cancelled: 'لغو شده',
  completed: 'انجام شده',
}

export const consultationBookingStatusTones: Record<
  ConsultationBookingStatus,
  'danger' | 'info' | 'neutral' | 'success' | 'warning'
> = {
  awaitingPayment: 'warning',
  paymentReview: 'info',
  confirmed: 'success',
  cancelled: 'danger',
  completed: 'neutral',
}

export type ConsultationSlot = {
  deliveryMethod: ConsultationDeliveryMethod
  durationMinutes: number
  id: number | string
  priceAmount: number
  startsAt: string
}

export type ConsultationBooking = {
  amount: number
  createdAt: string
  customerId: number | string
  deliveryMethod: ConsultationDeliveryMethod
  durationMinutes: number
  id: number | string
  reference: string
  startsAt: string
  status: ConsultationBookingStatus
  topic: string
}
