import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
export function createTotpSecret(): string {
  const bytes = randomBytes(20)
  let bits = 0, value = 0, result = ''
  for (const byte of bytes) {
    value = (value << 8) | byte; bits += 8
    while (bits >= 5) { result += alphabet[(value >>> (bits - 5)) & 31]; bits -= 5 }
  }
  return result
}
function decode(secret: string): Buffer {
  let bits = 0, value = 0
  const bytes: number[] = []
  for (const char of secret.replaceAll('=', '').toUpperCase()) {
    const index = alphabet.indexOf(char)
    if (index < 0) throw new Error('Invalid authenticator secret')
    value = (value << 5) | index; bits += 5
    if (bits >= 8) { bytes.push((value >>> (bits - 8)) & 255); bits -= 8 }
  }
  return Buffer.from(bytes)
}
export function totpCode(secret: string, step: number, digits = 6): string {
  const counter = Buffer.alloc(8)
  counter.writeBigUInt64BE(BigInt(step))
  const digest = createHmac('sha1', decode(secret)).update(counter).digest()
  const offset = digest[digest.length - 1] & 15
  return ((digest.readUInt32BE(offset) & 0x7fffffff) % (10 ** digits)).toString().padStart(digits, '0')
}
export function verifyTotp(secret: string, code: string, lastStep: number, now = Date.now()): number | null {
  if (!/^\d{6}$/.test(code)) return null
  const current = Math.floor(now / 30000)
  for (const step of [current, current - 1, current + 1]) {
    if (step >= 0 && step > lastStep && timingSafeEqual(Buffer.from(code), Buffer.from(totpCode(secret, step)))) return step
  }
  return null
}
