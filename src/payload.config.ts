import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Homepage } from '@/modules/content/infrastructure/payload/homepage.global'
import { Staff } from '@/modules/identity'
import { serverEnv } from '@/shared/config/server-env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Staff.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — BoldTrip',
    },
  },
  collections: [Staff],
  globals: [Homepage],
  cors: [serverEnv.NEXT_PUBLIC_SITE_URL],
  csrf: [serverEnv.NEXT_PUBLIC_SITE_URL],
  db: postgresAdapter({
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
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
