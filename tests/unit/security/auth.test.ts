// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { totpCode, verifyTotp, createTotpSecret } from '@/modules/identity/domain/totp'
import { encryptMfaSecret, decryptMfaSecret, recoveryHash } from '@/modules/identity/infrastructure/mfa-secret'
import { customerSessionHeaders } from '@/modules/identity/application/customer-session'
import { parseProductionEnv } from '@/shared/config/production-env'

const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'
describe('staff authenticator', () => {
  it.each([[59, '94287082'], [1111111109, '07081804'], [1111111111, '14050471'], [1234567890, '89005924'], [2000000000, '69279037'], [20000000000, '65353130']])('matches RFC 6238 at %i seconds', (time, expected) => {
    expect(totpCode(secret, Math.floor(Number(time) / 30), 8)).toBe(expected)
  })
  it('rejects replay, stale codes and malformed codes', () => {
    const code = totpCode(secret, 100)
    expect(verifyTotp(secret, code, 99, 3000000)).toBe(100)
    expect(verifyTotp(secret, code, 100, 3000000)).toBeNull()
    expect(verifyTotp(secret, code, -1, 3090000)).toBeNull()
    expect(verifyTotp(secret, '123', -1, 3000000)).toBeNull()
    expect(createTotpSecret()).toMatch(/^[A-Z2-7]{32}$/)
  })
  it('authenticates encrypted secrets and hashes recovery codes', () => {
    process.env.STAFF_MFA_ENCRYPTION_KEY = '12'.repeat(32)
    const encrypted = encryptMfaSecret(secret)
    expect(decryptMfaSecret(encrypted)).toBe(secret)
    const parts = encrypted.split('.')
    parts[2] = Buffer.from('tampered').toString('base64url')
    expect(() => decryptMfaSecret(parts.join('.'))).toThrow()
    expect(recoveryHash('ABCD')).toBe(recoveryHash('abcd'))
    delete process.env.STAFF_MFA_ENCRYPTION_KEY
  })
})
it('never forwards the admin cookie or caller authorization to the customer API', () => {
  const result = customerSessionHeaders(new Headers({ cookie: 'boldtrip-admin-token=staff; boldtrip-customer-token=customer', authorization: 'JWT forged' }))
  expect(result.get('authorization')).toBe('JWT customer')
  expect(result.has('cookie')).toBe(false)
  expect(customerSessionHeaders(new Headers({ cookie: 'boldtrip-admin-token=staff' })).has('authorization')).toBe(false)
})
it('refuses production with local storage or missing infrastructure', () => {
  expect(() => parseProductionEnv({ NODE_ENV: 'production' })).toThrow()
  expect(() => parseProductionEnv({ NODE_ENV: 'development' })).not.toThrow()
})
