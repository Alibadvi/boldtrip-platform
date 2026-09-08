import type { CollectionConfig } from 'payload'

export const AuthRateLimits: CollectionConfig = {
  slug: 'auth-rate-limits', admin: { hidden: true },
  access: { create: () => false, read: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true },
    { name: 'hits', type: 'number', required: true },
    { name: 'windowStartedAt', type: 'date', required: true },
  ],
}
