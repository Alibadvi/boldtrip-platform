import { s3Storage } from '@payloadcms/storage-s3'
import { productionEnv } from '@/shared/config/production-env'

export const privateStorage = s3Storage({
  alwaysInsertFields: true,
  enabled: productionEnv.STORAGE_MODE === 's3',
  bucket: productionEnv.S3_BUCKET ?? '',
  clientUploads: false,
  collections: {
    'customer-documents': { prefix: 'documents' },
    'payment-receipts': { prefix: 'receipts' },
  },
  signedDownloads: { expiresIn: 60 },
  config: {
    region: productionEnv.S3_REGION,
    endpoint: productionEnv.S3_ENDPOINT,
    forcePathStyle: productionEnv.S3_FORCE_PATH_STYLE === 'true',
    credentials: {
      accessKeyId: productionEnv.S3_ACCESS_KEY_ID ?? '',
      secretAccessKey: productionEnv.S3_SECRET_ACCESS_KEY ?? '',
    },
  },
})
