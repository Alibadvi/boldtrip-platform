import type { EmailAdapter } from 'payload'
import { productionEnv } from '@/shared/config/production-env'

function addresses(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(addresses)
  if (typeof value === 'string') return [value]
  if (value && typeof value === 'object' && 'address' in value && typeof value.address === 'string') return [value.address]
  return []
}

export const emailAdapter: EmailAdapter = ({ payload }) => ({
  name: 'boldtrip-resend',
  defaultFromAddress: productionEnv.EMAIL_FROM ?? 'no-reply@boldtrip.local',
  defaultFromName: 'BoldTrip',
  async sendEmail(message) {
    if (!productionEnv.RESEND_API_KEY) {
      // Development does not emit reset tokens, addresses or message bodies into logs.
      payload.logger.info('Email delivery is disabled; configure RESEND_API_KEY and EMAIL_FROM.')
      return { delivered: false }
    }
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${productionEnv.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `BoldTrip <${productionEnv.EMAIL_FROM}>`,
        to: addresses(message.to),
        subject: message.subject,
        html: typeof message.html === 'string' ? message.html : undefined,
        text: typeof message.text === 'string' ? message.text : undefined,
      }),
    })
    if (!response.ok) throw new Error(`Email delivery failed (${response.status})`)
    return response.json()
  },
})
