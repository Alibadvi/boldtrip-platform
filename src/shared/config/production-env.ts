import { z } from 'zod'

const settings = z.object({
  DEPLOYMENT_MODE: z.enum(['production', 'preview']).default('production'),
  STORAGE_MODE: z.enum(['local', 's3']).default('local'),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().default('us-east-1'),
  S3_ENDPOINT: z.url().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_FORCE_PATH_STYLE: z.enum(['true', 'false']).default('false'),
  CLAMD_HOST: z.string().optional(),
  CLAMD_PORT: z.coerce.number().int().min(1).max(65535).default(3310),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.email().optional(),
  STAFF_MFA_REQUIRED: z.enum(['true', 'false']).default('false'),
  STAFF_MFA_ENCRYPTION_KEY: z.string().regex(/^[a-fA-F0-9]{64}$/).optional(),
  BOOKING_HOLD_MINUTES: z.coerce.number().int().min(15).max(1440).default(60),
})

export function parseProductionEnv(input: NodeJS.ProcessEnv) {
  const env = settings.parse(Object.fromEntries(Object.entries(input).filter(([, value]) => value !== '')))
  if (
    input.NODE_ENV === 'production' &&
    input.NEXT_PHASE !== 'phase-production-build' &&
    env.DEPLOYMENT_MODE !== 'preview'
  ) {
    if (env.STORAGE_MODE !== 's3' || !env.S3_BUCKET || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY || !env.CLAMD_HOST || !env.RESEND_API_KEY || !env.EMAIL_FROM || env.STAFF_MFA_REQUIRED !== 'true' || !env.STAFF_MFA_ENCRYPTION_KEY || !input.NEXT_PUBLIC_SITE_URL?.startsWith('https://')) {
      throw new Error('Production requires HTTPS, private S3, ClamAV, email, staff MFA. See docs/DEPLOYMENT.md.')
    }
  }
  return env
}

export const productionEnv = parseProductionEnv(process.env)
