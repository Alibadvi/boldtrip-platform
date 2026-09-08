import { Refunds } from '@/modules/payments/infrastructure/payload/refunds.collection'
import { privateStorage } from '@/modules/documents/infrastructure/private-storage'
import { AuditEvents, recordChange, recordDelete } from '@/modules/audit/infrastructure/audit-events.collection'
import { AuthRateLimits } from '@/modules/identity/infrastructure/payload/auth-rate-limits.collection'
import { emailAdapter } from '@/modules/notifications/infrastructure/email-adapter'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fa } from '@payloadcms/translations/languages/fa'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { ServiceRequests } from '@/modules/cases'
import {
  Countries,
  Services,
  Visas,
} from '@/modules/catalog'
import { Homepage } from '@/modules/content/infrastructure/payload/homepage.global'
import { CustomerDocuments } from '@/modules/documents'
import { Customers, Staff } from '@/modules/identity'
import { staffCookiePrefix } from '@/modules/identity/domain/session'
import { migrations } from '@/migrations'
import {
  PaymentReceipts,
  PaymentSettings,
} from '@/modules/payments'
import {
  ConsultationBookings,
  ConsultationPage,
  ConsultationSlots,
} from '@/modules/scheduling'
import { serverEnv } from '@/shared/config/server-env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

for (const collection of [Staff, Customers, ServiceRequests, CustomerDocuments, ConsultationBookings, ConsultationSlots, PaymentReceipts, Refunds]) {
  collection.hooks = { ...collection.hooks, afterChange: [...(collection.hooks?.afterChange ?? []), recordChange], afterDelete: [...(collection.hooks?.afterDelete ?? []), recordDelete] }
}

export default buildConfig({
  email: emailAdapter,
  plugins: [privateStorage],
  cookiePrefix: staffCookiePrefix,
  admin: {
    user: Staff.slug,
    theme: 'light',
    components: {
      graphics: {
        Icon: '/app/(payload)/_components/admin-brand#AdminIcon',
        Logo: '/app/(payload)/_components/admin-brand#AdminLogo',
      },
      beforeNavLinks: ['/app/(payload)/_components/admin-brand#AdminNavIntro'],
      views: {
        login: { Component: '/modules/identity/presentation/staff-login#StaffLogin', path: '/login' },
        dashboard: {
          Component: '/app/(payload)/_components/admin-dashboard#AdminDashboard',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — BoldTrip',
    },
  },

  i18n: {
    supportedLanguages: { fa },
    fallbackLanguage: 'fa',
  },

  collections: [
    Refunds,
    AuditEvents,
    AuthRateLimits,
    Staff,
    Customers,
    Countries,
    Visas,
    Services,
    ServiceRequests,
    CustomerDocuments,
    ConsultationSlots,
    ConsultationBookings,
    PaymentReceipts,
  ],

  globals: [
    Homepage,
    ConsultationPage,
    PaymentSettings,
  ],

  cors: [serverEnv.NEXT_PUBLIC_SITE_URL],
  csrf: [serverEnv.NEXT_PUBLIC_SITE_URL],

  db: postgresAdapter({
    prodMigrations: migrations,
    pool: {
      connectionString: serverEnv.DATABASE_URL,
    },
    push: process.env.NODE_ENV !== 'production',
  }),

  editor: lexicalEditor(),
  secret: serverEnv.PAYLOAD_SECRET,
  serverURL: serverEnv.NEXT_PUBLIC_SITE_URL,
  sharp,
  telemetry: false,

  typescript: {
    outputFile: path.resolve(
      dirname,
      'payload-types.ts',
    ),
  },
})
