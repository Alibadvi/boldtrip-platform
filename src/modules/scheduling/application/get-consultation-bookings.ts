import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

import type { CustomerId } from '@/modules/identity'

import type {
  ConsultationBooking,
  ConsultationBookingStatus,
  ConsultationSlot,
} from '../domain/booking'
import {
  isConsultationDeliveryMethod,
} from '../domain/consultation'

type SlotRecord = {
  active?: boolean
  deliveryMethod?: string
  durationMinutes?: number
  id: number | string
  priceAmount?: number
  startsAt?: string
}

type BookingRecord = {
  amount?: number
  createdAt: string
  customer:
    | CustomerId
    | { id: CustomerId }
  deliveryMethod?: string
  durationMinutes?: number
  id: number | string
  reference: string
  startsAt?: string
  status: ConsultationBookingStatus
  topic: string
}

function toBooking(
  record: BookingRecord,
): ConsultationBooking {
  return {
    amount: record.amount ?? 0,
    createdAt: record.createdAt,
    customerId:
      typeof record.customer === 'object'
        ? record.customer.id
        : record.customer,
    deliveryMethod:
      isConsultationDeliveryMethod(
        record.deliveryMethod,
      )
        ? record.deliveryMethod
        : 'video',
    durationMinutes: record.durationMinutes ?? 45,
    id: record.id,
    reference: record.reference,
    startsAt:
      record.startsAt ?? record.createdAt,
    status: record.status,
    topic: record.topic,
  }
}

export const getAvailableConsultationSlots = cache(
  async (): Promise<ConsultationSlot[]> => {
    const payload = await getPayload({ config: configPromise })
    const [slotResult, bookingResult] =
      await Promise.all([
        payload.find({
          collection: 'consultation-slots',
          depth: 0,
          limit: 100,
          overrideAccess: true,
          pagination: false,
          sort: 'startsAt',
          where: {
            and: [
              { active: { equals: true } },
              {
                startsAt: {
                  greater_than: new Date().toISOString(),
                },
              },
            ],
          },
        }),
        payload.find({
          collection: 'consultation-bookings',
          depth: 0,
          limit: 500,
          overrideAccess: true,
          pagination: false,
          where: {
            and: [{ status: { not_in: ['cancelled', 'expired'] } }, { or: [{ status: { not_equals: 'awaitingPayment' } }, { holdExpiresAt: { exists: false } }, { holdExpiresAt: { greater_than: new Date().toISOString() } }] }],
          },
        }),
      ])

    const bookedSlotIds = new Set(
      (bookingResult.docs as Array<{
        slot?: number | string | { id: number | string }
      }>).map((booking) =>
        typeof booking.slot === 'object'
          ? String(booking.slot.id)
          : String(booking.slot),
      ),
    )

    return slotResult.docs
      .filter(
        (slot) =>
          slot.startsAt &&
          !bookedSlotIds.has(String(slot.id)),
      )
      .map((slot) => ({
        deliveryMethod:
          isConsultationDeliveryMethod(
            slot.deliveryMethod,
          )
            ? slot.deliveryMethod
            : 'video',
        durationMinutes:
          slot.durationMinutes ?? 45,
        id: slot.id,
        priceAmount: slot.priceAmount ?? 0,
        startsAt: slot.startsAt,
      }))
  },
)

export const getCustomerConsultationBookings =
  cache(
    async (
      customerId: CustomerId,
    ): Promise<ConsultationBooking[]> => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'consultation-bookings',
        depth: 0,
        limit: 100,
        overrideAccess: true,
        pagination: false,
        sort: '-startsAt',
        where: {
          customer: {
            equals: customerId,
          },
        },
      })

      return result.docs.map(toBooking)
    },
  )

export const getCustomerConsultationBooking =
  cache(
    async (
      customerId: CustomerId,
      bookingId: string,
    ): Promise<ConsultationBooking | null> => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'consultation-bookings',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        pagination: false,
        where: {
          and: [
            { id: { equals: bookingId } },
            {
              customer: {
                equals: customerId,
              },
            },
          ],
        },
      })

      const booking = result.docs[0] as
        | BookingRecord
        | undefined

      return booking ? toBooking(booking) : null
    },
  )

