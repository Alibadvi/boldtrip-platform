import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload, type Where } from 'payload'

import type { CustomerId } from '@/modules/identity'

import type {
  ManualPaymentSettings,
  PaymentReceiptStatus,
  PaymentReceiptSummary,
} from '../domain/manual-payment'

type ReceiptRecord = {
  amount: number
  createdAt: string
  filename?: string
  id: number | string
  paidAt?: null | string
  reviewerNote?: null | string
  status: PaymentReceiptStatus
}

export const getManualPaymentSettings = cache(
  async (): Promise<ManualPaymentSettings> => {
    const payload = await getPayload({
      config: configPromise,
    })

    const settings = await payload.findGlobal({
      slug: 'payment-settings',
      overrideAccess: true,
    })

    return {
      active: settings.active === true,
      bankName:
        typeof settings.bankName === 'string'
          ? settings.bankName
          : undefined,
      cardholderName:
        typeof settings.cardholderName === 'string'
          ? settings.cardholderName
          : undefined,
      cardNumber:
        typeof settings.cardNumber === 'string'
          ? settings.cardNumber
          : undefined,
      iban:
        typeof settings.iban === 'string'
          ? settings.iban
          : undefined,
      instructions:
        typeof settings.instructions === 'string'
          ? settings.instructions
          : undefined,
    }
  },
)

export const getPaymentReceipts = cache(
  async ({
    customerId,
    serviceRequestId,
    consultationBookingId,
  }: {
    consultationBookingId?: number | string
    customerId: CustomerId
    serviceRequestId?: number | string
  }): Promise<PaymentReceiptSummary[]> => {
    const payload = await getPayload({
      config: configPromise,
    })

    const relationFilter: Where = serviceRequestId
      ? {
          serviceRequest: {
            equals: serviceRequestId,
          },
        }
      : {
          consultationBooking: {
            equals: consultationBookingId,
          },
        }

    const result = await payload.find({
      collection: 'payment-receipts',
      depth: 0,
      limit: 20,
      overrideAccess: true,
      pagination: false,
      sort: '-createdAt',
      where: {
        and: [
          {
            customer: {
              equals: customerId,
            },
          },
          relationFilter,
        ],
      },
    })

    return result.docs.map((receipt) => ({
      amount: receipt.amount,
      createdAt: receipt.createdAt,
      filename: receipt.filename ?? undefined,
      id: receipt.id,
      paidAt: receipt.paidAt ?? undefined,
      reviewerNote: receipt.reviewerNote ?? undefined,
      status: receipt.status,
    }))
  },
)

