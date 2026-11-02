'use server'

import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { z } from 'zod'
import { createHash } from 'node:crypto'
import type { PostgresAdapter } from '@payloadcms/db-postgres'

const inputSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  contact: z.string().trim().min(5).max(200),
  question: z.string().trim().min(10).max(2000),
  consent: z.literal('on'),
})

export async function submitCountryQuestion(countryId: number | string, formData: FormData) {
  const payload = await getPayload({ config: configPromise })
  const country = await payload.findByID({
    collection: 'countries',
    id: countryId,
    depth: 0,
    draft: false,
    overrideAccess: true,
  })
  if (country._status !== 'published' || country.code.toUpperCase() === 'AE')
    throw new Error('این کشور برای دریافت سؤال در دسترس نیست.')
  if (formData.get('website')) return
  const parsed = inputSchema.safeParse({
    firstName: formData.get('firstName'),
    contact: formData.get('contact'),
    question: formData.get('question'),
    consent: formData.get('consent'),
  })
  if (!parsed.success) redirect(`/countries/${country.slug}?question=invalid`)
  const input = parsed.data
  const key = createHash('sha256')
    .update(`country-question:${input.contact.toLowerCase()}`)
    .digest('hex')
  const adapter = payload.db as unknown as PostgresAdapter
  const result = await adapter.pool.query<{ hits: number }>(
    `
    INSERT INTO auth_rate_limits (key, hits, window_started_at, created_at, updated_at)
    VALUES ($1, 1, NOW(), NOW(), NOW())
    ON CONFLICT (key) DO UPDATE SET
      hits = CASE WHEN auth_rate_limits.window_started_at < NOW() - INTERVAL '1 day' THEN 1 ELSE auth_rate_limits.hits + 1 END,
      window_started_at = CASE WHEN auth_rate_limits.window_started_at < NOW() - INTERVAL '1 day' THEN NOW() ELSE auth_rate_limits.window_started_at END,
      updated_at = NOW()
    RETURNING hits`,
    [key],
  )
  if (result.rows[0].hits > 5) redirect(`/countries/${country.slug}?question=limited`)
  await payload.create({
    collection: 'country-questions',
    overrideAccess: true,
    data: {
      firstName: input.firstName.split(/\s+/)[0],
      contact: input.contact,
      question: input.question,
      country: country.id,
      consent: true,
      status: 'pending',
    },
  })
  redirect(`/countries/${country.slug}?question=sent`)
}
