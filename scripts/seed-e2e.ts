import { loadEnv } from 'payload/node'
import { getPayload } from 'payload'

loadEnv()
if (!process.env.DATABASE_URL || new URL(process.env.DATABASE_URL).pathname !== '/boldtrip_ci') throw new Error('E2E fixtures require the disposable boldtrip_ci database.')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
try {
  const country = await payload.create({ collection: 'countries', data: {
    flag: '🇫🇷', sortOrder: 100, name: 'فرانسه آزمایشی', slug: 'e2e-france', code: 'ZZ', summary: 'Synthetic test destination', introduction: 'Synthetic destination for CI only', _status: 'published',
    embassyAppointment: { enabled: true, acceptingRequests: true, title: 'وقت سفارت فرانسه آزمایشی' },
  } })
  const service = await payload.create({ collection: 'services', data: {
    sortOrder: 100, title: 'بررسی ویزای آزمایشی', slug: 'e2e-visa-review', kind: 'documentReview', summary: 'Synthetic test service', description: 'Synthetic test service for CI only', pricingMode: 'quotation', _status: 'published', benefits: [{ title: 'Review' }], steps: [{ title: 'Submit', description: 'Submit documents' }],
  } })
  for (const entry of [
    { title: 'E2E Embassy France', kind: 'embassy' as const, actionType: 'embassy' as const },
    { title: 'E2E Visa France', kind: 'visa' as const, actionType: 'service' as const, targetService: service.id },
    { title: 'E2E Consultation France', kind: 'other' as const, actionType: 'consultation' as const },
  ]) await payload.create({ collection: 'pricing-entries', data: { ...entry, targetCountry: country.id, published: true, priceLabel: 'Synthetic CI price' } })
  await payload.create({ collection: 'consultation-slots', data: { startsAt: new Date(Date.now() + 2 * 86400000).toISOString(), durationMinutes: 45, priceAmount: 500000, active: true, deliveryMethod: 'video' } })
} finally { await payload.destroy() }

// Standalone Payload scripts can retain adapter handles after cleanup.
process.exit(0)
