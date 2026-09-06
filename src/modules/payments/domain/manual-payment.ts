export const paymentReceiptStatuses = [
  'pending',
  'approved',
  'rejected',
] as const

export type PaymentReceiptStatus =
  (typeof paymentReceiptStatuses)[number]

export const paymentReceiptStatusLabels: Record<
  PaymentReceiptStatus,
  string
> = {
  pending: 'در انتظار بررسی',
  approved: 'تأیید شده',
  rejected: 'رد شده',
}

export type ManualPaymentSettings = {
  active: boolean
  bankName?: string
  cardholderName?: string
  cardNumber?: string
  iban?: string
  instructions?: string
}

export type PaymentReceiptSummary = {
  amount: number
  createdAt: string
  filename?: string
  id: number | string
  paidAt?: string
  reviewerNote?: string
  status: PaymentReceiptStatus
}
