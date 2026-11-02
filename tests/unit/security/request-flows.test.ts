import { describe, expect, it } from 'vitest'
import { normalizeRequestDestination } from '@/modules/content/domain/pricing-destination'
import { assessmentSchema } from '@/modules/cases/domain/assessment'
import { organizationSchema, safeJsonLd } from '@/modules/content/domain/organization'
import { getSafeNextPath } from '@/modules/identity/domain/customer'

describe('service request destinations', () => {
  it.each([
    [
      '/sign-up?next=%2Fembassy-appointments%2Ffrance%2Fapply',
      '/embassy-appointments/france/apply',
    ],
    [
      '/sign-in?next=%2Fservices%2Fvisa-review%2Fapply%3Fcountry%3Dfrance',
      '/services/visa-review/apply?country=france',
    ],
    ['/services/visa-review?country=france', '/services/visa-review/apply?country=france'],
    ['/consultation?country=france&topic=visa', '/consultation/book?country=france&topic=visa'],
    ['/assessment', '/assessment/apply'],
  ])('preserves form selection in %s', (input, expected) =>
    expect(normalizeRequestDestination(input)).toBe(expected),
  )
  it.each([
    '/sign-up?next=/countries',
    '/countries',
    '//attacker.test',
    '/\\attacker.test',
    '/sign-in?next=https://attacker.test',
    '/services/boldtrip-pricing',
    '/admin',
  ])('rejects an unsafe or generic destination %s', (input) =>
    expect(normalizeRequestDestination(input)).toBeNull(),
  )
  it('blocks encoded URL separators and preserves country query through auth links', () => {
    expect(getSafeNextPath('/%2f%2fattacker.test', '/account')).toBe('/account')
    const path = '/services/visa-review/apply?country=france'
    expect(getSafeNextPath(decodeURIComponent(encodeURIComponent(path)))).toBe(path)
  })
})

const valid = {
  whatsapp: '۰۹۱۲۰۰۰۰۰۰۱',
  age: '30',
  maritalStatus: 'single',
  education: 'Bachelor',
  occupation: 'Developer',
  travelHistory: 'None',
  refusals: 'None',
  destination: 'Canada',
  visaType: 'Tourist',
  budget: '5000 CAD',
  consent: true,
}
it('validates and normalizes assessment answers; requires consent and bounds', () => {
  expect(assessmentSchema.parse(valid).whatsapp).toBe('09120000001')
  expect(assessmentSchema.safeParse({ ...valid, consent: false }).success).toBe(false)
  expect(assessmentSchema.safeParse({ ...valid, age: 150 }).success).toBe(false)
  expect(assessmentSchema.safeParse({ ...valid, refusals: '' }).success).toBe(false)
  expect(assessmentSchema.safeParse({ ...valid, privateField: 'unexpected' }).success).toBe(false)
})

it('uses verified contact fields without inventing a registered address or licence', () => {
  const schema = organizationSchema({
    phone: '+989104787878',
    email: 'boldtrip4444@gmail.com',
    instagram: '@boldtrip.visa',
    telegram: '@boldtrip4444',
  })
  expect(schema.sameAs).toEqual([
    'https://www.instagram.com/boldtrip.visa/',
    'https://t.me/boldtrip4444',
  ])
  expect(schema).not.toHaveProperty('address')
  expect(schema).not.toHaveProperty('taxID')
  expect(safeJsonLd({ name: '</script>' })).not.toContain('</script>')
})
