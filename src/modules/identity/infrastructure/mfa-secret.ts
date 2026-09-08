import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

function key(): Buffer {
  const hex = process.env.STAFF_MFA_ENCRYPTION_KEY
  if (!hex || !/^[a-f\d]{64}$/i.test(hex)) throw new Error('STAFF_MFA_ENCRYPTION_KEY must be 32 random bytes encoded as hex')
  return Buffer.from(hex, 'hex')
}
export function encryptMfaSecret(value: string): string {
  const nonce = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), nonce)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return [nonce, cipher.getAuthTag(), encrypted].map((part) => part.toString('base64url')).join('.')
}
export function decryptMfaSecret(value: string): string {
  const [nonce, tag, encrypted] = value.split('.').map((part) => Buffer.from(part, 'base64url'))
  const decipher = createDecipheriv('aes-256-gcm', key(), nonce)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}
export function recoveryHash(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}
