import type { CustomerId } from '@/modules/identity'

export const documentKinds = [
  'passport',
  'identity',
  'photo',
  'financial',
  'application',
  'other',
] as const

export type DocumentKind = (typeof documentKinds)[number]

export const documentKindLabels: Record<DocumentKind, string> = {
  passport: 'پاسپورت',
  identity: 'مدرک هویتی',
  photo: 'عکس پرسنلی',
  financial: 'مدرک مالی',
  application: 'فرم درخواست',
  other: 'سایر مدارک',
}

export const documentStatuses = [
  'pending',
  'accepted',
  'rejected',
] as const

export type DocumentStatus = (typeof documentStatuses)[number]

export const documentStatusLabels: Record<DocumentStatus, string> = {
  pending: 'در انتظار بررسی',
  accepted: 'تأییدشده',
  rejected: 'نیازمند بارگذاری مجدد',
}

export const documentStatusTones: Record<
  DocumentStatus,
  'danger' | 'success' | 'warning'
> = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'danger',
}

export type CustomerDocument = {
  createdAt: string
  customerId: CustomerId
  filename: string
  id: number | string
  kind: DocumentKind
  label: string
  mimeType?: string
  reviewerNote?: string
  serviceRequestId: number | string
  serviceRequestReference?: string
  status: DocumentStatus
  url?: string
}
