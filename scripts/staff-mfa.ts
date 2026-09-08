import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import { loadEnv } from 'payload/node'
import { createTotpSecret, verifyTotp } from '../src/modules/identity/domain/totp'
import { encryptMfaSecret, recoveryHash } from '../src/modules/identity/infrastructure/mfa-secret'
import { createInterface } from 'node:readline/promises'

loadEnv()
const email = process.argv.find((arg) => arg.startsWith('--email='))?.slice(8)?.trim().toLowerCase()
if (!email) throw new Error('Usage: pnpm staff:mfa --email=staff@example.com (run on the trusted server terminal)')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
try {
  const result = await payload.find({ collection: 'staff', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
  let staff = result.docs[0]
  if (!staff) {
    if (!process.env.BOOTSTRAP_STAFF_PASSWORD) throw new Error('Staff not found. For first-admin setup, supply BOOTSTRAP_STAFF_PASSWORD in the process environment.')
    staff = await payload.create({ collection: 'staff', overrideAccess: true, data: { email, password: process.env.BOOTSTRAP_STAFF_PASSWORD, name: 'مدیر', roles: ['admin'], accountStatus: 'active' } })
  }
  const secret = createTotpSecret()
  const uri = `otpauth://totp/${encodeURIComponent(`BoldTrip:${email}`)}?secret=${secret}&issuer=BoldTrip&algorithm=SHA1&digits=6&period=30`
  console.log('Add this key manually in your authenticator app. Do not share it or commit it:')
  console.log(secret)
  console.log(uri)
  const terminal = createInterface({ input: process.stdin, output: process.stdout })
  const code = await terminal.question('Enter the 6-digit code to activate MFA: ')
  terminal.close()
  const step = verifyTotp(secret, code.trim(), -1)
  if (step === null) throw new Error('Code incorrect; MFA was not changed.')
  const recovery = Array.from({ length: 8 }, () => randomBytes(16).toString('hex'))
  await payload.update({ collection: 'staff', id: staff.id, overrideAccess: true,
    data: { mfaEnabled: true, mfaSecret: encryptMfaSecret(secret), mfaLastStep: step, mfaRecoveryHashes: recovery.map(recoveryHash), sessions: [], ...(process.env.BOOTSTRAP_STAFF_PASSWORD ? { password: process.env.BOOTSTRAP_STAFF_PASSWORD } : {}) },
  })
  console.log('MFA enabled; old sessions invalidated. Store these one-use recovery codes offline:')
  console.log(recovery.join('\n'))
  console.log('Wait for the next authenticator code before signing in.')
} finally { await payload.destroy() }
