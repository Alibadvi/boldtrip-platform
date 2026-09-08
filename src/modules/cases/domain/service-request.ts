import type { CustomerId } from '@/modules/identity'

export const serviceRequestTypes = ['service', 'embassyAppointment'] as const

export type ServiceRequestType = (typeof serviceRequestTypes)[number]

export const serviceRequestTypeLabels: Record<ServiceRequestType, string> = {
  service: 'درخواست خدمت',
  embassyAppointment: 'درخواست وقت سفارت',
}

export const serviceRequestStatuses = [
  'submitted',
  'needsDocuments',
  'underReview',
  'quoted',
  'awaitingPayment',
  'paymentReview',
  'inProgress',
  'completed',
  'rejected',
  'cancelled',
] as const

export type ServiceRequestStatus = (typeof serviceRequestStatuses)[number]

export const serviceRequestStatusLabels: Record<ServiceRequestStatus, string> = {
  submitted: 'ثبت‌شده',
  needsDocuments: 'در انتظار مدارک',
  underReview: 'در حال بررسی',
  quoted: 'هزینه اعلام شده',
  awaitingPayment: 'در انتظار پرداخت',
  paymentReview: 'در حال بررسی پرداخت',
  inProgress: 'در حال انجام',
  completed: 'تکمیل‌شده',
  rejected: 'ردشده',
  cancelled: 'لغوشده',
}

export type ServiceRequestStatusTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning'

export const serviceRequestStatusTones: Record<ServiceRequestStatus, ServiceRequestStatusTone> = {
  submitted: 'neutral',
  needsDocuments: 'warning',
  underReview: 'info',
  quoted: 'info',
  awaitingPayment: 'warning',
  paymentReview: 'warning',
  inProgress: 'info',
  completed: 'success',
  rejected: 'danger',
  cancelled: 'danger',
}

export type ServiceRequestApplicant = {
  applicantsCount: number
  email: string
  fullName: string
  mobile: string
  nationality: string
  passportNumber?: string
}

export type ServiceRequestSummary = {
  countryName?: string
  createdAt: string
  customerId: CustomerId
  id: number | string
  reference: string
  requestType: ServiceRequestType
  serviceTitle?: string
  status: ServiceRequestStatus
  submittedAt?: string
}

export type ServiceRequestDetail = ServiceRequestSummary & {
  applicant: ServiceRequestApplicant
  customerMessage?: string
  quotedAmount?: number
}

export function getServiceRequestTitle(
  request: Pick<ServiceRequestSummary, 'countryName' | 'requestType' | 'serviceTitle'>,
): string {
  if (request.requestType === 'embassyAppointment' && request.countryName) {
    return `وقت سفارت ${request.countryName}`
  }

  return request.serviceTitle ?? 'درخواست خدمت'
}
