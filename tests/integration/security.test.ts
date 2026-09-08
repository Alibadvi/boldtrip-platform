import { beforeAll, afterAll, expect, it } from 'vitest'
import { getPayload, handleEndpoints, type Payload } from 'payload'
import { handleCustomerRequest } from '@/modules/identity/infrastructure/payload/customer-api'
import { encryptMfaSecret, recoveryHash } from '@/modules/identity/infrastructure/mfa-secret'
import { createTotpSecret, totpCode } from '@/modules/identity/domain/totp'
import type { Customer, ConsultationBooking, Staff } from '@/payload-types'

let payload: Payload
let a: Customer, b: Customer, staff: Staff, booking: ConsultationBooking
const password = 'A-long-test-password-42'
const origin = 'http://localhost:3000'
const codeSecret = createTotpSecret()
const pdf = { name: 'example.pdf', mimetype: 'application/pdf', data: Buffer.from('%PDF-1.4\nshowcase only\n%%EOF'), size: 30 }
const asCustomer = (customer: Customer) => ({ ...customer, collection: 'customers' as const })
const asStaff = () => ({ ...staff, collection: 'staff' as const })

beforeAll(async () => {
  if (!process.env.DATABASE_URL || !new URL(process.env.DATABASE_URL).pathname.endsWith('/boldtrip_ci')) throw new Error('Integration checks require the disposable boldtrip_ci database')
  process.env.STAFF_MFA_ENCRYPTION_KEY = '34'.repeat(32)
  const { default: config } = await import('@payload-config')
  payload = await getPayload({ config })
  const stamp = Date.now()
  staff = await payload.create({ collection: 'staff', data: { name: 'CI admin', email: `staff-${stamp}@example.test`, password, roles: ['admin'], accountStatus: 'active', mfaEnabled: true, mfaSecret: encryptMfaSecret(codeSecret), mfaRecoveryHashes: [recoveryHash('ab'.repeat(16))] }, overrideAccess: true })
  a = await payload.create({ collection: 'customers', data: { name: 'Customer A', email: `a-${stamp}@example.test`, password, mobile: '09120000001' } })
  b = await payload.create({ collection: 'customers', data: { name: 'Customer B', email: `b-${stamp}@example.test`, password, mobile: '09120000002' } })
  pdf.size = pdf.data.length
})
afterAll(async () => { if (payload) await payload.destroy() })

it('requires MFA and keeps admin and customer sessions separate', async () => {
  const loginRequest = (body: object) => new Request(`${origin}/api/staff/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', origin }, body: JSON.stringify(body) })
  const denied = await handleEndpoints({ config: payload.config, path: '/api/staff/login', request: loginRequest({ email: staff.email, password }) })
  expect(denied.status).not.toBe(200)
  const code = totpCode(codeSecret, Math.floor(Date.now() / 30000))
  const admin = await handleEndpoints({ config: payload.config, path: '/api/staff/login', request: loginRequest({ email: staff.email, password, mfaCode: code }) })
  expect(admin.status).toBe(200)
  const adminCookie = admin.headers.getSetCookie().find((value) => value.startsWith('boldtrip-admin-token='))?.split(';')[0]
  expect(adminCookie).toBeTruthy()
  const customer = await handleCustomerRequest(new Request(`${origin}/api/customer/customers/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', origin, cookie: adminCookie! }, body: JSON.stringify({ email: a.email, password }) }), ['customers', 'login'], payload.config)
  expect(customer.status).toBe(200)
  expect(customer.headers.getSetCookie().some((value) => value.startsWith('boldtrip-admin-token='))).toBe(false)
  const customerCookie = customer.headers.getSetCookie().find((value) => value.startsWith('boldtrip-customer-token='))?.split(';')[0]
  const both = `${adminCookie}; ${customerCookie}`
  const me = await handleCustomerRequest(new Request(`${origin}/api/customer/customers/me`, { headers: { cookie: both } }), ['customers', 'me'], payload.config)
  expect((await me.json()).user.id).toBe(a.id)
  const auth = await payload.auth({ headers: new Headers({ cookie: both }) })
  expect(auth.user?.collection).toBe('staff')
  const replay = await handleEndpoints({ config: payload.config, path: '/api/staff/login', request: loginRequest({ email: staff.email, password, mfaCode: code }) })
  expect(replay.status).not.toBe(200)
})

it('allows only one concurrent booking for a slot and rejects manual confirmation', async () => {
  const slot = await payload.create({ collection: 'consultation-slots', data: { startsAt: new Date(Date.now() + 86400000).toISOString(), durationMinutes: 45, priceAmount: 500000, active: true, deliveryMethod: 'video' } })
  const results = await Promise.allSettled([a, b].map((customer) => payload.create({ collection: 'consultation-bookings', data: { slot: slot.id, customer: customer.id, topic: 'Test booking', reference: 'server-overwrites', amount: 1, startsAt: slot.startsAt, durationMinutes: 45, deliveryMethod: 'video', status: 'awaitingPayment' }, user: asCustomer(customer), overrideAccess: false })))
  expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
  const result = results.find((result) => result.status === 'fulfilled')!
  if (result.status !== 'fulfilled') throw new Error('No booking')
  booking = result.value
  await expect(payload.update({ collection: 'consultation-bookings', id: booking.id, data: { status: 'confirmed' }, user: asStaff(), overrideAccess: false })).rejects.toThrow()
})

it('serializes competing receipt decisions and records a single final audit event', async () => {
  const receipt = await payload.create({ collection: 'payment-receipts', data: { customer: a.id, payableType: 'consultation', consultationBooking: booking.id, amount: 1, status: 'pending' }, file: pdf, user: asStaff(), overrideAccess: false })
  const decisions = await Promise.allSettled(['approved', 'rejected'].map((status) => payload.update({ collection: 'payment-receipts', id: receipt.id, data: { status: status as 'approved' | 'rejected', reviewerNote: 'Reviewed against bank statement' }, user: asStaff(), overrideAccess: false })))
  expect(decisions.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
  const finalReceipt = await payload.findByID({ collection: 'payment-receipts', id: receipt.id })
  const finalBooking = await payload.findByID({ collection: 'consultation-bookings', id: booking.id })
  expect(finalBooking.status).toBe(finalReceipt.status === 'approved' ? 'confirmed' : 'awaitingPayment')
  const events = await payload.find({ collection: 'audit-events', where: { and: [{ targetCollection: { equals: 'payment-receipts' } }, { targetId: { equals: String(receipt.id) } }, { action: { equals: 'update' } }] } })
  expect(events.totalDocs).toBe(1)
})

it('rejects another customer’s document and denies its metadata', async () => {
  const country = await payload.create({ collection: 'countries', data: { name: 'Test country', slug: `test-${Date.now()}`, summary: 'Test destination', _status: 'draft' }, draft: true })
  const request = await payload.create({ collection: 'service-requests', data: { customer: a.id, requestType: 'embassyAppointment', country: country.id, submittedAt: new Date().toISOString(), reference: `OWN-${Date.now()}`, status: 'submitted', applicant: { fullName: 'Test Customer', nationality: 'Iran', applicantsCount: 1, mobile: '09120000001', email: a.email } }, overrideAccess: true })
  await expect(payload.create({ collection: 'customer-documents', data: { customer: b.id, serviceRequest: request.id, label: 'Foreign document', kind: 'other', status: 'pending' }, file: pdf, user: asCustomer(b), overrideAccess: false })).rejects.toThrow()
  const doc = await payload.create({ collection: 'customer-documents', data: { customer: a.id, serviceRequest: request.id, label: 'Owned document', kind: 'other', status: 'pending' }, file: pdf, user: asCustomer(a), overrideAccess: false })
  await expect(payload.findByID({ collection: 'customer-documents', id: doc.id, user: asCustomer(b), overrideAccess: false })).rejects.toThrow()
  expect((await payload.findByID({ collection: 'customer-documents', id: doc.id, user: asCustomer(a), overrideAccess: false })).id).toBe(doc.id)
})
