import { createHash } from 'node:crypto'
import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import { APIError, type CollectionBeforeOperationHook, type CollectionBeforeLoginHook } from 'payload'
import { verifyTotp } from '../../domain/totp'
import { decryptMfaSecret, recoveryHash } from '../mfa-secret'

export const limitAuthAttempts: CollectionBeforeOperationHook = async ({ operation, args, req, collection }) => {
  if (!['login', 'forgotPassword', 'resetPassword'].includes(operation)) return
  if (collection.slug === 'staff' && operation === 'resetPassword') {
    throw new APIError('بازیابی دسترسی کارکنان از طریق مدیر سرور انجام می‌شود.', 403)
  }
  const data = 'data' in args ? args.data : undefined
  if (operation === 'resetPassword' && data && typeof data === 'object' && 'password' in data) {
    if (typeof data.password !== 'string' || data.password.length < 12 || data.password.length > 128) throw new APIError('رمز عبور باید بین ۱۲ تا ۱۲۸ کاراکتر باشد.', 400)
  }
  const email = data && typeof data === 'object' && 'email' in data && typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
  const token = data && typeof data === 'object' && 'token' in data && typeof data.token === 'string' ? data.token : ''
  const key = createHash('sha256').update(`${collection.slug}:${operation}:${email || token || 'unknown'}`).digest('hex')
  const adapter = req.payload.db as unknown as PostgresAdapter
  // Independent of a failed login transaction so rejected attempts remain counted.
  const result = await adapter.pool.query<{ hits: number }>(`
    INSERT INTO auth_rate_limits (key, hits, window_started_at, created_at, updated_at)
    VALUES ($1, 1, NOW(), NOW(), NOW())
    ON CONFLICT (key) DO UPDATE SET
      hits = CASE WHEN auth_rate_limits.window_started_at < NOW() - INTERVAL '15 minutes' THEN 1 ELSE auth_rate_limits.hits + 1 END,
      window_started_at = CASE WHEN auth_rate_limits.window_started_at < NOW() - INTERVAL '15 minutes' THEN NOW() ELSE auth_rate_limits.window_started_at END,
      updated_at = NOW()
    RETURNING hits`, [key])
  if (result.rows[0].hits > 10) throw new APIError('تعداد تلاش‌ها زیاد است. ۱۵ دقیقه دیگر امتحان کنید.', 429)
}

export const verifyStaffMfa: CollectionBeforeLoginHook = async ({ user, req }) => {
  if (user.accountStatus !== 'active') throw new APIError('ورود به این حساب امکان‌پذیر نیست.', 403)
  if (!user.mfaEnabled) {
    if (process.env.STAFF_MFA_REQUIRED === 'true') throw new APIError('ابتدا احراز هویت دومرحله‌ای را با مدیر سرور فعال کنید.', 403)
    return user
  }
  const code = typeof req.data?.mfaCode === 'string' ? req.data.mfaCode.trim() : ''
  const adapter = req.payload.db as unknown as PostgresAdapter
  const transactionID = await req.transactionID
  const tx = transactionID == null ? undefined : adapter.sessions[transactionID]?.db
  if (!tx || !('execute' in tx)) throw new APIError('ورود امن فعلاً ممکن نیست.', 503)
  const table = adapter.tables.staff
  await tx.execute(sql`SELECT ${table.id} FROM ${table} WHERE ${table.id} = ${user.id} FOR UPDATE`)
  const current = await req.payload.findByID({ collection: 'staff', id: user.id, depth: 0, overrideAccess: true, showHiddenFields: true, req })
  if (!current.mfaSecret) throw new APIError('تنظیمات ورود دومرحله‌ای کامل نیست.', 403)
  const step = verifyTotp(decryptMfaSecret(current.mfaSecret), code, current.mfaLastStep ?? -1)
  const hashes = Array.isArray(current.mfaRecoveryHashes) ? current.mfaRecoveryHashes.filter((value): value is string => typeof value === 'string') : []
  const hash = recoveryHash(code)
  const recovery = /^[a-f\d]{32}$/i.test(code) && hashes.includes(hash)
  if (step === null && !recovery) throw new APIError('کد ورود نادرست یا منقضی است.', 401)
  await req.payload.update({ collection: 'staff', id: user.id, overrideAccess: true, req,
    data: step !== null ? { mfaLastStep: step } : { mfaRecoveryHashes: hashes.filter((value) => value !== hash) },
  })
  return user
}
